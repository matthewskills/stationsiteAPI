const express = require('express');
const onairRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

onairRouter.get('/', (req,res,next) => {

    const d = new Date();
    const currentDay = d.getDay();
    const currentHour = d.getHours();
    db.serialize(function() { 
        db.get(`SELECT * FROM schedules WHERE station_id = ${req.params.stationId} AND day = ${currentDay} AND CAST(end_time as INTEGER) > ${currentHour} ORDER BY start_time ASC`, (err,row) => {
            
            if(err) { next(err); } else if(row) { 
                if(currentHour >= row.start_time && currentHour <= row.end_time) { res.status(200).json( { onAir: row }); } else {
                    res.status(200).json( { onAir: '' });
                }
             } else { res.status(200).json( { onAir: '' }); }
        });
    
        
    });
    
})

module.exports = onairRouter;