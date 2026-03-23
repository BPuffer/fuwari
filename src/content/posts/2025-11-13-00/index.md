---
title: Traceback 里为什么不显示源码的绝对路径？
description: 溯源了C扩展模块的co_filename不是绝对路径的原因及其解决办法
published: 2025-11-15
category: python
tags:
  - python
  - cython
updated: 2026-01-01
---

写完代码，一运行，报错了。Python 的 Traceback 会告诉你错误发生在哪个文件的哪一行。我们通常会根据这个绝对路径去找到源文件，查看问题。

但在使用 C 扩展模块时，你可能会遇到一个奇怪的现象：Traceback 里显示的文件名是一个相对路径（比如`path/main.pyx`），而不是我们熟悉的绝对路径。这会导致一些依赖绝对路径的工具（例如，用来判断这个文件属于哪个第三方包）直接失效

剧透：问题的解决实际上是绕了个没那么稳定的路，这个问题不动cython或者源码是没法彻底解决的，就是用`__file__`……

起因是我正在尝试通过`traceback.py`中`TracebackException.stack[i].filename`获取一个错误链的所有文件名，并且尝试压缩这一串东西，让tb看起来没那么狰狞，同时我需要提取出关键信息：这个文件来自什么模块。

## 名词解释

|   名词    | 类型     |                             解释                             |
| :-------: | -------- | :----------------------------------------------------------: |
|  Python   | 编程语言 |                   狭义特指Python语法本身。                   |
|  cpython  | 代码库   | 使用C语言实现的标准Python。也是我们一般情境用到几乎所有的python。本期分析的python源代码使用cpython。大部分以后情况也会这样。 |
|  Cython   | 代码库   | 一个Python的第三方包，它将python源代码改造为接入cpython API的c源代码并编译以获得极高的执行速度。一种方式是编写与python语法极为相似的`.pyx`文件，并编译为`.pyd/.so`。本期主题就是`.pyx`文件中报错不会写出完整路径的问题 |
| Traceback | 概念     | 或称为堆栈跟踪或回溯，它在发生错误时展示，展示导致错误的函数调用序列及其扩展信息。写的很清楚就是调试好帮手，很乱红红一片就是红温发生器。 |

## 问题重现

首先来看这样一个测试

```python
from traceback import TracebackException

try:
    import cython_module
    import dppath_cymodule
    # cython_module.pyx & the/cmodule/inthe/deep/path/dppath_cymodule.pyx
    """
    def raise_error_in_cython():
        raise ValueError("这是在 Cython 中引发的错误")
    """

    import python_module
    # python_module.py
    """
    def raise_error_in_python():
        raise ValueError("这是在 Python 中引发的错误")
    """
except ImportError as e:
    print("编译 Cython 模块: python setup.py build_ext --inplace")
    # setup.py
    """
    from distutils.core import setup
    from Cython.Build import cythonize

    setup(
        ext_modules=cythonize("cython_module.pyx"),
    )
    """
    TracebackException.from_exception(e).print();import sys;sys.exit(1)

def test_and_print(name, method):
    """测试 Cython 模块中的错误"""
    print(f"测试 {name} 模块错误...")
    try:
        method()
    except Exception as e:
        print("捕获到的tb文件链:")
        [print('-', stack.filename, stack.line) for stack in TracebackException.from_exception(e).stack]
    print("=" * 50)

def raise_error_in_numpy():
    import numpy as np
    np.random.uniform(low=[1, 2], high=[4, 5, 6], size=(3))

if __name__ == "__main__":
    test_and_print("Cython", cython_module.raise_error_in_cython)
    test_and_print("Python", python_module.raise_error_in_python)
    test_and_print("带路径的 Cython", dppath_cymodule.raise_error_in_cython2)
    test_and_print("Numpy", raise_error_in_numpy)
```

