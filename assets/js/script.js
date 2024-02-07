// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5
// api for finding lat and lon at: https://openweathermap.org/api/geocoding-api

const searchText = $("#citySearch");
const searchButton = $("#searchButton");
const historyArea = $('.history');
const currentDay = $('.currentDay');
const fiveDayForecast = $('.forecast');

// historyList variable is used for local storage process
let historyList = [];

// order of events are numbered - input will always start with '1' then count up through the steps

// ----------------------------- 5 ------------------------------
// LOCAL STORAGE PROCESS + RENDERING HISTORY
// add a searched city's name to the historyList array, then send it to local storage
function storeCity(name) {
    historyList.unshift(name);
    localStorage.setItem("history", JSON.stringify(historyList));
}

// loads item from storage, limits history to 10 items
// Appends a button to the history area with the name of the city name
function loadStorage() {
    historyArea.empty();
    let historyList = JSON.parse(localStorage.getItem("history"));

    if (historyList === null) {
        historyList = [];
    }

    for ( i = 10; historyList.length > i;) {
        historyList.pop();
    }

    for (let i = 0; i < historyList.length; i++) {
        let historyItem = $(`<button class="historyCityName">${historyList[i]}</button>`)
        historyArea.append(historyItem);
    }
}

// ----------------------------- 4 ------------------------------
// function to render everything onto the page
function render(data){
    console.log(data);
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

    // information to render from searched city
    let currentDayArea = $(`
    <h2>${cityName} (${cityDate}) ${cityWeather}</h2>
    <p>Temp: ${cityTemp}</p>
    <p>Wind: ${cityWind}</p>
    <p>Humidity: ${cityHumid}</p>
    `)
    // empty previous city information from currentDay div and forecast divs
    currentDay.empty();
    fiveDayForecast.empty();
    // add new city data to currentDay div
    currentDay.append(currentDayArea);

    for (let i = 0; i < data.length; i++) {
        let today = data.list[0].dt_txt.split(" ").shift();
        let futureTime = data.list[i].dt_txt.split(" ").shift();
        let fiveDayForecastList = [];

        let cityDateForecast = data.list[i].dt_txt.split(" ").shift();
        let cityWeatherForecast = data.list[i].weather[0].main;
        let cityTempForecast = Math.ceil((data.list[i].main.temp-273.15)*9/5+32) + " °F";
        let cityWindForecast = data.list[i].wind.speed + " mph";
        let cityHumidForecast = data.list[i].main.humidity + "%";

        if (today !== futureTime) {
            fiveDayForecastList.push({
                Date: cityDateForecast,
                Weather: cityWeatherForecast,
                Temp: cityTempForecast,
                Wind: cityWindForecast,
                Humid: cityHumidForecast
            })
        }

        if (fiveDayForecastList.length > 0) {
            
        }
    }

    // 5-day forecast rendering - loop through next 5 days and append to forecast area
    for (let i = 1; i < 6; i++) {

        let currentDayAreaForecast = $(`
        <div class="forecastCard">
            <h3>${cityDateForecast}</h3>
            <p>${cityWeatherForecast}<p>
            <p>Temp: ${cityTempForecast}</p>
            <p>Wind: ${cityWindForecast}</p>
            <p>Humidity: ${cityHumidForecast}</p>
        </div>
        `)

        // add new city data to currentDay div
        fiveDayForecast.append(currentDayAreaForecast);
    }

    // store cityname to storage then reload storage to render updated history
    storeCity(cityName);
    loadStorage();

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
       3) Create on click function so history buttons perform a search for that city
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

loadStorage();