
var searchHistory = [];
var artistQuery = $("#input-box");

// Intro slider on page load
const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

tl.to( ".text", { y: "0%", duration: 2, stagger: 0.25 });
tl.to( ".slider", { y: "-100%", duration: 2});
tl.to( ".intro", { y: "-100%", duration: 1 } , "-=2");

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
        fadeIn(); }, 3000)
  });

function getArtistArt(artist){
    fetch("https://theaudiodb.com/api/v1/json/523532/search.php?s="+artist)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {

        var artistArt = data.artists[0].strArtistThumb;
        var artistName = data.artists[0].strArtist;
    
        var cardEl = $("<div class='recommendedArtists column is-clickable'></div>")
        $("#recommend-container").append(cardEl); 
        //Create elements and append it to card
        var artistNameEl = $("<h3></h3>").text(artistName).css("text-align","center");
        $(cardEl).append(artistNameEl);
        var artistArtEl = $("<img src='"+artistArt+"' alt='"+artistName+" thumbnail' height='100%' width='100%'>");
        $(cardEl).append(artistArtEl); 
    })


}

function getArtistRecommends(artist){
    fetch("https://floating-headland-95050.herokuapp.com/https://tastedive.com/api/similar?q="+artist+"&k=443399-ClassPro-DVSLXXJW&limit=5&type=music")
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        var names = data.Similar.Results;
        console.log(names);
        if (!names.length) {
            return;
        }
        $("#recommend-container").empty();
        var headerEl = $("<h2></h2>").text("Similar Artists").css("text-align","center");
        $("#recommend-container").prepend(headerEl); 
        for (let i = 0; i < names.length; i++) {
            var artistName = names[i].Name;
            var ampSearch =artistName.search("&");
        if (ampSearch !=-1) {
            insert = encodeURIComponent("&");
            artistName=[artistName.slice(0,ampSearch), insert, artistName.slice(ampSearch+1)].join('');
            console.log("new & name: "+artistName);
        }
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
        $("#album-container").empty();
        var albums = data.album;
        console.log(albums);
        // sort albums by score property in descending order
        albums.sort( function ( a, b ) { return b.intYearReleased - a.intYearReleased; } );
        var length = albums.length;
        if (length>=8) {
            length=8;
        }
        for (let i = 0; i < length; i++) {
            
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
            var cardEl = $("<div class='columns'></div>")
            $("#album-container").append(cardEl); 

            var leftEl = $("<span class='column is-3'></span>")
            $(cardEl).append(leftEl); 
            var rightEl = $("<div class='column is-8'></div>")
            $(cardEl).append(rightEl); 
            //Create elements and append it to card
            var albumArtEl = $("<img src='"+albumArt+"' alt='"+albumName+" thumbnail' height='100%' width='100%'>");
            $(leftEl).append(albumArtEl);
            var albumNameEl = $("<h3></h3>").text(albumName);
            var albumYearEl = $("<p></p>").text("Released: "+albumYear);
            var albumGenreEl = $("<p></p>").text("Genre: "+albumGenre);
            var albumLabelEl = $("<p></p>").text("Record Label: "+albumLabel);
            $(rightEl).append(albumNameEl, albumYearEl, albumGenreEl, albumLabelEl);  
            
        }
        console.log(artistId);
        var cardEl = $("<div class='columns'></div>");
        $("#album-container").append(cardEl); 
        //var finalTextEl = $("<p></p>").text("For more artist information click here");
        
        var tadbImgEl = $("<a href='https://www.theaudiodb.com/artist/"+artistId+"'></a>").html("<img src='https://www.theaudiodb.com/images/logo_new_12.png' alt='The Audio Data Base logo' height='60%' width='60%'>");
        $(cardEl).append(/*finalTextEl, */tadbImgEl);  
        



    })
}

