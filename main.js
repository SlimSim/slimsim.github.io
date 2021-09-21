
if( "serviceWorker" in navigator ) {
	console.log( "tryuing to register service-worker.js" );
	window.addEventListener( "load", () => {
		navigator.serviceWorker.register( "/service-worker.js" )
		.then( reg => {
			console.log( "service-worker.js registerd! :)" );
		}).catch( error => {
			console.error( "service-worker.js failed to register:", error );
		});
	});
} else {
	console.error( 'No "serviceWorker" in navigator' );
}


var slimSimSound = new Audio( "assets/slim-sim-sound.mp3" );
var deferredPrompt = null;

$( document ).ready( function() {

	$( "#slimSimSound" ).on( "click", function( event ) {
		slimSimSound.play();
		//TODO: play in web-worker :)
	});

	var isTooSoon = true;
	window.addEventListener("beforeinstallprompt", function(e) {
	    e.preventDefault(); // Prevents prompt display

			$("#addToHomeScreen").removeAttr("hidden");
			$("#addToHomeScreen").on( "click", function(){
	      isTooSoon = false;
	      e.prompt(); // Throws if called more than once or default not prevented


				e.userChoice.then(function(choiceResult) { 
					console.log("e choiceResult.outcome", choiceResult.outcome); // either "accepted" or "dismissed"

					// TODO: remove the button, and add a "Thank you"-message instead :)

				}, function(err){console.log("e err", err)}); 


			});
	  // The event was re-dispatched in response to our request
	  // ...
	});





//	$( window ).on( "beforeinstallprompt", function( event ) {
	window.addEventListener("beforeinstallprompt23", function(e) {
//		event.preventDefault();
//		deferredPrompt = event;
		$("#addToHomeScreen")
			.removeAttr("hidden");
		deferredPrompt = e;


	});

	$("#addToHomeScreen")
			.on( "click", function(){

		deferredPrompt.userChoice.then(function(choiceResult) { 
			console.log("choiceResult.outcome", choiceResult.outcome); // either "accepted" or "dismissed"
		}, function(err){
			console.log("err", err);
		}); 


		
				//console.log(event.platforms);
//				event.prompt();
			//	event.userChoice.then((choiceResult) => {
		//			console.log("choiceResult", choiceResult);
	//				event = null;
//				})
	});

});

