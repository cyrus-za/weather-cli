import { exec } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';
import { API_KEY } from './weather';

const pathToFile = path.join(__dirname, 'index.ts');

const execAsync = promisify(exec);

// needed due to integration tests. Usually I would use something like cypress, but this is a command line tool and not a webpage or api
jest.setTimeout(20000);

describe('index.ts integration', () => {
  it('should be able to be executed with ts-node without errors', () => {
    exec(`ts-node ${pathToFile}`);
  });

  it('should have open weather map api key in env', () => {
    expect(API_KEY).toBeDefined();
  });

  it('should log the weather for New York', async () => {
    const location = 'New York';
    const { stdout, stderr }: any = await execAsync(`ts-node ${pathToFile} --location '${location}'`);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`New York (US) weather is currently `);
    expect(stdout).toContain(` °K and a humidity of `);
    expect(stdout.length).toBeGreaterThan(70 + location.length);
  });

  it('should log the weather for Tokyo and Beijing in Metric', async () => {
    const locations = ['Tokyo', 'Beijing'];
    const units = 'Metric';
    const { stdout, stderr }: any = await execAsync(`ts-node ${pathToFile} --location '${locations[0]}' -l Beijing --units ${units}`);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`Tokyo (JP) weather is currently `);
    expect(stdout).toContain(`Beijing (CN) weather is currently `);
    expect(stdout).toContain(` °C and a humidity of `);
    expect(stdout.length).toBeGreaterThan(70 + locations[0].length);
  });

  it('should log the weather for New York, 10005, Tokyo São Paulo and Pluto in Metric', async () => {
    const locations = ['New York', 10005, 'Tokyo', 'São Paulo', 'Pluto'];
    const units = 'Metric';
    const locationString = locations.reduce((acc, curr) => `${acc} -l '${curr}'`, '');
    const command = `ts-node ${pathToFile} ${locationString} --units ${units}`;
    const { stdout, stderr }: any = await execAsync(command);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`New York (US) weather is currently `);
    expect(stdout).toContain(`Tokyo (JP) weather is currently `);
    // I am aware of the fact that Pluto is not in the US, but that is what the API returns.
    // I believe checking if the city exists in the world is out of scope here
    expect(stdout).toContain(`Pluto (US) weather is currently `);
    expect(stdout).toContain(`São Paulo (BR) weather is currently `);
    expect(stdout).toContain(` °C and a humidity of `);
    expect(stdout.length).toBeGreaterThan(70 + String(locations[0]).length);
  });
});
