
const request = require('request');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const musicLogger = () => {
request({uri: "http://64.237.40.90:8232/7?sid=2"}, 
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
        $stationId: 1,
        $artist: artist,
        $title: title,
        $listenerCount: listenerCount,
        $timestamp: 0,
        $asAlbumArt: 0
    },
    function(err){
        if(err) { next(err); } else {
            console.log(listenerCount);
    console.log(artist);
    console.log(title);
        }
    }
    
    ) 
  }
);
}

module.exports = musicLogger;