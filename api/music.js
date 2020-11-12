const express = require('express');
const musicRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');


musicRouter.get('/', (req,res,next) => {
    db.all(`SELECT * from musiclogs WHERE station_id = ${req.params.stationId} ORDER BY id DESC LIMIT 30 `, (err,rows) => {
        if (err) { next(err); } else if (rows) { res.status(200).json( {tracks: rows} ) } else { res.sendStatus(404); }
    });
})

musicRouter.post('/', (req,res,next) => {
    const recData = req.body.song;
    
    db.run(`INSERT INTO musiclogs (station_id,artist,title,listener_count,timestamp,as_album_art) VALUES ($stationId,$artist,$title,$listenerCount,$timestamp,$asAlbumArt)`, 
    {
        $stationId: recData.station_id,
        $artist: recData.artist,
        $title: recData.title,
        $listenerCount: recData.listener_count,
        $timestamp: recData.timestamp,
        $asAlbumArt: recData.as_album_art
    },
    function(err){
        if(err) { next(err); } else {
           res.sendStatus(201)
        }
    }
    
    ) 
})

module.exports = musicRouter;