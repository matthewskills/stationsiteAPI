const express = require('express');
const presentersRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

presentersRouter.param('presenterId', (req,res,next, presenterId) => {
    db.get(`SELECT * FROM presenters WHERE id = ${presenterId}`, (err,row) => {
        if(err) { next(err); } else if (row) { req.presenter = row; next(); } else { res.sendStatus(404); }
    });
});

presentersRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM presenters WHERE  station_id = ${req.params.stationId}`, (err,rows) => {
        if(err) { next(err); } else if (rows) { res.status(200).json({ presenter: rows }); } else { res.sendStatus(404); }
    })
})

presentersRouter.get('/:presenterId', (req,res,next) => {
    res.status(200).json( { presenter: req.presenter });
});

module.exports = presentersRouter;