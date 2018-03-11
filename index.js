'use strict';

const firebase = require('firebase');
const googlehome = require('google-home-notifier');

const config = require('./app/config');
const linkstation = require('./app/linkstation/linkstation');
const playstation = require('./app/playstation/playstation');


firebase.initializeApp(config.firebase);


const db = firebase.database();

// LinkStation
const linkstationRef = db.ref('/linkstation');
linkstationRef.on('child_changed', (snapshot) => {
  const value = snapshot.val();
  if (value) {
    linkstationRef.set({'request': ''});
    linkstation.execute(normalizeWord(value))
      .then((stdout) => console.log(stdout))
      .catch((error, stderr) => console.log(stderr));
  }
});

// PlayStation
const playstationRef = db.ref('/playstation');
playstationRef.on('child_changed', (dataSnapshot) => {
  const value = dataSnapshot.val();
  if (value) {
    playstationRef.set({'request': ''});
    playstation.execute(normalizeWord(value))
      .then(() => console.log('ok'))
      .catch((err) => console.log(err));
  }
});

function normalizeWord(text) {
  return text
    .trim()
    .replace(/^を\s+(.+)$/, '$1')
    .replace(/\s+/g, '');
}


//googlehome.device(config.googlehome.device, config.googlehome.language);
//googlehome.ip(config.googlehome.ip, config.googlehome.language);
//googlehome.notify('こんにちは', function(res) {
//  console.log(res);
//});
