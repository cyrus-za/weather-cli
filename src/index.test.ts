import { exec } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';
import { API_KEY } from './weather';

const pathToFile = path.join(__dirname, 'index.ts');

const execAsync = promisify(exec);

describe('index.ts', () => {
  it('should be able to be executed with ts-node without errors', () => {
    exec(`ts-node ${pathToFile}`);
  });

  it('should have open weather map api key in env', () => {
    expect(API_KEY).toBeDefined();
  });

  it('should log the weather for New York', async () => {
    const location = 'New York';
    const { stdout, stderr }: any = await execAsync(`ts-node ${pathToFile} '${location}'`);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`Weather in New York is currently `);
    expect(stdout).toContain(` degrees Kelvin and a humidity of `);
    expect(stdout.length).toBeGreaterThan(80);
  });
});
