'use strict';

const path = require('path');
const {google} = require('googleapis');
const googlehome = require('google-home-notifier');
const moment = require('moment');

const {auth} = require('auth');
const config = require('../../config');

const SECRET_PATH = path.join(__dirname, '.client_secret.json');
const CREDENTIALS_PATH = path.join(__dirname, '.credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];


// OAuth
auth.authorize(SECRET_PATH, CREDENTIALS_PATH, SCOPES, listEvents);

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(oAuth2Client) {
  const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client
  });

  const date = process.argv[2] || '明日';
  const minNumber = process.argv[3] || 0;
  const minSuffix = process.argv[4] || 'days';
  const maxNumber = process.argv[5] || 1;
  const maxSuffix = process.argv[6] || 'days';

  const now = moment();

  calendar.events.list({
    calendarId: 'primary',
    timeMin: now.add(minNumber, minSuffix).toISOString(),
    timeMax: now.add(maxNumber, maxSuffix).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;
    if (events.length) {
      const schedules = events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
        return event.summary;
      });
      notice(`${date}の予定は、${schedules.join('と、')}です。`);
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function notice(text) {
  console.log(`text: ${text}`);
  googlehome.device(config.googlehome.device, config.googlehome.language);
  googlehome.ip(config.googlehome.ip, config.googlehome.language);
  googlehome.notify(text, (res) => {
    console.log(`res: ${res}`);
  });
}
