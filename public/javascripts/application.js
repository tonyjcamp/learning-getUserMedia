var FILTER_VALS = {};

var filters = ['grayscale', 'sepia', 'blur', 'brightness', 'contrast', 'hue-rotate', 'hue-rotate2', 'hue-rotate3', 'saturate', 'invert', 'reset'];

var addEvents = function ( lis, filter ) {
	lis.addEventListener('click', function() {
		// document.querySelector('canvas').classList.add(filter);

		if ( this.classList[0] === 'reset' ) {
			reset();
		} else {
			// brightness blur drop shadow
			//set( filter, '5px' );
		}

	});
},

set = function ( filter, value ) {
	FILTER_VALS[filter] = value;
	render();
},

reset = function () {
	FILTER_VALS = {};
	render();
},

render = function () {
	var vals = [],
		val;

	Object.keys( FILTER_VALS ).forEach( function( key, i ) {
		vals.push( key + '(' + FILTER_VALS[key] + ')' );
	});

	val = vals.join( ' ' );
	canvas.style.webkitFilter = val;
};

// add click event on button
// adds class to the canvas

var doc = document,
	canvas = doc.querySelector('canvas'),
	ctx = canvas.getContext('2d'),
	video = doc.querySelector('video'),
	VIDEO_WIDTH, VIDEO_HEIGHT,
	take = doc.querySelector('#take'),
	img,
	computeSize = function(supportsObjectFit){
		// user agents that don't support object-fit
		// will display the video with a different
		// aspect ratio.
		if (supportsObjectFit == true){
			VIDEO_WIDTH = 320;
			VIDEO_HEIGHT = 240;
		} else {
			VIDEO_WIDTH = video.videoWidth;
			VIDEO_HEIGHT = video.videoHeight;
		}
	},

	errorCallback =function ( error ) {
		console.error('An error occurred: [CODE ' + error.code + ']');
	},

	hasGetUserMedia = function() {
		return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
	},

	snap = function() {
		var button = document.getElementById('take'),
			canvasDataUrl = canvas.toDataURL('image/png');

		//button.classList.add('hidden');

		canvas.classList.remove('hidden');
		computeSize(true);
		ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
		// document.querySelector('canvas').src = canvasDataUrl

		// push img data URI to server

		var request = new XMLHttpRequest();

		request.open('POST', '/snap', false);
		request.setRequestHeader("Content-type", "image/png");
		request.send(canvas.toDataURL('image/png'));
		console.log('from server: ', request.responseText);
	};

take.addEventListener('click', snap, false);

window.addEventListener('DOMContentLoaded', function() {

	if ( hasGetUserMedia() ) {

		if (navigator.getUserMedia) {

			navigator.getUserMedia({'video': true}, function( stream ) {
				video.src = stream;
				video.play();
				computeSize(true);
			}, errorCallback);

		}

		if (navigator.webkitGetUserMedia) {
			// doesn't work using file:///Uset/path...
			navigator.webkitGetUserMedia('video', function( stream ){
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
				computeSize(false);
			}, errorCallback);

		}

	} else {

		console.log('Native web camera streaming (getUserMedia) is not supported in this browser.');

	}

}, false);
