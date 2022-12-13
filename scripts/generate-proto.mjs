import { exec } from 'node:child_process';
import os from 'node:os';

const isWin = os.platform() === 'win32';

const command = isWin
  ? 'npm run proto:generate:win'
  : 'npm run proto:generate:linux';

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
