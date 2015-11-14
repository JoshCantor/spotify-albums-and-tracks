// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things 
// like attach event listeners and any dom manipulation.  
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

// var uniq = function (list) {
//   var result = []
//   list.forEach(function(item) {
//     if(result.indexOf(item) === -1) {
//       result.push(item);
//     }
//   })
//   return result;
// }



/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success 
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;
        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items' 
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure 
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  var artistId = $(event.target).attr('data-spotify-id');
  var artistAlbumRequest = $.ajax({
      url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
      method: "GET"
  })
  
  artistAlbumRequest.done(function(data) {
    var albums = data.items;

    appendToMe.html('');
    
    albums.forEach(function(album) {
      var artistAlbumRequest = $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + album.id,
        method: "GET"
      })

      artistAlbumRequest.done(function(data) {
        var albumLi = $('<li id=' + album.id + '>' + data.name + ' (Release Date: ' + data.release_date + ')</li>');
        albumLi.attr('data-album-id', album.id);
        appendToMe.append(albumLi);
        albumLi.click(displayTracks);
      })
    })
  })

    artistAlbumRequest.fail(function (error) {
        console.log("Something Failed During Album Request:")
        console.log(error);
  })
  
}

function displayTracks(event) {
  var albumId = $(this).attr('id');
  var appendToMe = $('#' + albumId);
  var songClass = albumId
  var orderedList = $('<ol class=' + songClass + '></ol>')
  appendToMe.append(orderedList);
  var albumId = $(event.target).attr('data-album-id');
  var albumTrackRequest = $.ajax({
      url: 'https://api.spotify.com/v1/albums/' + albumId,
      method: "GET"
    })
  
  albumTrackRequest.done(function(data) {
    var songs = data.tracks.items;
    songs.forEach(function(song) {
      var songLi = $('<li>' + song.name + '</li>');
      var jquerySongClass = '.' + songClass;
      $(jquerySongClass).append(songLi);
    })
  })
}


/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
