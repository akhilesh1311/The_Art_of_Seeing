""" resize the image to RGB (512,512),
    fill blank with black"""

from PIL import Image

def make_square(im, min_size=512, fill_color=(0, 0, 0)):
    x, y = im.size
    size = max(min_size, x, y)
    new_im = Image.new('RGB', (size, size), fill_color)
    new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
    return new_im

def convert512(path):
    try:
        img=Image.open(path)
    except IOError:
        return ('loading image error')
    print(img.mode)
    if img.mode != 'RGB':
        img=img.convert('RGB')
    print(img.mode)
    if img.size[0]==img.size[1]:
        img1=img.resize((512,512),Image.ANTIALIAS)
    elif img.size[0]>img.size[1]:
        ratio=512/img.size[0]
        img1=img.resize((512,int(ratio*img.size[1])),Image.ANTIALIAS)
    else:
        ratio=512/img.size[1]
        img1=img.resize((int(ratio*img.size[0]),512),Image.ANTIALIAS)
    if img1.size==(512,512):
        img_fill=img1
    else:
        img_fill=make_square(img1)
    for i in range(1,len(path)):
        if path[-i]=='.':
            break
    p=path[:-i]
    img_fill.save(p+'%d.png'%(img_fill.size[0]),quality=95)
    newpath=p+'512.png'
    return newpath
