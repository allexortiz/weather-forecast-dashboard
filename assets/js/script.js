var API = "52dda624c96ec8795ccb46872a07e9c1";

var userInput = $('#input');
var searchBtn = $('#btn');
var currentHour = parseInt(dayjs().format("HH"));
var currentWeather = $('#currentWeather');
var searchResults = $('#searchResults');
var row2 = $('#row2')
searchBtn.on("click", function () {
    console.log(userInput.val())
    const cityInput = userInput.val();

    if (cityInput) {
        getWeather(cityInput);
    } else {
        alert("Please enter a city name.");
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
            console.log(data)
            getForcast(data)
            localStorage.setItem('cityData', JSON.stringify(data.name));
            // var cityData = JSON.parse(localStorage.getItem('cityData'));
            var city = document.getElementById("city")
            city.textContent = data.name
            currentWeather.empty();
            currentWeather.append(data.name + ' (' + dayjs.unix(data.dt).format('MM/DD/YYYY') + ') <img src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png">');
            currentWeather.append('<p>Temperature:' + data.main.temp + '</p>')
            currentWeather.append('<p>Humidity: ' + data.main.humidity + '</p>')
            currentWeather.append('<p>Wind: ' + data.wind.speed + '</p>')
            searchResults.append('<button class = "recentCity"></button>')
            var recentCityBtn = $('.recentCity')
            recentCityBtn.text(data.name)
        });
}
function getForcast(data) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + data.name + '&appid=' + API + '&units=imperial';
    fetch(requestUrl)
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            row2.empty();
            for (let i = 3; i < data.list.length; i += 8) {
                console.log(data.list[i])
                row2.append(` <div class="col">
      <div class="card" id="monday">
        <div class="card-body">
          <h5 class="card-title">${dayjs.unix(data.list[i].dt).format('MM/DD/YYYY')}</h5>
          <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Humidity: <span class="humidity">${data.list[i].main.humidity}</span></li>
            <li class="list-group-item">Temperature:<span class="temperature">${data.list[i].main.temp}</span></li>
            <li class="list-group-item">Wind Speed: <span class="windspeed">${data.list[i].wind.speed}</span></li></li>
          </ul>
        </div>
      </div>
    </div>`)
            }
        });

};