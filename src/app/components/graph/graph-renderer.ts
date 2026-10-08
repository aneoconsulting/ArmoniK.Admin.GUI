import { Camera } from './graph-view';

/**
 * Draws a session graph with WebGL2, in three instanced draws: the links, the highlights, then
 * the nodes. Built for a graph that changes all the time:
 * - the positions of the nodes live in a texture both the nodes and the links read by index:
 *   moving every node, as the layout does, uploads that texture once;
 * - a status changes the 4 bytes of a color;
 * - hovering fades what is not around the hovered node through a texture of one byte a node, which
 *   the links read too;
 * - panning and zooming change uniforms only: nothing is processed again.
 * The shapes are drawn by the shader from their distance to the edge, sharp at any zoom: a circle
 * for a task, a rectangle for a data, as the icons of the legend. Everything uploaded is kept, to
 * upload it again when the browser loses the WebGL context.
 */

/** Indices of the node shapes. */
export const TASK_SHAPE = 0;
export const RESULT_SHAPE = 1;

export type RendererOptions = {
  /** Width of a node, in graph units. */
  nodeSize: number;
  /** Width of a link, in graph units, kept between `minLinkPixels` and `maxLinkPixels` on screen. */
  linkWidth: number;
  minLinkPixels: number;
  maxLinkPixels: number;
  /** Smallest width on screen of a node, however far zoomed out. */
  minNodePixels: number;
  /** Smallest width on screen of the mark of a highlighted node. */
  minHighlightPixels: number;
  /** Opacity of what is not around the hovered node. */
  fadedAlpha: number;
  /**
   * Called once the browser gave a lost context back, nothing drawn yet, with the error when it
   * could not be set up again.
   */
  restored: (error: unknown) => void;
};

/** Positions and fading textures are this wide, and as high as the nodes need. */
const TEXTURE_WIDTH = 2048;

const NODE_VERTEX = `#version 300 es
layout(location = 0) in vec4 a_color;
layout(location = 1) in float a_shape;
uniform highp sampler2D u_positions;
uniform sampler2D u_focus;
uniform vec2 u_center;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_size;
uniform float u_minSize;
uniform bool u_hovering;
uniform float u_faded;
out vec2 v_offset;
out vec4 v_color;
out float v_pixels;
flat out int v_shape;
void main() {
  ivec2 texel = ivec2(gl_InstanceID % ${TEXTURE_WIDTH}, gl_InstanceID / ${TEXTURE_WIDTH});
  vec2 position = texelFetch(u_positions, texel, 0).xy;
  float focus = texelFetch(u_focus, texel, 0).r;
  vec2 corner = vec2(gl_VertexID & 1, gl_VertexID >> 1) * 2.0 - 1.0;
  float pixels = max(u_size * u_scale, u_minSize);
  // A pixel wider than the shape, for its soft edge.
  vec2 offset = corner * (pixels * 0.5 + 1.0);
  vec2 pixel = (position - u_center) * u_scale + offset;
  gl_Position = vec4(pixel * 2.0 / u_viewport * vec2(1.0, -1.0), 0.0, 1.0);
  v_offset = offset;
  v_pixels = pixels;
  v_shape = int(a_shape);
  v_color = vec4(a_color.rgb, a_color.a * (u_hovering && focus < 0.5 ? u_faded : 1.0));
}`;

const NODE_FRAGMENT = `#version 300 es
precision mediump float;
in vec2 v_offset;
in vec4 v_color;
in float v_pixels;
flat in int v_shape;
out vec4 color;
void main() {
  // The distance to the edge, in pixels, negative inside: a circle for a task, a rectangle two
  // thirds as high for a data. A pixel of soft edge, whatever the zoom.
  float half_size = v_pixels * 0.5;
  vec2 outside = abs(v_offset) - vec2(half_size, half_size * 0.667);
  float distance = v_shape == 0 ? length(v_offset) - half_size : max(outside.x, outside.y);
  float alpha = clamp(0.5 - distance, 0.0, 1.0);
  if (alpha <= 0.0) {
    discard;
  }
  color = vec4(v_color.rgb, 1.0) * v_color.a * alpha;
}`;

