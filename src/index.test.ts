import * as index from './index';
import * as weather from './weather';

describe('index.ts', () => {
  beforeEach(() => {
    // @ts-ignore
    weather.default = jest.fn(async location => `${location} weather is currently cloudy with 22 degrees celsius`);
  });
  it('should load module without errors', () => {
    expect(true).toBe(true);
  });
  it('should load module without calling main', () => {
    const indexSpy = jest.spyOn(index, 'default');
    expect(indexSpy).not.toHaveBeenCalled();
  });

  it('should log the weather for New York', async () => {
    const location = 'New York';
    const consoleLog = jest.spyOn(console, 'log');
    await index.default(location);
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('New York weather is currently cloudy with 22 degrees celsius');
  });

  it('should log the weather for Tokyo', async () => {
    const location = 'Tokyo';
    const consoleLog = jest.spyOn(console, 'log');
    await index.default(location);
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('Tokyo weather is currently cloudy with 22 degrees celsius');
  });

  it('should log the weather for São Paulo', async () => {
    const location = 'São Paulo';
    const consoleLog = jest.spyOn(console, 'log');
    await index.default(location);
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('São Paulo weather is currently cloudy with 22 degrees celsius');
  });

  it('should log the weather for 10005', async () => {
    const location = '10005';
    const consoleLog = jest.spyOn(console, 'log');
    await index.default(location);
    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog).toHaveBeenCalledWith('10005 weather is currently cloudy with 22 degrees celsius');
  });
});
