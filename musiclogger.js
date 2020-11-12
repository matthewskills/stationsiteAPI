
const request = require('request');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const musicLogger = () => {

db.all(`SELECT id,stream_url FROM stations`, (err,stations) => {

    stations.forEach(station => {
        
        setTimeout(function() {
            request({uri: station.stream_url+"/7?sid=2"}, 
            function(error, response, body) {
                let remFrontTags = body.replace('<html><body>', '');
                let remBackTags = remFrontTags.replace('</body></html>', '');
                const data = remBackTags.split(',')
                const listenerCount = data[0];
                const song = data[6].split('-');
                const artist = song[0].trim();
                const title = song[1].trim();

                db.run(`INSERT INTO musiclogs (station_id,artist,title,listener_count,timestamp,as_album_art) VALUES ($stationId,$artist,$title,$listenerCount,$timestamp,$asAlbumArt)`, 
                {
                    $stationId: station.id,
                    $artist: artist,
                    $title: title,
                    $listenerCount: listenerCount,
                    $timestamp: 0,
                    $asAlbumArt: 0
                },
                function(err){
                    if(err) { next(err); } else {
                        console.log('\x1b[33m%s\x1b[0m',`[MUSICLOGGER] `,'\x1b[0m',`station with id: ${station.id} is currently playing ${artist} - ${title} with ${listenerCount} listeners`)
                    }
                });
        });
        }, 1000)
       

    });

})

};

module.exports = musicLogger;