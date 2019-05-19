import { exec } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';
import { API_KEY } from './weather';

const pathToFile = path.join(__dirname, 'index.ts');

const execAsync = promisify(exec);

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
    expect(stdout).toContain(`New York weather is currently `);
    expect(stdout).toContain(` °K and a humidity of `);
    expect(stdout.length).toBeGreaterThan(70 + location.length);
  });

  it('should log the weather for Tokyo in Metric', async () => {
    const location = 'Tokyo';
    const { stdout, stderr }: any = await execAsync(`ts-node ${pathToFile} --location '${location}' --units Metric`);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`Tokyo weather is currently `);
    expect(stdout).toContain(` °C and a humidity of `);
    expect(stdout.length).toBeGreaterThan(70 + location.length);
  });
});
