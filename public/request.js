$(document).ready(function () {

    $(document).on('click', "#getSong", function () {
        getSong();
    });

    $(document).on('click', "#rand", function () {

        // Needs enable check
        // Set sliders/params to random values
        document.getElementById("dance").value = Math.floor(Math.random() * 100);
        document.getElementById("acoustic").value = Math.floor(Math.random() * 100);
        document.getElementById("energy").value = Math.floor(Math.random() * 100);
        document.getElementById("tempo").value = getRandomIntInclusive(0, 100);

        getSong();

    });
});

function getSong() {
    $.ajax({
        type: "POST",
        url: "https://jumbo-juke.herokuapp.com/getPreview",
        data: JSON.stringify(getParams()),
        contentType: "application/JSON; charset=utf-8",
        success: function (data) {
            console.log(data);
            console.log(data.substring(14));
            var newUrl = "https://open.spotify.com/embed/track/" + data.substring(14);
            $("#music_player").attr("src", newUrl);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// After upgrading sliders, add enable check here...
function getParams() {
    return {
        dance: document.getElementById("dance").value / 100,
        acoustic: document.getElementById("acoustic").value / 100,
        energy: document.getElementById("energy").value / 100,
        tempo: (document.getElementById("tempo").value * 1.5) + 50
    };
}

// Code from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




/// Notes...

// line could be useful for building reccomendation history
// var oldUrl = $("#music_player").attr("src"); // Get current url
