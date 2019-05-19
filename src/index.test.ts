import * as index from './index';
import * as weather from './weather';

jest.mock('axios');

let consoleLog;
describe('index.ts', () => {
  beforeEach(() => {
    // @ts-ignore
    weather.default = jest.fn(async location => `${location} (XX) weather is currently cloudy with 22 °C`);
    consoleLog = jest.spyOn(console, 'log');
  });
  it('should load module without errors', () => {
    expect(true).toBe(true);
  });
  it('should load module without calling main', () => {
    const indexSpy = jest.spyOn(index, 'default');
    expect(indexSpy).not.toHaveBeenCalled();
  });

  it('should log the weather for New York', async () => {
    const locations = ['New York'];
    await index.default({ locations });
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('New York (XX) weather is currently cloudy with 22 °C');
  });

  it('should log the weather for Tokyo and São Paulo', async () => {
    const locations = ['Tokyo', 'São Paulo'];
    await index.default({ locations });
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('Tokyo (XX) weather is currently cloudy with 22 °C');
    expect(consoleLog).toHaveBeenCalledWith('São Paulo (XX) weather is currently cloudy with 22 °C');
  });

  it('should log the weather for zip 10005', async () => {
    const locations = ['10005'];
    await index.default({ locations });
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('10005 (XX) weather is currently cloudy with 22 °C');
  });
});
