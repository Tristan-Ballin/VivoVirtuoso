var artistQuery = $("#input-box");


// function that fades in the app description slowly
function fadeIn() {
    setInterval(show, 25);
}

function show() {
    var opacity = 0;
    var intervalID = 0;
    var infoBox = document.getElementById("info-box");
    opacity = Number(window.getComputedStyle(infoBox)
                     .getPropertyValue("opacity"));
    if (opacity < 1) {
        opacity = opacity + 0.025;
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

        if (!artistArt) {
            artistArt = "assets/images/artistPlaceholder.png"
        }

        var cardEl = $("<div class='recommendedArtists column is-clickable'></div>")
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
        return response.json();
        })
    .then(function (data) {
        var names = data.Similar.Results;
        if (!names.length) {
            return;
        }
        $("#recommendContainer").empty();
        var headerEl = $("<h2></h2>").text("Similar Artists").css("text-align","center");
        $("#recommendContainer").prepend(headerEl); 
        for (let i = 0; i < names.length; i++) {
            var artistName = names[i].Name;
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
        console.log(albums);
        // sort albums by score property in descending order
        albums.sort( function ( a, b ) { return b.intYearReleased - a.intYearReleased; } );
        for (let i = 0; i < 7; i++) {
            
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
            if (!albumArt) {
                albumArt = "assets/images/albumPlaceholder.jpg"
            }
            //Create card and append it to body
            var cardEl = $("<div class='columns column'></div>")
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
        var cardEl = $("<section class='column columns is-10 is-offset-1' id='artistContainer'></section>")
        $("#art-bg").prepend(cardEl); 
        var leftEl = $("<span class='column is-2'></span>")
        
        $(cardEl).append(leftEl); 
        var rightEl = $("<div class='column is-10'></div>")
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

function initRandArtist(){
    var rand = "111"+Math.floor(Math.random()*1000);

    fetch("https://theaudiodb.com/api/v1/json/523532/artist.php?i="+rand)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        if (!data.artists) {
            initRandArtist()
        }
        var artistName = data.artists[0].strArtist;
        initSearch(artistName);
    })
}

function initSearch(search) {
    getArtistID(search);
    getArtistRecommends(search);
}

function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!artistQuery.val()) {
        return;
    }

    e.preventDefault();
    var search = artistQuery.val().trim();
    getArtistID(search);
    getArtistRecommends(search);
    artistQuery.val("");
}

function handleRecommendedArtistClick(e) {
    var search = $(this).children().text().trim();
    getArtistID(search);
    getArtistRecommends(search);
    artistQuery.val("");
}


initRandArtist();

$("#searchButton").on("click", handleSearchFormSubmit);
$('#input-box').keypress((e) => {
if (e.which === 13) {
    handleSearchFormSubmit(e);
}
})
$(document).on("click", ".recommendedArtists", handleRecommendedArtistClick);