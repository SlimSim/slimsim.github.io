let appCaches = [
	{
		name: 'core-v1.4.15',
		urls: [
			"/",
			"index.html",
			"main.js"
		]
	},
	{
		name: 'app-assets-v1.8',
		urls: [
			"assets/logos/favicon.ico",
			"assets/logos/slim-sim-logo.svg",
			"assets/logos/slim-sim-logo-128.png",
			"assets/logos/slim-sim-logo-192-non-transparent.png",
			"assets/logos/slim-sim-logo-256.png",
			"assets/logos/slim-sim-logo-512.png",
			"manifest.json"
		]
	},
	{
		name: 'external-assets-v1.4.1',
		urls: [
			"assets/external/jquery-3.4.1.min.js",
			"assets/external/bootstrap-4.4.1/bootstrap.min.css",
			"assets/external/bootstrap-4.4.1/bootstrap.bundle.min.js",
			"assets/external/fontawesome-free-5.12.1-web-test/css/all.min.css",
			"assets/external/fontawesome-free-5.12.1-web-test/js/all.min.js",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-brands-400.svg",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-regular-400.svg",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-solid-900.svg",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-brands-400.ttf",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-regular-400.ttf",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-solid-900.ttf",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-brands-400.eot",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-regular-400.eot",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-solid-900.eot",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-brands-400.woff2",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-regular-400.woff2",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-solid-900.woff2",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-brands-400.woff",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-regular-400.woff",
			"assets/external/fontawesome-free-5.12.1-web-test/webfonts/fa-solid-900.woff"
		]
	},
	{
		name: 'sound-v1.1',
		urls: [
			'assets/slim-sim-sound.mp3'
		]
	}
];

let cacheNames = appCaches.map((cache) => cache.name);

self.addEventListener( "install", function ( event ) {
	event.waitUntil(caches.keys().then(function( keys ) {
		return Promise.all( appCaches.map( function( appCache ) {
			if( keys.indexOf( appCache.name ) === -1 ) {
				return caches.open( appCache.name ).then( function( cache ) {
					return cache.addAll( appCache.urls );
				})
			} else {
				console.log(`found ${appCache.name}`);
				return Promise.resolve(true);
			}
		}))
		/*.then(function () {
			return this.skipWaiting();
		})*/;
	}));
});

self.addEventListener( "activate", function( event ) {
	event.waitUntil(
		caches.keys().then( function( keys ) {
			return Promise.all( keys.map( function( key ) {
				if( cacheNames.indexOf( key ) === -1) {
					return caches.delete( key );
				}
			}));
		})
	);
});

self.addEventListener( "fetch", event => {
	event.respondWith(
		caches.match( event.request )
		.then( cachedResponse => {
			return cachedResponse || fetch( event.request );
			/*
			if( cachedResponse ) {
				return cachedResponse;
			} else if( event.request.url.indexOf( "google" ) =! -1 ) {
				console.info( "fetching googletagmanager" );
				return fetch( event.request );
			} else {
				console.error( "fetch.request was not cached:", event.request );
			}
			*/
		})
	);
});