const chalk = require("chalk");
const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");

dotenv.config();
const { WEATHER_KEY, MAP_TOKEN } = process.env;

const log = console.log;

const getCoordinates = async (address) => {
  const query = qs.stringify(
    {
      access_token: MAP_TOKEN,
      limit: 1,
    },
    {
      encode: false,
      addQueryPrefix: true,
    }
  );
  try {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json${query}`
    );
    const [feature, ...rest] = data.features;
    return feature.center.reverse().join(",");
  } catch (e) {
    log(chalk.redBright("[ERROR] Cannot connect to map API service"));
  }
};

const getCityData = async (location) => {
  const query = qs.stringify(
    {
      access_key: WEATHER_KEY,
      query: `${location}`,
      units: "f",
    },
    {
      encode: false,
      addQueryPrefix: true,
    }
  );

  try {
    const { data } = await axios.get(
      `http://api.weatherstack.com/current${query}`
    );

    const {
      current: { temperature, humidity, feelslike, visibility, weather_icons },
      location: { name, localtime },
    } = data;
    return {
      temperature,
      humidity,
      feelslike,
      visibility,
      weather_icons,
      name,
      localtime,
    };
  } catch (e) {
    return {
      error: "Cannot find location. Please try another search.",
    };
  }
};

module.exports = {
  getCoordinates,
  getCityData,
};
