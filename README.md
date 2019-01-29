# Google Home
Google Home applications on Node.js.

## Applications
### LinkStation
- Send Wake On Lan packet to wake up.
- ~~Login to admin web page and send a request to shutdown.~~
    - It won't be waked up by WOL if you send a shutdown request.
- Get power status.

### PlayStation4
- Wake.
- Do standby.
- Launch application.
    - torne
    - Netflix

```
$ NODE_PATH=./lib node app/index.js
```


## Bin
### Google Calendar
- Fetch schedule and speak schedules.

```
$ NODE_PATH=./lib node bin/googlecalendar/googlecalendar.js
```


## Install
- node packages
~~~shell
$ npm install
~~~

- launch
~~~shell
$ NODE_PATH=./lib node app/index.js
~~~

