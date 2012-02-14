Zoomz.js
========

## Easy Mouse-Over Zooming ##

Use this jQuery extension to zoom in on an image when moused over.

## Basic Usage ##

Currently, you will want an HTML structure along the following lines:

    <div style="position: relative"> <!-- There needs to be at least one container with position: relative between figure and body in the DOM -->
      <figure>
        <img src="path/to/image.jpg" />
      </figure>
    </div>

Simply run the following javascript:

    $('figure').Zoomz();
  
Voila!

## Additional Parameters ##

You can optionally pass a variety of parameters to the Zoomz method. For example, to scale the zoomed image to 300% its original size, use the following code:

    $('figure').Zoomz({
      style: {
        width: 3, // 300%
        height: 3 // 300% again
      }
    });