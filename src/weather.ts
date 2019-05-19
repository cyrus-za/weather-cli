import axios, { AxiosResponse } from 'axios';
import { WeatherResponses } from './types';

import CurrentWeatherDataResponse = WeatherResponses.CurrentWeatherDataResponse;

export const API_KEY = process.env.OPEN_WEATHER_API_KEY;

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

type Units = 'Standard' | 'Metric' | 'Imperial';

interface WeatherOptions {
  units?: Units;
}

interface WeatherRequestParams extends WeatherOptions {
  q: string;
  appId: string;
}

const unitHash = {
  Imperial: {
    temperature: 'Fahrenheit'
  },
  Metric: {
    temperature: 'Celsius'
  },
  Standard: {
    temperature: 'Kelvin'
  }
};

const defaultOptions: WeatherOptions = { units: 'Standard' };

function formatResponse(location, { weather: [{ description }], main: { temp, humidity } }: CurrentWeatherDataResponse, { units }: WeatherOptions) {
  const tempUnit = unitHash[units].temperature;

  return `${location} weather is currently ${description} with ${temp} degrees ${tempUnit} and a humidity of ${humidity}%`;
}

function validateParams(location, options) {
  if (!location) {
    throw new Error('Please provide a location');
  }
  if (options.units && !unitHash[options.units]) {
    throw new Error(`Units ${options.units} are not supported. Please use one of: ${Object.keys(unitHash).join(', ')}`);
  }
}

async function weather(location: string, options: WeatherOptions = {}) {
  validateParams(location, options);
  const params: WeatherRequestParams = {
    ...defaultOptions,
    ...options,
    q: location,
    appId: API_KEY
  };
  const { data }: AxiosResponse<WeatherResponses.CurrentWeatherDataResponse> = await axios.get('/weather', {
    baseURL: WEATHER_API_URL,
    params
  });

  return formatResponse(location, data, params);
}

export default weather;