const HIGHLIGHT_VERTEX = `#version 300 es
layout(location = 0) in uint a_node;
layout(location = 1) in vec4 a_color;
uniform highp sampler2D u_positions;
uniform vec2 u_center;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_size;
uniform float u_minSize;
out vec2 v_offset;
out float v_pixels;
out vec4 v_color;
void main() {
  int node = int(a_node);
  vec2 position = texelFetch(u_positions, ivec2(node % ${TEXTURE_WIDTH}, node / ${TEXTURE_WIDTH}), 0).xy;
  vec2 corner = vec2(gl_VertexID & 1, gl_VertexID >> 1) * 2.0 - 1.0;
  float pixels = max(u_size * u_scale, u_minSize);
  vec2 offset = corner * (pixels * 0.5 + 1.0);
  vec2 pixel = (position - u_center) * u_scale + offset;
  gl_Position = vec4(pixel * 2.0 / u_viewport * vec2(1.0, -1.0), 0.0, 1.0);
  v_offset = offset;
  v_pixels = pixels;
  v_color = a_color;
}`;

const HIGHLIGHT_FRAGMENT = `#version 300 es
precision mediump float;
uniform float u_hole;
in vec2 v_offset;
in float v_pixels;
in vec4 v_color;
out vec4 color;
void main() {
  // A disc, or a ring around the node when it is drawn over it.
  float distance = length(v_offset);
  float alpha = clamp(0.5 - (distance - v_pixels * 0.5), 0.0, 1.0);
  if (u_hole > 0.0) {
    alpha *= clamp(distance - u_hole + 0.5, 0.0, 1.0);
  }
  if (alpha <= 0.0) {
    discard;
  }
  color = vec4(v_color.rgb, 1.0) * v_color.a * alpha;
}`;

const LINK_VERTEX = `#version 300 es
layout(location = 0) in uint a_source;
layout(location = 1) in uint a_target;
layout(location = 2) in uint a_type;
uniform highp sampler2D u_positions;
uniform sampler2D u_focus;
uniform vec4 u_colors[4];
uniform vec2 u_center;
uniform float u_scale;
uniform vec2 u_viewport;
uniform float u_width;
uniform float u_minWidth;
uniform float u_maxWidth;
uniform float u_alpha;
uniform bool u_hovering;
uniform float u_faded;
out vec4 v_color;
ivec2 texel(uint node) {
  return ivec2(int(node) % ${TEXTURE_WIDTH}, int(node) / ${TEXTURE_WIDTH});
}
void main() {
  vec2 source = (texelFetch(u_positions, texel(a_source), 0).xy - u_center) * u_scale;
  vec2 target = (texelFetch(u_positions, texel(a_target), 0).xy - u_center) * u_scale;
  bool focused = texelFetch(u_focus, texel(a_source), 0).r > 0.5 && texelFetch(u_focus, texel(a_target), 0).r > 0.5;
  vec2 direction = target - source;
  float length = length(direction);
  vec2 normal = length > 0.0 ? vec2(-direction.y, direction.x) / length : vec2(0.0, 1.0);
  float along = float(gl_VertexID & 1);
  float side = float(gl_VertexID >> 1) * 2.0 - 1.0;
  // Thinner as the view zooms out, then fainter once under the thinnest a line is drawn.
  float width = clamp(u_width * u_scale, 0.0, u_maxWidth);
  float drawn = max(width, u_minWidth);
  vec2 pixel = mix(source, target, along) + normal * side * drawn * 0.5;
  gl_Position = vec4(pixel * 2.0 / u_viewport * vec2(1.0, -1.0), 0.0, 1.0);
  vec4 color = u_colors[a_type];
  // Hovering, the links around the hovered node are opaque and the others faded; otherwise the
  // opacity follows the zoom, translucent where links pile up.
  float alpha = color.a * (width / drawn) * (u_hovering ? (focused ? 1.0 : u_faded) : u_alpha);
  v_color = vec4(color.rgb * alpha, alpha);
}`;

