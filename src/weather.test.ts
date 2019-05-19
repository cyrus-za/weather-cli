import axios from 'axios';
import weather, { WEATHER_API_URL } from './weather';

jest.mock('axios');

describe('weather.ts', () => {

  it('should import weather module', () => {
    expect(weather).toBeDefined();
  });

  it('should call weather api', async () => {
    await weather();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(WEATHER_API_URL);
  });

  it('should call weather api with New York', async () => {
    const location = 'New York';
    await weather(location);
    expect(axios.get).toHaveBeenCalledWith(WEATHER_API_URL, location);
  });

});
