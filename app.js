// API Variables
var apiKey = 'aec6f380f4286b7eb92b912e38445e48';
var galleryId = '72157663691204050';
var extras = 'description,date_taken,owner_name,url_q,url_c';
var format = 'json';
var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos'.concat('&api_key=', apiKey).concat('&gallery_id=', galleryId).concat('&extras=', extras).concat('&format=', format).concat('&nojsoncallback=1');

var flickrRequest = new XMLHttpRequest();
flickrRequest.onreadystatechange = function() {
  if (flickrRequest.readyState === 4 && flickrRequest.status === 200) {
    console.log(JSON.parse(flickrRequest.responseText));
  }
};
flickrRequest.open('GET', flickrUrl, true);
flickrRequest.send();