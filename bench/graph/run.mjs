// Runs the benchmark in a headless Chrome and prints the results, for a machine without a display.
// It still needs a GPU: check the GPU column, SwiftShader or llvmpipe mean software rendering.
//
//   CHROME=/usr/bin/google-chrome node run.mjs [renderers] [tasks] [grow] [extra query]
//   node run.mjs all 30000 20
//   node run.mjs webgl 30000 20 'antialias=0&minLinkWidth=0'
//
// CHROME defaults to google-chrome. Chrome may need --no-sandbox as root: CHROME_FLAGS adds flags.
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const [renderers = 'all', tasks = '10000', grow = '20', extra = ''] = process.argv.slice(2);
const port = process.env.PORT ?? '5099';
const server = spawn(process.execPath, [new URL('server.mjs', import.meta.url).pathname], { env: { ...process.env, PORT: port, TASKS: '10' } });
let output = '';
const results = [];
let done;
const finished = new Promise(resolve => (done = resolve));
server.stdout.on('data', chunk => {
  output += chunk;
  let newline;
  while ((newline = output.indexOf('\n')) !== -1) {
    const line = output.slice(0, newline);
    output = output.slice(newline + 1);
    if (line.startsWith('RESULT ')) {
      const result = JSON.parse(line.slice('RESULT '.length));
      results.push(result);
      console.error(result.error ? `${result.renderer} failed: ${result.error}` : `${result.renderer} done`);
      if (result.last) {
        done();
      }
    } else if (line.startsWith('Benchmark:')) {
      server.emit('ready');
    }
  }
});
server.stderr.pipe(process.stderr);
await once(server, 'ready');

const url = `http://localhost:${port}/bench/?run=${renderers}&tasks=${tasks}&grow=${grow}${extra ? `&${extra}` : ''}`;
const chrome = spawn(process.env.CHROME ?? 'google-chrome', [
  '--headless=new', '--no-first-run', '--window-size=1400,1000', `--user-data-dir=${process.env.CHROME_PROFILE ?? '/tmp/graph-bench-profile'}`,
  ...(process.env.CHROME_FLAGS ?? '').split(' ').filter(Boolean), url,
], { stdio: 'ignore' });
const timeout = setTimeout(() => {
  console.error('No result after 10 minutes.');
  done();
}, 600000);
await finished;
clearTimeout(timeout);
chrome.kill();
server.kill();

const columns = ['renderer', 'nodes', 'tickMs', 'tickP95', 'liveFps', 'liveBlocked', 'panFps', 'panFrameP95', 'panBlocked', 'loadMs'];
console.log(`GPU: ${results.find(result => result.gpu)?.gpu ?? 'unknown'}`);
console.log(`| ${columns.join(' | ')} |\n|${columns.map(() => '---').join('|')}|`);
for (const result of results) {
  console.log(`| ${columns.map(column => result[column] ?? (column === 'renderer' ? '' : result.error ? 'failed' : '')).join(' | ')} |`);
}
process.exit(0);
