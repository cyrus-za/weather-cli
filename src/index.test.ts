import { exec } from 'child_process';
import * as path from 'path';

describe('index.ts', () => {
  it('should be able to be executed with ts-node without errors', () => {
    const pathToFile = path.join(__dirname, 'index.ts');
    exec(`ts-node ${pathToFile}`);
  });
});
