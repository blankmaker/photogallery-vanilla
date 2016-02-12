// wrap function and execute to prevent globals
(function() {
  'use strict';

  // collection returned from api
  var images;

  // keeps track of where we are in lightbox view, so that we see the images in order
  var currentPosition;

  /*
    CONNECT TO FLICKR API
  */
  // API variables
  var apiKey = 'aec6f380f4286b7eb92b912e38445e48';
  var galleryId = '72157663691204050';
  var extras = 'owner_name,url_q,url_c,url_m';
  var format = 'json';
  var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos'
                    .concat('&api_key=', apiKey)
                    .concat('&gallery_id=', galleryId)
                    .concat('&extras=', extras)
                    .concat('&format=', format)
                    .concat('&nojsoncallback=1');

  // Make request and turn off spinner when we get a 200
  var flickrRequest = new XMLHttpRequest();
  flickrRequest.onreadystatechange = function() {
    if (flickrRequest.readyState === 4 && flickrRequest.status === 200) {
      document.getElementById('darkspinner').style.display = 'none';
      images = JSON.parse(flickrRequest.responseText).photos.photo;
      attachThumbnails(images);
    }
  };
  flickrRequest.open('GET', flickrUrl, true);
  flickrRequest.send();

  /*
    CREATE THUMBNAIL GALLERY
  */

  // Thumbnail factory
  function makeThumbnail(imageObj, position) {
    var container = document.createElement('li');
    container.className = 'gallery__thumbnail';

    var image = document.createElement('img');
    image.src = imageObj.url_q;
    image.dataset.position = position.toString();

    container.appendChild(image);
    return container;
  }

  // Attaches thumbnails to the gallery parent
  function attachThumbnails(imagesCollection) {
    imagesCollection.forEach(function(imageObj, i) {
      var thumb = makeThumbnail(imageObj, i);
      document.getElementById('gallery').appendChild(thumb);
    });
  }

  /* EVENT LISTENERS */
  document.addEventListener('DOMContentLoaded', function() {

    // listener on the gallery parent for bubbling
    document.getElementById('gallery').addEventListener('click', function(e) {
      if (e.target.id !== 'gallery') {
        loadLightbox(e.target.dataset.position, images);
      }
    });

    // listeners for static lightbox elements
    document.getElementById('close').addEventListener('click', closeLightbox, false);
    document.getElementById('next').addEventListener('click', toggleImages, false);
    document.getElementById('prev').addEventListener('click', toggleImages, false);

    // listeners for lightbox image to smooth transition between photos
    document.getElementById('image').addEventListener('load', function() {
      document.getElementById('lightspinner').style.display = 'none';
      document.getElementById('image').style.display = 'block';
      document.getElementById('caption').style.display = 'block';
    });
  });

  /*
  INITIATES LIGHTBOX
    - disable scrolling, update image template's attributes
    - update currentPosition
    - add keydown listener to allow you to control lightbox with keyboard
  */
  function loadLightbox(imagePosition) {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';

    updateLightboxPhoto(images[imagePosition]);
    currentPosition = Number(imagePosition);

    var lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'block';

    document.addEventListener('keydown', keydownListener, false);
  }

  /*
    CLOSES LIGHTBOX
    - hide lightbox, reenable scrolling, reset currentPosition (just in case)
    - remove keydown listener - keep it tidy!
  */
  function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';

    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'auto';

    currentPosition = 0;

    document.removeEventListener('keydown', keydownListener, false);
  }

  /*
    UPDATES IMAGE'S ATTRIBUTES
    - hide image and caption, enable spinner while we update the phone
  */
  function updateLightboxPhoto(imageObj) {
    var image = document.getElementById('image');
    image.style.display = 'none';

    var imageCaption = document.getElementById('caption');
    imageCaption.style.display = 'none';

    var loadingAnimation = document.getElementById('lightspinner');
    loadingAnimation.style.display = 'block';

    image.src = imageObj.url_c ? imageObj.url_c : imageObj.url_m;
    image.alt = imageObj.title;
    imageCaption.innerHTML = '"' + imageObj.title + '"' +  ' by ' + '<a href="https://www.flickr.com/photos/' + imageObj.owner + '">' + imageObj.ownername + '</a>';
  }

  /*
    TOGGLE IMAGES IN LIGHTBOX VIEW
  */
  function toggleImages(e) {
    e.target.blur();  // remove focus to avoid any bugs in the next lines of code
    if (e.keyCode === 37 || e.target.id === 'prev') {
      incrementCounter(false);
      updateLightboxPhoto(images[currentPosition]);
    } else if (e.keyCode === 39 || e.target.id === 'next') {
      incrementCounter(true);
      updateLightboxPhoto(images[currentPosition]);
    }
  }

  // helper to keep track of current position while toggling
  function incrementCounter(increase) {
    if (currentPosition === images.length - 1 && increase) {
      currentPosition = 0;
    } else if (currentPosition === 0 && !increase) {
      currentPosition = images.length - 1;
    } else if (increase) {
      currentPosition++;
    } else {
      currentPosition--;
    }
  }

  // Translates the key pressed to the action it should take
  function keydownListener(e) {
    e.stopPropagation();
    if (e.keyCode === 27) {
      closeLightbox();
    } else if (e.keyCode === 37 || e.keyCode === 39) {
      toggleImages(e);
    }
  }

})();
