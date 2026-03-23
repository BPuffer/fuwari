from PIL import Image, ImageOps
import os

dhue_angle = 130
dhue = int(dhue_angle / 360 * 255)

def process_favicon(input_path, output_dir):
    """
    处理favicon图片，生成不同尺寸的浅色和深色版本
    
    Args:
        input_path (str): 原始图片路径
        output_dir (str): 输出目录
    """
    
    # 目标尺寸
    sizes = [32, 128, 180, 192]
    
    try:
        # 打开原始图片并确保是RGBA模式（包含alpha通道）
        original = Image.open(input_path).convert('RGBA')
        print(f"原始图片尺寸: {original.size}, 模式: {original.mode}")
        
        # 确保输出目录存在
        os.makedirs(output_dir, exist_ok=True)
        
        for size in sizes:
            print(f"\n处理 {size}x{size} 尺寸...")
            
            # 调整尺寸，使用双三次插值
            resized = original.resize((size, size), Image.BICUBIC)
            
            # 浅色模式：直接保存
            light_filename = f"favicon-light-{size}.png"
            light_path = os.path.join(output_dir, light_filename)
            resized.save(light_path, "PNG")
            print(f"生成浅色模式: {light_filename}")
            
            # 深色模式：hue旋转30度
            # 分离RGB和Alpha通道
            rgb = resized.convert('RGB')
            alpha = resized.getchannel('A')
            
            # 将RGB转换为HSV
            hsv = rgb.convert('HSV')
            # 分离HSV通道
            h, s, v = hsv.split()
            # 旋转Hue通道：每个像素值加上21（因为30度对应255的12分之一，即21.25，取整21）
            h = h.point(lambda x: (x + dhue) % 255)
            # 合并HSV通道并转回RGB
            rotated_hsv = Image.merge('HSV', (h, s, v))
            rotated_rgb = rotated_hsv.convert('RGB')
            
            # 重新合并RGB和Alpha通道
            dark_image = Image.merge('RGBA', (*rotated_rgb.split(), alpha))
            
            dark_filename = f"favicon-dark-{size}.png"
            dark_path = os.path.join(output_dir, dark_filename)
            dark_image.save(dark_path, "PNG")
            print(f"生成深色模式: {dark_filename}")
            
        print(f"\n所有图片已生成到: {output_dir}")
        
    except Exception as e:
        print(f"处理图片时出错: {e}")

def main():
    # 配置路径
    input_file = "favicon.png"  # 原始图片文件名
    output_directory = "."      # 输出目录（当前目录）
    
    # 检查原始图片是否存在
    if not os.path.exists(input_file):
        print(f"错误: 找不到原始图片 '{input_file}'")
        print("请确保脚本与favicon.png在同一目录下")
        return
    
    print("开始处理favicon图片...")
    process_favicon(input_file, output_directory)

if __name__ == "__main__":
    main()