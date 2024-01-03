// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5

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