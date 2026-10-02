// A WebGL2 engine of our own, the prototype of the one the app would get. Two instanced draws:
// the links, a quad each, then the nodes, a quad each shaped by the fragment shader. Every
// instance lives in GPU buffers that grow by doubling:
// - a status changes 4 bytes, at the index of its node;
// - new nodes and links are written after the others;
// - panning and zooming change uniforms only.
import { LINK_COLOR, NODE_SIZE, STATUS_COLORS, fitView, rgba } from '../scene.js';

const NODE_VERTEX = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec4 a_color;
layout(location = 2) in float a_shape;
uniform vec2 u_center;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_size;
out vec2 v_corner;
out vec4 v_color;
flat out int v_shape;
void main() {
  vec2 corner = vec2(gl_VertexID & 1, gl_VertexID >> 1) * 2.0 - 1.0;
  // Never under 2 pixels: a node must stay visible however far zoomed out.
  float size = max(u_size * u_scale, 2.0);
  vec2 pixel = (a_position - u_center) * u_scale + corner * size * 0.5;
  gl_Position = vec4(pixel * 2.0 / u_viewport * vec2(1.0, -1.0), 0.0, 1.0);
  v_corner = corner;
  v_color = a_color;
  v_shape = int(a_shape);
}`;

const NODE_FRAGMENT = `#version 300 es
precision mediump float;
in vec2 v_corner;
in vec4 v_color;
flat in int v_shape;
out vec4 color;
void main() {
  // A circle for a task, a rectangle two thirds as high for a data.
  if (v_shape == 0 ? dot(v_corner, v_corner) > 1.0 : abs(v_corner.y) > 0.667) {
    discard;
  }
  color = vec4(v_color.rgb * v_color.a, v_color.a);
}`;

const LINK_VERTEX = `#version 300 es
layout(location = 0) in vec2 a_source;
layout(location = 1) in vec2 a_target;
layout(location = 2) in vec4 a_color;
uniform vec2 u_center;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_width;
out vec4 v_color;
void main() {
  vec2 source = (a_source - u_center) * u_scale;
  vec2 target = (a_target - u_center) * u_scale;
  vec2 direction = target - source;
  float length = length(direction);
  vec2 normal = length > 0.0 ? vec2(-direction.y, direction.x) / length : vec2(0.0, 1.0);
  float along = float(gl_VertexID & 1);
  float side = float(gl_VertexID >> 1) * 2.0 - 1.0;
  // Thinner as the view zooms out, but never under a pixel: fainter instead.
  float width = u_width * u_scale;
  vec2 pixel = mix(source, target, along) + normal * side * max(width, 1.0) * 0.5;
  gl_Position = vec4(pixel * 2.0 / u_viewport * vec2(1.0, -1.0), 0.0, 1.0);
  v_color = a_color * min(1.0, width);
}`;

const LINK_FRAGMENT = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 color;
void main() {
  color = vec4(v_color.rgb * v_color.a, v_color.a);
}`;

function program(gl, vertex, fragment) {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
  };
  const result = gl.createProgram();
  gl.attachShader(result, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(result, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(result);
  if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(result));
  }
  const uniforms = {};
  for (let i = 0; i < gl.getProgramParameter(result, gl.ACTIVE_UNIFORMS); i++) {
    const { name } = gl.getActiveUniform(result, i);
    uniforms[name] = gl.getUniformLocation(result, name);
  }
  return { program: result, uniforms };
}

/**
 * Instances of fixed size, in GPU buffers that double when full. Each attribute has its own
 * buffer, so that one of them is updated without touching the others.
 */
class Instances {
  constructor(gl, attributes) {
    this.gl = gl;
    this.count = 0;
    this.capacity = 0;
    this.vao = gl.createVertexArray();
    this.attributes = attributes.map(attribute => ({ ...attribute, buffer: null }));
  }

  /** Room for `count` more instances, keeping the ones there. */
  reserve(count) {
    if (this.count + count <= this.capacity) {
      return;
    }
    const gl = this.gl;
    const capacity = Math.max(1024, this.capacity * 2, this.count + count);
    gl.bindVertexArray(this.vao);
    for (const attribute of this.attributes) {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, capacity * attribute.bytes, gl.DYNAMIC_DRAW);
      if (attribute.buffer) {
        gl.bindBuffer(gl.COPY_READ_BUFFER, attribute.buffer);
        gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.ARRAY_BUFFER, 0, 0, this.count * attribute.bytes);
        gl.deleteBuffer(attribute.buffer);
      }
      attribute.buffer = buffer;
      gl.enableVertexAttribArray(attribute.location);
      gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized, 0, 0);
      gl.vertexAttribDivisor(attribute.location, 1);
    }
    gl.bindVertexArray(null);
    this.capacity = capacity;
  }

  /** Writes `values` for the attribute `index`, from the instance `first` on. */
  write(index, first, values) {
    const attribute = this.attributes[index];
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, first * attribute.bytes, values);
  }
}

