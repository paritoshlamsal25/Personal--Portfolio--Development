import base64
import os
from PIL import Image, ImageDraw

# Create a simple circular favicon from text since we can't directly process JPG
def create_simple_favicon():
    # Create a 32x32 image with a circular design
    size = 32
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a circular background (blue color scheme)
    draw.ellipse([2, 2, size-2, size-2], fill='#2196F3', outline='#1976D2', width=2)
    
    # Add letter 'P' for Paritosh
    try:
        from PIL import ImageFont
        font = ImageFont.load_default()
        draw.text((size//2-4, size//2-8), 'P', fill='white', font=font)
    except:
        # Fallback if font loading fails
        draw.text((size//2-4, size//2-8), 'P', fill='white')
    
    return img

# Save as ICO file
if __name__ == "__main__":
    favicon = create_simple_favicon()
    favicon.save('favicon.ico', format='ICO', sizes=[(32, 32)])
    print("Favicon created successfully!")
