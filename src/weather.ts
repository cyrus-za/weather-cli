import axios, { AxiosResponse } from 'axios';
import memoize from 'memoizee';
import { WeatherResponses } from './types';

import CurrentWeatherDataResponse = WeatherResponses.CurrentWeatherDataResponse;

export const API_KEY = process.env.OPEN_WEATHER_API_KEY;

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export type Units = 'Standard' | 'Metric' | 'Imperial';

interface WeatherOptions {
  units?: Units;
}

interface WeatherRequestParams extends WeatherOptions {
  q?: string;
  zip?: string;
  appId: string;
}

const unitHash = {
  Imperial: {
    temperature: 'F'
  },
  Metric: {
    temperature: 'C'
  },
  Standard: {
    temperature: 'K'
  }
};

const defaultOptions: WeatherOptions = { units: 'Standard' };

function formatResponse({ name, sys: { country }, weather: [{ description }], main: { temp, humidity } }: CurrentWeatherDataResponse, { units }: WeatherOptions) {
  const tempUnit = unitHash[units].temperature;

  return `${name} (${country}) weather is currently ${description} with ${temp} °${tempUnit} and a humidity of ${humidity}%`;
}

function validateParams(location, options) {
  if (!location) {
    throw new Error('Please provide a location');
  }
  if (options.units && !unitHash[options.units]) {
    throw new Error(`Units ${options.units} are not supported. Please use one of: ${Object.keys(unitHash).join(', ')}`);
  }
}

function addCityOrZipToParams(location: string | number) {
  switch (typeof location) {
    case 'number':
      return { zip: String(location) };
    case 'string':
      if (Number(location)) return addCityOrZipToParams(Number(location));
      return { q: location };
    default:
      throw new Error('Location must be a string or number');
  }
}

async function weather(location: string | number, options: WeatherOptions = {}) {
  validateParams(location, options);
  const params: WeatherRequestParams = {
    ...defaultOptions,
    ...options,
    appId: API_KEY,
    ...addCityOrZipToParams(location)
  };

  try {
    const { data }: AxiosResponse<WeatherResponses.CurrentWeatherDataResponse> = await axios.get('/weather', {
      baseURL: WEATHER_API_URL,
      params
    });
    return formatResponse(data, params);
  } catch (e) {
    if (e.message.indexOf('404') > -1) {
      throw new Error(`Location ${location}, not found`);
    }
    throw e;
  }
}

// Caching for 10 minutes as per openweathermap.org documentation
const memoizedWeather = memoize(weather, { length: false, maxAge: 600000 });

export default memoizedWeather;