export class GraphEngine {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, premultipliedAlpha: true });
    if (!gl) {
      throw new Error('WebGL2 is not available.');
    }
    this.gl = gl;
    this.canvas = canvas;
    this.nodeProgram = program(gl, NODE_VERTEX, NODE_FRAGMENT);
    this.linkProgram = program(gl, LINK_VERTEX, LINK_FRAGMENT);
    this.nodes = new Instances(gl, [
      { location: 0, size: 2, type: gl.FLOAT, normalized: false, bytes: 8 },
      { location: 1, size: 4, type: gl.UNSIGNED_BYTE, normalized: true, bytes: 4 },
      { location: 2, size: 1, type: gl.UNSIGNED_BYTE, normalized: false, bytes: 1 },
    ]);
    this.links = new Instances(gl, [
      { location: 0, size: 2, type: gl.FLOAT, normalized: false, bytes: 8 },
      { location: 1, size: 2, type: gl.FLOAT, normalized: false, bytes: 8 },
      { location: 2, size: 4, type: gl.UNSIGNED_BYTE, normalized: true, bytes: 4 },
    ]);
    this.view = { x: 0, y: 0, scale: 1 };
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  /** Nodes as [x, y] positions, [r, g, b, a] colors and shapes (0: circle, 1: rectangle). Returns the index of the first. */
  addNodes(positions, colors, shapes) {
    const count = shapes.length;
    const first = this.nodes.count;
    this.nodes.reserve(count);
    this.nodes.write(0, first, positions);
    this.nodes.write(1, first, colors);
    this.nodes.write(2, first, shapes);
    this.nodes.count += count;
    return first;
  }

  setNodeColor(index, color) {
    this.nodes.write(1, index, color);
  }

  addLinks(sources, targets, colors) {
    const count = colors.length / 4;
    const first = this.links.count;
    this.links.reserve(count);
    this.links.write(0, first, sources);
    this.links.write(1, first, targets);
    this.links.write(2, first, colors);
    this.links.count += count;
  }

  render() {
    const gl = this.gl;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const scale = this.view.scale * devicePixelRatio;
    gl.viewport(0, 0, width, height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const [instances, { program: used, uniforms }, setUniforms] of [
      [this.links, this.linkProgram, u => gl.uniform1f(u.u_width, NODE_SIZE / 12 * devicePixelRatio)],
      [this.nodes, this.nodeProgram, u => gl.uniform1f(u.u_size, NODE_SIZE)],
    ]) {
      if (instances.count === 0) {
        continue;
      }
      gl.useProgram(used);
      gl.uniform2f(uniforms.u_center, this.view.x, this.view.y);
      gl.uniform1f(uniforms.u_scale, scale);
      gl.uniform2f(uniforms.u_viewport, width, height);
      setUniforms(uniforms);
      gl.bindVertexArray(instances.vao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instances.count);
    }
    gl.bindVertexArray(null);
  }
}

export function webglRenderer(container, scene, width, height) {
  const canvas = document.createElement('canvas');
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.round(width * devicePixelRatio);
  canvas.height = Math.round(height * devicePixelRatio);
  container.appendChild(canvas);
  const engine = new GraphEngine(canvas);
  const statusColors = STATUS_COLORS.map(color => new Uint8Array(rgba(color)));
  const linkColor = rgba(LINK_COLOR, 0.3);

  const addNodes = nodes => {
    const positions = new Float32Array(nodes.length * 2);
    const colors = new Uint8Array(nodes.length * 4);
    const shapes = new Uint8Array(nodes.length);
    nodes.forEach((node, i) => {
      positions[i * 2] = node.x;
      positions[i * 2 + 1] = node.y;
      colors.set(statusColors[node.status], i * 4);
      shapes[i] = node.type === 'task' ? 0 : 1;
    });
    engine.addNodes(positions, colors, shapes);
  };
  const addLinks = links => {
    const sources = new Float32Array(links.length * 2);
    const targets = new Float32Array(links.length * 2);
    const colors = new Uint8Array(links.length * 4);
    links.forEach((link, i) => {
      const source = scene.byId.get(link.source);
      const target = scene.byId.get(link.target);
      sources[i * 2] = source.x;
      sources[i * 2 + 1] = source.y;
      targets[i * 2] = target.x;
      targets[i * 2 + 1] = target.y;
      colors.set(linkColor, i * 4);
    });
    engine.addLinks(sources, targets, colors);
  };
  addNodes(scene.nodes);
  addLinks(scene.links);
  Object.assign(engine.view, fitView(scene, width, height));
  engine.render();

  return {
    asyncDraw: false,
    apply({ changed, added }) {
      // The scene gives each node its index in the order it was added, as the engine does.
      for (const node of changed) {
        engine.setNodeColor(node.index, statusColors[node.status]);
      }
      if (added.nodes.length !== 0) {
        addNodes(added.nodes);
        addLinks(added.links);
      }
      engine.render();
    },
    pan(dx) {
      engine.view.x += dx / engine.view.scale;
      engine.render();
    },
    destroy() {
      engine.gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
