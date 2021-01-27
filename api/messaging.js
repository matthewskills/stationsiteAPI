const express = require('express');
const messagingRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

messagingRouter.get('/', (req,res,next) => {
    const recData = req.body;
    const apiKey = recData.apiKey;

    // this will check that the provided api and station id are a match or returns a 401 errror
    db.get(`SELECT id,api_key FROM stations WHERE id = '${req.params.stationId}' AND  api_key='${apiKey}'`, (err,row) => {
        if (err || !row) {  res.sendStatus(401); } else { 

            // get the messaging data
            db.all(`SELECT * FROM messaging WHERE station_id = '${req.params.stationId}' ORDER BY timestamp DESC LIMIT 15`, (err,rows) => {
                if(err) { next(err) } else if (rows) { res.status(200).json({messages: rows}) } else { res.sendStatus(404); }
            });

    }

});

messagingRouter.post('/', (req,res,next) => {
    const recData = req.body;

                // post a new message
                db.run(`INSERT INTO messaging (station_id,sender,subject,message,returnto,timestamp) VALUES ($stationId,$sender,$subject,$message,$returnto,$timestamp)`, 
                {
                    $stationId: req.params.stationId,
                    $sender: recData.sender,
                    $subject: recData.subject,
                    $message: recData.message,
                    $returnto: recData.returnto,
                    $timestamp: recData.timestamp
                },
                function(err) {
                    if(err) { next(err); } else {res.sendStatus(201); }
                })

});

messagingRouter.delete('/', (req,res,next) => {
    const recData = req.body;
    const apiKey = recData.apiKey;

        // this will check that the provided api and station id are a match or returns a 401 errror
        db.get(`SELECT id,api_key FROM stations WHERE id = '${req.params.stationId}' AND  api_key='${apiKey}'`, (err,row) => {
            if (err || !row) {  res.sendStatus(401); } else {
     
                // delete the messaging data
                db.run(`DELETE FROM messaging WHERE station_id = '${req.params.stationId}' AND id = '${recData.messageId}`, (err,rows) => {
                    if(err) { next(err) } else if (rows) { res.sendStatus(200); } else { res.sendStatus(404); }
                });
    
        }

})