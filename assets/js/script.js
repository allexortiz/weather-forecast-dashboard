// Some variables to store API key, user input, and various HTML elements
var API = "52dda624c96ec8795ccb46872a07e9c1";
var userInput = $('#input');
var searchBtn = $('#btn');
var currentWeather = $('#currentWeather');
var searchResults = $('#searchResults');
var row2 = $('#row2');

// Function to perform a weather search
function performSearch() {
    // Get the city input from the user
    var cityInput = userInput.val();

    // Check if the input is not empty
    if (cityInput) {
        // Call a function to get weather data using the city input
        getWeather(cityInput);
        // Clear the search bar after searching
        userInput.val('');
    } else {
        // Show an alert if the user didn't enter a city name
        alert("Please enter a city name.");
    }
}

// Event listeners for the search button click and Enter key press
searchBtn.on("click", performSearch);
userInput.on("keypress", function (event) {
    if (event.which === 13) {  // 13 is the code for the Enter key
        performSearch();
    }
});

// Function to get weather data from an API
function getWeather(city) {
    // Construct the API request URL using the city and API key
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API + '&units=imperial';
    
    // Use the fetch function to make a network request to the API
    fetch(requestUrl)
        .then(function (response) {
            // When the response is received, convert it to JSON format
            return response.json();
        })
        .then(function (data) {
            // Call other functions to display the weather and forecast
            getForecast(data);
            saveCity(data.name);
            displayWeather(data);
            displayRecentCities();
        });
}

// Function to get a weather forecast
function getForecast(data) {
    // Construct the API request URL for forecast using the city and API key
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + data.name + '&appid=' + API + '&units=imperial';
    
    // Make a network request to the forecast API
    fetch(requestUrl)
        .then(function (response) {
            // Convert the response to JSON format
            return response.json();
        })
        .then(function (data) {
            // Call a function to display the forecast
            displayForecast(data);
        });
}

// Function to save a city to local storage
function saveCity(cityName) {
    // Retrieve existing cities from local storage or create an empty array
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    // Check if the city is not already in the list
    if (!savedCities.includes(cityName)) {
        // Add the new city to the array
        savedCities.push(cityName);

        // Save the updated array back to local storage
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

// Function to display current weather data
function displayWeather(data) {
    // Get the HTML element to display the city name
    var city = document.getElementById("city");
    city.textContent = data.name;

    // Clear the current weather section
    currentWeather.empty();

   // Display information like temperature, humidity, and wind speed
   currentWeather.append(data.name + ' (' + dayjs.unix(data.dt).format('MM/DD/YYYY') + ')');

   // Append an image with a class for styling
   currentWeather.append('<img class="weather-icon" src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png">');

    currentWeather.append('<p>Temperature:' + data.main.temp + '</p>')
    currentWeather.append('<p>Humidity: ' + data.main.humidity + '</p>')
    currentWeather.append('<p>Wind: ' + data.wind.speed + '</p>')
}

// Function to display recent cities from local storage
function displayRecentCities() {
    // Clear existing recent cities
    searchResults.empty();

    // Retrieve saved cities from local storage or create an empty array
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    // Display each saved city as a button
    savedCities.forEach(function (city) {
        var button = $('<button class="recentCity">' + city + '</button>');
        button.on('click', function () {
            // When a recent city button is clicked, get its weather data
            getWeather(city);
        });
        searchResults.append(button);
    });
}

// Function to display the weather forecast
function displayForecast(data) {
    // Clear the forecast section
    row2.empty();

    // Display forecast for the next few days using cards
    for (let i = 3; i < data.list.length; i += 8) {
        row2.append(`<div class="col">
            <div class="card" id="day-${i}">
                <div class="card-body">
                    <h5 class="card-title">${dayjs.unix(data.list[i].dt).format('MM/DD/YYYY')}</h5>
                    <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Humidity: <span class="humidity">${data.list[i].main.humidity}</span></li>
                        <li class="list-group-item">Temperature:<span class="temperature">${data.list[i].main.temp}</span></li>
                        <li class="list-group-item">Wind Speed: <span class="windspeed">${data.list[i].wind.speed}</span></li>
                    </ul>
                </div>
            </div>
        </div>`);
    }
}

// Initial display of recent cities when the page loads
displayRecentCities();