importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

// Initialize Aplu
const apluPushConfig = {
    apiKey: "AIzaSyA5pH6WJzZdhRIZHi04REsN03ZRcXRfP2M",
	authDomain: "aplu-i.firebaseapp.com",
	projectId: "aplu-i",
	storageBucket: "aplu-i.firebasestorage.app",
	messagingSenderId: "623588794761",
	appId: "1:623588794761:web:18b4f0fd464dc244ca8158"
};

try {
    importScripts('https://push.aplu.io/import-aplu-messaging.js');
} catch (err) {
    console.warn("Couldn't load aplu-script, falling back: ", err);
}