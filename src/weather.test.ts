import axios from 'axios';
import weather from './weather';

jest.mock('axios');

describe('weather.ts', () => {

  it('should import weather module', () => {
    expect(weather).toBeDefined();
  });

  it('should call weather api', async () => {
    await weather();
    expect(axios.get).toHaveBeenCalled();
  });

});
