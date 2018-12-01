var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
var cors = require('cors');
var bodyParser = require('body-parser');
var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// window.onSpotifyWebPlaybackSDKReady = () => {
//   const token = 'a5dec87ebd744ebab9ff564c9fa2d802';
//   const player = new Spotify.Player({
//     name: 'Web Playback SDK Quick Start Player',
//     getOAuthToken: cb => { cb(token); }
//   });
// };


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
    spotifyApi.getNewReleases({ limit : 5, offset: 0, country: 'SE' })
        .then(function(data) {
            console.log(data.body);
            done();
        }, function(err) {
            console.log("Something went wrong!", err);
        });
    response.send("test");
});



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


