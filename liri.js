///////////////////////
// Dependencies
///////////////////////
var keyxpt = require("./keys.js");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var spotify = require("spotify");
var fs = require("fs");
var request = require("request");

//////////////////////
// Variable declaration
//////////////////////

//the intro text
var introText = "Who approaches the Bridge of Death must answer me these questions three, \'ere the other side he see?";
console.log(introText);

var client = new Twitter(keyxpt.twitterKeys);
var rText;
var rTyp;

//////////////////////
// the input source  -- inquired questions
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
        questions   // the variable
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



        // Based on requestType run the appropriate function

        //////////////////////
        // twitter
        //////////////////////
        function tweets() {
            console.log("twit");
        }


        //     //////////////////////
        //     // spotify
        //     //////////////////////
        function spotify(title) {
            console.log("spot " + title);
        }

        //     //////////////////////
        //     // omdb
        //     //////////////////////
        function movie(title) {
            console.log("movie " + title);
        }

        //     //////////////////////
        //     // self directed
        //     //////////////////////
        function selfDetermined() {
            console.log("random ");
        }

    });