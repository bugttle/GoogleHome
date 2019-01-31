'use strict';

const LinkStationClient = require('./linkstation_client');

const WOL_SENDING_INTERVAL = 1 * 60 * 1000; // 1 min
var lsClient = null;

const commands = {
  // on
  '起動': (config) => { return turnOn(); },
  '点けて': (config) => { return turnOn(); },
  // off
  '消して': (config) => { return turnOff(config.user, config.password); },
  '止めて': (config) => { return turnOff(config.user, config.password); },
  '終了して': (config) => { return turnOff(config.user, config.password); },
  // state
  '状況': (config) => { return state(); },
}

function turnOn() {
  return new Promise((resolve, reject) => {
    lsClient.sendWOL((err, msg) => {
      if (err) {
        reject(err);
      } else {
        lsClient.startWOLInterval(WOL_SENDING_INTERVAL);
        resolve(msg);
      }
    });
  });
}

function turnOff(user, password) {
  return new Promise((resolve, reject) => {
    lsClient.stopWOLInterval();
    resolve('succeeded to stop WOL interval');
    // Don't send shutdown request if you want to use auto wake.
    //lsClient.login(user, password, (err, msg) => {
    //  if (err) {
    //    reject(err);
    //  } else {
    //    lsClient.sendShutdown((err, msg) => {
    //      if (err) {
    //        reject(err);
    //      } else {
    //        resolve(msg);
    //      }
    //    });
    //  }
    //});
  });
}

function state(){
  return new Promise((resolve, reject) => {
    lsClient.sendPing((err, msg) => {
      if (err) {
        reject(err);
      } else {
        resolve(msg);
      }
    });
  });
}

function execute(config, request) {
  if (!lsClient) {
    lsClient = new LinkStationClient(config.host, config.macAddress);
  }

  return new Promise((resolve, reject) => {
    const command = commands[request];
    if (command) {
      command(config)
        .then((msg) => resolve(msg))
        .catch((err) => reject(err));
    } else {
      reject('unknown command');
    }
  });
}

module.exports.execute = execute;

