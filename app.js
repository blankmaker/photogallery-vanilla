'use strict';

var images;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('gallery').addEventListener('click', function(e) {
    loadLightbox(e.target.dataset.id, e.target.dataset.position, images);
  });
});

function loadLightbox(imageIdString, imagePosition, imageCollection) {
  var body = document.getElementsByTagName('body')[0];
  body.style.overflow = 'hidden';

  var lightbox = document.getElementById('lightbox');
  var imageContainer = document.createElement('figure');
  var image = document.createElement('img');
  var imageCaption = document.createElement('figcaption');

  imageContainer.className = 'lightbox__imagecontainer';
  image.className = 'lightbox__image';
  imageCaption.className = 'lightbox__imagecaption';
  imageCaption.innerHTML = imageCollection[imagePosition].title + 'by' + '<a href="http://www.google.com">me</a>';

  image.src = imageCollection[imagePosition].url_c ? imageCollection[imagePosition].url_c : imageCollection[imagePosition].url_m;

  imageContainer.appendChild(image);
  imageContainer.appendChild(imageCaption);
  lightbox.appendChild(imageContainer);
  lightbox.style.display = 'block';
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
var extras = 'description,date_taken,owner_name,url_q,url_c,url_m';
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
