from flask import Flask
from matplotlib import pyplot as plt
from PIL import Image, ImageEnhance
import moirecrypt as m
import convert as c
import os.path
import imageio
from flask import request, render_template, session, redirect, url_for, flash, \
send_from_directory
from flask_bootstrap import Bootstrap
from datetime import datetime
from flask_wtf import FlaskForm as Form
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import Required
from flask_sqlalchemy import SQLAlchemy
from constants import DB_URI
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand
import os
from flask_mail import Mail, Message
from threading import Thread
from flask_uploads import *
#from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
from flask_wtf.file import FileField, FileAllowed, FileRequired
from werkzeug.utils import secure_filename


app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
manager=Manager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)
app.config['SECRET_KEY'] = 'hard to guess'


photos = UploadSet('photos',IMAGES)
photos2 = UploadSet('photos2',IMAGES)
app.config['UPLOADED_PHOTOS_DEST'] = 'static/uploads'
app.config['UPLOADED_PHOTOS_ALLOW'] = IMAGES
app.config['UPLOADED_PHOTOS2_DEST'] = 'static/uploads'
app.config['UPLOADED_PHOTOS2_ALLOW'] = IMAGES
#photos = UploadSet('photos', IMAGES)
#configure_uploads(app, photos)
patch_request_class(app)
#ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
configure_uploads(app, photos)
configure_uploads(app, photos2)



class UploadForm(Form):
    '''
        upload form
    '''
    # 文件field设置为非空，过滤规则设置为‘photos’
    upload = FileField(u'Upload Image (required):', validators=[
                       FileRequired(), FileAllowed(photos, 'you can upload images only!')])
    upload2 = FileField(u'Upload Image (only for Moire Art):', validators=[
                        FileAllowed(photos2, 'you can upload images only!')])
    encrypt_type = SelectField('Encryption Type:',choices=[
        ('simple', 'Simple Moire for 1 image'),('idt', 'Complex Moire for 1 image'),\
        ('art', 'Moire Art for 2 images')],render_kw = {'width':'30em'})
    submit = SubmitField('upload')

@app.route('/upload', methods=('GET', 'POST'))
def index():
    form = UploadForm()
    save_ori_path= '/Users/summer/AnacondaProjects/divamoire/static/uploads/'
    save_grt_path= '/Users/summer/AnacondaProjects/divamoire/static/gratings/'
    save_sup_path='/Users/summer/AnacondaProjects/divamoire/static/supos/'
    url = None
    url2 = None
    my_file = None
    my_file2 = None
    set_path = []
    if form.validate_on_submit():
        filename = form.upload.data.filename
        url = photos.save(form.upload.data, name=filename)
        print(filename)
        my_file= os.path.join(save_ori_path, filename)
        print('myfile: %s',my_file)
        if form.upload2.data is not None:
            filename2 = form.upload2.data.filename
            url2 = photos2.save(form.upload2.data, name=filename2)
            my_file2= os.path.join(save_ori_path, filename2)
##------------Simple Moire---------------------------##
        if form.encrypt_type.data == 'simple':
            image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)
            if os.path.isfile(my_file):
                print('already uploaded before')
                filename = os.path.splitext(os.path.basename(filename))[0]
                if os.path.isfile(os.path.join(save_grt_path, filename+"_simple_g1"+".png")) \
                and os.path.isfile(os.path.join(save_grt_path, filename+"_simple_g2"+".png")) \
                and os.path.isfile(os.path.join(save_sup_path, filename+"_simple_sup"+".png")):
                    set_path.append(image_path)
                    set_path.append(url_for('static',filename=os.path.join('gratings',filename+"_simple_g1"+".png")))
                    set_path.append(url_for('static',filename=os.path.join('gratings',filename+"_simple_g2"+".png")))
                    set_path.append(url_for('static', filename=os.path.join('supos', filename+"_simple_sup"+".png")))
                    return render_template('index.html',form=form, url=url, set_path=set_path)
                else:
                    set_path = simple_moire(image_path)
                    return render_template('index.html',form=form, url=url, set_path=set_path)
            else:
                set_path = simple_moire(image_path)
                return render_template('index.html',form=form, url=url, set_path=set_path)
