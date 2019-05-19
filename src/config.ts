import { each } from 'lodash';

const ENV = process.env;

const CONFIG = {
  WEATHER_API_URL: ENV.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',

  OPEN_WEATHER_API_KEY: ENV.OPEN_WEATHER_API_KEY,

  NODE_ENV: ENV.NODE_ENV || 'development'
};

each(CONFIG, (value, key) => {
  if (!value) {
    throw new Error(`missing environment variable ${key}`);
  }
});

export default CONFIG;
