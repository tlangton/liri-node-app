var keyxpt = require("./keys.js");
var Twitter = require('twitter');

console.log("--------------------------");
console.log(keyxpt.twitterKeys);
console.log("--------------------------");

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var client =  new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});
// console.log( client );

var inputString = process.argv;
// console.log( process.argv );
// Parses the command line argument to capture the "processChoice" & the query strings
var processChoice = inputString[2];
var inputVar = inputString[3];


// Here's the variable we will be modifying with the new info
var theOutput;

// Determines the processChoice selected...
// Based on the processChoice we run the appropriate function
if (processChoice === "my-tweets") {
	// theOutput = processChoice

	client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
   console.log(tweets);
});
// client.get('favorites/list', function(error, tweets, response) {
//   if(error) throw error;
//   console.log(tweets);  // The favorites.
//   console.log(response);  // Raw response object.
// });


}

else if (processChoice === "spotify-this-song") {
  theOutput = 'el songo';
}

else if (processChoice === "movie-this") {

  // var queryURL = "http://www.omdbapi.com/?t=" + inputVar + "&y=&plot=short&r=json";
  //   $.ajax({
  //     url: queryURL,
  //     method: "GET"
  //   }).done(function(response) {
  //     console.log("Title: " + response.Title
  //     	+ "\nYear: " + response.Year
  //     	+ "\nimdbRating: " + response.imdbRating
  //     	+ "\nCountry: " + response.Country
  //     	+ "\nLanguage: " + response.Language
  //     	+ "\nPlot: " + response.Plot
  //     	+ "\nActors: " + response.Actors
  //     	);
  //   });

  theOutput = "movee";
}

else if (processChoice === "do-what-it-says") {
  theOutput = 'till satisfy';
}


else {
  theOutput = "Not a recognized command";
}

console.log( theOutput );