##---------------------idt Moire--------------------------##
        if form.encrypt_type.data == 'idt':
            image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)
            if os.path.isfile(my_file):
                filename = os.path.splitext(os.path.basename(filename))[0]
                if os.path.isfile(os.path.join(save_grt_path, filename+"_idt_g1"+".png")) \
                and os.path.isfile(os.path.join(save_grt_path, filename+"_idt_g2"+".png")) \
                and os.path.isfile(os.path.join(save_sup_path, filename+"_idt_sup"+".png")):
                    set_path.append(image_path)
                    set_path.append(url_for('static',filename=os.path.join('gratings',filename+"_idt_g1"+".png")))
                    set_path.append(url_for('static',filename=os.path.join('gratings',filename+"_idt_g2"+".png")))
                    set_path.append(url_for('static', filename=os.path.join('supos', filename+"_idt_sup"+".png")))
                    return render_template('index.html',form=form, url=url, set_path=set_path)
                else:
                    set_path = idt_moire(image_path)
                    return render_template('index.html',form=form, url=url, set_path=set_path)
            else:
                set_path = idt_moire(image_path)
                return render_template('index.html',form=form, url=url, set_path=set_path)
##-------------moire art---------------------------------------------------##
        if form.encrypt_type.data == 'art':
            image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)
            image_path2 = os.path.join(app.config['UPLOADED_PHOTOS2_DEST'], filename2)
            if os.path.isfile(my_file) and os.path.isfile(my_file2):
                filename = os.path.splitext(os.path.basename(filename))[0]
                filename2 = os.path.splitext(os.path.basename(filename2))[0]
                if os.path.isfile(os.path.join(save_grt_path, filename+'_'+filename2+"_art_g1"+".png")) \
                and os.path.isfile(os.path.join(save_grt_path, filename+'_'+filename2+"_art_g2"+".png")) \
                and os.path.isfile(os.path.join(save_sup_path, filename+'_'+filename2+"_art_sup1"+".png")) \
                and os.path.isfile(os.path.join(save_sup_path, filename+'_'+filename2+"_art_sup2"+".png")):
                    set_path.append(image_path)
                    set_path.append(image_path2)
                    set_path.append(url_for('static',filename=os.path.join('gratings',filename+'_'+filename2+"_art_g1"+".png")))
                    set_path.append(url_for('static',filename=os.path.join('gratings',filename+'_'+filename2+"_art_g2"+".png")))
                    set_path.append(url_for('static', filename=os.path.join('supos',filename+'_'+filename2+"_art_sup1"+".png")))
                    set_path.append(url_for('static', filename=os.path.join('supos',filename+'_'+filename2+"_art_sup2"+".png")))
                    return render_template('index.html',form=form, url=url, set_path=set_path)
                else:
                    set_path = moire_art(image_path,image_path2)
                    return render_template('index.html',form=form, url=url, set_path=set_path)
            else:
                set_path = moire_art(image_path,image_path2)
                return render_template('index.html',form=form, url=url, set_path=set_path)
        # url = photos.save(form.upload.data, name=filename)
        # if form.upload2.data is not None:
        #     filename2 = form.upload2.data.filename
        #     url2 = photos2.save(form.upload2.data, name=filename2)
        # if form.encrypt_type.data == 'simple':
        #     image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)
        #     set_path = simple_moire(image_path)
        # if form.encrypt_type.data == 'idt':
        #     image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)
        #     set_path = idt_moire(image_path)
        # if form.encrypt_type.data == 'art':
        #     image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)
        #     image_path2 = os.path.join(app.config['UPLOADED_PHOTOS2_DEST'], filename2)
        #     set_path = moire_art(image_path,image_path2)
        # return render_template('index.html',form=form, url=url, set_path=set_path)
    else:
        return render_template('upload.html',form=form,url=url)

@app.route('/base')
def base():
    return render_template('base.html')
