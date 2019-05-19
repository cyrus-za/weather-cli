import axios from 'axios';

const WEATHER_API_URL = '';

async function weather() {
  await axios.get(WEATHER_API_URL);
}

export  default weather;
