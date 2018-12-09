var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
var bodyParser = require('body-parser');
var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.json());
app.use(express.urlencoded());

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

getCredentials();


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


//// REQUEST HANDLING ////

app.get("/", function (request, response) {
    console.log("entered get callback");
    getCredentials();
    if (songs.find().count() === 0) {
        console.log("Adding songs to empty collection");
        addSongsFromPlaylist(top50);
        addSongsFromPlaylist(spotifySingles);
    }
    response.send("this is a test");
});


//// DATABASE MANAGEMENT ////

function addSongsFromPlaylist( playlistID ) {
    spotifyApi.getPlaylist( playlistID )
        .then(function (data) {
            var artists = new Array();

            data.body.tracks.items.forEach(function (song) {
                song.track.artists.forEach(function (artist) {
                    artists.push(artist.name);
                    return artists;
                });

                spotifyApi.getAudioFeaturesForTrack(song.track.id)
                    .then( function (data) {
                        if (song.track.preview_url != null) {
                            songs.insert({
                                "name": song.track.name,
                                "artists": artists,
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
                artists = [];
            });

        }, function (err) {
            console.log('Something went wrong!', err);
        });
}



app.listen(process.env.PORT || 8888);


//   // Error handling
//   player.addListener('initialization_error', ({ message }) => { console.error(message); });
//   player.addListener('authentication_error', ({ message }) => { console.error(message); });
//   player.addListener('account_error', ({ message }) => { console.error(message); });
//   player.addListener('playback_error', ({ message }) => { console.error(message); });

//   // Playback status updates
//   player.addListener('player_state_changed', state => { console.log(state); });

//   // Ready
//   player.addListener('ready', ({ device_id }) => {
//     console.log('Ready with Device ID', device_id);
//   });

//   // Not Ready
//   player.addListener('not_ready', ({ device_id }) => {
//     console.log('Device ID has gone offline', device_id);
//   });

//   // Connect to the player!
//   player.connect();