"""
Simple moire with a single color image
"""
def simple_moire(path):
    save_ori_path= '/Users/summer/AnacondaProjects/divamoire/static/origins/'
    save_grt_path= '/Users/summer/AnacondaProjects/divamoire/static/gratings/'
    save_sup_path='/Users/summer/AnacondaProjects/divamoire/static/supos/'
    file_name = os.path.splitext(os.path.basename(path))[0]
    set_path=[]
    set_path.append(path)
    im=Image.open(path)
    if im.size!=(512,512):
        print('convert')
        path=c.convert512(path)

    T = 1./40        # grating period

    print ('pre-processing images...')
    img = m.prepImage(path, mag=2, sigma=(0,T/4., 0))
    #imageio.imwrite(os.path.join(save_ori_path, file_name+".png"),img)

    print ('generating gratings...')
    carrier = m.makePhase(img.shape, T)
    g1 = carrier-(1-img)/4
    g2 = carrier+(1-img)/4

    print ('smoothing phase...')
    g1 = m.smoothPhase(g1, 1e-3/T, 50)
    g2 = m.smoothPhase(g2, 1e-3/T, 50)

    print ('saving images...')
    g1 = m.makeGrating(g1)
    g2 = m.makeGrating(g2)
    # save gratings
    imageio.imwrite(os.path.join(save_grt_path, file_name+"_simple_g1"+".png"),g1)
    set_path.append(url_for('static', filename=os.path.join('gratings',file_name+"_simple_g1"+".png")))
    imageio.imwrite(os.path.join(save_grt_path, file_name+"_simple_g2"+".png"),g2)
    set_path.append(url_for('static', filename=os.path.join('gratings',file_name+"_simple_g2"+".png")))
    # save superpositons
    sup = g1*g2
    imageio.imwrite(os.path.join(save_sup_path, file_name+"_simple_sup"+".png"),sup)
    print('done')
    set_path.append(url_for('static', filename=os.path.join('supos', file_name+"_simple_sup"+".png")))
    print(set_path)
    return set_path
    

def moire_art(path1,path2):
    image_path = '/Users/summer/AnacondaProjects/divamoire/static/uploads'
    save_ori_path= '/Users/summer/AnacondaProjects/divamoire/static/origins/'
    save_grt_path= '/Users/summer/AnacondaProjects/divamoire/static/gratings/'
    save_sup_path='/Users/summer/AnacondaProjects/divamoire/static/supos/'
    set_path=[]
    set_path.append(path1)
    set_path.append(path2)
    T = 1./40  # grating period as fraction of image width
    offset = 1./8  # offset as a fraction of the image height
    #check size 512*512
    im=Image.open(path1)
    if im.size!=(512,512):
        print('convert')
        path1=c.convert512(path1)
    im=Image.open(path2)
    if im.size!=(512,512):
        print('convert')
        path2=c.convert512(path2)

    file_name1 = os.path.splitext(os.path.basename(path1))[0]
    file_name2 = os.path.splitext(os.path.basename(path2))[0]

    print ('Loading images...')
    img = (
        m.prepImage(path1, mag=4, sigma=(0,T/4,0)), 
        m.prepImage(path2, mag=4, sigma=(0,T/4,0))
        )
    #imageio.imwrite(os.path.join(save_ori_path, file_name1+".png"),img[0])
    #imageio.imwrite(os.path.join(save_ori_path, file_name2+".png"),img[1])
    print ('generating gratings...')
    offset = round(offset*img[0].shape[0])  # convert to pixels
    dims = img[0].shape
    dims = (dims[0]+offset,dims[1],dims[2])
    g1 = m.makePhase(dims, T)
    g2 = g1.copy()

    # iterative adjustment of gratings to images
    L = 0.04       # learning rate
    niter = 501    # of iterations

    for i in range(niter):
        if i % 25 == 0:
            print ("iteration [%4d/%4d]" % (i, niter))

        # update gratings
        err1 = (1-img[0])/2 - (g1[:-offset,:,:] - g2[offset:,:,:])
        err2 = (1-img[1])/2 - (g2[:-offset,:,:] - g1[offset:,:,:])
        g1[:-offset,:,:] += L*err1
        g2[offset:,:,:] -= L*err1
        g2[:-offset,:,:] += L*err2
        g1[offset:,:,:] -= L*err2

        # enforce grating smoothness by clipping the laplacian
        g1 = m.smoothPhase(g1, 1e-4/T)

    print ('saving image...')
    g1 = m.makeGrating(g1)
    g2 = m.makeGrating(g2)

    # save gratings 
    imageio.imwrite(os.path.join(save_grt_path, file_name1+'_'+file_name2+"_art_g1"+".png"),g1)
    imageio.imwrite(os.path.join(save_grt_path, file_name1+'_'+file_name2+"_art_g2"+".png"),g2)
    set_path.append(url_for('static', filename=os.path.join('gratings',file_name1+'_'+file_name2+"_art_g1"+".png")))
    set_path.append(url_for('static', filename=os.path.join('gratings',file_name1+'_'+file_name2+"_art_g2"+".png")))
    # save superpositions
    e = m.ones((offset, dims[1], dims[2]))
    s1 = m.vstack((e, g1))*m.vstack((g2, e)) 
    s2 = m.vstack((e, g2))*m.vstack((g1, e))
    imageio.imwrite(os.path.join(save_sup_path, file_name1+'_'+file_name2+"_art_sup1"+".png"),s1)
    imageio.imwrite(os.path.join(save_sup_path, file_name1+'_'+file_name2+"_art_sup2"+".png"),s2)
    set_path.append(url_for('static', filename=os.path.join('supos',file_name1+'_'+file_name2+"_art_sup1"+".png")))
    set_path.append(url_for('static', filename=os.path.join('supos',file_name1+'_'+file_name2+"_art_sup2"+".png")))
    print('done')
    print(len(set_path),set_path)
    return(set_path)