function getArtistID(artist){
    fetch("https://theaudiodb.com/api/v1/json/523532/search.php?s="+artist)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        //parse data
        console.log(data);
        var artistArt = data.artists[0].strArtistThumb;
        var artistName = data.artists[0].strArtist;
        var artistDescr = data.artists[0].strBiographyEN;

        

        $("#artist-container").remove();
        //Create card and append it to body
        var cardEl = $("<section class='column columns is-10 is-offset-1' id='artist-container'></section>")
        $("#artist-sec").append(cardEl); 
        var leftEl = $("<span class='column is-2'></span>")
        
        $(cardEl).append(leftEl); 
        var rightEl = $("<div class='column is-10'></div>")
        $(cardEl).append(rightEl); 
        //Create elements and append it to card
        var artistArtEl = $("<img src='"+artistArt+"' alt='"+artistName+" thumbnail'>");
        $(leftEl).append(artistArtEl);  
        var artistNameEl = $("<h2></h2>").text(artistName);
        var artistDescrEl = $("<p></p>").text(artistDescr);
        $(rightEl).append(artistNameEl, artistDescrEl);  
        
        appendToHistory(artistName);
        getAlbums(data.artists[0].idArtist);
        getArtistRecommends(artistName);
    })
}

// Function to display the search history list.
function renderSearchHistory() {
    $("#history").empty();
    // loop through the history array creating a button for each item
    for (let i = 0; i < searchHistory.length; i++) {
        const element = searchHistory[i];

        var liEl = $("<li></li>").html("<span class='history-list column'>"+element+"</span>");
        // append to the search history container
        $("#history").prepend(liEl);  
    }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
    //check for repeated values
    for (let i = 0; i < searchHistory.length; i++) {
        const history = searchHistory[i];
        if (history == search) {
            return;
        }
        
    }
    var  arrLength = searchHistory.length;
    if(arrLength > 9){
        searchHistory.splice(0, 1);
    }

    // push search term into search history array
    searchHistory.push(search);
    localStorage.setItem("artists", JSON.stringify(searchHistory));

    // set search history array to local storage
    renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
    // get search history item from local storage
    if (localStorage.getItem("artists")!==null) {
        searchHistory= JSON.parse(localStorage.getItem("artists"));
        getArtistID(searchHistory[searchHistory.length-1]);
    }
    else{
        localStorage.setItem("artists", JSON.stringify(searchHistory));
        initRandArtist()
    }
    // set search history array equal to what you got from local storage
    renderSearchHistory();
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
}

function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!artistQuery.val()) {
        return;
    }

    e.preventDefault();
    var search = artistQuery.val().trim();
    var ampSearch =search.search("&");
    if (ampSearch !=-1) {
        insert = encodeURIComponent("&");
        search=[search.slice(0,ampSearch), insert, search.slice(ampSearch+1)].join('');
        console.log("new & name: "+search);
    }
    getArtistID(search);
    artistQuery.val("");
}

function handleRecommendedArtistClick(e) {
    var search = $(this).children().text().trim();
    var ampSearch =search.search("&");
    if (ampSearch !=-1) {
        insert = encodeURIComponent("&");
        search=[search.slice(0,ampSearch), insert, search.slice(ampSearch+1)].join('');
        console.log("new & name: "+search);
    }
    getArtistID(search);
    artistQuery.val("");
}
function handleHistoryClick(e) {
    var search = $(this).text().trim();
    var ampSearch =search.search("&");
    if (ampSearch !=-1) {
        insert = encodeURIComponent("&");
        search=[search.slice(0,ampSearch), insert, search.slice(ampSearch+1)].join('');
        console.log("new & name: "+search);
    }
    getArtistID(search);
    artistQuery.val("");
}
function handleCollapseClick(e) {
    if ($("#history").css("display")!="none") {
        $("#history").css("display", "none")
        $("#arrow-pos-top").css("display", "flex")
        $("#arrow-pos-bot").css("display", "none")
    }else{
        $("#history").css("display", "flex")
        $("#arrow-pos-bot").css("display", "flex")
        $("#arrow-pos-top").css("display", "none")
    }
}



initSearchHistory();
$("#searchButton").on("click", handleSearchFormSubmit);
$('#input-box').keypress((e) => {
if (e.which === 13) {
    handleSearchFormSubmit(e);
}
})
$(document).on("click", ".recommendedArtists", handleRecommendedArtistClick);
$(document).on("click", ".history-list", handleHistoryClick);
$(".collapse").on("click", handleCollapseClick);
$("#vinyl").on("click", initRandArtist);