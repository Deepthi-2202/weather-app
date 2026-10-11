const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const message = document.querySelector("#message");

const weatherCodes = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Foggy", "🌫️"],
  48: ["Foggy", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],
  61: ["Light rain", "🌦️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"],
  82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Severe thunderstorm", "⛈️"]
};

async function getWeather(city) {
  try {
    message.textContent = "Finding your city...";

    const geoResponse = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1&language=en&format=json"
    );

    if (!geoResponse.ok) {
      throw new Error("Could not search for the city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Check the spelling.");
    }

    const place = geoData.results[0];

    message.textContent = "Loading current weather...";

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!weatherResponse.ok) {
      throw new Error("Could not load weather data.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    const [description, icon] =
      weatherCodes[current.weather_code] || ["Unknown", "🌍"];

    document.querySelector("#cityName").textContent =
      place.name + (place.country_code ? ", " + place.country_code : "");

    document.querySelector("#temperature").textContent =
      Math.round(current.temperature_2m);

    document.querySelector("#feelsLike").textContent =
      Math.round(current.apparent_temperature) + "°C";

    document.querySelector("#humidity").textContent =
      current.relative_humidity_2m + "%";

    document.querySelector("#wind").textContent =
      current.wind_speed_10m + " km/h";

    document.querySelector("#condition").textContent = description;
    document.querySelector("#weatherDescription").textContent =
      description + (current.is_day ? " · Daytime" : " · Nighttime");

    document.querySelector("#weatherIcon").textContent =
      current.is_day ? icon : (current.weather_code === 0 ? "🌙" : icon);

    message.textContent =
      "Updated with live weather data for " + place.name + ".";

    document.querySelector(".weather-card").style.animation = "none";
    void document.querySelector(".weather-card").offsetWidth;
    document.querySelector(".weather-card").style.animation =
      "riseIn 0.6s ease both";

  } catch (error) {
    message.textContent = error.message ||
      "Something went wrong. Please try again.";
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city) {
    getWeather(city);
  }
});

getWeather("Nellore");