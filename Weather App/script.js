// Declare latitude and longitude variables globally
let latitude;
let longitude;

// DOM elements
const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Function to fetch weather data based on latitude and longitude
async function getWeatherByCoords(latitude, longitude) {
  const api_key = "966ad225cd1f1e7b81d2362e64b1f811";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    const weather_data = await response.json();
    displayWeather(weather_data);
  } catch (error) {
    console.error(error);
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
  }
}

// Function to fetch the city name from coordinates using reverse geocoding
async function getCityNameByCoords(latitude, longitude) {
  const api_key = "966ad225cd1f1e7b81d2362e64b1f811";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('City data not found');
    }
    const city_data = await response.json();
    const cityName = city_data.name;
    return cityName;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to fetch weather data by city name
async function getWeatherByCity(city) {
  const api_key = "966ad225cd1f1e7b81d2362e64b1f811";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    const weather_data = await response.json();
    displayWeather(weather_data);
  } catch (error) {
    console.error(error);
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
  }
}

// Function to display weather data
function displayWeather(weather_data) {
  location_not_found.style.display = "none";
  weather_body.style.display = "flex";
  temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
  description.innerHTML = `${weather_data.weather[0].description}`;
  humidity.innerHTML = `${weather_data.main.humidity}%`;
  wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

  switch (weather_data.weather[0].main) {
    case 'Clouds':
      weather_img.src = "/assets/cloud.png";
      break;
    case 'Clear':
      weather_img.src = "/assets/clear.png";
      break;
    case 'Rain':
      weather_img.src = "/assets/rain.png";
      break;
    case 'Mist':
      weather_img.src = "/assets/mist.png";
      break;
    case 'Snow':
      weather_img.src = "/assets/snow.png";
      break;
  }
}

// Function to handle geolocation and fetch weather data
async function handleGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      const cityName = await getCityNameByCoords(latitude, longitude);
      if (cityName) {
        inputBox.value = cityName;
        getWeatherByCoords(latitude, longitude);
      } else {
        console.error("City name not found.");
      }
    }, error => {
      console.error(error);
      location_not_found.style.display = "flex";
      weather_body.style.display = "none";
    });
  } else {
    console.error("Geolocation is not supported by your browser.");
  }
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = inputBox.value.trim();
  if (city) {
    getWeatherByCity(city); // Call getWeatherByCity to fetch weather data
  }
});

inputBox.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const city = inputBox.value.trim();
    if (city) {
       getWeatherByCity(city); // Call getWeatherByCity to fetch weather data
    }
  }
});

// On page load, get user location and fetch weather data
window.onload = () => {
  handleGeolocation();

  
};

window.onunload = function () {
      console.log("Page unloading!")
      document.querySelector(
          "#loader").style.display = "none";
      document.querySelector(
          "body").style.visibility = "visible";
  
};
// window.ontransitionend = () => {
//   console.log("Transition terminée");
// };
