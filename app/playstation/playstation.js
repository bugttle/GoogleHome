'use strict';
const path = require('path');
const {Device} = require('ps4-waker');

const ps4 = new Device({
  credentials: path.join(__dirname, '.ps4-wake.credentials.json'),
});

const commands = {
  // on
  '起動': () => { return turnOn(); },
  '点けて': () => { return turnOn(); },
  'トルネ': () => { return startTitle('CUSA00442'); },
  // off
  '消して': () => { return doStandby(); },
  '止めて': () => { return doStandby(); },
  'スリープ': () => { return doStandby(); },
  'スタンバイ': () => { return doStandby(); },
}

function turnOn() {
  return ps4.turnOn();
}

function startTitle(titleId) {
  return ps4.startTitle(titleId);
}

function doStandby() {
  return ps4.turnOff();
}

function waitAndClose(promise) {
  return new Promise((resolve, reject) => {
    promise.then(() => {
      ps4.close();
      resolve();
    }).catch((err) => reject(err));
  });
}

function execute(request) {
  return new Promise((resolve, reject) => {
    const command = commands[request];
    if (command) {
        console.log(command);
        waitAndClose(command())
          .then(() => resolve())
          .catch((err) => reject(err));
    } else {
      reject('unknown command');
    }
  });
}


module.exports.execute = execute;
