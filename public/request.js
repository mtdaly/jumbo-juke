$(document).ready(function(){

	$(document).on('click', "#getSong", function(){

		// Get parameters from sliders
		var pD = document.getElementById("dance").value / 100;
		var pA = document.getElementById("acoustic").value / 100;
		var pE = document.getElementById("energy").value / 100;
		var pT = ((document.getElementById("tempo").value) * 1.5) + 50;

		// Use parameters in AJAX request to get a song
		var params = {
					dance: pD,
					acoustic: pA,
					energy: pE,
					tempo: pT
				};
		getSong(params);

	});

    $(document).on('click', "#rand", function() {

        // Set sliders/params to random values
        document.getElementById("dance").value = Math.floor(Math.random()*100);
        document.getElementById("acoustic").value = Math.floor(Math.random()*100);
        document.getElementById("energy").value = Math.floor(Math.random()*100);
        document.getElementById("tempo").value = getRandomIntInclusive(0, 100)

    });
});

function getSong(params) {
	$.ajax({
		type: "POST",
		url: "https://jumbo-juke.herokuapp.com/getPreview",
		data: JSON.stringify(params),
		contentType: "application/JSON; charset=utf-8",
		success: function(params) {
		    // next line could be useful for building reccomendation history
			// var oldUrl = $("#music_player").attr("src"); // Get current url
        	var newUrl = "https://open.spotify.com/embed/track/" + resultData
        	just_uri = resultData.substring(14);
        	newUrl += just_uri;
        	$("#music_player").attr("src", newUrl);
		},
		error: function(resultData) {
			console.log(resultData);
		}
	});
}


// Code from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}