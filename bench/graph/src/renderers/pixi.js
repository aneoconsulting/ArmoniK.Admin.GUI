// PixiJS v8: nodes as particles, tinted by status; links as lines, one Graphics per batch since
// adding to a single one tessellates all its lines again. Drawn on demand, not by its ticker.
import { Application, Container, Graphics, Particle, ParticleContainer, Texture } from 'pixi.js';
import { LINK_COLOR, NODE_SIZE, STATUS_COLORS, fitView } from '../scene.js';

const SPRITE = 64;

function shapeTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SPRITE;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  if (type === 'task') {
    ctx.beginPath();
    ctx.arc(SPRITE / 2, SPRITE / 2, SPRITE / 2, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    ctx.fillRect(0, SPRITE / 6, SPRITE, SPRITE * 2 / 3);
  }
  return Texture.from(canvas);
}

export async function pixiRenderer(container, scene, width, height) {
  const app = new Application();
  await app.init({ width, height, background: '#ffffff', antialias: true, autoStart: false, resolution: devicePixelRatio, autoDensity: true });
  container.appendChild(app.canvas);
  const world = new Container();
  app.stage.addChild(world);
  const linkLayer = new Container();
  world.addChild(linkLayer);
  const nodeLayer = new ParticleContainer({ dynamicProperties: { position: false, rotation: false, uvs: false, vertex: false, color: false } });
  world.addChild(nodeLayer);
  const textures = { task: shapeTexture('task'), result: shapeTexture('result') };
  const particles = new Map();

  const addNodes = nodes => {
    for (const node of nodes) {
      const particle = new Particle({
        texture: textures[node.type], x: node.x, y: node.y, anchorX: 0.5, anchorY: 0.5,
        scaleX: NODE_SIZE / SPRITE, scaleY: NODE_SIZE / SPRITE, tint: STATUS_COLORS[node.status],
      });
      particles.set(node.id, particle);
      nodeLayer.addParticle(particle);
    }
  };
  const addLinks = links => {
    const lines = new Graphics();
    for (const link of links) {
      const source = scene.byId.get(link.source);
      const target = scene.byId.get(link.target);
      lines.moveTo(source.x, source.y).lineTo(target.x, target.y);
    }
    lines.stroke({ width: NODE_SIZE / 12, color: LINK_COLOR, alpha: 0.3 });
    linkLayer.addChild(lines);
  };
  addNodes(scene.nodes);
  addLinks(scene.links);

  const view = fitView(scene, width, height);
  const place = () => {
    world.scale.set(view.scale);
    world.position.set(width / 2 - view.x * view.scale, height / 2 - view.y * view.scale);
  };
  place();
  app.render();

  return {
    asyncDraw: false,
    apply({ changed, added }) {
      for (const node of changed) {
        particles.get(node.id).tint = STATUS_COLORS[node.status];
      }
      addNodes(added.nodes);
      if (added.links.length !== 0) {
        addLinks(added.links);
      }
      nodeLayer.update();
      app.render();
    },
    pan(dx) {
      view.x += dx / view.scale;
      place();
      app.render();
    },
    destroy() {
      app.destroy(true);
    },
  };
}
