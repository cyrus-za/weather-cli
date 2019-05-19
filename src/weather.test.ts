import axios from 'axios';
import weather, { WEATHER_API_URL } from './weather';

jest.mock('axios');

const mockedAxiosGet: jest.Mock<typeof axios.get> = (axios.get as any);

describe('weather.ts', () => {

  it('should import weather module', () => {
    expect(weather).toBeDefined();
  });

  it('should call weather api', async () => {
    await weather('');
    expect(axios.get).toHaveBeenCalled();
  });

  it('should call weather api with New York', async () => {
    const location = 'New York';
    await weather(location);
    expect(axios.get).toHaveBeenCalledWith('/weather', {
      baseURL: WEATHER_API_URL,
      params: { q: location }
    });
  });

  it('should get weather response', async () => {
    const mockedResponse = { // example data from openweathermap.org documentation
      'weather': [{ 'id': 804, 'main': 'clouds', 'description': 'overcast clouds', 'icon': '04n' }],
      'main': { 'temp': 289.5, 'humidity': 89, 'pressure': 1013, 'temp_min': 287.04, 'temp_max': 292.04 }

    };
    // @ts-ignore
    mockedAxiosGet.mockResolvedValue({ data: mockedResponse });
    const response = await weather('');
    expect(response).toEqual('overcast clouds with 289.5 degrees Kelvin and a humidity of 89%');
  });

});
