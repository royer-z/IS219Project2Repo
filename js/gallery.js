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

// Returns any parameter included in the page url

function getQueryParams(qs){
	qs = qs.split("+").join(" ");
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)){
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}
	return params;
}
var $_GET = getQueryParams(document.location.search);
console.log($_GET["json"]);

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl;

if ($_GET["json"] === undefined){
	mUrl = "../images.json";
}
else{
	mUrl = $_GET["json"];
}

// XMLHttpRequest response listener
function XMLHttpListener() {
	// console.log("XMLHttpRequest response:");
	// console.log(mRequest.response);
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
let mCurrentIndex = 0;

// Populates mImages array with GalleryImage objects
mJson.images.forEach(image => {
    mImages.push(new GalleryImage(image.imgLocation, image.description, image.date, image.imgPath));
});
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
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded
	//from the JSON string
	if (mCurrentIndex === mImages.length){
		mCurrentIndex = 0;
	}

	console.log('swap photo');
	$(".thumbnail").attr("src", mImages[mCurrentIndex].img);

	let details = $(".details");
	details.find(".location").text("Location: "+mImages[mCurrentIndex].location);
	details.find(".description").text("Description: "+mImages[mCurrentIndex].description);
	details.find(".date").text("Date: "+mImages[mCurrentIndex].date);

	mCurrentIndex++;
}

// Next photo event listener
$("#nextPhoto").on("click", () => {
	swapPhoto();
});

// Previous photo event listener
$("#prevPhoto").on("click", () => {
	mCurrentIndex = mCurrentIndex - 2;
	// If negative index, jump to end of image list
	if (mCurrentIndex < 0){
		mCurrentIndex = mImages.length - 1;
	}
	swapPhoto();
});

// More info event listener
$(".moreIndicator").on("click", () => {
	if ($(event.currentTarget).hasClass("rot90")){
	    $(".details").slideToggle();
		$(event.currentTarget).addClass("rot270");
		$(event.currentTarget).removeClass("rot90");
	}
	else{
		$(event.currentTarget).addClass("rot90");
		$(event.currentTarget).removeClass("rot270");
		$(".details").slideToggle();
	}
});

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).show();
	// This initially positions the next button to the right side of the slide show
	$("#nextPhoto").css({
		position: "relative",
		left: "86%",
	});
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);