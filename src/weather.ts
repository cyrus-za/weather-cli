import axios, { AxiosResponse } from 'axios';
import memoize from 'memoizee';
import { LocationInput, UnitsInput, WeatherResponses } from './types';
import CONFIG from './config';

import CurrentWeatherDataResponse = WeatherResponses.CurrentWeatherDataResponse;

interface WeatherOptions {
  units?: UnitsInput;
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

function getTemperatureUnit(units: UnitsInput) {
  return unitHash[units].temperature;
}

function formatResponse({ name: locationName, sys: { country }, weather: [{ description }], main: { temp, humidity } }: CurrentWeatherDataResponse, { units }: WeatherOptions) {
  const tempUnit = getTemperatureUnit(units);

  return `${locationName} (${country}) weather is currently ${description} with ${temp} °${tempUnit} and a humidity of ${humidity}%`;
}

function validateParams(location, options) {
  if (!location) {
    throw new Error('Please provide a location');
  }
  if (options.units && !unitHash[options.units]) {
    throw new Error(`Units ${options.units} are not supported. Please use one of: ${Object.keys(unitHash).join(', ')}`);
  }
}

function getCityOrZipToParams(location: LocationInput) {
  switch (typeof location) {
    case 'number':
      return { zip: String(location) };
    case 'string':
      if (Number(location)) return getCityOrZipToParams(Number(location));
      return { q: location };
    default:
      throw new Error('LocationInput must be a string or number');
  }
}

async function getWeatherForLocationAsync(location: LocationInput, options: WeatherOptions = {}) {
  validateParams(location, options);
  const params: WeatherRequestParams = {
    ...defaultOptions,
    ...options,
    appId: CONFIG.OPEN_WEATHER_API_KEY,
    ...getCityOrZipToParams(location)
  };

  try {
    const { data }: AxiosResponse<WeatherResponses.CurrentWeatherDataResponse> = await axios.get('/weather', {
      baseURL: CONFIG.WEATHER_API_URL,
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
const memoizedWeather = memoize(getWeatherForLocationAsync, { length: false, maxAge: 600000 });

export default memoizedWeather;