```
测试 Cython 模块错误...
捕获到的tb文件链:
- c:\Users\BPuffer\Desktop\_\test.py method()
- cython_module.pyx
==================================================
测试 Python 模块错误...
捕获到的tb文件链:
- c:\Users\BPuffer\Desktop\_\test.py method()
- c:\Users\BPuffer\Desktop\_\python_module.py raise ValueError("这是在 Python 中引发的错误")
==================================================
测试 带路径的 Cython 模块错误...
捕获到的tb文件链:
- c:\Users\BPuffer\Desktop\_\test.py method()
- the\\cmodule\\inthe\\deep\\path\\dppath_cymodule.pyx       
==================================================
测试 Numpy 模块错误...
捕获到的tb文件链:
- c:\Users\BPuffer\Desktop\_\test.py method()
- c:\Users\BPuffer\Desktop\_\test.py np.random.uniform(low=[1, 2], high=[4, 5, 6], size=(3))
- numpy\\random\\mtrand.pyx
==================================================

# 另有文件结构：
C:\USERS\BPUFFER\DESKTOP\_
│  build.cmd
│  cython_module.pyx
│  python_module.py
│  setup.py
│  test.py
└─the
   └─cmodule
       └─inthe
           └─deep
               └─path
                       dppath_cymodule.pyx
# 编译后新增
│  cython_module.cp312-win_amd64.pyd
│  cython_module.pyx
│  dppath_cymodule.cp312-win_amd64.pyd
```

显然，`cython_module.pyx`并不打算露出它的绝对位置。

## 为什么？

这不是一个 bug，而是 Cython 的一个设计上的权衡。理解它，需要明白 Cython 代码是如何运行的。

1. **你写的是`.pyx`源码**，比如`src/example/path/main.pyx`。
2. **它被编译成二进制文件**，比如一个`.pyd`或`.so`文件。这个文件最终会被安装到你的 Python 环境里，例如`lib/site-packages/example/path/main.cp312-win_amd64.pyd`。
3. **Python 运行时真正加载和执行的是这个`.pyd`文件**。Python 知道这个`.pyd`文件的绝对路径，就像知道普通`.py`文件的路径一样。

**那么问题来了：Traceback 里的源码路径`path/main.pyx`是哪来的？**

这个路径是在编译时由 Cython 记录下来的。通常是项目源码目录里的相对路径。**而且不会给到源码级别的行展示。**

当运行时错误发生，Cython 会忠实地把这个编译时记录的相对路径报告给你。它 **不会** 动态地去计算这个`.pyx`文件在你当前机器上的绝对路径。

**为什么不呢？**

因为 Python 运行时 **根本不需要** 这个`.pyx`源文件来执行程序。一切都已经编译在`.pyd`文件里了。当然说是被编译进去了，实际上也只是编译了哪些操作对应了源码的行，并没有真的把原语句编译进去。

如果 Cython 非要报告一个绝对路径，那么就只有一种方法：要求你在部署、安装二进制包的时候，也必须把原始的`.pyx`源文件按照编译时的目录结构一模一样地放在旁边。这对于用户来说是一个不必要的负担。绝大多数用户只需要安装二进制包来运行程序，并不需要查看 Cython 源码。

**所以，Cython 的选择是：**
报告编译时的相对路径。这样：

- 对于**拥有完整项目源码的开发者**来说，他们可以根据这个相对路径在项目里找到对应的源文件。
- 对于**只安装了二进制包的用户**，他们也不至于因为找不到源文件而遇到更多错误。

## 如何解决？

既然从 Traceback 里拿到的`co_filename`是不可靠的相对路径，我们就需要一个可靠的锚点。这个锚点就是模块的`__file__`属性。

对于同一个模块，`__file__`属性会给出运行时加载的`.pyd`文件（或`.so`文件）的 **绝对路径**。通过这个绝对路径，你就能准确地判断出这个模块属于哪个第三方包。

当然也仅限包名。对于这件事的最初目的——**对Traceback的路径进行压缩美化输出**——中，除了模块名，还有压缩的路径部分，这部分我会使用原始提供的filename。完全路径模式下则用原始`__file__`。

```
PASSED [100%]
pypy被玩坏了！这肯定不是py的问题！绝对不是！
  文件 test_exc_from_libs.py:29:12 的 test_from_third_party_lib
    np.random.uniform(low=[1, 2], high=[4, 5, 6], size=(3))
  文件 [numpy 模块] numpy/random/mtrand.pyx:1183 的 numpy.random.mtrand.RandomState.uniform
[ValueError] operands could not be broadcast together with shapes (3,) (2,) 
```

