'use strict';

const libxmljs = require('libxmljs');
const ping = require('ping');
const request = require('request');
const wol = require('wake_on_lan');

module.exports = class LinkStationClient {
  constructor(host, macAddress) {
    this.host = host;
    this.macAddress = macAddress;
    this.gSSS = null;
    this.gRRR = null;
    this.interval = null;
  }

  startWOLInterval(intervalTime) {
    this.stopWOLInterval();
    this.interval = setInterval(this.sendWOL.bind(this), intervalTime);
  }

  stopWOLInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  sendWOL(callback) {
    wol.wake(this.macAddress, (err) => {
      if (err) {
        if (callback) {
          callback(err, null);
        }
      } else {
        if (callback) {
          callback(null, `succeeded to send WOL: ${this.macAddress}`);
        }
      }
    });
  }

  login(user, password, callback) {
    const options = {
      url: `http://${this.host}/cgi-bin/top.cgi`,
      method: 'POST',
      form: {
        'txtAuthLoginUser': user,
        'txtAuthLoginPassword': password,
        'hiddenAuthFocus': '',
        'gPage': 'top',
        'gMode': 'auth',
        'txtHelpSearch': '',
        'gType': '',
        'gKey': '',
        'gSSS': '',
        'gRRR': '',
        'hiddenDummyText': 'dummy',
      },
    };
    request(options, (err, res, body) => {
      if (err) {
        callback(err, null);
      } else {
        const doc = libxmljs.parseHtmlString(body);
        this.gSSS = doc.get('//input[@id="gSSS"]').attr('value').value();
        this.gRRR = doc.get('//input[@id="gRRR"]').attr('value').value();
        callback(null, 'succeeded to login');
      }
    });
  }

  sendShutdown(callback) {
    const options = {
      url: `http://${this.host}/cgi-bin/top.cgi`,
      method: 'POST',
      form: {
        'txtHelpSearch': '',
        'gPage': 'maintenance',
        'gMode': 'shutdown',
        'gType': 'shutdown',
        'gKey': 'undefined',
        'gSSS': this.gSSS,
        'gRRR': this.gRRR,
        'hiddenDummyText': 'dummy',
      },
    };
    request(options, (err, res, body) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, 'succeeded to send a shutdown request');
      }
    });
  }

  sendPing(callback) {
    const conf = {
      timeout: 0.5,
    };
    ping.sys.probe(this.host, (isAlive) => {
      if (!isAlive) {
        callback(`failed to send a ping: ${this.host} is Dead`, null);
      } else {
        callback(null, 'succeeded to send a ping');
      }
    }, conf);
  }
}

