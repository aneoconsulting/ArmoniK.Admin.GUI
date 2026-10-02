// Runs one renderer on the scene of a running session, and keeps the results across reloads: each
// run gets a fresh page, so that none inherits the GPU state of the previous one.
import { forceGraphRenderer } from './renderers/force-graph.js';
import { pixiRenderer } from './renderers/pixi.js';
import { webglRenderer } from './renderers/webgl.js';
import { createScene } from './scene.js';

const RENDERERS = { 'force-graph': forceGraphRenderer, pixi: pixiRenderer, webgl: webglRenderer };
const LIVE_MS = 10000;
const PAN_MS = 5000;
const TICK_MS = 200;
const STORAGE_KEY = 'graph-bench-results';
const QUEUE_KEY = 'graph-bench-queue';

const form = document.getElementById('form');
const stage = document.getElementById('stage');
const status = document.getElementById('status');

const load = key => JSON.parse(localStorage.getItem(key) ?? '[]');
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const COLUMNS = [
  ['renderer', 'Renderer'],
  ['nodes', 'Nodes at the end'],
  ['loadMs', 'First draw (ms)'],
  ['tickMs', 'Tick: apply + draw, mean (ms)'],
  ['tickP95', 'Tick p95 (ms)'],
  ['liveFps', 'Frames/s while live'],
  ['liveBlocked', 'Main thread blocked while live (ms/s)'],
  ['panFps', 'Frames/s while panning'],
  ['panFrameP95', 'Frame interval p95 while panning (ms)'],
  ['panBlocked', 'Main thread blocked while panning (ms/s)'],
  ['gpu', 'GPU'],
];

function showResults() {
  const results = load(STORAGE_KEY);
  const table = document.getElementById('results');
  table.innerHTML = '';
  if (results.length === 0) {
    return;
  }
  const head = table.createTHead().insertRow();
  COLUMNS.forEach(([, label]) => (head.insertCell().outerHTML = `<th>${label}</th>`));
  const body = table.createTBody();
  for (const result of results) {
    const row = body.insertRow();
    COLUMNS.forEach(([key]) => (row.insertCell().textContent = result[key]));
  }
}

function markdown() {
  const results = load(STORAGE_KEY);
  const lines = [`| ${COLUMNS.map(([, label]) => label).join(' | ')} |`, `|${COLUMNS.map(() => '---').join('|')}|`];
  for (const result of results) {
    lines.push(`| ${COLUMNS.map(([key]) => result[key]).join(' | ')} |`);
  }
  return `${navigator.userAgent}\n\n${lines.join('\n')}\n`;
}

function gpu() {
  const gl = document.createElement('canvas').getContext('webgl');
  const info = gl?.getExtension('WEBGL_debug_renderer_info');
  return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'unknown';
}

const mean = values => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const percentile = (values, p) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
};
const round = value => Math.round(value * 10) / 10;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Frame intervals and main thread blocking (long tasks) over a phase. */
function observe() {
  const intervals = [];
  let blocked = 0;
  let last = performance.now();
  let running = true;
  const frame = now => {
    intervals.push(now - last);
    last = now;
    if (running) {
      requestAnimationFrame(frame);
    }
  };
  requestAnimationFrame(frame);
  const observer = new PerformanceObserver(list => list.getEntries().forEach(entry => (blocked += entry.duration)));
  try {
    observer.observe({ type: 'longtask' });
  } catch {
    // Long tasks are not reported by every browser: blocking then reads 0.
  }
  const start = performance.now();
  return () => {
    running = false;
    observer.disconnect();
    const seconds = (performance.now() - start) / 1000;
    return { fps: intervals.length / seconds, intervals, blockedPerSecond: blocked / seconds };
  };
}

