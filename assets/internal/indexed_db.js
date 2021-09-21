
var DB = {};
window.indexedDB =	window.indexedDB || 
										window.webkitIndexedDB ||
										window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}

DB.indexedDB = {};

DB.indexedDB.db = null;

DB.indexedDB.onerror = function(e) {
	console.error(e);
};

var createKeyValueStore = function( db ) {
	if(db.objectStoreNames.contains("keyValue")) {
		console.info("keyValue - store already exists");
		return;
	}

	var keyValueStore = db.createObjectStore("keyValue", {keyPath: "key"});
}

DB.indexedDB.open = function() {

	var version = 1;
	var request = indexedDB.open("indexed_db_database", version);

	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {

		var db = e.target.result;

		// A versionchange transaction is started automatically.
		e.target.transaction.onerror = DB.indexedDB.onerror;

		createKeyValueStore( db );
	}; // Ctrl+M: request.onupgradeneeded


	request.onsuccess = function(e) {
		DB.indexedDB.db = e.target.result;
	};

	request.onerror = DB.indexedDB.onerror;
};

DB.setKeyValue = function( key, value, callBackFunk ) {

	var db = DB.indexedDB.db;
	var trans = db.transaction(["keyValue"], "readwrite");
	var store = trans.objectStore("keyValue");

	var data = {
		"key": key,
		"value": value
	};

	var request = store.put(data);

	request.onsuccess = function( e ) {
		if( callBackFunk ) {
			callBackFunk();
		}
	};

	request.onerror = function( e ) {
		console.error("DB.indexedDB.setKeyValue Error:", e);
	};
};

DB.getKeyValue = function( key, callBackFunk ) {

	var db = DB.indexedDB.db;
	var trans = db.transaction(["keyValue"], "readwrite");
	var store = trans.objectStore("keyValue");

	// Get everything in the store;
	var keyRange = IDBKeyRange.lowerBound(0);
	var cursorRequest = store.openCursor(keyRange);

	cursorRequest.onsuccess = function(e) {
		var result = e.target.result;
		if( !!result == false ) {
			callBackFunk( undefined );
			return;
		}
		if( result.key == key ) {
			callBackFunk( result.value.value );
			return;
		}

		result.continue();
	};

	cursorRequest.onerror = DB.indexedDB.onerror;
}


DB.indexedDB.open();	
