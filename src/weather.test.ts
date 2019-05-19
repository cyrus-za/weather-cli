import weather from './weather';
import axios from 'axios';

jest.mock('axios');

describe('weather.ts', () => {

  it('should import weather module', () => {
    expect(weather).toBeDefined();
  });

  it('should call weather api', () => {
    expect(axios.get).toHaveBeenCalled();
  });

});
