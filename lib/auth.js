'use strict';

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const {utils} = require('utils');

class Auth {
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {string} secret file path.
   * @param {string} credentials file path.
   * @param {Array} scopes.
   * @return {function} if error in reading credentials.json asks for a new one.
   */
  static authorize(secretFilePath, credentialsFilePath, scopes, callback) {
    try {
      // Load client secrets from a local file.
      const secret = utils.loadJsonFile(secretFilePath);
      const {client_secret, client_id, redirect_uris} = secret.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      try {
        // Check if we have previously stored a token.
        const token = utils.loadJsonFile(credentialsFilePath);
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
      } catch (err) {
        return this._getAccessToken(oAuth2Client, credentialsFilePath, scopes, callback);
      }
    } catch (err) {
      return console.log('Error loading client secret file:', err);
    }

  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {string} credentials file path.
   * @param {Array} scopes.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  static _getAccessToken(oAuth2Client, credentialsFilePath, scopes, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        try {
          fs.writeFileSync(credentialsFilePath, JSON.stringify(token));
          console.log('Token stored to', credentialsFilePath);
        } catch (err) {
          console.error(err);
        }
        callback(oAuth2Client);
      });
    });
  }
}

module.exports.auth = Auth;
