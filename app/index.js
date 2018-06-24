'use strict';

const firebase = require('firebase');

const {utils} = require('utils');
const config = require('../config');
const linkstation = require('./linkstation/linkstation');
const playstation = require('./playstation/playstation');

firebase.initializeApp(config.firebase);
const db = firebase.database();

// LinkStation
const linkstationRef = db.ref('/linkstation');
linkstationRef.on('child_changed', (snapshot) => {
  const value = snapshot.val();
  if (value) {
    linkstationRef.set({'request': ''});
    linkstation.execute(utils.normalizeWord(value))
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
    playstation.execute(utils.normalizeWord(value))
      .then(() => console.log('ok'))
      .catch((err) => console.log(err));
  }
});