def idt_moire(path):
    image_path = '/Users/summer/AnacondaProjects/divamoire/static/uploads'
    save_ori_path= '/Users/summer/AnacondaProjects/divamoire/static/origins/'
    save_grt_path= '/Users/summer/AnacondaProjects/divamoire/static/gratings/'
    save_sup_path='/Users/summer/AnacondaProjects/divamoire/static/supos/'
    set_path=[]
    set_path.append(path)
    im=Image.open(path)

    if im.size!=(512,512):
        print('convert')
        path=c.convert512(path)

    file_name = os.path.splitext(os.path.basename(path))[0]

    T = 1./40        # grating period
    offset = 1./8    # superposition offset

    print ('pre-processing images...')
    img = m.prepImage(path, mag=4, sigma=(0,T/4., 0))
    #imageio.imwrite(os.path.join(save_ori_path, file_name+".png"),img)

    # carrier phase image: horizontal gradient with slope 1/T
    offset = round(offset*img.shape[0])  # convert to pixels
    dims = (img.shape[0]+offset, img.shape[1], img.shape[2])
    g = m.makePhase(dims, T)

    print ('computing gratings...')
    L = 0.04    # learning rate
    niter = 501   # of iterations

    for i in range(niter):
        if i % 25 == 0:
            print ("iteration [%4d/%4d]" % (i, niter))

        # update grating
        err = (1-img)/2 - (g[0:-offset,:,:] - g[offset:,:,:])
        g[0:-offset,:,:] += L*err
        g[offset:,:,:]   -= L*err
        g = m.smoothPhase(g, 1e-4/T)

    print ('saving image...')
    g = m.makeGrating(g)

    # save gratings 
    imageio.imwrite(os.path.join(save_grt_path, file_name+"_idt_g1"+".png"),g)
    imageio.imwrite(os.path.join(save_grt_path, file_name+"_idt_g2"+".png"),g)
    set_path.append(url_for('static', filename=os.path.join('gratings',file_name+"_idt_g1"+".png")))
    set_path.append(url_for('static', filename=os.path.join('gratings',file_name+"_idt_g2"+".png")))
    # save superpositions
    e = m.ones((offset, img.shape[1], img.shape[2]))
    s = m.vstack((e, g))*m.vstack((g, e)) 
    imageio.imwrite(os.path.join(save_sup_path,file_name+"_idt_sup"+".png"),s)
    set_path.append(url_for('static', filename=os.path.join('supos',file_name+"_idt_sup"+".png")))

    print('done')
    return(set_path)

# def make_shell_context():
#     return dict(app=app, db=db, User=User, Role=Role)

# manager.add_command("shell", Shell(make_context=make_shell_context))
# manager.add_command('db', MigrateCommand)
# @app.route('/moire1')
# def moire1():
#     return render_template('moire1.html')

# @app.route('/moire2')
# def moire2():
#     return render_template('moire2.html')

# @app.route('/moire3')
# def moire3():
#     return render_template('moire3.html')

# @app.route('/moire4')
# def moire4():
#     return render_template('moire4.html')

# @app.route('/moire5')
# def moire5():
#     return render_template('moire5.html')

# @app.route('/test')
# def test():
#     return render_template('test.html')

if __name__ == '__main__':
   # manager.run()
   #app.run(debug=True)
   app.run(host = '0.0.0.0',port=5005)