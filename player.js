var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
var bodyParser = require('body-parser');
var app = new express();
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.json());
app.use(express.urlencoded());

app.use(cors());

var mongojs = require('mongojs');
var mongoURL = process.env.MONGODB_URI;
var db = mongojs(mongoURL);
var songs = db.collection('songs');

// Spotify Playlists:
var top50 = '37i9dQZEVXbLRQDuF5jeBp';
var spotifySingles = '37i9dQZF1DWTUm9HjVUKnL';

//// START ROUTINE ////

var spotifyApi = new SpotifyWebApi({
    clientId: 'a5dec87ebd744ebab9ff564c9fa2d802',
    clientSecret: 'b13366801081480c845c59802c249cc9'
});

addSongs();


//// API MANAGEMENT ////

function getCredentials() {
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
}

function addSongs() {
    songs.remove({});
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);


            addSongsFromPlaylist(top50);
            addSongsFromPlaylist(spotifySingles);
        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
}

//// REQUEST HANDLING ////

app.get("/", function (request, response) {
    console.log("entered get callback");
    response.send("this is a test");
});


//// DATABASE MANAGEMENT ////

function addSongsFromPlaylist( playlistID ) {
    spotifyApi.getPlaylist( playlistID )
        .then(function (data) {
            data.body.tracks.items.forEach(function (song) {
                spotifyApi.getAudioFeaturesForTrack(song.track.id)
                    .then( function (data) {
                        if (song.track.preview_url != null) {
                            songs.insert({
                                "name": song.track.name,
                                "id": song.track.id,
                                "preview": song.track.preview_url,
                                "tempo": data.body.tempo,
                                "dance": data.body.danceability,
                                "acoustic": data.body.acousticness,
                                "energy": data.body.energy
                            });
                        }
                    }, function (err) {
                        console.log(err);
                    });
            });

        }, function (err) {
            console.log('Something went wrong!', err);
        });
}

// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//         if ((new Date().getTime() - start) > milliseconds){
//             break;
//         }
//     }
// }

app.listen(process.env.PORT || 8888);
