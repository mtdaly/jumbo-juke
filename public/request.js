$(document).ready(function () {

    $(document).on('click', "#getSong", function () {

        // Get parameters from sliders
        // var pD = document.getElementById("dance").value / 100;
        // var pA = document.getElementById("acoustic").value / 100;
        // var pE = document.getElementById("energy").value / 100;
        // var pT = ((document.getElementById("tempo").value) * 1.5) + 50;

        // Use parameters in AJAX request to get a song
        var params = {
            dance: document.getElementById("dance").value / 100,
            acoustic: document.getElementById("acoustic").value / 100,
            energy: document.getElementById("energy").value / 100,
            tempo: (document.getElementById("tempo").value * 1.5) + 50
        };
        getSong(params);

    });

    $(document).on('click', "#rand", function () {

        // Set sliders/params to random values
        document.getElementById("dance").value = Math.floor(Math.random() * 100);
        document.getElementById("acoustic").value = Math.floor(Math.random() * 100);
        document.getElementById("energy").value = Math.floor(Math.random() * 100);
        document.getElementById("tempo").value = getRandomIntInclusive(0, 100)

        var params = {
            dance: document.getElementById("dance").value / 100,
            acoustic: document.getElementById("acoustic").value / 100,
            energy: document.getElementById("energy").value / 100,
            tempo: (document.getElementById("tempo").value * 1.5) + 50
        };
        getSong(params);

    });
});

function getSong(params) {
    $.ajax({
        type: "POST",
        url: "https://jumbo-juke.herokuapp.com/getPreview",
        data: JSON.stringify(params),
        contentType: "application/JSON; charset=utf-8",
        success: function (data) {
            // next line could be useful for building reccomendation history
            // var oldUrl = $("#music_player").attr("src"); // Get current url
            var newUrl = "https://open.spotify.com/embed/track/" + data.substring(14);
            $("#music_player").attr("src", newUrl);
        },
        error: function (err) {
            console.log(err);
        }
    });
}


// Code from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}