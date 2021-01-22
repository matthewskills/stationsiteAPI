const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const errorhandler = require('errorhandler');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const musicLogger = require('./musiclogger.js')


const db = new sqlite3.Database('./database.sqlite');


const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.stationsite.co.uk/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.stationsite.co.uk/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api.stationsite.co.uk/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const app = express();
//const PORT = 80;

app.use(cors());
app.use(bodyParser.json());
app.use(errorhandler());

const apiRouter = require('./api/api');
app.use('/api', apiRouter);



// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});





//app.listen(PORT, () => {
//    console.log('stationsiteAPI is active and listening on port: '+ PORT)
//});


// This function is imported from musiclogger.js and is used to pull now playing data from each station's shoutcast server
// and inserts it into the musiclogs table.
musicLogger();
setInterval(musicLogger, 120000);

module.exports = app;