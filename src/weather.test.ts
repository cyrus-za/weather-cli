import axios, { AxiosRequestConfig } from 'axios';
import weather, { API_KEY, WEATHER_API_URL } from './weather';
import { WeatherResponses } from './types';

type Units = 'Standard' | 'Metric' | 'Imperial';
jest.mock('axios');

const mockedAxiosGet: jest.Mock<typeof axios.get> = axios.get as any;

interface UnitValueHash {
  // @ts-ignore
  [key: Units]: { temperature: number };
}

// @ts-ignore
const unitValueHash: UnitValueHash = {
  Metric: {
    temperature: 16.35
  },
  Imperial: {
    temperature: 61.7
  },
  Standard: {
    temperature: 289.5
  }
};
Object.freeze(unitValueHash); // freezing as this is declared outside of tests
describe('weather.ts', () => {
  beforeEach(() => {
    const mockedResponse: WeatherResponses.CurrentWeatherDataResponse = {
      // example data from openweathermap.org documentation
      coord: { lon: 139, lat: 35 },
      sys: { id: 123, type: 3, message: 1, country: 'JP', sunrise: 1369769524, sunset: 1369821049 },
      weather: [{ id: 804, main: 'clouds', description: 'overcast clouds', icon: '04n' }],
      main: { temp: 289.5, humidity: 89, pressure: 1013, temp_min: 287.04, temp_max: 292.04 }, // eslint-disable-line @typescript-eslint/camelcase
      wind: { gust: 20, speed: 7.31, deg: 187.002 },
      clouds: { all: 92 },
      dt: 1369824698,
      id: 1851632,
      name: 'Shuzenji',
      cod: 200,
      base: 'base',
      visibility: 10
    };

    // @ts-ignore
    mockedAxiosGet.mockImplementation(async (url: string, config: AxiosRequestConfig) => {
      mockedResponse.main.temp = unitValueHash[config.params.units].temperature;
      return { data: mockedResponse };
    });
  });

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
      params: {
        appId: API_KEY,
        q: location,
        units: 'Standard'
      }
    });
  });

  it('should get weather response', async () => {
    const response = await weather('');
    expect(response).toEqual('overcast clouds with 289.5 degrees Kelvin and a humidity of 89%');
  });

  it('should get weather response in Celsius', async () => {
    const response = await weather('', { units: 'Metric' });
    expect(response).toEqual('overcast clouds with 16.35 degrees Celsius and a humidity of 89%');
  });

  it('should get weather response in Imperial', async () => {
    const response = await weather('', { units: 'Imperial' });
    expect(response).toEqual('overcast clouds with 61.7 degrees Fahrenheit and a humidity of 89%');
  });
});
