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

var spotifyApi = new SpotifyWebApi({
    clientId: 'a5dec87ebd744ebab9ff564c9fa2d802',
    clientSecret: 'b13366801081480c845c59802c249cc9'
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);


app.get("/", function (request, response) {
    spotifyApi.getPlaylist('37i9dQZEVXbLRQDuF5jeBp')
        .then(function (data) {
            var artists = new Array();

            data.body.tracks.items.forEach(function (song) {
                console.log(song.track.name);
                song.track.artists.forEach(function (artist) {
                    artists.push(artist.name);
                    return artists;
                });
                songs.insert({
                    "name": song.track.name,
                    "artists": artists,
                    "id": song.track.id,
                    "preview": song.track.preview
                });
                artists = [];
            });


            response.send("this is a test")
        }, function (err) {
            console.log('Something went wrong!', err);
        });
});


function addSongsFromPlaylist( playlistID ) {
    spotifyApi.getPlaylist(playlistID)
        .then(function(data) {
            var temp;
            var artists = new Array();
            data.tracks.forEach( function (track) {
                temp.name = track.name;
                console.log(track.name);
                temp.id = track.id;
                temp.preview = track.preview_url;
                track.artists.forEach( function (artist) {
                    artists.push(artist.name);
                    return artists;
                });
                songs.insert({
                    "name": temp.name,
                    "artists": temp.artists,
                    "id": temp.id,
                    "preview": temp.preview
                })
            })
        }, function(err) {
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


