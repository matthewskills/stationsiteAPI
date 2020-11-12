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

module.exports = scheduleRouter;