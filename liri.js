var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// console.log(twitterKeys);

var command = process.argv[2];
var search = '';
var output = '';
var userInput = "Command: " + command + " Search: " + search;
for (var i = 3; i < process.argv.length; i++) {
  search += process.argv[i] + " ";
};

// Create switch cases for each user command
function liri() {
  switch (command) {
    case "my-tweets":
    tweets();
    break;

    case "spotify-this-song":
    music();
    break;

    case "movie-this":
    movie();
    break;

    case "do-what-it-says":
    doWhat();
    break;

    default:
    output = "--Invalid command--" +
      "\nPlease enter one of the following:\n" +
      "\nmy-tweets" +
      "\nspotify-this-song [song title]" +
      "\nmovie-this [movie title]" +
      "\ndo-what-it-says";
    console.log(output);
    log();
  }
}

// User command functions
// Twitter: returns 20 most recent tweets and their timestamps
var tweets = function() {
  var client = new Twitter (keys.twitterKeys);
  var params = {
    screen_name: 'arsenicDev',
    count: 20,
  };
  client.get('statuses/user_timeline', params, function(err, tweets, response) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < tweets.length; i++) {
        output = tweets[i].created_at + '\n"' + tweets[i].text + '"\n\n---\n';
        console.log(output);
      }
      log();
    }
  });
};

// Spotify: returns artist, title, preview link, album
// if no song input, use "The Sign" -Ace of Base
var music = function() {
  var spotify = new Spotify (keys.spotifyKeys);
  if (process.argv.length < 3) {
    spotify.search({ type: 'track', query: "The Sign Ace of Base" }, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            output = 
              "\nArtist: " + data.tracks.items[0].artists[0].name +
              "\nTitle: " + data.tracks.items[0].name +
              "\nAlbum: " + data.tracks.items[0].album.name + 
              "\nPreview Link: " + data.tracks.items[0].preview_url;
            console.log(output); 
            log();
          }
        });
  } else {
    spotify.search({ type: 'track', query: search }, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        output = 
          "\nArtist: " + data.tracks.items[0].artists[0].name +
          "\nTitle: " + data.tracks.items[0].name +
          "\nAlbum: " + data.tracks.items[0].album.name + 
          "\nPreview Link: " + data.tracks.items[0].preview_url;
        console.log(output); 
        log();
      }
    });
  }
}; 

// OMDB: returns title, year, IMDB & RT rating, country, lang, plot, cast
// if no movie input, use "Mr. Nobody"
var movie = function() {
  if (process.argv.length < 3) {  
    var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=mr+nobody";
    request(queryURL, function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        var data = JSON.parse(body);
        output = 
          "\nTitle: " + data.Title +
          "\n\nRelease Year: " + data.Year +
          "\n\nIMDB Rating: " + data.imdbRating +
          "\n\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
          "\n\nCountry: " + data.Country + 
          "\n\nLanguage: " + data.Language + 
          "\n\nActors: " + data.Actors + 
          "\n\nPlot: \n" + data.Plot;
        console.log(output);
        log();
      }
    });
  } else {
    var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + search;
    request(queryURL, function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        var data = JSON.parse(body);
        output = 
          "\nTitle: " + data.Title +
          "\n\nRelease Year: " + data.Year +
          "\n\nIMDB Rating: " + data.imdbRating +
          "\n\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
          "\n\nCountry: " + data.Country + 
          "\n\nLanguage: " + data.Language + 
          "\n\nActors: " + data.Actors + 
          "\n\nPlot: \n" + data.Plot;
        console.log(output);
        log();
      }
    });
  }
};

// FS: uses fs node package to retreive data from random.txt
var doWhat = function() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      data = data.split(",");
      command = data[0];
      search = data[1];
      liri();
    }
  })
};
liri();

function log() {
  fs.appendFile('log.txt', userInput + "Result: " + output + "---", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("\n\n-------------\nLog Updated!")
    }
  })
};