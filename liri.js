
//Week 10 - Liri-node-app
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
var introText = "     Who approaches the Bridge of Death must answer me ";
var introText2 = "       these questions three,'ere the other side he see:";
var client = new Twitter(keyxpt.twitterKeys);
var rText;
var rTyp;
var row40 = "----------------------------------------"; //40 hyphens!
var row80 = (row40 + row40).slice(-80);
var returns2 = "\n\n";
var returns1 = "\n";
var defaultTrack = "";
var maxTweetcount = "";
//Console header//////
console.log(
    row80 + returns1 + introText + "\n" + introText2 + returns1 + row80
);
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
        //movie title is requested if movie picked
        type: "input",
        message: "Movie Title?",
        name: "requestText",
        when: function(answers) {
            return answers.requestType === "Movie";
        }
    },
    {
        //song title is requested only for spotify
        type: "input",
        message: "Artist / Song Title?",
        name: "requestText",
        when: function(answers) {
            return answers.requestType === "Spotify";
        }
    }
];

// Create a "Prompt" with a series of questions from var above.
inquirer
    .prompt(
         questions
        // Here we give the user a list to choose from.
        // the variable
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
                spotifyTrack(rText);
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
            fs.appendFile(
                "log.txt",
                data + " Logged: " + tNow + "\n" + row80,
                function(err) {
                    if (err) throw err;
                }
            );
        }

        function writeLogLess(data) {
            // var tNow = moment().format("MM DD YYYY, h:mm:ss a");

            fs.appendFile("log.txt", data, function(err) {
                if (err) throw err;
            });
        }

        // Based on requestType run the appropriate function

        //////////////////////
        // twitter
        //////////////////////
        function tweets() {
            // console.log("twit");
            // writeLog("twit");

            var twitLogHeader = returns1 +
                row80 +
                returns1 +
                "Recent Tweets: " +
                returns1 +
                row40 +
                returns1;
            writeLog(twitLogHeader);
            writeLogLess(returns1);

            var params = { screen_name: "InifinitleyLoop" };
            client.get(
                "statuses/user_timeline",
                params,
                function(error, tweets, response) {
                    if (!error) {
                        // console.log(tweets);

                        if (tweets.length > 20) {
                            maxTweetcount = 20;
                        } else {
                            maxTweetcount = tweets.length;
                        }

                        for (i = 0; i < maxTweetcount; i++) {
                            var twitterLog = i +
                                1 +
                                ") --->>>  " +
                                tweets[i].created_at +
                                returns1 +
                                tweets[i].text +
                                returns1;
                            console.log(twitterLog);
                            writeLogLess(twitterLog);
                        }
                    }
                    writeLogLess(row80 + returns2);
                }
            );
        }

        ////////////////////////
        //// spotify
        ////////////////////////
        var aOfB = "https://api.spotify.com/v1/search?q=track:the%20sign%20artist:ace%20of%20base&type=track";
        var countReportTracks;
        var reportTable;
        // var spotifyLogHeader;

        function spotifyTrack(title) {
            // console.log("spot: " + title);
            // writeLog("spot " + title);

            if (title == "") {
                var title = "The Sign Ace of Base";
                defaultTrack = "No search params! - Default Track -> ";
            }

            spotify.search(
                { type: "track", query: title },
                function(err, data) {
                    if (err) {
                        console.log("Error occurred: " + err);
                        return;
                    }
                    var itemLength = data.tracks.items.length;

                    if (itemLength > 4) {
                        countReportTracks = 5;
                    } else {
                        countReportTracks = itemLength;
                    }

                    var spotifyLogHeader = returns1 +
                        row80 +
                        returns1 +
                        defaultTrack +
                        "Spotify search: " +
                        title +
                        "\n" +
                        "Matches: " +
                        itemLength +
                        "\n" +
                        "First " +
                        countReportTracks +
                        " Matches shown.\n" +
                        row40 +
                        returns1;

                    writeLog(spotifyLogHeader);
                    writeLogLess(returns1);
                    console.log(spotifyLogHeader);

                    if (itemLength < 1) {
                        // console.log("No matches.")
                    } else {
                        for (var i = 0; i < countReportTracks; i++) {
                            var songName = data.tracks.items[i].name;
                            var albumName = data.tracks.items[i].album.name;
                            var songURL = data.tracks.items[i].album.artists[
                                0
                            ].external_urls.spotify;
                            var songArtists = data.tracks.items[
                                i
                            ].album.artists[0].name;

                            var logSong = "Song Title: " +
                                songName +
                                "  ---> Artist: " +
                                songArtists +
                                returns1 +
                                "Album: " +
                                albumName +
                                returns1 +
                                songURL +
                                returns1 +
                                row80 +
                                returns1;

                            console.log(logSong);
                            writeLogLess(logSong);
                        }
                    }
                }
            );
        }

        ////////////////////////
        //// omdb  a/k/a "movie-this"
        ////////////////////////
        function movie(title) {
            //if no title entered, Nobody's the default.
            if (title == "") {
                var title = "Mr. Nobody";
                defaultTrack = "No film selected - default movie choice <->";
            }

            var queryURL = "http://www.omdbapi.com/?t=" +
                title +
                "&y=&plot=short&tomatoes=true&r=json";

            request(queryURL, function(error, response, body) {
                // If the request is successful (i.e. if the response status code is 200)
                if (!error && response.statusCode === 200) {
                    var jsBody = JSON.parse(body);
                    // console.log(jsBody);

                    if (jsBody.Ratings === undefined) {
                        var noMatchOmdb = row80 +
                            returns1 +
                            "No Matches - Movie search on: " +
                            title +
                            returns1 +
                            row80 +
                            returns1;
                        console.log(noMatchOmdb);
                        writeLog(noMatchOmdb);
                        return;
                    }

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

                    //calculating header log line output - making it pretty.
                    //the title line and the last line will be 80 characters long, the title centered.
                    var tLength = jsBody.Title.length;
                    var cPadding = (71 - tLength) / 2; //"71" = 80 columns less 9 chars for " Title: "
                    var cPaddingSlice = row40.slice(-cPadding);
                    var titleString = returns1 +
                        cPaddingSlice +
                        " Title: " +
                        jsBody.Title +
                        " " +
                        cPaddingSlice;
                    // console.log(titleString);

                    var movieLog = titleString +
                        returns1 +
                        defaultTrack +
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
                        "\n" +
                        row80 +
                        returns1;
                }

                console.log(movieLog, row80, returns2);

                writeLog(
                    returns1 +
                        row80 +
                        returns1 +
                        "Movie Search: " +
                        title +
                        returns1 +
                        row40 +
                        returns1
                );
                writeLogLess(movieLog);
            });
            // writeLogLess(row80 + returns1);
        }

        ////////////////////////
        //// self directed a/k/a "do-what-it-says"
        ////////////////////////
        function selfDetermined() {
            // console.log("random ");
            writeLogLess("\n" + row80 + "\n do-what-it-says - Randomly Picked from list...");

            //read the random txt file
            fs.readFile("random.txt", "utf8", function(error, data) {
                //split the lines on char returns
                var dataArr = data.split("\n");
                //counts the lines
                var dataArrLength = dataArr.length;
                //picks a random number based on the number of lines
                var randItem = Math.floor(Math.random() * dataArrLength );
                //split the randomly chosen line into function and data
                var randItemArray = dataArr[randItem].split(",");
                //separate
                var randFunction = randItemArray[0];
                var randData = randItemArray[1];

                //switch to choose function and pass paramter.
                switch (randFunction) {
                    case "my-tweets":
                        tweets();
                        break;
                    case "movie-this":
                        movie(randData);
                        break;
                    case "spotify-this-song":
                        spotifyTrack(randData);
                        break;
                }

            });
        }
    });