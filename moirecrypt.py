from numpy import *
from matplotlib.pyplot import *
import scipy.ndimage.filters as filters
import scipy.ndimage.interpolation as interpolation

def prepImage(name, mag=4, sigma=(0,1./40,0)):
    """
    read image with path=name or the 4 example images, 
    apply low-pass filterm,which is gaussian here, smooth with specified sigma and magnify

    Inputs:
        name - filname or one of {'audrey','mona','lenna','einstein'}
        mag - upsample factor
        sigma - gaussian smoothing in each dimension as fraction of image width
    """

    try:
        path = dict( 
            audrey = './images/audrey512.png',
            mona   = './images/mona512.png',
            lenna =  './images/Lenna512.png',
            einstein = './images/einstein512.png'
        )[name]
    except KeyError:
        path = name
    
    img = imread(path)
    img = filters.gaussian_filter(img, sigma=[x*img.shape[1] for x in sigma])
    img = interpolation.zoom(img, (mag,mag,1))  #upsamlping to increase the dpi
    return img



def makeGrating(phaseImage):
    """ 
    Convert phase image into grating image scaled between 0 and 1
    """
    t=1/(1+exp(5*cos(2*pi*phaseImage)))
    return t



# def show(img, sub=111, plotTitle=''):
#     subplot(sub)
#     imshow(img)
#     axis('off')
#     title(plotTitle)



def makePhase(dims=(800,600,3), period=1./20, axis=1, type='uniform'):
    """
    make the phase image  
    INPUTS:
        dims - dimensions of phase image in pixels (y,x) for grating, or (y,x,3) for RGB
        period - grating period as fraction of dims[1]
        axis - 0=horizontal, 1=vertical grating
    """
    if type=='uniform':
        phase = fromfunction(lambda y,x,d: x/float64(period)/dims[1], dims)
    else:
        raise Exception('unknown carrier type') 
    return phase



def smoothPhase(img, maxLap, niter=1):
    """
    enforce grating smoothness by clipping the laplacian of the phase image
    INPUTS:
        maxLap - max Laplacian
        niter - # of iteration
    """
    limit = maxLap/img.shape[1]
    for i in range(niter):
        avg = (img[2:,:,:]+img[:-2,:,:])/2
        img[1:-1,:,:] = img[1:-1,:,:].clip(avg-limit, avg+limit)
    return img