const weatherForm = document.getElementById("weather-form");
const searchInput = document.getElementById("search-input");
const forecastContainer = document.getElementById("forecast-container");
const forecastList = document.getElementById("forecast");

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const weatherIcon = document.getElementById("weather-icon");
  if (weatherIcon) {
    weatherIcon.remove();
  }

  while (forecastList.firstChild) {
    forecastList.removeChild(forecastList.firstChild);
  }

  const location = searchInput.value;

  try {
    const response = await fetch(`/weather?address=${location}`);
    const data = await response.json();
    if (data.error) {
      const errorEl = document.createElement("li");
      errorEl.appendChild(document.createTextNode(`Error: ${data.error}`));
      forecastList.appendChild(errorEl);
      return;
    }

    const forecast = {
      temperature: `The current temperature for ${data.name} is ${data.temperature}°F, but it feels like ${data.feelslike}°F.`,
      humidity: `The current humidity is ${data.humidity}%.`,
      visibility: `You can see about ${data.visibility} kilometers ahead of you.`,
      time: `Last time weather was authenticated was at ${
        data.localtime.split(" ")[1]
      }.`,
      weather_icons: data.weather_icons,
    };

    Object.keys(forecast).map((key) => {
      const forecastEl = document.createElement("li");
      if (key == "weather_icons") {
        const weatherIcon = document.createElement("img");
        weatherIcon.id = "weather-icon";
        weatherIcon.src = forecast[key];
        forecastContainer.insertAdjacentElement("afterbegin", weatherIcon);
        return;
      }
      forecastEl.appendChild(document.createTextNode(forecast[key]));
      forecastList.appendChild(forecastEl);
    });
  } catch (e) {
    return {
      error: '"Unable to find location, please try another search."',
    };
  }
});
