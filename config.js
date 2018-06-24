'use strict';

// Firebase
const firebase = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXX.firebaseapp.com",
  databaseURL: "https://XXXXXXXXXX.firebaseio.com",
  projectId: "XXXXXXXXXX",
  storageBucket: "",
  messagingSenderId: "XXXXXXXXXXXX"
};

// Google Home
const googlehome = {
  device: 'Google Home',
  ip: '192.168.XXX.XXX',
  language: 'ja',
};

module.exports.firebase = firebase;
module.exports.googlehome = googlehome;

