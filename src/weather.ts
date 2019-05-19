import axios, { AxiosResponse } from 'axios';
import { WeatherResponses } from './types';

import CurrentWeatherDataResponse = WeatherResponses.CurrentWeatherDataResponse;

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

type Units = 'Standard' | 'Metric'

interface WeatherOptions {
  units?: Units;
}

interface WeatherRequestParams extends WeatherOptions {
  q: string;
}

const unitHash = {
  Metric: {
    temperature: 'Celsius'
  },
  Standard: {
    temperature: 'Kelvin'
  }
};

const defaultOptions: WeatherOptions = { units: 'Standard' };

function formatResponse({ weather: [{ description }], main: { temp, humidity } }: CurrentWeatherDataResponse, { units }: WeatherOptions) {
  const tempUnit = unitHash[units].temperature;

  if (!tempUnit) throw new Error(
    `Units ${units} are not supported.
    Please use one of: ${Object.keys(unitHash).join(', ')}
  `);

  return `${description} with ${temp} degrees ${tempUnit} and a humidity of ${humidity}%`;
}

async function weather(location: string, options: WeatherOptions = {}) {
  const params: WeatherRequestParams = {
    ...defaultOptions,
    ...options,
    q: location
  };
  const { data }: AxiosResponse<WeatherResponses.CurrentWeatherDataResponse> = await axios.get('/weather', {
    baseURL: WEATHER_API_URL,
    params
  });

  return formatResponse(data, params);
}

export default weather;
