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

//////////////////////
// Variable declaration
//////////////////////

//the intro text
var introText = "Who approaches the Bridge of Death must answer me these questions three, 'ere the other side he see?";
console.log(introText);

var client = new Twitter(keyxpt.twitterKeys);
var rText;
var rTyp;

//////////////////////
// User Input   -- inquired questions
//////////////////////

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
            var tNow = moment().format("MM DD YYYY, h:mm:ss a");

            fs.appendFile("log.txt", data + " " + tNow + "\n", function(err) {
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

        //     //////////////////////
        //     // spotify
        //     //////////////////////
        function spotify(title) {
            console.log("spot " + title);
            writeLog("spot " + title);
        }

        //     //////////////////////
        //     // omdb
        //     //////////////////////
        function movie(title) {


            var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json";

            request(queryURL, function(error, response, body) {

             // If the request is successful (i.e. if the response status code is 200)
             if (!error && response.statusCode === 200) {


 // console.log(JSON.parse(body));

            var movieLog =
            "Title: " + JSON.parse(body).Title +'\n'+
            "Release Year: " + JSON.parse(body).Year +'\n'+
            "IMDB Rating: " + JSON.parse(body).Title +'\n'+
            "Produced in: " + JSON.parse(body).Country +'\n'+
            "Language: " + JSON.parse(body).Language +'\n'+
            "Plot: " + JSON.parse(body).Plot +'\n'+
            "Actors: " + JSON.parse(body).Actors +'\n'+
            // "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +'\n'+
            "Rotten Tomatoes URL: " + JSON.parse(body).Country +'\n'
             }
             console.log( movieLog);
            writeLog(movieLog);

        });


        }

        //     //////////////////////
        //     // self directed
        //     //////////////////////
        function selfDetermined() {
            console.log("random ");
            writeLog("random");
        }
    });