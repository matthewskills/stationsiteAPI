
const request = require('request');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const musicLogger = () => {

db.all(`SELECT id,stream_url FROM stations`, (err,stations) => {

    stations.forEach(station => {
        
        setTimeout(function() {
            request({uri: station.stream_url+"/7.html"}, 
            function(error, response, body) {

                try { 
                    let remFrontTags = body.replace('<HTML><meta http-equiv="Pragma" content="no-cache"></head><body>', '');
                    let remBackTags = remFrontTags.replace('</body></html>', '');
                    const data = remBackTags.split(',')
                    const listenerCount = data[0];
                    const song = data[6].split('-');
                    const artist = song[0].trim();
                    const title = song[1].trim();

                    let apiUrl = 'http://ws.audioscrobbler.com/2.0/';
                    let method = 'track.getInfo';
                    let apiKey = '6f23c5a84d20794e1afa8eaa40f8ea00';
                    let image = 'no_cover_art.jpg';
                    let asUri;
                   request({uri: apiUrl+'?method='+method+'&api_key='+apiKey+'&artist='+artist+'&track='+title+'&format=json'},function(error, response, body) {
                        const trackResults = JSON.parse(body);
                        
                        const trackData = trackResults.track;
                        try {const imageRaw = JSON.stringify(trackData.album.image[3]);
                            image =  imageRaw.replace('{"#text":"', '').replace('","size":"extralarge"}', ''); }
                        catch(err) {}
                        try { asUri = trackData.artist.url; } catch(err) {}
                        
                        console.log(image);
                        console.log(asUri);

                        db.run(`INSERT INTO musiclogs (station_id,artist,title,listener_count,timestamp,as_album_art, as_uri) VALUES ($stationId,$artist,$title,$listenerCount,$timestamp,$asAlbumArt, $asUri)`, 
                        {
                            $stationId: station.id,
                            $artist: artist,
                            $title: title,
                            $listenerCount: listenerCount,
                            $timestamp: 0,
                            $asAlbumArt: image,
                            $asUri: asUri
                        },
                        function(err){
                            if(err) { next(err); } else {
                                console.log('\x1b[33m%s\x1b[0m',`[MUSIC LOGGER] `,'\x1b[0m',`station with id: ${station.id} is currently playing ${artist} - ${title} with ${listenerCount} listeners`)
                            }
                        });
                        
                    })
    
                   
                } catch(err) {console.log('\x1b[33m%s\x1b[0m',`[MUSIC LOGGER] `, `station id  ${station.id} with url: ${station.stream_url} (`+err+')') }
               
        });
        }, 1000)
       

    });

})

};

module.exports = musicLogger;