// A fake ArmoniK control plane for the session graph, and a static server for the benchmark and the app.
//
// - /bench/            the renderers benchmark (build it first: npm run build)
// - /en/...            the app, built by `pnpm build` at the root of the repository
// - GetEvents          the events of one session, `session`, as grpc-web-text: its whole graph, then
//                      status updates and, with GROW=1, new tasks, forever
// - any other gRPC     UNIMPLEMENTED, which the app tolerates
//
// Environment: PORT (5099), TASKS (10000, tasks of the initial graph), GROW (unset: no new task;
// 1: 20 new tasks every 200 ms), STATUS (unset: 50 status updates every 200 ms; 0: none),
// APP (path of the built app, default ../../dist/admin/browser/en).
import '@angular/compiler';
import * as api from '@aneoconsultingfr/armonik.api.angular';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const R = api.EventSubscriptionResponse;
const SESSION = 'session';
const PORT = Number(process.env.PORT ?? 5099);
const TASKS = Number(process.env.TASKS ?? 10000);
const GROW = process.env.GROW === '1';
const STATUS = process.env.STATUS !== '0';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const APP = process.env.APP ?? path.join(HERE, '../../dist/admin/browser/en');
const TYPES = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', woff2: 'font/woff2', svg: 'image/svg+xml', png: 'image/png', ico: 'image/x-icon', json: 'application/json' };

function frame(message) {
  const bytes = message.serializeBinary();
  const out = Buffer.alloc(5 + bytes.length);
  out.writeUInt8(0, 0);
  out.writeUInt32BE(bytes.length, 1);
  Buffer.from(bytes).copy(out, 5);
  return out;
}

function newTask(i, parent, status) {
  // Every 10th task also reduces the outputs of the 3 tasks before it.
  const deps = i % 10 === 9 && i >= 3 ? [`out-${i - 1}`, `out-${i - 2}`, `out-${i - 3}`] : [];
  return [
    new R({ sessionId: SESSION, newTask: new R.NewTask({
      taskId: `task-${i}`, payloadId: `payload-${i}`, parentTaskIds: parent === undefined ? [SESSION] : [SESSION, parent],
      originTaskId: parent ?? SESSION, status, dataDependencies: deps, expectedOutputKeys: [`out-${i}`], retryOfIds: [],
    }) }),
    new R({ sessionId: SESSION, newResult: new R.NewResult({ resultId: `out-${i}`, ownerId: `task-${i}`, status: api.ResultStatus.RESULT_STATUS_CREATED }) }),
  ];
}

/** A tree of subtasks, 4 children per task. */
function initialGraph() {
  const events = [];
  for (let i = 0; i < TASKS; i++) {
    events.push(...newTask(i, i === 0 ? undefined : `task-${Math.floor((i - 1) / 4)}`, api.TaskStatus.TASK_STATUS_COMPLETED));
  }
  return events;
}

function events(res) {
  res.writeHead(200, { 'content-type': 'application/grpc-web-text+proto' });
  // grpc-web-text is decoded 4 characters at a time: no padding in the middle of the stream, so
  // only multiples of 3 bytes are sent.
  let rest = Buffer.alloc(0);
  const send = frames => {
    const all = Buffer.concat([rest, ...frames.map(frame)]);
    const cut = all.length - all.length % 3;
    rest = all.subarray(cut);
    res.write(all.subarray(0, cut).toString('base64'));
  };
  const initial = initialGraph();
  let index = 0;
  let next = TASKS;
  const timer = setInterval(() => {
    if (index < initial.length) {
      send(initial.slice(index, index += 2000));
      return;
    }
    const updates = [];
    if (GROW) {
      for (let k = 0; k < 20; k++) {
        const i = next++;
        updates.push(...newTask(i, `task-${Math.floor(Math.random() * i)}`, api.TaskStatus.TASK_STATUS_SUBMITTED));
      }
    }
    if (STATUS) {
      for (let k = 0; k < 50; k++) {
        const i = Math.floor(Math.random() * next);
        const status = Math.random() < 0.5 ? api.ResultStatus.RESULT_STATUS_COMPLETED : api.ResultStatus.RESULT_STATUS_CREATED;
        updates.push(new R({ sessionId: SESSION, resultStatusUpdate: new R.ResultStatusUpdate({ resultId: `out-${i}`, status }) }));
      }
    }
    if (updates.length) {
      send(updates);
    }
  }, 200);
  // Not `req`: a request emits `close` once its body is read.
  res.on('close', () => clearInterval(timer));
}

function file(res, root, relative) {
  const target = path.join(root, relative);
  if (!target.startsWith(root) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return false;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(target).slice(1)] ?? 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
  return true;
}

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (req.method === 'POST') {
    if (url.endsWith('/GetEvents')) {
      req.resume();
      events(res);
    } else {
      res.writeHead(200, { 'content-type': 'application/grpc-web-text+proto', 'grpc-status': '12', 'grpc-message': 'Not implemented by the fake control plane' });
      res.end();
    }
    return;
  }
  if (url === '/' || url === '/bench') {
    res.writeHead(302, { location: '/bench/' });
    res.end();
    return;
  }
  if (url.startsWith('/bench/')) {
    const relative = url.slice('/bench/'.length) || 'index.html';
    if (!file(res, HERE, relative)) {
      res.writeHead(404);
      res.end();
    }
    return;
  }
  if (url.startsWith('/en/')) {
    // The app's routes are its own: anything that is not a file is its index.
    if (!file(res, APP, url.slice('/en/'.length)) && !file(res, APP, 'index.html')) {
      res.writeHead(404);
      res.end('Build the app first: pnpm build');
    }
    return;
  }
  res.writeHead(404);
  res.end();
}).listen(PORT, () => {
  console.log(`Benchmark: http://localhost:${PORT}/bench/`);
  console.log(`App:       http://localhost:${PORT}/en/sessions/graph/session  (${TASKS} tasks${GROW ? ', growing' : ''}${STATUS ? ', status updates' : ''})`);
});
