const apiKey = "fa942440840a92b07cdc65341fc088c4"; 
let isCelsius = true;

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) fetchWeather(city);
});

document.getElementById("geo-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

document.getElementById("unit-toggle").addEventListener("click", () => {
  isCelsius = !isCelsius;
  updateTemperature();
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert(error.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("Unable to fetch weather data");
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(lat, lon);
  } catch (error) {
    alert(error.message);
  }
}

function displayCurrentWeather(data) {
  const cityName = data.name;
  const temp = data.main.temp;
  const description = data.weather[0].description;
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("city-name").textContent = cityName;
  document.getElementById("temperature").dataset.celsius = temp;
  document.getElementById("description").textContent = description;
  document.getElementById("icon").src = iconUrl;

  updateTemperature();

  document.querySelector(".weather-info").style.display = "block";
}

async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("Unable to fetch forecast data");
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    alert(error.message);
  }
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  const dailyForecasts = data.list.filter((reading) =>
    reading.dt_txt.includes("12:00:00")
  );

  dailyForecasts.forEach((forecast) => {
    const temp = forecast.main.temp;
    const date = new Date(forecast.dt_txt).toLocaleDateString();
    const description = forecast.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("forecast-day");
    forecastDiv.innerHTML = `
      <p>${date}</p>
      <img src="${iconUrl}" alt="Weather Icon" />
      <p>${description}</p>
      <p>${temp}°C</p>
    `;

    forecastContainer.appendChild(forecastDiv);
  });

  document.getElementById("forecast-container").style.display = "block";
}

function updateTemperature() {
  const tempElement = document.getElementById("temperature");
  const tempCelsius = parseFloat(tempElement.dataset.celsius);

  if (isCelsius) {
    tempElement.textContent = `Temperature: ${tempCelsius.toFixed(1)}°C`;
  } else {
    const tempFahrenheit = (tempCelsius * 9) / 5 + 32;
    tempElement.textContent = `Temperature: ${tempFahrenheit.toFixed(1)}°F`;
  }
}



