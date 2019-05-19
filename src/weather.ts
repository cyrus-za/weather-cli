import axios from 'axios';

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

async function weather(location) {
  await axios.get('/weather', {
    baseURL: WEATHER_API_URL,
    params: { q: location }
  });
}

export default weather;
