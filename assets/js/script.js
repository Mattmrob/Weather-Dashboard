// for weather api call format:
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&appid={API key}
// documentation at: https://openweathermap.org/forecast5#name5
// api for finding lat and lon at: https://openweathermap.org/api/geocoding-api

const searchText = $("#citySearch");
const searchButton = $("#searchButton");
const historyArea = $('.history');
const currentDay = $('.currentDay');
const fiveDayForecast = $('.forecast');
const historyListButton = $('.historyCityName');

// historyList variable is used for local storage process
let historyList = [];

// order of events are numbered - input will always start with '1' then count up through the steps

// ----------------------------- 5 ------------------------------
// LOCAL STORAGE PROCESS + RENDERING HISTORY
// add a searched city's name to the historyList array, then send it to local storage
function storeCity(name) {
    let historyList = JSON.parse(localStorage.getItem("history"));

    if (historyList != null) {
        historyList = historyList.filter(item => item != name)
        historyList.unshift(name);
    } else {
        console.log("history is empty!")
        historyList = [name]
    };

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
        
        let historyItem = $(`<p class="historyCityName">${historyList[i]}</p>`)
        historyArea.append(historyItem);
    }
}

// ----------------------------- 4 ------------------------------
// function to render everything onto the page
function render(data){
    console.log(data);

    // list needed for 5-day forecast
    let fiveDayForecastList = [];
    // today and futureTime are used in our 5-day forecast
    let today = data.list[0].dt_txt.split(" ").shift();

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

    // empty previous city information from currentDay div and forecast divs
    currentDay.empty();
    fiveDayForecast.empty();

    // information to render from searched city into currentDay div
    let currentDayArea = $(`
    <h2>${cityName} (${cityDate}) ${cityWeather}</h2>
    <p>Temp: ${cityTemp}</p>
    <p>Wind: ${cityWind}</p>
    <p>Humidity: ${cityHumid}</p>
    `)
    
    // add new city data to currentDay div
    currentDay.append(currentDayArea);

    // *** 5 - DAY - FORECAST ***
    // only pull new days for 5-day forecast by cycling through results to find unique days
    for (let i = 0; i < data.list.length; i++) {
        // a future date that we are going to compare to our current date (today)
        let futureTime = data.list[i].dt_txt.split(" ").shift();

        // altered version of dat variables that target the current looped information
        let cityDateForecast = data.list[i].dt_txt.split(" ").shift();
        let cityWeatherForecast = data.list[i].weather[0].main;
        let cityTempForecast = Math.ceil((data.list[i].main.temp-273.15)*9/5+32) + " °F";
        let cityWindForecast = data.list[i].wind.speed + " mph";
        let cityHumidForecast = data.list[i].main.humidity + "%";

        // checks if the current date does not match the date we are asessing
        // if it does not match, add that day's data to our fiveDayForecastList array as an object with key value pairs
        if (today != futureTime) {
            fiveDayForecastList.push({
                date: cityDateForecast,
                weather: cityWeatherForecast,
                temp: cityTempForecast,
                wind: cityWindForecast,
                humid: cityHumidForecast
            });

            // set current date to the new date, so that as we continue looping, we go until we find the next day
            // going to day 2, 3, 4, ect
            today = futureTime;
            console.log(futureTime)
        };

        // once our 5-day forecast array is 5 days long, loop through and render them
        if ( fiveDayForecastList.length === 4) {
            console.log(fiveDayForecastList)

            // info to render
            for (let e = 0; e < 4; e++) {
                let currentDayAreaForecast = $(`
                <div class="forecastCard">
                    <h3>${fiveDayForecastList[e].date}</h3>
                    <p>${fiveDayForecastList[e].weather}<p>
                    <p>Temp: ${fiveDayForecastList[e].temp}</p>
                    <p>Wind: ${fiveDayForecastList[e].wind}</p>
                    <p>Humidity: ${fiveDayForecastList[e].humid}</p>
                </div>
                `)

            // add new city data to currentDay div
            fiveDayForecast.append(currentDayAreaForecast);
            console.log(currentDayAreaForecast);
            }
            break;
        };

    // **** end of 5-day forecast ****
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

    let cityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c57cbf4f07cb44866a70fe1c66c5d6fb`
    // formatted url to search for city lat/lon based on user input

    getLatLon(cityUrl)
    // api call for lat and lon using the formatted url
    // *2 occurs
})

loadStorage();