async function run(rendererName, tasks, grow) {
  status.textContent = `${rendererName}: building the scene of ${tasks} tasks…`;
  await wait(100);
  const scene = createScene(tasks);
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const asyncFrames = [];
  const loadStart = performance.now();
  const renderer = await RENDERERS[rendererName](stage, scene, width, height, ms => asyncFrames.push(ms));
  const loadMs = performance.now() - loadStart;
  await wait(2000);

  // A running session.
  status.textContent = `${rendererName}: running session…`;
  const ticks = [];
  const tick = () => {
    const start = performance.now();
    renderer.apply(scene.tick(grow));
    ticks.push(performance.now() - start);
  };
  asyncFrames.length = 0;
  let stop = observe();
  const timer = setInterval(tick, TICK_MS);
  await wait(LIVE_MS);
  const live = stop();
  // force-graph draws in its own loop: its draws are part of what a tick costs.
  const liveDraws = [...asyncFrames];

  // Panning, the session still running.
  status.textContent = `${rendererName}: panning…`;
  stop = observe();
  const panEnd = performance.now() + PAN_MS;
  await new Promise(resolve => {
    const step = () => {
      renderer.pan(2);
      if (performance.now() < panEnd) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
  const pan = stop();
  clearInterval(timer);

  const tickCosts = renderer.asyncDraw ? ticks.map(ms => ms + mean(liveDraws)) : ticks;
  const result = {
    renderer: rendererName,
    nodes: scene.nodes.length,
    loadMs: Math.round(loadMs),
    tickMs: round(mean(tickCosts)),
    tickP95: round(percentile(tickCosts, 0.95)),
    liveFps: round(live.fps),
    liveBlocked: Math.round(live.blockedPerSecond),
    panFps: round(pan.fps),
    panFrameP95: round(percentile(pan.intervals, 0.95)),
    panBlocked: Math.round(pan.blockedPerSecond),
    gpu: gpu(),
  };
  renderer.destroy();
  return result;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  save(QUEUE_KEY, [{ renderer: data.get('renderer'), tasks: Number(data.get('tasks')), grow: Number(data.get('grow')) }]);
  location.reload();
});
document.getElementById('all').addEventListener('click', () => {
  const data = new FormData(form);
  save(QUEUE_KEY, Object.keys(RENDERERS).map(renderer => ({ renderer, tasks: Number(data.get('tasks')), grow: Number(data.get('grow')) })));
  location.reload();
});
document.getElementById('copy').addEventListener('click', async () => {
  await navigator.clipboard.writeText(markdown());
  status.textContent = 'Results copied.';
});
document.getElementById('clear').addEventListener('click', () => {
  save(STORAGE_KEY, []);
  showResults();
});

// ?run=all&tasks=…&grow=… runs the three renderers without a click, for a browser driven from a
// script: each result is also posted to the server, which prints it.
const query = new URLSearchParams(location.search);
// ?run=pixi,webgl runs only those. The other parameters are kept for the renderers' own knobs.
const starting = query.has('run');
if (starting) {
  const tasks = Number(query.get('tasks') ?? 10000);
  const grow = Number(query.get('grow') ?? 20);
  const renderers = query.get('run') === 'all' ? Object.keys(RENDERERS) : query.get('run').split(',');
  save(STORAGE_KEY, []);
  save(QUEUE_KEY, renderers.map(renderer => ({ renderer, tasks, grow, report: true })));
  query.delete('run');
  location.replace(`${location.pathname}?${query}`);
}

showResults();
// Not while starting: the page is being replaced, and would lose the run it took.
const [next, ...rest] = starting ? [] : load(QUEUE_KEY);
if (next) {
  save(QUEUE_KEY, rest);
  form.renderer.value = next.renderer;
  form.tasks.value = next.tasks;
  form.grow.value = next.grow;
  run(next.renderer, next.tasks, next.grow).then(result => {
    save(STORAGE_KEY, [...load(STORAGE_KEY), result]);
    window.benchResult = result;
    if (next.report) {
      return fetch('results', { method: 'POST', body: JSON.stringify({ ...result, tasks: next.tasks, grow: next.grow, last: rest.length === 0 }) }).then(() => result);
    }
  }).then(() => {
    if (rest.length) {
      location.reload();
    } else {
      status.textContent = 'Done.';
      showResults();
    }
  }, error => {
    console.error(error);
    status.textContent = `${next.renderer} failed: ${error.message}`;
    if (next.report) {
      fetch('results', { method: 'POST', body: JSON.stringify({ renderer: next.renderer, error: String(error?.stack ?? error), last: true }) });
    }
    save(QUEUE_KEY, []);
  });
}
