var artistQuery = "coldplay";

function getArtistRecommends(data){
    fetch("https://floating-headland-95050.herokuapp.com/https://tastedive.com/api/similar?q="+artistQuery+"&k=443399-ClassPro-DVSLXXJW")
    .then(function (response) {
        console.log("TasteDive response gotten");
        return response.json();
        })
    .then(function (data) {
        /*if (!data[0]) {
            return;
        }*/
        console.log("Data:");
        console.log(JSON.stringify(data));
    })
}


function getArtistID(){
    fetch("https://theaudiodb.com/api/v1/json/2/search.php?s="+artistQuery)
    .then(function (response) {
        console.log("TADB response gotten");
        return response.json();
        })
    .then(function (data) {
        /*if (!data[0]) {
            return;
        }*/
        console.log("Data:");
        console.log(JSON.stringify(data.artists[0]));
    })
}
getArtistID();
getArtistRecommends();