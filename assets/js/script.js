// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5
// api for finding lat and lon at: https://openweathermap.org/api/geocoding-api

const searchText = $("#citySearch");
const searchButton = $("#searchButton");

let cityName = "";

let latLonUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=c57cbf4f07cb44866a70fe1c66c5d6fb';
// url takes lat and long of city to perform weather forecast

let cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c57cbf4f07cb44866a70fe1c66c5d6fb`
// user searches for a city name, so we first use an api call to get that city's lat and long, then plug it into the weather api

function getLatLong(city) {

}

// Weather Api Call function
function getWeather(url) {

    fetch(url)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}


$(searchButton).on("click", function(event) {
    event.preventDefault();
    cityName = searchText.val();

    let trimmedCityUrl = cityName.split(" ").join("%20");

    getLatLon(trimmedCityUrl);
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