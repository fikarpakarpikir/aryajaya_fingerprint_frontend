// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

// import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
firebase.initializeApp({
    apiKey: "AIzaSyBKrHbPPjGjS2Kt1PTU9btjbNOJAEyKm60",
    authDomain: "hcsystem-aryajaya.firebaseapp.com",
    projectId: "hcsystem-aryajaya",
    storageBucket: "hcsystem-aryajaya.appspot.com",
    messagingSenderId: "74363632350",
    appId: "1:74363632350:web:d35329541795f67d5aa04f",
    measurementId: "G-YNCQFSP5NZ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
// messaging.onBackgroundMessage(function(payload) {
//     // console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/assets/logo/logo-crc.png'
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });