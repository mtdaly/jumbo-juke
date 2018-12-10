var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
var bodyParser = require('body-parser');
var app = new express();
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.json());
app.use(express.urlencoded());

app.use(cors());

var mongojs = require('mongojs');
ObjectId = require('mongodb').ObjectID;
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

app.post("/getPreview", function (request, response) {
    var tempo = Number(request.body.tempo);
    var dance = Number(request.body.dance);
    var acoustic = Number(request.body.acoustic);
    var energy = Number(request.body.energy);
    var sum = 0;

    if (tempo == NaN || dance == NaN || acoustic == NaN || energy == NaN) {
        response.send("Bad Request");
    }

    songs.find().toArray( function (err, data) {
        data.forEach( function (song) {
            sum += Math.abs(song.tempo - tempo) / 150;
            sum += Math.abs(song.dance - dance);
            sum += Math.abs(song.acoustic - acoustic);
            sum += Math.abs(song.energy - energy);

            songs.update(
                { _id: song._id },
                { $set: { "matchQuality": sum } }
            );
            sum = 0;
        });
        songs.find().sort({ matchQuality: 1}).toArray( function (err, data) {
             response.send(data[0].uri)
        });

    });


});

app.get("/", function (request, response) {
    response.sendFile('/public/index.html', {root: __dirname});
});

app.get("/public/request.js", function (req, resp) {
    resp.sendFile('public/request.js', {root: __dirname});
});

app.get("/public/stylesheets/style.css", function (req, resp) {
    resp.sendFile('/public/stylesheets/style.css', {root: __dirname});
});

// app.get("/node_modules", function (req, resp) {
//     resp.sendFile('public/request.js', {root: __dirname});
// });


//// DATABASE MANAGEMENT ////

function addSongsFromPlaylist( playlistID ) {
    spotifyApi.getPlaylist( playlistID )
        .then(function (data) {
            data.body.tracks.items.forEach(function (song) {
                spotifyApi.getAudioFeaturesForTrack(song.track.id)
                    .then( function (data) {
                            songs.insert({
                                "name": song.track.name,
                                "id": song.track.id,
                                "uri": song.track.uri,
                                "tempo": data.body.tempo,
                                "dance": data.body.danceability,
                                "acoustic": data.body.acousticness,
                                "energy": data.body.energy,
                                "matchQuality": 100
                            });
                    }, function (err) {
                        console.log(err);
                    });
            });

        }, function (err) {
            console.log('Something went wrong!', err);
        });
}

app.listen(process.env.PORT || 8888);
