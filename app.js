'use strict';

// API Variables
var apiKey = 'aec6f380f4286b7eb92b912e38445e48';
var galleryId = '72157663691204050';
var extras = 'description,date_taken,owner_name,url_q,url_c';
var format = 'json';
var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos'
                  .concat('&api_key=', apiKey)
                  .concat('&gallery_id=', galleryId)
                  .concat('&extras=', extras)
                  .concat('&format=', format)
                  .concat('&nojsoncallback=1');

var flickrRequest = new XMLHttpRequest();
flickrRequest.onreadystatechange = function() {
  var images;
  if (flickrRequest.readyState === 4 && flickrRequest.status === 200) {
    images = JSON.parse(flickrRequest.responseText).photos.photo;
    attachThumbnails(images);
  }
};


flickrRequest.open('GET', flickrUrl, true);
flickrRequest.send();

// create thumbnail
function attachThumbnails(imagesCollection) {
  imagesCollection.forEach(function(imageObj) {
    var thumb = makeThumbnail(imageObj);
    document.getElementById('gallery').appendChild(thumb);
  });
}

function makeThumbnail(imageObj) {
  var container = document.createElement('li');
  container.className = 'gallery__thumbnail';
  var image = document.createElement('img');
  image.src = imageObj.url_q;

  container.appendChild(image);
  return container;
}