const LINK_FRAGMENT = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 color;
void main() {
  color = v_color;
}`;

type Program = { program: WebGLProgram, uniforms: Record<string, WebGLUniformLocation> };

export class GraphRenderer {
  private gl: WebGL2RenderingContext;
  private lost = false;
  private nodeProgram!: Program;
  private linkProgram!: Program;
  private highlightProgram!: Program;
  private nodeVao!: WebGLVertexArrayObject;
  private linkVao!: WebGLVertexArrayObject;
  private highlightVao!: WebGLVertexArrayObject;
  private buffers: Record<'colors' | 'shapes' | 'sources' | 'targets' | 'types' | 'highlightNodes' | 'highlightColors', WebGLBuffer> = {} as never;
  private positionsTexture!: WebGLTexture;
  private focusTexture!: WebGLTexture;

  // What was uploaded, kept for a lost context.
  private nodeCount = 0;
  private textureRows = 1;
  private positions = new Float32Array(TEXTURE_WIDTH * 2);
  private colors = new Uint8Array(0);
  private shapes = new Uint8Array(0);
  private focus = new Uint8Array(TEXTURE_WIDTH);
  private hovering = false;
  private linkCount = 0;
  private sources = new Uint32Array(0);
  private targets = new Uint32Array(0);
  private types = new Uint8Array(0);
  private linkColors = new Float32Array(16);
  private highlightCount = 0;
  private highlightNodes = new Uint32Array(0);
  private highlightColors = new Uint8Array(0);
  // The box of the canvas on screen, and the device pixels in a pixel of it, when last sized.
  private width = 1;
  private height = 1;
  private ratio = 1;

  constructor(private readonly canvas: HTMLCanvasElement, private readonly options: RendererOptions) {
    const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: true, alpha: true });
    if (!gl) {
      throw new Error($localize`:@@graphNoWebGL2:WebGL2 is not available.`);
    }
    this.gl = gl;
    canvas.addEventListener('webglcontextlost', this.onLost);
    canvas.addEventListener('webglcontextrestored', this.onRestored);
    this.setUp();
  }

  private readonly onLost = (event: Event) => {
    // Without it, the browser would never give the context back.
    event.preventDefault();
    this.lost = true;
  };

  private readonly onRestored = () => {
    try {
      this.setUp();
      this.uploadNodes();
      this.uploadPositions();
      this.uploadFocus();
      this.uploadLinks();
      this.uploadHighlights();
    } catch (error) {
      this.options.restored(error);
      return;
    }
    this.lost = false;
    this.options.restored(null);
  };

  private setUp(): void {
    const gl = this.gl;
    this.nodeProgram = this.program(NODE_VERTEX, NODE_FRAGMENT);
    this.linkProgram = this.program(LINK_VERTEX, LINK_FRAGMENT);
    this.highlightProgram = this.program(HIGHLIGHT_VERTEX, HIGHLIGHT_FRAGMENT);
    for (const name of ['colors', 'shapes', 'sources', 'targets', 'types', 'highlightNodes', 'highlightColors'] as const) {
      this.buffers[name] = gl.createBuffer()!;
    }
    this.nodeVao = this.vertexArray([
      { buffer: this.buffers.colors, location: 0, size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
      { buffer: this.buffers.shapes, location: 1, size: 1, type: gl.UNSIGNED_BYTE, normalized: false },
    ]);
    this.linkVao = this.vertexArray([
      { buffer: this.buffers.sources, location: 0, size: 1, type: gl.UNSIGNED_INT, integer: true },
      { buffer: this.buffers.targets, location: 1, size: 1, type: gl.UNSIGNED_INT, integer: true },
      { buffer: this.buffers.types, location: 2, size: 1, type: gl.UNSIGNED_BYTE, integer: true },
    ]);
    this.highlightVao = this.vertexArray([
      { buffer: this.buffers.highlightNodes, location: 0, size: 1, type: gl.UNSIGNED_INT, integer: true },
      { buffer: this.buffers.highlightColors, location: 1, size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
    ]);
    this.positionsTexture = this.texture();
    this.focusTexture = this.texture();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  private program(vertex: string, fragment: string): Program {
    const gl = this.gl;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        throw new Error(gl.getShaderInfoLog(shader) ?? 'A shader did not compile.');
      }
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'A program did not link.');
    }
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) ?? 0;
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i)!.name.replace(/\[0\]$/, '');
      uniforms[name] = gl.getUniformLocation(program, name)!;
    }
    return { program, uniforms };
  }

  private vertexArray(attributes: { buffer: WebGLBuffer, location: number, size: number, type: number, normalized?: boolean, integer?: boolean }[]) {
    const gl = this.gl;
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    for (const attribute of attributes) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
      gl.enableVertexAttribArray(attribute.location);
      if (attribute.integer) {
        gl.vertexAttribIPointer(attribute.location, attribute.size, attribute.type, 0, 0);
      } else {
        gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized ?? false, 0, 0);
      }
      gl.vertexAttribDivisor(attribute.location, 1);
    }
    gl.bindVertexArray(null);
    return vao;
  }

  private texture(): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }

  /** The nodes, as many as `count`: their shapes and colors, 4 bytes each, by index. */
  setNodes(count: number, shapes: Uint8Array, colors: Uint8Array): void {
    this.nodeCount = count;
    this.shapes = shapes.slice(0, count);
    this.colors = colors.slice(0, count * 4);
    this.uploadNodes();
  }

  private uploadNodes(): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.shapes);
    gl.bufferData(gl.ARRAY_BUFFER, this.shapes, gl.STATIC_DRAW);
  }

  /** The color of one node: 4 bytes written, nothing else. */
  setNodeColor(index: number, color: Uint8Array): void {
    this.colors.set(color, index * 4);
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
    gl.bufferSubData(gl.ARRAY_BUFFER, index * 4, color);
  }

  /** The x and y of each node, interleaved, as many as the nodes. */
  setPositions(positions: Float32Array): void {
    const rows = Math.max(1, Math.ceil(this.nodeCount / TEXTURE_WIDTH));
    if (rows !== this.textureRows || this.positions.length < rows * TEXTURE_WIDTH * 2) {
      this.textureRows = rows;
      this.positions = new Float32Array(rows * TEXTURE_WIDTH * 2);
      const focus = new Uint8Array(rows * TEXTURE_WIDTH);
      focus.set(this.focus.subarray(0, Math.min(this.focus.length, focus.length)));
      this.focus = focus;
      this.uploadFocus();
    }
    this.positions.set(positions.subarray(0, Math.min(positions.length, this.positions.length)));
    this.uploadPositions();
  }

  private uploadPositions(): void {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.positionsTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, TEXTURE_WIDTH, this.textureRows, 0, gl.RG, gl.FLOAT, this.positions);
  }

  /** Fades every node but those `focused` holds, 1 for those to keep; null fades nothing. */
  setFocus(focused: Uint8Array | null): void {
    this.hovering = focused !== null;
    if (focused) {
      // The texture is read normalised: a kept node is 255, read as 1.
      this.focus.fill(0);
      const count = Math.min(focused.length, this.focus.length);
      for (let i = 0; i < count; i++) {
        this.focus[i] = focused[i] ? 255 : 0;
      }
      this.uploadFocus();
    }
  }

  private uploadFocus(): void {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.focusTexture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, TEXTURE_WIDTH, this.textureRows, 0, gl.RED, gl.UNSIGNED_BYTE, this.focus);
  }

  /** The links, from node `sources[i]` to node `targets[i]`, of type `types[i]`. */
  setLinks(count: number, sources: Uint32Array, targets: Uint32Array, types: Uint8Array): void {
    this.linkCount = count;
    this.sources = sources.slice(0, count);
    this.targets = targets.slice(0, count);
    this.types = types.slice(0, count);
    this.uploadLinks();
  }

  private uploadLinks(): void {
    const gl = this.gl;
    for (const [buffer, values] of [[this.buffers.sources, this.sources], [this.buffers.targets, this.targets], [this.buffers.types, this.types]] as const) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.DYNAMIC_DRAW);
    }
  }

  /** The color of each type of link, by type index: r, g, b, a between 0 and 1. */
  setLinkColors(colors: [number, number, number, number][]): void {
    colors.forEach((color, type) => this.linkColors.set(color, type * 4));
  }

  /** The highlighted nodes, each marked with a disc of its own color: behind it, or zoomed out a ring over it. */
  setHighlights(nodes: Uint32Array, colors: Uint8Array): void {
    this.highlightCount = nodes.length;
    this.highlightNodes = nodes.slice();
    this.highlightColors = colors.slice();
    this.uploadHighlights();
  }

  private uploadHighlights(): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.highlightNodes);
    gl.bufferData(gl.ARRAY_BUFFER, this.highlightNodes, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.highlightColors);
    gl.bufferData(gl.ARRAY_BUFFER, this.highlightColors, gl.DYNAMIC_DRAW);
  }

  /** Sizes the canvas as its box on screen, in device pixels. */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.ratio = globalThis.devicePixelRatio ?? 1;
    this.canvas.width = Math.max(1, Math.round(width * this.ratio));
    this.canvas.height = Math.max(1, Math.round(height * this.ratio));
  }

  /** Draws the graph as `camera` sees it. Opaque links are those `linkAlpha` does not fade. */
  render(camera: Camera, linkAlpha: number): void {
    const gl = this.gl;
    if (this.lost || gl.isContextLost()) {
      return;
    }
    // The window moved to a screen of another density: its box is the same, not its pixels.
    if ((globalThis.devicePixelRatio ?? 1) !== this.ratio) {
      this.resize(this.width, this.height);
    }
    const ratio = this.ratio;
    const { options } = this;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.nodeCount === 0) {
      return;
    }
    const scale = camera.scale * ratio;
    const view = (program: Program) => {
      const { uniforms } = program;
      gl.useProgram(program.program);
      gl.uniform2f(uniforms['u_center'], camera.x, camera.y);
      gl.uniform1f(uniforms['u_scale'], scale);
      gl.uniform2f(uniforms['u_viewport'], this.canvas.width, this.canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.positionsTexture);
      gl.uniform1i(uniforms['u_positions'], 0);
      if (uniforms['u_focus']) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.focusTexture);
        gl.uniform1i(uniforms['u_focus'], 1);
        gl.uniform1i(uniforms['u_hovering'], this.hovering ? 1 : 0);
        gl.uniform1f(uniforms['u_faded'], options.fadedAlpha);
      }
      return uniforms;
    };

    if (this.linkCount !== 0) {
      const uniforms = view(this.linkProgram);
      gl.uniform4fv(uniforms['u_colors'], this.linkColors);
      gl.uniform1f(uniforms['u_width'], options.linkWidth);
      gl.uniform1f(uniforms['u_minWidth'], options.minLinkPixels * ratio);
      gl.uniform1f(uniforms['u_maxWidth'], options.maxLinkPixels * ratio);
      gl.uniform1f(uniforms['u_alpha'], linkAlpha);
      gl.bindVertexArray(this.linkVao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.linkCount);
    }
    // Zoomed in, a highlight is a disc behind its node. Zoomed out, where the nodes are a few pixels
    // apart and would cover it, it is a ring drawn over them, around its own node.
    const highlightSize = options.nodeSize * 1.4;
    const nodePixels = Math.max(options.nodeSize * scale, options.minNodePixels * ratio);
    const over = highlightSize * scale < options.minHighlightPixels * ratio;
    const highlight = () => {
      const uniforms = view(this.highlightProgram);
      gl.uniform1f(uniforms['u_size'], highlightSize);
      gl.uniform1f(uniforms['u_minSize'], options.minHighlightPixels * ratio);
      gl.uniform1f(uniforms['u_hole'], over ? nodePixels * 0.5 + 1 : 0);
      gl.bindVertexArray(this.highlightVao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.highlightCount);
    };
    if (this.highlightCount !== 0 && !over) {
      highlight();
    }
    const uniforms = view(this.nodeProgram);
    gl.uniform1f(uniforms['u_size'], options.nodeSize);
    gl.uniform1f(uniforms['u_minSize'], options.minNodePixels * ratio);
    gl.bindVertexArray(this.nodeVao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.nodeCount);
    if (this.highlightCount !== 0 && over) {
      highlight();
    }
    gl.bindVertexArray(null);
  }

  destroy(): void {
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