::github{repo="BPuffer/kawaii-traceback"}

## 路径被塞进`co_filename`的过程

### 由 Cython 编译的`.c`源码中的端倪

```cpp
// _\the\cmodule\inthe\deep\path\dppath_cymodule.pyx
#define __PYX_MARK_ERR_POS(f_index, lineno) \
    { __pyx_filename = __pyx_f[f_index]; (void)__pyx_filename; __pyx_lineno = lineno; (void)__pyx_lineno; __pyx_clineno = __LINE__;  (void)__pyx_clineno; }
#define __PYX_ERR(f_index, lineno, Ln_error) \
    { __PYX_MARK_ERR_POS(f_index, lineno) goto Ln_error; }

...

  /* "dppath_cymodule.pyx":2
 * # the/cmodule/inthe/deep/path/dppath_cymodule.pyx
 * def raise_error_in_cython2():             # <<<<<<<<<<<<<<
 *     raise ValueError(" Cython ")
 */

  /* function exit code */
  __pyx_L1_error:;
  __Pyx_XDECREF(__pyx_t_1);
  __Pyx_AddTraceback("dppath_cymodule.raise_error_in_cython2", __pyx_clineno, __pyx_lineno, __pyx_filename);
  __pyx_r = NULL;
  __Pyx_XGIVEREF(__pyx_r);
  __Pyx_RefNannyFinishContext();
  return __pyx_r;
}
```

### `FileFinder`找到`.pyc`的过程

`import cython_module`->找到文件`cython_module.cp312-win_amd64.pyd`

```python
# cpython\Lib\importlib\_bootstrap_external.py
class FileFinder:
    """File-based finder.
    Interactions with the file system are cached for performance, being
    refreshed when the directory the finder is handling has been modified.
    """
    ...
    def _get_spec(self, loader_class, fullname, path, smsl, target):
        loader = loader_class(fullname, path)
        return spec_from_file_location(fullname, path, loader=loader,
                                       submodule_search_locations=smsl)
    def find_spec(self, fullname, target=None):
        """Try to find a spec for the specified module.
        Returns the matching spec, or None if not found.
        """
        ...
        # Check for a file w/ a proper suffix exists.
        for suffix, loader_class in self._loaders:
            try:
                full_path = _path_join(self.path, tail_module + suffix)
            except ValueError:
                return None
            _bootstrap._verbose_message('trying {}', full_path, verbosity=2)
            if cache_module + suffix in cache:
                if _path_isfile(full_path):
                    return self._get_spec(loader_class, fullname, full_path,
                                          None, target)
        if is_namespace:
            _bootstrap._verbose_message('possible namespace for {}', base_path)
            spec = _bootstrap.ModuleSpec(fullname, None)
            spec.submodule_search_locations = [base_path]
            return spec
        return None
...
```

### Cython提供处理器的过程(解析pyd文件的处理器)

```c
// cpython\Python\import.c
...
/*[clinic input]
_imp.extension_suffixes

Returns the list of file suffixes used to identify extension modules.
[clinic start generated code]*/

static PyObject *
_imp_extension_suffixes_impl(PyObject *module)
/*[clinic end generated code: output=0bf346e25a8f0cd3 input=ecdeeecfcb6f839e]*/
{
    PyObject *list;

    list = PyList_New(0);
    if (list == NULL)
        return NULL;
#ifdef HAVE_DYNAMIC_LOADING
    const char *suffix;
    unsigned int index = 0;

    while ((suffix = _PyImport_DynLoadFiletab[index])) {
        PyObject *item = PyUnicode_FromString(suffix);
        if (item == NULL) {
            Py_DECREF(list);
            return NULL;
        }
        if (PyList_Append(list, item) < 0) {
            Py_DECREF(list);
            Py_DECREF(item);
            return NULL;
        }
        Py_DECREF(item);
        index += 1;
    }
#endif
    return list;
}
...
```

## 挖坑

- 文件被解析生成模块，模块生成CodeType的完整代码还没翻完整。
- ai总说Cython有设置能在编译到c的阶段贴上这个路径，没找到。也没找到Cython生成的地方。

