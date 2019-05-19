/* eslint-disable camelcase */ // not much I can do about the api response shape

export type UnitsInput = 'Standard' | 'Metric' | 'Imperial';

export type LocationInput = string | number;

export interface MainFnParams {
  locations: LocationInput[];
  units?: UnitsInput;
}

export interface CommandLineArgs extends MainFnParams {
  _: string[];
  l: LocationInput[];
  u?: UnitsInput;
  location: LocationInput[]; // --location arg also adds to locations
}

export namespace WeatherResponses {
  interface Coord {
    lon: number;
    lat: number;
  }

  interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
  }

  export interface Main {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  }

  interface Wind {
    speed: number;
    deg: number;
    gust: number;
  }

  interface Clouds {
    all: number;
  }

  interface Sys {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  }

  export interface CurrentWeatherDataResponse {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    id: number;
    name: string;
    cod: number;
  }
}
