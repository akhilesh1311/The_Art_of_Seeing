# The Art of Seeing

This webpage displays the Moire book, implements the Moire image encryption algorithm and shows how the Moire effect works.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

For installing Flask and it's subsidary packages, run the following command

```
pip install -r requirements.txt
```
## Running the Application

Just run the moire.py file as:
```
python moire.py
```
Open ```0.0.0.0:5005/base``` on any web browser.

## Deployment

The Application has 3 main parts

### Moire Patterns:

We have 5 patterns:\
*Circles\
*Spikes\
*Dots\
*Square\
*Triangles

Screenshot of a few of the patterns:\
![Alt text](Moire_circle.png?raw=true "Moire Circles")\
![Alt text](moire_spikes.png?raw=true "Moire Spikes")

Working animations of these are also uploaded on youtube:\
*[Moire Circles](https://youtu.be/TCJ3FupaYtE)\
*[Moire Spikes](https://youtu.be/LIvYlEHI6Kk)

### Moire Art:

We have 3 different types of moire art:\
*Simple Moire Encryption - Encrypt a single image with two gratings. And the superposition of the gratings reveals the original image.\
*Complex Moire Encryption - Encrypt a single image with two identical gratings. And the superposition of the gratings reveals the original image.\
*Moire Art - Encrypt two images with two gratings. And the superposition of the gratings reveals the original images respectively at diffenerent alignment.

Screenshot of the page:\
![Alt text](Moire_art.png?raw=true "Moire Art")

## Built With

* [Flask](http://flask.pocoo.org/docs/1.0/) - The web framework used\
* [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/) - UI Css used\
* [Target-Driven Moire Pattern Synthesis by Phase Modulation](https://ieeexplore.ieee.org/document/6751348) - Used as reference for Moire Art

## Acknowledgments

* Takahiro Kurashima\
* Yunong Liang\
* Bo Xu\
* James Abello
