const express = require('express');
const scheduleRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

scheduleRouter.param('presenterId', (req,res,next, presenterId) => {
    db.all(`SELECT * FROM schedules WHERE station_id = ${req.params.stationId} AND presenter_id = ${presenterId}  ORDER BY day ASC`, (err,row) => {
        if(err) { next(err); } else if (row) { req.schedule = row; next(); } else { res.sendStatus(404); }
    });
});

scheduleRouter.get('/', (req,res,next) => {
        
        db.all(`SELECT * FROM schedules WHERE station_id = ${req.params.stationId}  ORDER BY day ASC, start_time ASC`, (err,rows) => {
            if (err) { next(err); } else if (rows) { res.status(200).json({schedule: rows}) } else { res.sendStatus(404); }
        });
});

scheduleRouter.get('/featured', (req,res,next) => {
        
    db.all(`SELECT * FROM schedules WHERE station_id = ${req.params.stationId} AND featured = 1  ORDER BY day ASC`, (err,rows) => {
        if (err) { next(err); } else if (rows) { res.status(200).json({featuredSchedule: rows}) } else { res.sendStatus(404); }
    });
});

scheduleRouter.get('/:presenterId', (req,res,next) => {
    res.status(200).json( { presenterSchedule: req.schedule });
});

scheduleRouter.post('/', (req,res,next) => {

    const recData = req.body;
    const apiKey = recData.apiKey;

    db.get(`SELECT id,api_key FROM stations WHERE id = '${req.params.stationId}' AND  api_key='${apiKey}'`, (err,row) => {
        if (err || !row) {  res.sendStatus(401); } else {

            db.run(`INSERT INTO schedules (presenter_id,station_id,day,start_time,end_time,title,description,image) VALUES ($presenter,$station,$day,$start,$end,$title,$description,$image)`,
            {
            $presenter: recData.presenter_id,
            $station: req.params.stationId,
            $day: recData.day,
            $start: recData.start_time,
            $end: recData.end_time,
            $title: recData.title,
            $description: recData.description,
            $image: recData.image
            },
            function(err){
                if(err) { next(err); } else {res.sendStatus(201); }
            })

        }
    })


})

scheduleRouter.delete('/', (req,res,next) => {

    const recData = req.body;
    const apiKey = recData.apiKey;

    db.get(`SELECT id,api_key FROM stations WHERE id = '${req.params.stationId}' AND  api_key='${apiKey}'`, (err,row) => {
        if (err || !row) {  res.sendStatus(401); } else {

            db.run(`DELETE FROM schedules WHERE station_id = '${req.params.stationId}' AND id = '${recData.sid}'`,
            function(err){
                if(err) { next(err); } else {res.sendStatus(200); }
            })

        }
    })


})

module.exports = scheduleRouter;