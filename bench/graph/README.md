# Session graph benchmark

Measures the renderers considered for the session graph (`src/app/components/graph`) on the
graph of a running session, and provides a fake control plane to measure the app itself.

The question it answers: what does a running session cost each renderer? A live ArmoniK session
sends hundreds of events per second (statuses, new tasks). force-graph redraws everything on each
of them. sigma.js was tried and dropped: it reprocessed the whole graph on every change.

Run it in a real browser on a machine with a GPU. Headless Chromium and WSL render WebGL and
canvas in software, and their numbers mean nothing.

## Setup

```sh
cd bench/graph
npm install          # its own dependencies, apart from the app's: force-graph, pixi.js, esbuild
npm run build
```

The fake control plane also needs the app's dependencies, so run `pnpm install` at the root first.

## Renderers benchmark

```sh
npm run serve        # http://localhost:5099/bench/
```

Open http://localhost:5099/bench/, keep the tab in front, keep the mouse away from the canvas,
and click **Run all three**. The page reloads before each renderer so that none inherits the GPU
state of another. Results accumulate in the table below the canvas. **Copy results as Markdown**
copies them with the browser and GPU.

Each run:
1. builds the scene: a tree of `Tasks` tasks (10000 by default), each with a payload above and an
   output below, i.e. 3 nodes per task, laid out by layers as ELK does;
2. plays a running session for 10 s: every 200 ms, 50 status changes and `New tasks per tick`
   new tasks (20 by default), each put on its parent as the app does until the next layout;
3. pans the view every frame for 5 s, the session still running.

| Column | Meaning |
|---|---|
| Tick: apply + draw | JS time to apply one tick and draw it. For force-graph, which draws in its own loop, the mean of its draws is added. |
| Frames/s while live, while panning | What the user sees. 60 is the goal. |
| Frame interval p95 while panning | Stutter: 16.7 ms at 60 fps. |
| Main thread blocked | Sum of long tasks (> 50 ms) per second. Chromium only, 0 elsewhere. |

The renderers:
- `force-graph`: configured as `main` uses it (`src/renderers/force-graph.js`).
- `pixi`: PixiJS v8, nodes as particles tinted by status, links as one `Graphics` per batch
  (`src/renderers/pixi.js`).
- `webgl`: the prototype of a WebGL2 engine of our own (`src/renderers/webgl.js`). It makes two
  instanced draws, links then nodes, from GPU buffers that grow by doubling. A status change
  writes the 4 bytes of one node, new nodes and links are appended, and panning and zooming only
  change uniforms.

Only what costs is drawn: shapes and links, no icons, hover or highlight. Those would come with
the real engine.

Try larger sessions too (`Tasks` 30000, 50000), and `New tasks per tick` 0 to measure statuses
alone.

## The app against a fake control plane

```sh
pnpm build                                  # at the root: dist/admin/browser/en
cd bench/graph
GROW=1 TASKS=10000 npm run serve
```

Open http://localhost:5099/en/sessions/graph/session and check **Debug**. The panel shows frames
per second, draws, and the time a batch of events takes.

| Variable | Default | |
|---|---|---|
| `TASKS` | 10000 | Tasks of the initial graph, a tree of 4 subtasks per task. |
| `GROW` | unset | `1`: 20 new tasks every 200 ms, a running session. |
| `STATUS` | unset | `0`: no status updates. Otherwise, 50 every 200 ms. |
| `PORT` | 5099 | |
| `APP` | `../../dist/admin/browser/en` | The built app to serve. |

The server answers only `GetEvents`. Every other gRPC call gets UNIMPLEMENTED, which the app
tolerates, so the header shows unknown versions.
