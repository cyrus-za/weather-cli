import axios from 'axios';
import weather, { WEATHER_API_URL } from './weather';
import { WeatherResponses } from './types';

jest.mock('axios');

const mockedAxiosGet: jest.Mock<typeof axios.get> = (axios.get as any);

const mockedResponse: WeatherResponses.CurrentWeatherDataResponse =
  { // example data from openweathermap.org documentation
    'coord': { 'lon': 139, 'lat': 35 },
    'sys': { 'id': 123, type: 3, 'message': 1, 'country': 'JP', 'sunrise': 1369769524, 'sunset': 1369821049 },
    'weather': [{ 'id': 804, 'main': 'clouds', 'description': 'overcast clouds', 'icon': '04n' }],
    'main': { 'temp': 289.5, 'humidity': 89, 'pressure': 1013, 'temp_min': 287.04, 'temp_max': 292.04 },
    'wind': { 'gust': 20, 'speed': 7.31, 'deg': 187.002 },
    'clouds': { 'all': 92 },
    'dt': 1369824698,
    'id': 1851632,
    'name': 'Shuzenji',
    'cod': 200,
    'base': 'base',
    'visibility': 10
  };

// @ts-ignore
mockedAxiosGet.mockResolvedValue({ data: mockedResponse });
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
    const response = await weather('');
    expect(response).toEqual('overcast clouds with 289.5 degrees Kelvin and a humidity of 89%');
  });

});
