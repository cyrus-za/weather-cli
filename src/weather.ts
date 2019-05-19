import axios, { AxiosResponse } from 'axios';
import { WeatherResponses } from './types';

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

async function weather(location, options = {}) {
  const { data }: AxiosResponse<WeatherResponses.CurrentWeatherDataResponse> = await axios.get('/weather', {
    baseURL: WEATHER_API_URL,
    params: { q: location }
  });

  return `${data.weather[0].description} with ${data.main.temp} degrees Kelvin and a humidity of ${data.main.humidity}%`;
}

export default weather;
