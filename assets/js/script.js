// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5
// api for finding lat and lon at: https://openweathermap.org/api/geocoding-api

const searchText = $("#citySearch");
const searchButton = $("#searchButton");

// order of events are numbered - input will always start with '1' then count up through the steps

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

    // testing
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
            // console log data for now
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








// TODOS:

// Create input that allows users to search for a city, which is then passed through the geocoding api
// THEN extract geocoding api response lon & lat to be used in the 5-day-forcast API req
// THEN display the response on the webpage for the next 5 days of weather for that city.

// THINGS TO KEEP IN MIND:
// using bootstrap
// using jquery
// persistant data is kept with local storage
// include a history of perviously searched cities
// when clicking on cities in your history, it performs a new api call ->
// <- meaning we need to save city name and lon/lat to local storage for reuse (name for display, lon/lat for new api req)