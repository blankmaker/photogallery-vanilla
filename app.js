'use strict';

// loading animation
// so many globals! fix this.
// make responsive-er

var images;
var currentPosition;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('gallery').addEventListener('click', function(e) {
    loadLightbox(e.target.dataset.position, images);
  });

  document.getElementById('close').addEventListener('click', closeLightbox, false);
  document.getElementById('next').addEventListener('click', toggleImages, false);
  document.getElementById('prev').addEventListener('click', toggleImages, false);
});

function loadLightbox(imagePosition) {
  var body = document.getElementsByTagName('body')[0];
  body.style.overflow = 'hidden';
  updateLightboxPhoto(images[imagePosition]);
  currentPosition = Number(imagePosition);

  var lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'block';

  // should this event be here?
  document.addEventListener('keydown', keydownListener, false);
}

function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  var body = document.getElementsByTagName('body')[0];
  lightbox.style.display = 'none';
  body.style.overflow = 'auto';
  currentPosition = 0;

  document.removeEventListener('keydown', keydownListener, false);
}

function updateLightboxPhoto(imageObj) {
  var image = document.getElementById('image');
  var imageCaption = document.getElementById('caption');

  imageCaption.innerHTML = '"' + imageObj.title + '"' +  ' by ' + '<a href="https://www.flickr.com/photos/' + imageObj.owner + '">' + imageObj.ownername + '</a>';
  image.src = imageObj.url_c ? imageObj.url_c : imageObj.url_m;
}

function keydownListener(e) {
  e.stopPropagation();
  if (e.keyCode === 27) {
    closeLightbox();
  } else if (e.keyCode === 37 || e.keyCode === 39) {
    toggleImages(e);
  }
}

function toggleImages(e) {
  e.target.blur();
  if (e.keyCode === 37 || e.target.id === 'prev') {
    incrementCounter(false);
    updateLightboxPhoto(images[currentPosition]);
  } else if (e.keyCode === 39 || e.target.id === 'next') {
    incrementCounter(true);
    updateLightboxPhoto(images[currentPosition]);
  }
}

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

function attachThumbnails(imagesCollection) {
  imagesCollection.forEach(function(imageObj, i) {
    var thumb = makeThumbnail(imageObj, i);
    document.getElementById('gallery').appendChild(thumb);
  });
}

function makeThumbnail(imageObj, position) {
  var container = document.createElement('li');
  container.className = 'gallery__thumbnail';

  var image = document.createElement('img');
  image.src = imageObj.url_q;
  image.dataset.id = imageObj.id.toString();
  image.dataset.position = position.toString();

  container.appendChild(image);
  return container;
}

// API Variables
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


var flickrRequest = new XMLHttpRequest();
flickrRequest.onreadystatechange = function() {
  if (flickrRequest.readyState === 4 && flickrRequest.status === 200) {
    images = JSON.parse(flickrRequest.responseText).photos.photo;
    attachThumbnails(images);
    console.log(images);
  }
};

flickrRequest.open('GET', flickrUrl, true);
flickrRequest.send();
