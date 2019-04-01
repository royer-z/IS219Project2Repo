// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

//implement me as an object to hold the following data about an image:
//1. location where photo was taken
//2. description of photo
//3. the date when the photo was taken
//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
function GalleryImage(location, description, date, img) {
    this.location = location;
    this.description = description;
    this.date = date;
    this.img = img;
}

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = "../images-short.json";

// XMLHttpRequest response listener
function XMLHttpListener() {
	console.log("XMLHttpRequest response:");
	console.log(mRequest.response);
}

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();
mRequest.addEventListener("load", XMLHttpListener);
mRequest.open("GET", mUrl, false);
mRequest.send();

// Holds the retrieved JSON information
var mJson = JSON.parse(mRequest.response);

// Array holding GalleryImage objects (see below).
var mImages = [];

// Counter for the mImages array
var mCurrentIndex = 0;

// Populates mImages array with GalleryImage objects
mJson.images.forEach(image => {
    mImages.push(new GalleryImage(image.imgLocation, image.Description, image.date, image.imgPath));
});
console.log("Array of GalleryImage objects:");
console.log(mImages);

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

function swapPhoto() {
	// If the end of the list of images is detected start from beginning
	if (mCurrentIndex === mImages.length){
		mCurrentIndex = 0;
	}
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded
	//from the JSON string
	console.log('swap photo');
	$(".thumbnail").attr("src", mImages[mCurrentIndex].img);

	let details = $(".details");
	details.find(".location").text(mImages[mCurrentIndex].location);
	details.find(".description").text(mImages[mCurrentIndex].description);
	details.find(".date").text(mImages[mCurrentIndex].date);
	mCurrentIndex++;
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
	
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);