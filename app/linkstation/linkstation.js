'use strict';
const child_process = require('child_process');
const path = require('path');

const LINKSTATION_BIN = path.join(__dirname, 'linkstation.rb');

const commands = {
  // on
  '起動': 'on',
  '点けて': 'on',
  // off
  '消して': 'off',
  '止めて': 'off',
  '終了して': 'off',
  // state
  '状況': 'state',
}

function execute(request) {
  return new Promise((resolve, reject) => {
    const command = commands[request];
    if (command) {
      const exec_command = LINKSTATION_BIN + ' ' + command;
      console.log(exec_command);
      child_process.exec(exec_command, (error, stdout, stderr) => {
        if (error) {
          reject(error, stderr);
        } else {
          resolve(stdout);
        }
      });
    }
  });
}


module.exports.execute = execute;
