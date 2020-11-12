const express = require('express');
const errorhandler = require('errorhandler');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const musicLogger = require('./musiclogger.js')

const db = new sqlite3.Database('./database.sqlite');
const app = express();
const PORT = 80;

app.use(cors());
app.use(bodyParser.json());
app.use(errorhandler());

const apiRouter = require('./api/api');
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log('stationsiteAPI is active and listening on port: '+ PORT)
});

// This function is imported from musiclogger.js and is used to pull now playing data from each station's shoutcast server
// and inserts it into the musiclogs table.
setInterval(musicLogger, 120000);

module.exports = app;