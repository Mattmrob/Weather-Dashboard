// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5
// api for finding lat and lon at: https://openweathermap.org/api/geocoding-api

const searchText = $("#citySearch");
const searchButton = $("#searchButton");

// order of events are numbered - input will always start with '1' then count up through the steps

// local storage functionality?

// stores input item into local storage
function storeCity(name) {
    localStorage.setItem("history", JSON.stringify(name));
}

// loads item from storage then renders history
function loadStorage() {
    favorites.empty();
    favoriteList = JSON.parse(localStorage.getItem("favorites"));

    if (favoriteList === null) {
        favoriteList = [];
    }

    if (favoriteList.length > 0) {
        emptyFavorites.css("display","initial");
    } else {
        emptyFavorites.css("display","none");
    }

    for ( i = 10; favoriteList.length > i;) {
        favoriteList.pop();
    }

    for (let i = 0; i < favoriteList.length; i++) {
        let favoritesItem = $('<p class="favoritesItemTitle col-md-12"></p>').text(favoriteList[i][0])
        let favoritesItemAuthor = $('<p class="favoritesItemAuthor col-md-12"></p>').text(' by ' + favoriteList[i][1])
        $(favoritesItem).data('title', favoriteList[i][0])
        $(favoritesItemAuthor).data('author', favoriteList[i][1])
        $("#favorite-items").append(favoritesItem);
        $("#favorite-items").append(favoritesItemAuthor);

    }
}

// ----------------------------- 4 ------------------------------
// function to render everything onto the page
function render(data){
    // declare all needed variables for name, date, weather, temp, wind, and humidity
    let cityName = data.city.name;
    let cityDate = data.list[0].dt_txt.split(" ").shift();
    let cityWeather = data.list[0].weather[0].main;
    let cityTemp = Math.ceil((data.list[0].main.temp-273.15)*9/5+32) + " °F";
    let cityWind = data.list[0].wind.speed + " mph";
    let cityHumid = data.list[0].main.humidity + "%" ;
    // NOTES ON VARIABLES:
    // cityDate also returns a time, so we split it on a space and only take the first array item (date)
    // cityTemp returns as kelvin, so we convert it to faharenheit(?) and round it up so we dont have a suuper long value
    // we add a % to humidity and a mph to wind speed

    // ensuring variables render as intended - CONFIRMED
    console.log(
        `
        city name = ${cityName}, 
        date = ${cityDate}, 
        cloudiness  = ${cityWeather}, 
        temperature = ${cityTemp}, 
        windiness = ${cityWind}, 
        humidity = ${cityHumid}, 
        `
    );

    /* TODO:
       1) Render variable information to page
       2) loop through data.list[1-5] for 5-day forecast and render to page (same variables, diff array no)
       3) Save city name into localstorage + create history buttons that on click search that city (search button logic)
       4) pull data from local storage when the page loads
    */
}


// ----------------------------- 3 ------------------------------
// GET WEATHER USING LAT/LON WITH API CALL
function getWeather(url) {

    fetch(url)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            render(data);
            // *4 occurs
        })
}

// ----------------------------- 2 ------------------------------
// GET THE LAT/LON OF A CITY WITH API CALL THEN SEARCH WEATHER
function getLatLon(cityurl) {

    fetch(cityurl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // run with data to perform 2nd api call for weather
            let lat = data[0].lat;
            let lon = data[0].lon;
    
            let latLonUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c57cbf4f07cb44866a70fe1c66c5d6fb`;
            // url takes lat and long of city to perform weather forecast   
    
            getWeather(latLonUrl);
            // feed url into weather api call
            // *3 occurs
        })

}

// ----------------------------- 1 ------------------------------
// SEARCH BUTTON LOGIC
$(searchButton).on("click", function(event) {
    event.preventDefault();

    let cityName = searchText.val();
    // set city name to the value of our input

    let cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c57cbf4f07cb44866a70fe1c66c5d6fb`
    // formatted url to search for city lat/lon based on user input

    getLatLon(cityUrl)
    // api call for lat and lon using the formatted url
    // *2 occurs
})