import axios, { AxiosRequestConfig } from 'axios';
import getWeatherForLocationAsync from './weather';
import { UnitsInput, WeatherResponses } from './types';
import CONFIG from './config';

jest.mock('axios');

const mockedAxiosGet: jest.Mock<typeof axios.get> = axios.get as any;

interface UnitValueHash {
  // @ts-ignore
  [key: UnitsInput]: { temperature: number };
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
      sys: { id: 123, type: 3, message: 1, country: 'US', sunrise: 1369769524, sunset: 1369821049 },
      weather: [{ id: 804, main: 'clouds', description: 'overcast clouds', icon: '04n' }],
      main: { temp: 289.5, humidity: 89, pressure: 1013, temp_min: 287.04, temp_max: 292.04 }, // eslint-disable-line @typescript-eslint/camelcase
      wind: { gust: 20, speed: 7.31, deg: 187.002 },
      clouds: { all: 92 },
      dt: 1369824698,
      id: 1851632,
      name: 'New York',
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
    expect(getWeatherForLocationAsync).toBeDefined();
  });

  it('should call weather api', async () => {
    await getWeatherForLocationAsync('Earth');
    expect(axios.get).toHaveBeenCalled();
  });

  it('should call weather api with New York', async () => {
    const location = 'New York';
    await getWeatherForLocationAsync(location);
    expect(axios.get).toHaveBeenCalledWith('/weather', {
      baseURL: CONFIG.WEATHER_API_URL,
      params: {
        appId: CONFIG.OPEN_WEATHER_API_KEY,
        q: location,
        units: 'Standard'
      }
    });
  });

  it('should get weather response', async () => {
    const response = await getWeatherForLocationAsync('New York');
    expect(response).toEqual('New York (US) weather is currently overcast clouds with 289.5 °K and a humidity of 89%');
  });

  it('should get weather response in Metric', async () => {
    const response = await getWeatherForLocationAsync('New York', { units: 'Metric' });
    expect(response).toEqual('New York (US) weather is currently overcast clouds with 16.35 °C and a humidity of 89%');
  });

  it('should get weather response in Imperial', async () => {
    const response = await getWeatherForLocationAsync('New York', { units: 'Imperial' });
    expect(response).toEqual('New York (US) weather is currently overcast clouds with 61.7 °F and a humidity of 89%');
  });

  it('should get weather response in Standard', async () => {
    const response = await getWeatherForLocationAsync('New York', { units: 'Standard' });
    expect(response).toEqual('New York (US) weather is currently overcast clouds with 289.5 °K and a humidity of 89%');
  });

  it('should get and error when using unsupported unit', async () => {
    // @ts-ignore
    expect(getWeatherForLocationAsync('New York', { units: 'somerandomunit' })).rejects.toEqual(
      new Error(`Units somerandomunit are not supported. Please use one of: Imperial, Metric, Standard`)
    );
  });

  it('should get and error when no location supplied', async () => {
    // @ts-ignore
    expect(getWeatherForLocationAsync('')).rejects.toEqual(new Error(`Please provide a location`));
  });
});
