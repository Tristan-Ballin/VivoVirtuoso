var artistQuery = $("#input-box");
var opacity = 0;
var intervalID = 0;

// function that fades in the app description slowly
function fadeIn() {
    setInterval(show, 50);
}

function show() {
    var infoBox = document.getElementById("info-box");
    opacity = Number(window.getComputedStyle(infoBox)
                     .getPropertyValue("opacity"));
    if (opacity < 1) {
        opacity = opacity + 0.05;
        infoBox.style.opacity = opacity
    } else {
        clearInterval(intervalID);
    }
}

// waits 1 second after page load to begin fadeIn  
  window.addEventListener("load", function() {
    console.log('Page is loaded');
    setTimeout(function() {
        fadeIn(); }, 1000)
  });

function getArtistArt(artist){
    fetch("https://theaudiodb.com/api/v1/json/523532/search.php?s="+artist)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        var artistArt = data.artists[0].strArtistThumb;
        var artistName = data.artists[0].strArtist;

        var cardEl = $("<div></div>")
        $("#recommendContainer").append(cardEl); 
        //Create elements and append it to card
        var artistNameEl = $("<h3></h3>").text(artistName).css("text-align","center");
        $(cardEl).append(artistNameEl);
        var artistArtEl = $("<img src='"+artistArt+"' alt='"+artistName+" thumbnail'>");
        $(cardEl).append(artistArtEl); 
    })


}

function getArtistRecommends(artist){
    fetch("https://floating-headland-95050.herokuapp.com/https://tastedive.com/api/similar?q="+artist+"&k=443399-ClassPro-DVSLXXJW&limit=5")
    .then(function (response) {
        console.log("TasteDive response gotten");
        return response.json();
        })
    .then(function (data) {
        console.log("Data:");
        var names = data.Similar.Results;
        console.log(names);
        if (!names.length) {
            return;
        }
        $("#recommendContainer").empty();
        var headerEl = $("<h2></h2>").text("Similar Artists").css("text-align","center");
        $("#recommendContainer").prepend(headerEl); 
        for (let i = 0; i < names.length; i++) {
            var artistName = names[i].Name;
            //var artistName = "coldplay";
            //console.log(artistName);
            getArtistArt(artistName); 
        }
    })
}

function getAlbums(artistId){
    fetch("https://theaudiodb.com/api/v1/json/523532/album.php?i="+artistId)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        $("#albumContainer").empty();
        var albums = data.album;
        // sort albums by score property in descending order
        albums.sort( function ( a, b ) { return b.intYearReleased - a.intYearReleased; } );
        for (let i = 0; i < 8; i++) {
            //console.log(albums[i]);
            var albumArt = albums[i].strAlbumThumb;
            var albumName = albums[i].strAlbum;
            var albumYear = albums[i].intYearReleased;
            var albumGenre = albums[i].strStyle;
            var albumLabel = albums[i].strLabel;
            
            if (!albumGenre) {
                albumGenre = "Undetermined";
            }
            if (!albumLabel) {
                albumLabel = "None";
            }
            //Create card and append it to body
            var cardEl = $("<div class='columns'></div>")
            $("#albumContainer").append(cardEl); 

            var leftEl = $("<span class='column is-3'></span>")
            $(cardEl).append(leftEl); 
            var rightEl = $("<div class='column is-8'></div>")
            $(cardEl).append(rightEl); 
            //Create elements and append it to card
            var albumArtEl = $("<img src='"+albumArt+"' alt='"+albumName+" thumbnail' >");
            $(leftEl).append(albumArtEl);
            var albumNameEl = $("<h3></h3>").text(albumName);
            var albumYearEl = $("<p></p>").text("Released: "+albumYear);
            var albumGenreEl = $("<p></p>").text("Genre: "+albumGenre);
            var albumLabelEl = $("<p></p>").text("Record Label: "+albumLabel);
            $(rightEl).append(albumNameEl, albumYearEl, albumGenreEl, albumLabelEl);  
            
        }

    })
}

function getArtistID(artist){
    fetch("https://theaudiodb.com/api/v1/json/523532/search.php?s="+artist)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        //parse data
        var artistArt = data.artists[0].strArtistThumb;
        var artistName = data.artists[0].strArtist;
        var artistDescr = data.artists[0].strBiographyEN;
        $("#art-bg").empty();
        //Create card and append it to body
        var cardEl = $("<section class='columns' id='artistContainer'></section>")
        $(".art-sec").prepend(cardEl); 
        var leftEl = $("<span class='column is-2 is-offset-1'></span>")
        $(cardEl).append(leftEl); 
        var rightEl = $("<div class='column is-8'></div>")
        $(cardEl).append(rightEl); 
        //Create elements and append it to card
        var artistArtEl = $("<div><img src='"+artistArt+"' alt='"+artistName+" thumbnail'></div>");
        $(leftEl).append(artistArtEl);  
        var artistNameEl = $("<h2></h2>").text(artistName);
        var artistDescrEl = $("<p></p>").text(artistDescr);
        $(rightEl).append(artistNameEl, artistDescrEl);  
        
        getAlbums(data.artists[0].idArtist);
    })
}

function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    console.log("You clicked search");
    if (!artistQuery.val()) {
        return;
    }

    e.preventDefault();
    var search = artistQuery.val().trim();
    getArtistID(search);
    getArtistRecommends(search);
    artistQuery.val("");
}

$("#searchButton").on("click", handleSearchFormSubmit);
$('#input-box').keypress((e) => {
if (e.which === 13) {
    handleSearchFormSubmit(e);
}
})