const express = require('express');
const stationRouter = express.Router();
const presentersRouter = require('./presenters.js');
const scheduleRouter = require('./schedule.js');
const onairRouter = require('./onair.js');
const musicRouter = require('./music.js');
const messagingRouter = require('./messaging.js');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

stationRouter.use('/:stationId/presenters', presentersRouter);
stationRouter.use('/:stationId/schedule', scheduleRouter);
stationRouter.use('/:stationId/onair', onairRouter);
stationRouter.use('/:stationId/music', musicRouter);
stationRouter.use('/:stationId/messaging', messagingRouter);

stationRouter.param('stationId', (req,res,next, stationId) => {
    db.get(`SELECT * FROM stations WHERE id = ${stationId}`, (err,row) => {
        if(err) { next(err); } else if (row) { req.station = row; next(); } else { res.sendStatus(404); }
    });
});

stationRouter.get('/:stationId', (req,res,next) => {
    res.status(200).json( { station: req.station });
});

stationRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM stations`, (err,rows) => {
        if(err) { next(err); } else if (rows) { res.status(200).json({ stations: rows }); } else { res.sendStatus(404); }
    })
})

module.exports = stationRouter;