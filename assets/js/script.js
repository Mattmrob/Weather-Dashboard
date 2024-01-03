// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5
// api for finding lat and lon at: https://openweathermap.org/api/geocoding-api

let weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=c57cbf4f07cb44866a70fe1c66c5d6fb';
// Change Austin to a different city for a different result

// Api Call Logic, log data to console
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

// Call Api function
getWeather(weatherUrl);




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