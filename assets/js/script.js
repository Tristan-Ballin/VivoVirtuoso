var artistQuery = "coldplay";


function getArtistArt(artist){
    /*fetch("https://theaudiodb.com/api/v1/json/2/search.php?s="+artist)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        var url = data.artists[0].strArtistThumb;
        console.log(url);
        return url;
    })*/
    return "Filler: Need to fix";

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
        for (let i = 0; i < names.length; i++) {
            //var artistName = names[i].Name;
            var artistName = "coldplay";
            //console.log(artistName);
            var artistArt = getArtistArt(artist);
            console.log(artistArt);
            var cardEl = $("<div class='columns'></div>")
            $("#recommendContainer").append(cardEl); 
            //Create elements and append it to card
            var artistNameEl = $("<h3></h3>").text(artistName);
            $(cardEl).append(artistNameEl);
            var artistArtEl = $("<div><img src='"+artistArt+"' alt='"+artistName+" thumbnail'></div>");
            $(cardEl).append(artistArtEl);  

        }
    })
}

function getAlbums(artistId){
    fetch("https://theaudiodb.com/api/v1/json/2/album.php?i="+artistId)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        var albums = data.album;
        for (let i = 0; i < 5; i++) {
            var albumArt = albums[i].strAlbumThumb;
            var albumName = albums[i].strAlbum;
            var albumYear = albums[i].intYearReleased;
            var albumGenre = albums[i].strStyle;
            var albumLabel = albums[i].strLabel;
            
            //Create card and append it to body
            var cardEl = $("<div class='columns'></div>")
            $("#albumContainer").append(cardEl); 

            var leftEl = $("<span class='column is-2'></span>")
            $(cardEl).append(leftEl); 
            var rightEl = $("<div class='column is-9'></div>")
            $(cardEl).append(rightEl); 
            //Create elements and append it to card
            var albumArtEl = $("<img src='"+albumArt+"' alt='"+albumName+" thumbnail' height='100%' width='100%' >");
            $(leftEl).append(albumArtEl);
            var albumNameEl = $("<h4></h4>").text(albumName);
            var albumYearEl = $("<p></p>").text("Released: "+albumYear);
            var albumGenreEl = $("<p></p>").text("Genre: "+albumGenre);
            var albumLabelEl = $("<p></p>").text("Record Label: "+albumLabel);
            $(rightEl).append(albumNameEl, albumYearEl, albumGenreEl, albumLabelEl);  
            
        }

    })
}

function getArtistID(artist){
    fetch("https://theaudiodb.com/api/v1/json/2/search.php?s="+artist)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
        //parse data
        var artistArt = data.artists[0].strArtistThumb;
        var artistName = data.artists[0].strArtist;
        var artistDescr = data.artists[0].strBiographyEN;
        
        //Create card and append it to body
        var cardEl = $("<div class='columns'></div>")
        $("article").prepend(cardEl); 
        var leftEl = $("<span class='column is-2'></span>")
        $(cardEl).append(leftEl); 
        var rightEl = $("<div class='column is-9'></div>")
        $(cardEl).append(rightEl); 
        //Create elements and append it to card
        var artistArtEl = $("<div><img src='"+artistArt+"' alt='"+artistName+" thumbnail'></div>");
        $(leftEl).append(artistArtEl);  
        var artistNameEl = $("<h4></h4>").text(artistName);
        var artistDescrEl = $("<p></p>").text(artistDescr);
        $(rightEl).append(artistNameEl, artistDescrEl);  
        
        getAlbums(data.artists[0].idArtist);
    })
}
getArtistID(artistQuery);
getArtistRecommends(artistQuery);
//getArtistArt("coldplay")