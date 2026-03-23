import os
import subprocess
from datetime import datetime
from platform import system

def create_new_post():
    # 获取当前系统日期（YYYY-MM-DD格式）
    current_date = datetime.now().strftime('%Y-%m-%d')
    print(f"当前日期: {current_date}")

    # 获取当前目录下的所有文件和文件夹
    current_dir = os.getcwd()
    entries = os.listdir(current_dir)

    # 提取当前日期相关的条目序号
    indices = []
    for entry in entries:
        # 处理.md文件（如2025-10-25-00.md）
        if entry.endswith('.md'):
            base_name = entry[:-3]  # 移除.md后缀
            if base_name.startswith(f"{current_date}-"):
                suffix = base_name.split('-')[-1]
                if len(suffix) == 2 and suffix.isdigit():
                    indices.append(int(suffix))
        
        # 处理文件夹（如2025-10-25-01）
        elif os.path.isdir(os.path.join(current_dir, entry)):
            if entry.startswith(f"{current_date}-"):
                suffix = entry.split('-')[-1]
                if len(suffix) == 2 and suffix.isdigit():
                    indices.append(int(suffix))

    # 确定新的序号（两位数字，从00开始递增）
    if not indices:
        new_index = 0
    else:
        new_index = max(indices) + 1
    new_index_str = f"{new_index:02d}"  # 格式化为两位数字（00, 01, 02...）

    # 新文件夹名称
    new_folder = f"{current_date}-{new_index_str}"
    new_folder_path = os.path.join(current_dir, new_folder)

    # 检查文件夹是否已存在
    if os.path.exists(new_folder_path):
        print(f"错误: 文件夹 {new_folder} 已存在，无法创建")
        return

    # 创建新文件夹
    try:
        os.makedirs(new_folder_path)
        print(f"已创建文件夹: {new_folder}")
    except OSError as e:
        print(f"创建文件夹失败: {e}")
        return

    # 生成index.md内容
    index_content = f"""---
title: "标题"
description: "简介"
pinned: false
published: {current_date}

category: "类别"
tags: [tag]
# author: "月宮絵夢"
# sourceLink: "https://github.com/zhangsan/vue3-guide"

# image: './cover.png'

draft: true
---"""

    # 创建并写入index.md
    index_path = os.path.join(new_folder_path, "index.md")
    try:
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(index_content)
        print(f"已创建文件: {os.path.join(new_folder, 'index.md')}")
    except OSError as e:
        print(f"创建index.md失败: {e}")
        # 清理已创建的空文件夹
        if os.path.exists(new_folder_path) and not os.listdir(new_folder_path):
            os.rmdir(new_folder_path)
            print(f"已清理空文件夹: {new_folder}")
        return

if __name__ == "__main__":
    create_new_post()
