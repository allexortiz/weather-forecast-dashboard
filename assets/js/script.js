var API = "52dda624c96ec8795ccb46872a07e9c1";

var userInput = $('#input');
var searchBtn = $('#btn');
var currentWeather = $('#currentWeather');
var searchResults = $('#searchResults');
var row2 = $('#row2');

// Function to perform the search
function performSearch() {
    var cityInput = userInput.val();

    if (cityInput) {
        getWeather(cityInput);
        // Clear the search bar after searching
        userInput.val('');
    } else {
        alert("Please enter a city name.");
    }
}

// Event listener for the search button click
searchBtn.on("click", performSearch);

// Event listener for the Enter key press
userInput.on("keypress", function (event) {
    if (event.which === 13) {
        performSearch();
    }
});

function getWeather(city) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API + '&units=imperial';
    fetch(requestUrl)
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            getForecast(data);
            saveCity(data.name);
            displayWeather(data);
            displayRecentCities();
        });
}

function getForecast(data) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + data.name + '&appid=' + API + '&units=imperial';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayForecast(data);
        });
}

function saveCity(cityName) {
    // Retrieve existing cities from local storage
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    // Check if the city is already in the list
    if (!savedCities.includes(cityName)) {
        // Add the new city to the array
        savedCities.push(cityName);

        // Save the updated array back to local storage
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

function displayWeather(data) {
    var city = document.getElementById("city");
    city.textContent = data.name;

    currentWeather.empty();
    currentWeather.append(data.name + ' (' + dayjs.unix(data.dt).format('MM/DD/YYYY') + ') <img src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png">');
    currentWeather.append('<p>Temperature:' + data.main.temp + '</p>')
    currentWeather.append('<p>Humidity: ' + data.main.humidity + '</p>')
    currentWeather.append('<p>Wind: ' + data.wind.speed + '</p>')
}

function displayRecentCities() {
    // Clear existing recent cities
    searchResults.empty();

    // Retrieve saved cities from local storage
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    // Display each saved city as a button
    savedCities.forEach(function (city) {
        var button = $('<button class="recentCity">' + city + '</button>');
        button.on('click', function () {
            getWeather(city);
        });
        searchResults.append(button);
    });
}

function displayForecast(data) {
    row2.empty();
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
