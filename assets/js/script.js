var artistQuery = "coldplay";




function getArtistRecommends(artist){
    fetch("https://floating-headland-95050.herokuapp.com/https://tastedive.com/api/similar?q="+artist+"&k=443399-ClassPro-DVSLXXJW&limit=5")
    .then(function (response) {
        console.log("TasteDive response gotten");
        return response.json();
        })
    .then(function (data) {
        console.log("Data:");
        console.log(JSON.stringify(data.Similar.Results));
        console.log(data.Similar.Results);
    })
}

function getAlbums(artistId){
    fetch("https://theaudiodb.com/api/v1/json/2/album.php?i="+artistId)
    .then(function (response) {
        console.log("TADB Album response gotten");
        return response.json();
        })
    .then(function (data) {
        console.log("Data:");
        var albums = data.album;
        for (let i = 0; i < 5; i++) {
            var albumArt = albums[i].strAlbumThumb;
            var albumName = albums[i].strAlbum;
            var albumYear = albums[i].intYearReleased;
            var albumGenre = albums[i].strStyle;
            var albumLabel = albums[i].strLabel;
            console.log(albumName);
            console.log(albumArt);
            console.log(albumYear);
            
            //Create card and append it to body
            var cardEl = $("<div class='columns'></div>")
            $("body").append(cardEl); 

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
        console.log("TADB Artist response gotten");
        return response.json();
        })
    .then(function (data) {
        console.log("ID: "+JSON.stringify(data.artists[0].idArtist));
        //parse data
        var artistArt = data.artists[0].strArtistThumb;
        var artistName = data.artists[0].strArtist;
        var artistDescr = data.artists[0].strBiographyEN;
        /*
        //Create card and append it to body
        var cardEl = $("<div'></div>")
        $("body").append(cardEl); 
        //Create elements and append it to card
        var artistArtEl = $("<div><img src='"+artistArt+"' alt='"+artistName+" thumbnail'></div>");
        var artistNameEl = $("<h4></h4>").text(artistName);
        var artistDescrEl = $("<p></p>").text(artistDescr);
        $(cardEl).append(artistArtEl, artistNameEl, artistDescrEl);  
        */
        getAlbums(data.artists[0].idArtist);
    })
}
getArtistID(artistQuery);
//getArtistRecommends(artistQuery);