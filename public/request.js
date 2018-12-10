$(document).ready(function(){

	$(document).on('click', "#play", function(){	
		slid1 = document.getElementById("dance").value / 100;
		slid2 = document.getElementById("acoustic").value / 100;
		slid3 = document.getElementById("energy").value / 100;
		slid4 = ((document.getElementById("tempo").value * 1.5) + 50;

		console.log(slid1);
		console.log(slid2);
		console.log(slid3);
		console.log(slid4);

		qstring = "dance=" + slid1 + "&acoustic=" + slid2 + "&energy=" + slid3 + "&tempo=" + slid4;
		
		postedData = {
					dance: slid1,
					acoustic: slid2,
					energy: slid3,
					tempo: slid4
				};
		url = "https://jumbo-juke.herokuapp.com/";
		AJAXrequest(url, postedData);
	});
});

function AJAXrequest(url, postedData) {
	$.ajax({
		type: "POST",
		url: "https://jumbo-juke.herokuapp.com/getPreview",
		data: JSON.stringify(postedData),
		contentType: "application/JSON; charset=utf-8",
		success: function(resultData) {
			console.log("Success!");
			var oldUrl = $("#music_player").attr("src"); // Get current url
        	var newUrl = "https://open.spotify.com/embed/track/";
        	just_uri = resultData.substring(14);
        	newUrl += just_uri;
        	$("#music_player").attr("src", newUrl);

		},
		error: function(resultData) {
			console.log("error!");
			console.log(resultData);
		}
	});
}

