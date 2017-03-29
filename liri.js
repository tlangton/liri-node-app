///////////////////////
// Dependencies
///////////////////////
var keyxpt = require("./keys.js");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var spotify = require("spotify");
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var aLine = "-------------------------------------------\n\n";

//////////////////////
// Variable declaration
//////////////////////

sString = String(10, "M")
console.log(sString + '\n');

//the intro text
var introText = "Who approaches the Bridge of Death must answer me these questions three, 'ere the other side he see?";
console.log(introText);

var client = new Twitter(keyxpt.twitterKeys);
var rText;
var rTyp;

// console.log(client);

/////////////////////////////////////////
// User Input   -- inquired questions  --
/////////////////////////////////////////

var questions = [
{
    type: "list",
    message: "What Request type?",
    choices: ["Twitter", "Spotify", "Movie", "Random"],
    name: "requestType"
},
{
        //title is requested only if spotify or movie is specified
        type: "input",
        message: "Movie or Song Title?",
        name: "requestText",
        when: function(answers) {
            return answers.requestType === "Spotify" ||
            answers.requestType === "Movie";
        }
    }
    ];

// Create a "Prompt" with a series of questions from var above.
inquirer
.prompt(
        // Here we give the user a list to choose from.
        questions // the variable
        // Once we are done with all the questions... "then" we do stuff with the answers
        // In this case, we store all of the answers into a "user" object that inquirer makes for us.
        )
.then(function(user) {
        // If we log that user as a JSON, we can see how it looks.
        // console.log(JSON.stringify(user, null, 2));

        var rText = user.requestText;
        var rType = user.requestType;

        switch (rType) {
            case "Spotify":
            spotify(rText);
            break;

            case "Twitter":
            tweets();
            break;

            case "Movie":
            movie(rText);
            break;

            case "Random":
            selfDetermined();
            break;

            default:
            ("unknown choice");
            break;
        }

        function writeLog(data) {
            // var tNow = moment().format("MM DD YYYY, h:mm:ss a");
            var tNow = new Date();
            fs.appendFile("log.txt", data + " Logged: " + tNow + "\n", function(err) {
                if (err) throw err;

                // console.log("Saved!");
            });
        }

        // Based on requestType run the appropriate function

        //////////////////////
        // twitter
        //////////////////////
        function tweets() {
            console.log("twit");
            writeLog("twit");
        }

        ////////////////////////
        //// spotify
        ////////////////////////
        function spotify(title) {
            console.log("spot " + title);
            writeLog("spot " + title);
        }

        ////////////////////////
        //// omdb
        ////////////////////////
        function movie(title) {
            var queryURL = "http://www.omdbapi.com/?t=" +
            title +
            "&y=&plot=short&tomatoes=true&r=json";

            request(queryURL, function(error, response, body) {
                // If the request is successful (i.e. if the response status code is 200)
                if (!error && response.statusCode === 200) {
                    var jsBody = JSON.parse(body);
                    // console.log(jsBody);

                    //Checking to see if Rotten Tomatoes rating exists
                    //if it exists, get the rating into a var
                    var myRatings = jsBody.Ratings;
                    var rtRating = "N/A";
                    for (var i = 0; i < myRatings.length; i++) {
                        if (myRatings[i].Source === "Rotten Tomatoes") {
                            rtRating = myRatings[i].Value;
                        }
                        // console.log("rating "+ rtRating);
                    }

                    var movieLog = "\n\n---------- Title: " +
                    jsBody.Title +
                    " ---------- \n" +
                    " Release Year: " +
                    jsBody.Year +
                    "\n" +
                    " IMDB Rating: " +
                    jsBody.imdbRating +
                    "\n" +
                    " Produced in: " +
                    jsBody.Country +
                    "\n" +
                    " Language: " +
                    jsBody.Language +
                    "\n" +
                    " Plot: " +
                    jsBody.Plot +
                    "\n" +
                    " Actors: " +
                    jsBody.Actors +
                    "\n" +
                    " Rotten Tomatoes Rating: " +
                    rtRating +
                    "\n" +
                    " Rotten Tomatoes URL: " +
                    jsBody.tomatoURL +
                    "\n";

                }



                console.log(movieLog,aLine);
                writeLog(movieLog,aLine);
            });
        }

        ////////////////////////
        //// self directed
        ////////////////////////
        function selfDetermined() {
            console.log("random ");
            writeLog("random");
        }
    });