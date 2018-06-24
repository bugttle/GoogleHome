'use strict';

// Firebase
var firebase = {
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

// LinkStation
var linkstation = {
  host: '192.168.XXX.XXX',
  user: 'XXXXX',
  password: 'XXXXXXXXXX',
};

module.exports.firebase = firebase;
module.exports.googlehome = googlehome;
module.exports.linkstation = linkstation;
