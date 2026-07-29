import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const TELEGRAM_USERNAME = "x50mykidney";

const contactChannels = [
  {
    key: "telegram",
    label: "Telegram",
    icon: "assets/contact-channels/telegram.png",
  },
  {
    key: "signal",
    label: "Signal",
    icon: "assets/contact-channels/signal.png",
  },
  {
    key: "simplex",
    label: "SimpleX",
    icon: "assets/contact-channels/simplex.png",
  },
];

const services = {
  static: {
    label: "Static",
    shelf: "Graphic shelf",
    icon: "▤",
    note: "Creatives, logo, PWA, avatars",
    items: [
      { title: "Static", price: "12-14$", desc: "Creative for offer, warm-up or test bundle." },
      { title: "Static adaptation", price: "5$", desc: "New size, format or placement-ready version." },
      { title: "Logo", price: "23$", desc: "Sign or quick brand mark for the project." },
      { title: "Project redraw", price: "38$", desc: "Illustration with transfer from a source file." },
      { title: "Avatar", price: "from 38$", desc: "Mascot, character or channel image." },
      { title: "PWA", price: "23$", desc: "Visual for PWA, screen or promo flow." },
    ],
  },
  video: {
    label: "Video",
    shelf: "Motion shelf",
    icon: "▥",
    note: "Motion, UGC, VSL, clips, GIF",
    items: [
      { title: "Motion", price: "from 38$", desc: "Dynamic creative for affiliate launch." },
      { title: "AI clip", price: "from 38$", desc: "Video with AI processing for the needed script." },
      { title: "VSL", price: "from 75$", desc: "Selling video with clear structure." },
      { title: "GIF", price: "from 30$", desc: "Light motion format for funnels or posts." },
      { title: "UGC", price: "from 38$", desc: "Native trust-based short video or quick test." },
      { title: "Telegram circle", price: "from 23$", desc: "Telegram video in circle format." },
    ],
  },
  ai: {
    label: "AI photo generation",
    shelf: "AI photo",
    icon: "✣",
    note: "10, 25, 100 and 200+ photos",
    items: [
      { title: "Generate 10 photos", price: "45$", desc: "Pack of 10 AI photos for offer or test." },
      { title: "Generate 25 photos", price: "60$", desc: "Pack of 25 AI photos for a quick creative batch." },
      { title: "Generate 100 photos", price: "113$", desc: "Large generation for tests and best-shot selection." },
      { title: "Generate 200+ photos", price: "custom price", desc: "High-volume generation priced around the task." },
    ],
  },
};

function getServiceAmount(price) {
  if (!price || price.toLowerCase().includes("custom")) return null;
  const values = price.match(/\d+/g)?.map(Number) || [];
  if (!values.length) return null;
  return Math.max(...values);
}

function formatCartTotal(items) {
  if (!items.length) return "0$";
  const hasCustom = items.some((entry) => entry.amount === null);
  const total = items.reduce((sum, entry) => sum + (entry.amount || 0) * entry.qty, 0);
  if (hasCustom) return total ? `${total}$ + custom` : "custom price";
  return `${total}$`;
}

const showreelItems = [
  ["Video 01", "#1518cf", "#74ff86", "#ff4ea8"],
  ["Video 02", "#f0f5f7", "#322052", "#8f9bff"],
  ["Video 03", "#f2d16f", "#201312", "#745cff"],
  ["Video 04", "#b9f2ff", "#3040ff", "#b7ff4d"],
  ["Video 05", "#b4ff2c", "#0c0f12", "#38fff4"],
  ["Video 06", "#060914", "#8c54ff", "#ff6b28"],
  ["Static 01", "#26ead8", "#ff4f9c", "#1728d8"],
  ["Static 02", "#f4f1df", "#f0953a", "#9c66ff"],
  ["Static 03", "#1d2fff", "#a5f75c", "#ec63ff"],
  ["Static 04", "#d8efff", "#79fa5c", "#695dff"],
  ["Static 05", "#f6d36b", "#2b1513", "#845cff"],
  ["Static 06", "#10151d", "#f2f1ef", "#b7ff4d"],
];

const TORNADO_PRESETS = Object.freeze({
  long: {
    // LOCKED DESKTOP BASELINE. Tune mobile in long.mobile, not here.
    desktop: {
      scaleBaseWidth: 1380,
      scaleBaseHeight: 790,
      scaleMin: 1,
      scaleMax: 1.18,
      topRadius: 7.76,
      bottomRadius: 4.72,
      topDepth: 4.42,
      bottomDepth: 3.28,
      top: 4.08,
      bottom: -10.05,
      cardScale: 1.14,
      cameraZ: 18.2,
      turns: 5.65,
      backScale: 0.5,
      frontScale: 0.84,
      topCardScale: 1.5,
      bottomCardScale: 0.68,
      entryLift: 2.55,
      entryProgress: 0.105,
    },
    mobile: {
      scaleBaseWidth: 1600,
      scaleBaseHeight: 900,
      scaleMin: 0.68,
      scaleMax: 1.1,
      topRadius: 2.88,
      bottomRadius: 2.1,
      topDepth: 2.42,
      bottomDepth: 1.72,
      top: 7.45,
      bottom: -7.35,
      cardScale: 0.86,
      cameraZ: 18.9,
      turns: 5.65,
      backScale: 0.5,
      frontScale: 0.84,
      topCardScale: 1.35,
      bottomCardScale: 0.74,
      entryLift: 1.45,
      entryProgress: 0.12,
    },
  },
  compact: {
    desktop: {
      scaleBaseWidth: 1600,
      scaleBaseHeight: 900,
      scaleMin: 0.68,
      scaleMax: 1.1,
      topRadius: 6.2,
      bottomRadius: 1.55,
      topDepth: 4.25,
      bottomDepth: 1.25,
      top: 2.55,
      bottom: -3.65,
      cardScale: 1.24,
      cameraZ: 13.4,
      turns: 4.4,
      backScale: 0.48,
      frontScale: 1.05,
    },
    mobile: {
      scaleBaseWidth: 1600,
      scaleBaseHeight: 900,
      scaleMin: 0.68,
      scaleMax: 1.1,
      topRadius: 2.85,
      bottomRadius: 1,
      topDepth: 2.35,
      bottomDepth: 0.92,
      top: 2.92,
      bottom: -3.65,
      cardScale: 1.04,
      cameraZ: 12.8,
      turns: 4.4,
      backScale: 0.48,
      frontScale: 1.05,
    },
  },
});

function getTornadoScale(width, height, preset) {
  return THREE.MathUtils.clamp(
    Math.min(width / preset.scaleBaseWidth, height / preset.scaleBaseHeight),
    preset.scaleMin,
    preset.scaleMax,
  );
}

function applyTornadoPreset(layout, preset, scale) {
  layout.topRadius = preset.topRadius * scale;
  layout.bottomRadius = preset.bottomRadius * scale;
  layout.topDepth = preset.topDepth * scale;
  layout.bottomDepth = preset.bottomDepth * scale;
  layout.top = preset.top * scale;
  layout.bottom = preset.bottom * scale;
  layout.cardScale = preset.cardScale * scale;
  layout.cameraZ = preset.cameraZ / scale;

  if ("topCardScale" in preset) layout.topCardScale = preset.topCardScale;
  if ("bottomCardScale" in preset) layout.bottomCardScale = preset.bottomCardScale;
  if ("entryLift" in preset) layout.entryLift = preset.entryLift * scale;
  if ("entryProgress" in preset) layout.entryProgress = preset.entryProgress;
  if ("turns" in preset) layout.turns = preset.turns;
  if ("backScale" in preset) layout.backScale = preset.backScale;
  if ("frontScale" in preset) layout.frontScale = preset.frontScale;
}

function makeTexture([label, c1, c2, c3]) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 610;
  const ctx = canvas.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, c1);
  bg.addColorStop(0.52, c2);
  bg.addColorStop(1, "#071012");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow1 = ctx.createRadialGradient(660, 210, 0, 660, 210, 250);
  glow1.addColorStop(0, c3);
  glow1.addColorStop(1, "transparent");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow2 = ctx.createRadialGradient(360, 385, 0, 360, 385, 310);
  glow2.addColorStop(0, "rgba(255,255,255,0.26)");
  glow2.addColorStop(1, "transparent");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.ellipse(520, 315, 260, 150, -0.35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(255,255,255,0.055)";
  ctx.lineWidth = 2;
  for (let x = -canvas.height; x < canvas.width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(x + canvas.height, 0);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(238,248,250,0.78)";
  ctx.font = "900 48px Outfit, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(label.toUpperCase(), 950, 545);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeBrandTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2200;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  const text = "BOTTOMTXT";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "italic 312px Didot, 'Bodoni 72', Georgia, 'Times New Roman', serif";

  const tracking = 12;
  const metrics = [...text].reduce((width, char, index) => (
    width + ctx.measureText(char).width + (index ? tracking : 0)
  ), 0);
  const drawTrackedText = (stroke = false) => {
    let x = (canvas.width - metrics) / 2;
    [...text].forEach((char, index) => {
      if (index) x += tracking;
      const charWidth = ctx.measureText(char).width;
      if (stroke) {
        ctx.strokeText(char, x + charWidth / 2, canvas.height / 2 + 8);
      } else {
        ctx.fillText(char, x + charWidth / 2, canvas.height / 2 + 8);
      }
      x += charWidth;
    });
  };

  ctx.shadowColor = "rgba(232, 255, 238, 0.44)";
  ctx.shadowBlur = 26;
  ctx.fillStyle = "rgba(253, 253, 238, 0.88)";
  drawTrackedText(false);

  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.15;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.48)";
  drawTrackedText(true);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeBrandMaterial(texture, { glow = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uMap: { value: texture },
      uTime: { value: 0 },
      uOpacity: { value: glow ? 0.34 : 0.96 },
      uGlow: { value: glow ? 1 : 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uMap;
      uniform float uOpacity;
      uniform float uGlow;

      void main() {
        vec4 base = texture2D(uMap, vUv);
        vec3 color = base.rgb;
        float alpha = base.a;
        color += vec3(0.92, 1.0, 0.86) * uGlow * alpha * 0.45;
        gl_FragColor = vec4(color, alpha * uOpacity);
      }
    `,
  });
}

function makeCurvedPlane(width, height, curve) {
  const geometry = new THREE.PlaneGeometry(width, height, 48, 14);
  const position = geometry.attributes.position;
  const half = width / 2;
  const halfY = height / 2;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const nx = x / half;
    const ny = y / halfY;
    const edge = Math.abs(nx);
    const fold = -curve * edge * edge;
    const twist = Math.sin(nx * Math.PI) * curve * 0.04;
    const verticalBend = Math.cos(ny * Math.PI * 0.5) * Math.abs(curve) * 0.06;
    position.setZ(i, fold + verticalBend);
    position.setY(i, y + twist);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function makeFluidGridMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.46 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.z += sin((p.x * 0.42) + (p.y * 0.26)) * 0.22;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float lineGrid(vec2 uv, float scale, float width) {
        vec2 grid = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
        float line = min(grid.x, grid.y);
        return 1.0 - smoothstep(width, width + 1.15, line);
      }

      void main() {
        vec2 uv = vUv;
        vec2 centered = uv - 0.5;
        float n1 = noise(uv * 4.2 + vec2(uTime * 0.025, -uTime * 0.018));
        float n2 = noise(uv * 9.0 + vec2(-uTime * 0.012, uTime * 0.02));
        uv += vec2(n1 - 0.5, n2 - 0.5) * 0.035;
        uv.x += sin(uv.y * 7.0 + uTime * 0.16) * 0.012;
        uv.y += sin(uv.x * 5.0 - uTime * 0.12) * 0.014;

        float grid = lineGrid(uv + vec2(0.0, uTime * 0.006), 22.0, 0.42);
        float fine = lineGrid(uv + vec2(uTime * 0.004, 0.0), 44.0, 0.2) * 0.34;
        float glow = smoothstep(0.72, 0.08, length(centered * vec2(0.9, 1.22)));
        float beamMemory = smoothstep(0.5, -0.2, centered.x + centered.y * 0.72) * 0.32;
        float dust = step(0.984, noise(uv * 210.0 + uTime * 0.02)) * 0.28;

        vec3 color = vec3(0.08, 0.62, 0.68) * (grid + fine) * (0.24 + glow);
        color += vec3(0.08, 0.42, 0.48) * beamMemory;
        color += vec3(0.58, 1.0, 1.0) * dust;
        float alpha = (grid * 0.26 + fine * 0.13 + glow * 0.07 + dust) * uOpacity;
        alpha *= smoothstep(1.24, 0.16, length(centered * vec2(0.56, 0.82)));
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function makeBeamMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec2 uv = vUv;
        float axis = uv.x * 0.84 + uv.y * 0.6;
        float rayA = exp(-pow((axis - 0.4) / 0.18, 2.0)) * 0.22;
        float rayB = exp(-pow((axis - 0.62) / 0.25, 2.0)) * 0.16;
        float wash = exp(-pow((axis - 0.5) / 0.58, 2.0)) * 0.08;
        float edgeMask = smoothstep(0.0, 0.18, uv.x)
          * smoothstep(0.0, 0.18, uv.y)
          * (1.0 - smoothstep(0.68, 1.0, uv.x))
          * (1.0 - smoothstep(0.72, 1.0, uv.y));
        float distanceFade = 1.0 - smoothstep(0.26, 1.04, length(uv - vec2(0.04, 0.96)));
        float ripple = 0.94 + sin((uv.x * 18.0 + uv.y * 23.0) + uTime * 0.16) * 0.035;
        float alpha = (rayA + rayB + wash) * edgeMask * distanceFade * ripple;
        vec3 color = vec3(0.42, 0.94, 1.0) * alpha;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function makeCardGlowMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uGlow: { value: 0.62 },
      uColor: { value: new THREE.Color(0x9ff6ff) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uGlow;
      uniform vec3 uColor;
      void main() {
        vec2 edge = min(vUv, 1.0 - vUv);
        float line = 1.0 - smoothstep(0.0, 0.035, min(edge.x, edge.y));
        float corner = 1.0 - smoothstep(0.0, 0.14, length(edge));
        float alpha = (line * 0.72 + corner * 0.18) * uGlow;
        gl_FragColor = vec4(uColor * alpha, alpha);
      }
    `,
  });
}

function getHelixPose(index, total, offset = 0, layout = {}) {
  const base = index / Math.max(total - 1, 1);
  const rawProgress = base + offset;
  const progress = rawProgress <= 1 ? rawProgress : rawProgress % 1;
  const t = -0.18 + progress * Math.PI * 4;
  const radius = layout.radius ?? 2.55;
  const depth = layout.depth ?? 2.25;
  const top = layout.top ?? 2.12;
  const bottom = layout.bottom ?? -2.3;
  const cardScale = layout.cardScale ?? 1;
  const x = Math.sin(t) * radius;
  const y = THREE.MathUtils.lerp(top, bottom, progress);
  const z = Math.cos(t) * depth;
  const depthNorm = THREE.MathUtils.clamp((z + depth) / (depth * 2), 0, 1);
  const scale = THREE.MathUtils.lerp(0.5, 0.92, depthNorm) * cardScale;
  const depthLight = THREE.MathUtils.lerp(0.62, 1.04, depthNorm);
  const edgeIn = THREE.MathUtils.smoothstep(progress, 0.006, 0.02);
  const edgeOut = 1 - THREE.MathUtils.smoothstep(progress, 0.98, 0.994);
  const edgeLight = THREE.MathUtils.clamp(edgeIn * edgeOut, 0, 1);
  const fade = THREE.MathUtils.lerp(0.36, depthLight, edgeLight);
  const opacity = 1;
  const sideTilt = THREE.MathUtils.lerp(-9, 9, progress);
  return {
    x,
    y,
    z,
    scale,
    fade,
    opacity,
    rotationX: THREE.MathUtils.degToRad(-5 + Math.sin(t) * 5),
    rotationY: t,
    rotationZ: THREE.MathUtils.degToRad(sideTilt + Math.sin(t + 0.8) * 5),
  };
}

function ShowreelScene({ mode }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || mode !== "spiral") return undefined;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020808, long ? 0.018 : 0.012);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, -0.02, 14.8);
    const layout = {
      radius: 3.65,
      depth: 2.9,
      top: 5.9,
      bottom: -6.1,
      cardScale: 1,
      cameraZ: 14.8,
    };

    const root = new THREE.Group();
    root.rotation.x = -0.03;
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xa7f6ff, 1.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(0, 4.2, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x9ff6ff, 2.8, 18);
    rim.position.set(-2.4, -1.3, 4.6);
    scene.add(rim);

    const geometry = makeCurvedPlane(3.74, 2.18, 0.4);
    const visibleSlots = 12;
    const materials = Array.from({ length: visibleSlots }, (_, index) => new THREE.MeshStandardMaterial({
      map: makeTexture(showreelItems[index % showreelItems.length]),
      side: THREE.DoubleSide,
      roughness: 0.68,
      metalness: 0.02,
      transparent: false,
      depthWrite: true,
    }));

    const meshes = Array.from({ length: visibleSlots }, (_, index) => {
      const mesh = new THREE.Mesh(geometry, materials[index]);
      const pose = getHelixPose(index, visibleSlots, 0, layout);
      mesh.position.set(pose.x, pose.y, pose.z);
      mesh.rotation.set(pose.rotationX, pose.rotationY, pose.rotationZ);
      mesh.scale.setScalar(pose.scale);
      mesh.material.color.setScalar(pose.fade);
      mesh.material.opacity = pose.opacity;
      mesh.renderOrder = Math.round((pose.z + 6) * 100);
      mesh.userData.index = index;
      root.add(mesh);
      return mesh;
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      const aspect = width / height;
      const viewportScale = THREE.MathUtils.clamp(Math.min(width / 1600, height / 900), 0.68, 1.08);
      const portrait = aspect < 0.9;
      layout.radius = (portrait ? 2.22 : 4.72) * viewportScale;
      layout.depth = (portrait ? 1.96 : 3.58) * viewportScale;
      layout.top = (portrait ? 5.05 : 5.9) * viewportScale;
      layout.bottom = (portrait ? -5.25 : -6.1) * viewportScale;
      layout.cardScale = (portrait ? 1.14 : 1.48) * viewportScale;
      layout.cameraZ = (portrait ? 13.2 : 14.4) / viewportScale;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = layout.cameraZ;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      root.rotation.y += ((pointer.x * 0.1) - root.rotation.y) * 0.035;
      root.rotation.x += ((-0.06 + pointer.y * -0.05) - root.rotation.x) * 0.035;
      const offset = (time * 0.01125) % 1;
      meshes.forEach((mesh, index) => {
        const pose = getHelixPose(index, visibleSlots, offset, layout);
        mesh.position.x = pose.x;
        mesh.position.y = pose.y;
        mesh.position.z = pose.z;
        mesh.rotation.x = pose.rotationX;
        mesh.rotation.y = pose.rotationY;
        mesh.rotation.z = pose.rotationZ;
        mesh.scale.setScalar(pose.scale);
        mesh.material.color.setScalar(pose.fade);
        mesh.material.opacity = pose.opacity;
        mesh.renderOrder = Math.round((pose.z + 6) * 100);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    sceneRef.current = { renderer, scene, camera };
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onPointerMove);
      materials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, [mode]);

  return <div className="showreel-canvas" ref={mountRef} aria-hidden="true" />;
}

function getTornadoPose(index, total, offset = 0, layout = {}) {
  const base = index / Math.max(total - 1, 1);
  const progress = (base + offset) % 1;
  const t = 0.35 + progress * Math.PI * (layout.turns ?? 4.4);
  const topRadius = layout.topRadius ?? 6.4;
  const bottomRadius = layout.bottomRadius ?? 2.1;
  const topDepth = layout.topDepth ?? 4.4;
  const bottomDepth = layout.bottomDepth ?? 1.7;
  const radius = THREE.MathUtils.lerp(topRadius, bottomRadius, progress);
  const depth = THREE.MathUtils.lerp(topDepth, bottomDepth, progress);
  const entryProgress = layout.entryProgress ?? 0.105;
  const entryLift = (layout.entryLift ?? 1.7) * (1 - THREE.MathUtils.smoothstep(progress, 0, entryProgress));
  const y = THREE.MathUtils.lerp(layout.top ?? 3.2, layout.bottom ?? -3.35, progress) + entryLift;
  const x = Math.sin(t) * radius;
  const z = Math.cos(t) * depth;
  const depthNorm = THREE.MathUtils.clamp((z + topDepth) / (topDepth * 2), 0, 1);
  const verticalScale = THREE.MathUtils.lerp(layout.topCardScale ?? 1, layout.bottomCardScale ?? 1, progress);
  const scale = THREE.MathUtils.lerp(layout.backScale ?? 0.48, layout.frontScale ?? 1.05, depthNorm) * (layout.cardScale ?? 1) * verticalScale;
  const visibleBand = THREE.MathUtils.smoothstep(progress, 0.045, 0.115) * (1 - THREE.MathUtils.smoothstep(progress, 0.955, 0.992));
  const upperDark = THREE.MathUtils.smoothstep(progress, 0.06, 0.17);
  const depthLight = THREE.MathUtils.lerp(0.62, 1.06, depthNorm);
  const fade = THREE.MathUtils.lerp(0.2, depthLight, Math.min(visibleBand, upperDark));

  return {
    x,
    y,
    z,
    scale,
    fade,
    rotationX: THREE.MathUtils.degToRad(-7 + Math.sin(t) * 5),
    rotationY: t,
    rotationZ: THREE.MathUtils.degToRad(11 - progress * 18 + Math.sin(t) * 3),
  };
}

function HeroTornadoScene({ className = "hero-tornado-canvas", long = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, -0.08, 15);

    const layout = {
      topRadius: long ? 6.95 : 6.2,
      bottomRadius: long ? 4.18 : 1.55,
      topDepth: long ? 4.25 : 4.25,
      bottomDepth: long ? 3.05 : 1.25,
      top: long ? 7.4 : 2.55,
      bottom: long ? -7.3 : -3.65,
      cardScale: 1,
      cameraZ: long ? 23.2 : 15,
      turns: long ? 5.65 : 4.4,
      backScale: long ? 0.5 : 0.48,
      frontScale: long ? 0.84 : 1.05,
      topCardScale: long ? 1.5 : 1,
      bottomCardScale: long ? 0.68 : 1,
    };

    const root = new THREE.Group();
    root.rotation.x = -0.04;
    scene.add(root);

    const atmosphere = new THREE.Group();
    scene.add(atmosphere);

    const fluidGridMaterial = long ? makeFluidGridMaterial() : null;
    const fluidGridGeometry = long ? new THREE.PlaneGeometry(58, 27, 96, 56) : null;
    const fluidGrid = long ? new THREE.Mesh(fluidGridGeometry, fluidGridMaterial) : null;
    if (fluidGrid) {
      fluidGrid.position.set(0, 0, -11.5);
      fluidGrid.rotation.set(THREE.MathUtils.degToRad(-2), 0, THREE.MathUtils.degToRad(-4));
      fluidGrid.renderOrder = -80;
      atmosphere.add(fluidGrid);
    }

    const beamMaterial = long ? makeBeamMaterial() : null;
    const beamGeometry = long ? new THREE.PlaneGeometry(21, 13, 1, 1) : null;
    const beam = long ? new THREE.Mesh(beamGeometry, beamMaterial) : null;
    if (beam) {
      beam.position.set(-4.6, 3.65, -7.8);
      beam.rotation.set(THREE.MathUtils.degToRad(-4), 0, THREE.MathUtils.degToRad(-25));
      beam.renderOrder = -60;
      atmosphere.add(beam);
    }

    const dustGeometry = long ? new THREE.BufferGeometry() : null;
    const dustMaterial = long ? new THREE.PointsMaterial({
      color: 0xb6fbff,
      transparent: true,
      opacity: 0.42,
      size: 0.03,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }) : null;
    const dust = long ? new THREE.Points(dustGeometry, dustMaterial) : null;
    if (dustGeometry && dust) {
      const dustPositions = new Float32Array(500 * 3);
      for (let i = 0; i < 500; i += 1) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 23;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        dustPositions[i * 3 + 2] = -7.5 + Math.random() * 7.5;
      }
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      dust.renderOrder = -40;
      atmosphere.add(dust);
    }

    scene.add(new THREE.AmbientLight(0xa7f6ff, 1.28));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(0, 4.2, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x9ff6ff, 2.2, 20);
    rim.position.set(-3.5, 0, 5.2);
    scene.add(rim);

    const geometry = makeCurvedPlane(long ? 4.12 : 3.7, long ? 2.4 : 2.16, 0.42);
    const visibleSlots = long ? 22 : 16;
    const materials = Array.from({ length: visibleSlots }, (_, index) => new THREE.MeshStandardMaterial({
      map: makeTexture(showreelItems[index % showreelItems.length]),
      side: THREE.DoubleSide,
      roughness: 0.58,
      metalness: 0.02,
      depthWrite: true,
    }));
    const glowMaterials = Array.from({ length: visibleSlots }, () => makeCardGlowMaterial());

    const meshes = Array.from({ length: visibleSlots }, (_, index) => {
      const mesh = new THREE.Mesh(geometry, materials[index]);
      const glowMesh = new THREE.Mesh(geometry, glowMaterials[index]);
      glowMesh.scale.set(1.012, 1.012, 1.012);
      glowMesh.renderOrder = 12;
      const pose = getTornadoPose(index, visibleSlots, 0, layout);
      mesh.position.set(pose.x, pose.y, pose.z);
      mesh.rotation.set(pose.rotationX, pose.rotationY, pose.rotationZ);
      mesh.scale.setScalar(pose.scale);
      mesh.material.color.setScalar(pose.fade);
      mesh.userData.wasBrandFront = false;
      mesh.add(glowMesh);
      root.add(mesh);
      return mesh;
    });

    const brandTexture = long ? makeBrandTexture() : null;
    const brandGeometry = long ? new THREE.PlaneGeometry(12.55, 2.39, 1, 1) : null;
    const brandMaterial = long ? makeBrandMaterial(brandTexture) : null;
    const brandGlowMaterial = long ? makeBrandMaterial(brandTexture, { glow: true }) : null;
    const brandMesh = long ? new THREE.Mesh(brandGeometry, brandMaterial) : null;
    const brandGlowMesh = long ? new THREE.Mesh(brandGeometry, brandGlowMaterial) : null;
    const brandBasePosition = new THREE.Vector3(-0.1, -2.55, 0.62);
    if (brandMesh) {
      brandMesh.position.copy(brandBasePosition);
      brandMesh.rotation.set(THREE.MathUtils.degToRad(-1.5), THREE.MathUtils.degToRad(-3), THREE.MathUtils.degToRad(5));
      root.add(brandMesh);
    }
    if (brandGlowMesh) {
      brandGlowMesh.position.set(brandBasePosition.x, brandBasePosition.y - 0.02, brandBasePosition.z - 0.08);
      brandGlowMesh.rotation.set(THREE.MathUtils.degToRad(-1.5), THREE.MathUtils.degToRad(-3), THREE.MathUtils.degToRad(5));
      brandGlowMesh.scale.set(1.055, 1.12, 1);
      root.add(brandGlowMesh);
    }

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      const aspect = width / height;
      const portrait = aspect < 0.9;
      const scenePreset = TORNADO_PRESETS[long ? "long" : "compact"][portrait ? "mobile" : "desktop"];
      const sceneScale = getTornadoScale(width, height, scenePreset);
      applyTornadoPreset(layout, scenePreset, sceneScale);
      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.position.z = layout.cameraZ;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      const offset = (time * (long ? 0.004 : 0.0085)) % 1;
      if (fluidGridMaterial) fluidGridMaterial.uniforms.uTime.value = time;
      if (beamMaterial) beamMaterial.uniforms.uTime.value = time;
      if (brandMaterial) brandMaterial.uniforms.uTime.value = time;
      if (brandGlowMaterial) brandGlowMaterial.uniforms.uTime.value = time;
      if (dust) {
        dust.rotation.z = Math.sin(time * 0.035) * 0.035;
        dust.position.y = Math.sin(time * 0.08) * 0.12;
      }
      root.rotation.y = Math.sin(time * 0.12) * 0.025;
      meshes.forEach((mesh, index) => {
        const pose = getTornadoPose(index, visibleSlots, offset, layout);
        mesh.position.set(pose.x, pose.y, pose.z);
        mesh.rotation.set(pose.rotationX, pose.rotationY, pose.rotationZ);
        mesh.scale.setScalar(pose.scale);
        mesh.material.color.setScalar(pose.fade);
        mesh.renderOrder = Math.round((pose.z + 8) * 100);
        const glowMesh = mesh.children[0];
        if (glowMesh?.material?.uniforms?.uGlow) {
          glowMesh.material.uniforms.uGlow.value = THREE.MathUtils.clamp((pose.fade - 0.12) * 0.68, 0.12, 0.72);
        }
      });
      if (brandMesh) {
        const breath = (Math.sin(time * 0.42 - Math.PI * 0.5) + 1) * 0.5;
        const z = brandBasePosition.z + THREE.MathUtils.lerp(-0.42, 0, breath);
        brandMesh.position.set(brandBasePosition.x, brandBasePosition.y, z);
        brandMesh.renderOrder = 0;
      }
      if (brandGlowMesh) {
        brandGlowMesh.position.set(brandBasePosition.x, brandBasePosition.y - 0.02, (brandMesh?.position.z ?? brandBasePosition.z) - 0.08);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      materials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
      glowMaterials.forEach((material) => material.dispose());
      fluidGridMaterial?.dispose();
      fluidGridGeometry?.dispose();
      beamMaterial?.dispose();
      beamGeometry?.dispose();
      dustMaterial?.dispose();
      dustGeometry?.dispose();
      brandTexture?.dispose();
      brandMaterial?.dispose();
      brandGlowMaterial?.dispose();
      brandGeometry?.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [long]);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}

function Ticker() {
  const items = ["Crypto", "Dating", "Gamble", "PWA", "Betting", "Sweepstakes", "Nutra"];
  return (
    <div className="ticker" aria-label="Creative verticals">
      <div className="ticker-track">
        {[0, 1, 2].map((group) => (
          <div className="ticker-group" aria-hidden={group > 0} key={group}>
            {items.map((item) => (
              <span key={`${group}-${item}`}>{item}<i /></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [category, setCategory] = useState("static");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [telegram, setTelegram] = useState("");
  const [comment, setComment] = useState("");
  const [briefLink, setBriefLink] = useState("");
  const [contactChannel, setContactChannel] = useState("telegram");
  const [showreelMode, setShowreelMode] = useState("spiral");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPage, setMenuPage] = useState(null);
  const [menuCheckout, setMenuCheckout] = useState(false);
  const [cart, setCart] = useState([]);
  const previewCases = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "cases";

  const currentCategory = services[category];
  const item = currentCategory.items[serviceIndex] || currentCategory.items[0];
  const catalogServices = Object.fromEntries(Object.entries(services).filter(([key]) => key !== "ai"));
  const selectedServiceId = `${category}-${serviceIndex}`;
  const cartItems = useMemo(() => cart.map((entry) => {
    const cartCategory = services[entry.category];
    const service = cartCategory?.items[entry.serviceIndex];
    if (!cartCategory || !service) return null;
    return {
      ...entry,
      id: `${entry.category}-${entry.serviceIndex}`,
      categoryLabel: cartCategory.label,
      categoryNote: cartCategory.note,
      icon: cartCategory.icon,
      service,
      amount: getServiceAmount(service.price),
    };
  }).filter(Boolean), [cart]);
  const checkoutItems = cartItems.length ? cartItems : [{
    id: selectedServiceId,
    category,
    serviceIndex,
    qty: 1,
    categoryLabel: currentCategory.label,
    categoryNote: currentCategory.note,
    icon: currentCategory.icon,
    service: item,
    amount: getServiceAmount(item.price),
  }];
  const cartTotal = formatCartTotal(cartItems);
  const checkoutTotal = formatCartTotal(checkoutItems);
  const cartCount = cartItems.reduce((sum, entry) => sum + entry.qty, 0);
  const selectedContactChannel = contactChannels.find((channel) => channel.key === contactChannel) || contactChannels[0];

  useEffect(() => {
    if (!window.location.hash) return;
    let attempts = 0;
    const scrollToHash = () => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ block: "start" });
      attempts += 1;
      if (attempts < 10) window.setTimeout(scrollToHash, 120);
    };
    scrollToHash();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (menuCheckout) {
          setMenuCheckout(false);
          return;
        }
        if (menuPage) {
          setMenuPage(null);
          return;
        }
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuCheckout, menuPage]);

  const selectCategory = (next) => {
    setCategory(next);
    setServiceIndex(0);
    setMenuCheckout(false);
  };

  const addCurrentToCart = () => {
    setCart((current) => {
      const existing = current.find((entry) => entry.category === category && entry.serviceIndex === serviceIndex);
      if (existing) {
        return current.map((entry) => (
          entry.category === category && entry.serviceIndex === serviceIndex
            ? { ...entry, qty: entry.qty + 1 }
            : entry
        ));
      }
      return [...current, { category, serviceIndex, qty: 1 }];
    });
  };

  const updateCartQty = (id, nextQty) => {
    setCart((current) => current
      .map((entry) => `${entry.category}-${entry.serviceIndex}` === id ? { ...entry, qty: nextQty } : entry)
      .filter((entry) => entry.qty > 0));
  };

  const startCheckout = () => {
    if (!cartItems.length) addCurrentToCart();
    setMenuCheckout(true);
  };

  const requestText = useMemo(() => [
    "BOTTOMTXT DESIGN / New request",
    "Items:",
    ...checkoutItems.map((entry, index) => `${index + 1}. ${entry.service.title} / ${entry.categoryLabel} / ${entry.service.price} x ${entry.qty}`),
    `Total: ${checkoutTotal}`,
    `Contact channel: ${selectedContactChannel.label}`,
    briefLink.trim() ? `Brief link: ${briefLink.trim()}` : "Brief link: -",
    telegram.trim() ? `Customer Telegram: ${telegram}` : "Customer Telegram: from Telegram chat",
    comment.trim() ? `Comment: ${comment.trim()}` : "Comment: -",
  ].join("\n"), [briefLink, checkoutItems, checkoutTotal, comment, selectedContactChannel.label, telegram]);

  const submitRequest = (event) => {
    event.preventDefault();
    navigator.clipboard?.writeText(requestText).catch(() => {});
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(requestText)}`, "_blank", "noopener,noreferrer");
  };

  const menuItems = [
    { key: "request", label: "request", eyebrow: "Start a task", text: "Choose the format, quantity and brief details. The final request is prepared for Telegram." },
    { key: "about", label: "about", eyebrow: "BOTTOMTXT DESIGN", text: "Graphic, motion and AI-assisted creatives for affiliate marketing launches, tests and warm-up bundles." },
    { key: "contact", label: "contact", eyebrow: "@x50mykidney", text: "The fastest way to discuss scope, deadline and payment details is Telegram." },
  ];

  const selectedMenuPage = menuItems.find((item) => item.key === menuPage);
  const closeMenu = () => {
    setMenuCheckout(false);
    setMenuPage(null);
    setMenuOpen(false);
  };

  return (
    <div className={`site-shell ${previewCases ? "preview-cases" : ""}`}>
      <header className="topbar" aria-label="Primary navigation">
        <a className="nav-pill is-active" href="#home">Home</a>
        <a className="nav-pill" href="#cases">Cases</a>
        <a className="nav-pill" href="#services">Services</a>
        <a className="nav-pill" href="#faq">FAQ</a>
        <a className="nav-pill" href="#request">Request</a>
        <a className="nav-pill nav-pill-accent" href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" rel="noreferrer">Telegram <span>↗</span></a>
      </header>

      <div className={`site-menu ${menuOpen ? "is-open" : ""} ${menuPage ? "is-page" : ""} ${menuPage === "request" ? "is-request-catalog" : ""} ${menuCheckout ? "is-checkout" : ""}`}>
        <div className="site-menu-panel" role="dialog" aria-modal={menuOpen} aria-label="Site menu">
          <div className="site-menu-top">
            <button
              className="site-menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            >
              <span className="site-menu-toggle-label" aria-hidden="true">
                <span className="site-menu-word site-menu-word-menu">menu</span>
                <span className="site-menu-word site-menu-word-close">close</span>
              </span>
              <span className="site-menu-toggle-mark" aria-hidden="true" />
            </button>
            <button
              className="site-menu-back"
              type="button"
              aria-label="Back to menu"
              tabIndex={menuPage ? undefined : -1}
              onClick={() => {
                if (menuCheckout) {
                  setMenuCheckout(false);
                  return;
                }
                setMenuPage(null);
              }}
            >
              back
            </button>
          </div>
          <nav className="site-menu-nav" aria-label="Menu navigation" aria-hidden={!menuOpen || Boolean(menuPage)}>
            {menuItems.map((item) => (
              <a
                href={`#${item.key}`}
                tabIndex={menuOpen && !menuPage ? undefined : -1}
                onClick={(event) => {
                  event.preventDefault();
                  setMenuCheckout(false);
                  setMenuPage(item.key);
                }}
                key={item.key}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="site-menu-page" aria-hidden={!menuPage}>
            {menuPage === "request" ? (
              menuCheckout ? (
              <div className="menu-checkout">
                <section className="checkout-main">
                  <p>Request summary</p>
                  <h2>check out</h2>
                  <span className="checkout-lead">Review selected services and send the prepared request to Telegram.</span>
                  <div className="checkout-cart-list">
                    {checkoutItems.map((entry) => (
                      <div className="checkout-service-card" key={entry.id}>
                        <i aria-hidden="true">{entry.icon}</i>
                        <div>
                          <b>{entry.service.title}</b>
                          <small>{entry.categoryLabel} · {entry.service.price} × {entry.qty}</small>
                        </div>
                        <button type="button" onClick={() => updateCartQty(entry.id, 0)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-info-grid">
                    <div>
                      <small>Selected</small>
                      <p>{checkoutItems.length} service{checkoutItems.length === 1 ? "" : "s"} in cart.</p>
                    </div>
                    <div>
                      <small>Total</small>
                      <p>{checkoutTotal}</p>
                    </div>
                  </div>
                  <label className="checkout-brief-link">
                    <span>Brief link</span>
                    <input
                      type="url"
                      inputMode="url"
                      placeholder="https://..."
                      value={briefLink}
                      onChange={(event) => setBriefLink(event.target.value)}
                    />
                  </label>
                  <div className="checkout-details">
                    <span>deadlines in Telegram</span>
                    <span>short brief is enough</span>
                    <span>no managers</span>
                  </div>
                </section>
                <aside className="checkout-summary">
                  <p>final price</p>
                  <strong>{checkoutTotal}</strong>
                  <span>The final request is prepared for {selectedContactChannel.label}.</span>
                  <dl>
                    <div><dt>Items</dt><dd>{checkoutItems.reduce((sum, entry) => sum + entry.qty, 0)}</dd></div>
                    <div><dt>Services</dt><dd>{checkoutItems.length}</dd></div>
                    <div><dt>Channel</dt><dd>{selectedContactChannel.label}</dd></div>
                    <div><dt>Total</dt><dd>{checkoutTotal}</dd></div>
                  </dl>
                  <div className="checkout-channel-box">
                    <b>Choose contact channel</b>
                    <div className="checkout-channel-picker" aria-label="Choose contact channel">
                      {contactChannels.map((channel) => (
                        <button
                        className={`${contactChannel === channel.key ? "is-active" : ""} is-${channel.key}`}
                          type="button"
                          onClick={() => setContactChannel(channel.key)}
                          key={channel.key}
                        >
                          <i><img src={channel.icon} alt="" /></i>
                          <span>{channel.label}</span>
                        </button>
                      ))}
                    </div>
                    <span>Details are sent only through the selected channel.</span>
                  </div>
                  <button className="menu-request-submit" type="button" onClick={submitRequest}>Confirm and send <span>↗</span></button>
                </aside>
              </div>
              ) : (
              <div className="menu-catalog">
                <aside className="menu-catalog-sidebar">
                  <p>Services</p>
                  <h2>our<br />catalog</h2>
                  <div className="menu-catalog-tabs" aria-label="Service categories">
                    {Object.entries(catalogServices).map(([key, value]) => (
                      <button className={category === key ? "is-active" : ""} type="button" onClick={() => selectCategory(key)} key={key}>
                        <span>{value.icon}</span>
                        <b>{value.label}</b>
                        <small>{value.note}</small>
                      </button>
                    ))}
                  </div>
                  <div className="menu-custom-card">
                    <strong>Need something specific?</strong>
                    <span>Tell us what you need and we will handle the rest.</span>
                    <a href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" rel="noreferrer">Request custom work</a>
                  </div>
                </aside>
                <section className="menu-catalog-list" aria-label="All services">
                  <div className="menu-catalog-head">
                    <span>All services</span>
                    <strong>{currentCategory.items.length} services</strong>
                  </div>
                  <div className="menu-service-grid">
                    {currentCategory.items.map((service, index) => {
                      const serviceId = `${category}-${index}`;
                      const cartEntry = cartItems.find((entry) => entry.id === serviceId);
                      return (
                        <article className={`${index === serviceIndex ? "is-active" : ""} ${cartEntry ? "is-in-cart" : ""}`} onClick={() => setServiceIndex(index)} key={service.title}>
                          <span className="menu-service-index">{String(index + 1).padStart(2, "0")}</span>
                          <i aria-hidden="true">{currentCategory.icon}</i>
                          <b>{service.title}</b>
                          <small>{service.desc}</small>
                          <em><span>from</span>{service.price}</em>
                          <div className="menu-card-cart" onClick={(event) => event.stopPropagation()}>
                            {cartEntry ? (
                              <div className="menu-card-qty">
                                <button type="button" onClick={() => updateCartQty(serviceId, cartEntry.qty - 1)}>-</button>
                                <span>{cartEntry.qty}</span>
                                <button type="button" onClick={() => updateCartQty(serviceId, cartEntry.qty + 1)}>+</button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => {
                                setServiceIndex(index);
                                setCart((current) => [...current, { category, serviceIndex: index, qty: 1 }]);
                              }}>Add to cart</button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
                <aside className="menu-selected-service">
                  <small>Cart</small>
                  <h3>{cartCount || 0} item{cartCount === 1 ? "" : "s"}</h3>
                  <span>{cartItems.length ? "Selected services are ready for checkout." : "Add services from the cards, then continue to checkout."}</span>
                  <div className="menu-estimate">
                    <small>Total</small>
                    <strong>{cartTotal}</strong>
                  </div>
                  <div className="menu-cart-actions menu-cart-actions-single">
                    <button className="menu-request-submit" type="button" onClick={startCheckout}>Check out <span>↗</span></button>
                  </div>
                  <div className="menu-mini-cart">
                    <div><b>Added services</b><span>{cartItems.length} type{cartItems.length === 1 ? "" : "s"}</span></div>
                    {cartItems.length ? (
                      <ul>
                        {cartItems.map((entry) => (
                          <li key={entry.id}>
                            <em>x{entry.qty}</em>
                            <span>{entry.service.title}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No services added yet.</p>
                    )}
                  </div>
                  <div className="menu-how-card">
                    <b>How it works</b>
                    <span>Add services, check total, send to Telegram.</span>
                  </div>
                </aside>
              </div>
              )
            ) : (
              <>
                <p>{selectedMenuPage?.eyebrow}</p>
                <h2>{selectedMenuPage?.label}</h2>
                <span>{selectedMenuPage?.text}</span>
              </>
            )}
            {menuPage === "contact" ? (
              <a className="site-menu-page-link" href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" rel="noreferrer">open telegram</a>
            ) : menuPage && menuPage !== "request" ? (
              <a className="site-menu-page-link" href="#cases" onClick={closeMenu}>view showreel</a>
            ) : null}
          </div>
          <div className="site-menu-bottom" aria-hidden={Boolean(menuPage)}>
            <a href={`https://t.me/${TELEGRAM_USERNAME}`} tabIndex={menuOpen && !menuPage ? undefined : -1} target="_blank" rel="noreferrer">@x50mykidney</a>
            <div className="site-menu-socials" aria-label="Social links">
              <a href={`https://t.me/${TELEGRAM_USERNAME}`} tabIndex={menuOpen && !menuPage ? undefined : -1} target="_blank" rel="noreferrer">tg</a>
              <a href="#cases" tabIndex={menuOpen && !menuPage ? undefined : -1} onClick={closeMenu}>cs</a>
              <a href="#request" tabIndex={menuOpen && !menuPage ? undefined : -1} onClick={(event) => {
                event.preventDefault();
                setMenuCheckout(false);
                setMenuPage("request");
              }}>rq</a>
            </div>
          </div>
        </div>
      </div>

      <main>
        {!previewCases && <section className="hero-tornado" id="home" aria-label="BOTTOMTXT showreel tornado">
          <HeroTornadoScene className="tornado-run-canvas" long />
          <div className="hero-hurricane-logo" aria-hidden="true" />
          <div className="hero-copy">
            <p className="brand-kicker">BOTTOMTXT</p>
            <h1 className="hero-title" aria-label="BOTTOMTXT BOTTOM">
              <span className="sr-only">BOTTOMTXT BOTTOM</span>
              <img src="assets/bottom-metal.png" alt="" className="chrome-image" />
            </h1>
            <p className="hero-subtitle">Graphic and motion design for affiliate marketing</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#request" onClick={(event) => {
                event.preventDefault();
                setMenuOpen(true);
                setMenuCheckout(false);
                setMenuPage("request");
              }}>Leave request <span>›</span></a>
              <a className="button button-ghost" href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" rel="noreferrer">Message in Telegram <span className="chat-dot" /></a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img className="tool-orbit tool-figma" src="assets/hero-icons/figma.png" alt="" />
            <img className="tool-orbit tool-ps" src="assets/hero-icons/photoshop.png" alt="" />
            <img className="tool-orbit tool-ae" src="assets/hero-icons/after-effects.png" alt="" />
            <img className="tool-orbit tool-ai" src="assets/hero-icons/openai.png" alt="" />
            <img className="tool-orbit tool-tg" src="assets/hero-icons/telegram.png" alt="" />
            <img src="assets/hero-mascot.png" alt="" className="mascot" />
          </div>
          <Ticker />
        </section>}

        {previewCases && <section className="cases-section" id="cases">
          <div className="showreel-top">
            <div className="showreel-logo" aria-hidden="true" />
            <div className="showreel-mode" role="tablist" aria-label="Cases view mode">
              {["spiral", "list"].map((mode, index) => (
                <div className="showreel-mode-item" key={mode}>
                  <button className={showreelMode === mode ? "is-active" : ""} type="button" onClick={() => setShowreelMode(mode)}>{mode}</button>
                  {index === 0 && <span />}
                </div>
              ))}
            </div>
            <a className="showreel-menu" href="#request" onClick={(event) => {
              event.preventDefault();
              setMenuOpen(true);
              setMenuCheckout(false);
              setMenuPage("request");
            }}>request <span /></a>
          </div>
          {showreelMode === "spiral" ? (
            previewCases ? (
            <ShowreelScene mode={showreelMode} />
            ) : null
          ) : (
            <div className="showreel-list">
              {showreelItems.map(([label, c1, c2, c3]) => (
                <article className="showcase-card list-card" style={{ "--c1": c1, "--c2": c2, "--c3": c3 }} key={label}>
                  <div className="showcase-art" />
                  <span>{label}</span>
                </article>
              ))}
            </div>
          )}
          <div className="showreel-caption"><span>showreel</span><i /><span>2026</span><i /><span>BOTTOMTXT</span></div>
          <Ticker />
        </section>}

        {false && !previewCases && <section className="section services-section" id="services">
          <div className="section-head">
            <h2>Service catalog</h2>
            <p>Choose a format like in an order panel: price is visible upfront, details and deadlines are finalized in Telegram.</p>
          </div>
          <div className="catalog">
            <aside className="category-list" aria-label="Service categories">
              {Object.entries(services).map(([key, value]) => (
                <button className={`category-card ${category === key ? "is-active" : ""}`} type="button" onClick={() => selectCategory(key)} key={key}>
                  <span className="category-icon">{value.icon}</span>
                  <span><b>{value.label}</b><small>{value.note}</small></span>
                </button>
              ))}
            </aside>
            <div className="service-shelf">
              <div className="shelf-title"><span>{currentCategory.shelf}</span><strong>{currentCategory.items.length} formats</strong></div>
              <div className="service-grid">
                {currentCategory.items.map((service, index) => (
                  <button className={`service-card ${index === serviceIndex ? "is-active" : ""}`} type="button" onClick={() => setServiceIndex(index)} key={service.title}>
                    <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="image-mark">▧</span>
                    <b>{service.title}</b>
                    <small>{service.desc}</small>
                    <em><span>Price</span>{service.price}</em>
                  </button>
                ))}
              </div>
            </div>
            <aside className="selected-panel">
              <span className="badge">✣ Selected format</span>
              <p>{currentCategory.label}</p>
              <h3>{item.title}</h3>
              <div className="price-box"><small>Cost</small><strong>{item.price}</strong></div>
              <p className="selected-desc">{item.desc}</p>
              <ul className="feature-list"><li>deadlines in Telegram</li><li>short brief is enough</li><li>no managers</li></ul>
              <a className="button button-primary full" href="#request">Add to request <span>↗</span></a>
            </aside>
          </div>
        </section>}

        {false && !previewCases && <section className="section faq-section" id="faq">
          <div className="section-head"><h2>FAQ</h2><p>Short answers before you send a request.</p></div>
          <div className="faq-grid">
            {[
              ["01", "What formats can I order?", "Static creatives, adaptations, logos, project redraws, avatars, PWA visuals, motion, AI clips, VSL, GIF, UGC, Telegram circles, voiceover and AI photo generation."],
              ["02", "How do I place an order?", "Choose a category, select the service, set quantity, add your Telegram and send the request. The site opens Telegram with a prepared message."],
              ["03", "Are prices final?", "The catalog shows the starting price or fixed price for each format. Details, scope and deadlines are finalized in Telegram before work starts."],
              ["04", "What should I include in the brief?", "A short brief is enough: niche, offer, references, format, quantity and deadline. If something is missing, it can be clarified directly in Telegram."],
              ["05", "How does payment work?", "Payment is handled in USDT TRC20. The payment details are confirmed in Telegram after the format and scope are selected."],
              ["06", "Can I order batches for testing?", "Yes. Static creatives, video formats and AI photo packs are built for affiliate testing, warm-up bundles and quick creative batches."],
            ].map(([num, question, answer], index) => (
              <details className="faq-card" defaultOpen={index === 0} key={num}><summary><span>{num}</span>{question}</summary><p>{answer}</p></details>
            ))}
          </div>
        </section>}

        {false && !previewCases && <section className="section request-section" id="request">
          <div className="section-head"><h2>Build your request</h2><p>Final step without manager noise: choose format, quantity and leave your Telegram.</p></div>
          <div className="order-panel">
            <aside className="order-summary">
              <span className="badge">✣ Live request</span>
              <small>BOTTOMTXT / ORDER</small>
              <p>{currentCategory.label}</p>
              <h3>{item.title}</h3>
              <strong>{item.price}</strong>
              <p>{item.desc}</p>
              <ul className="feature-list"><li>format selected</li><li>Telegram needed</li><li>copies request text</li></ul>
              <img src="assets/hero-mascot.png" alt="" className="summary-mascot" />
            </aside>
            <form className="request-form" onSubmit={submitRequest}>
              <div className="form-row split">
                <label>Category<span className="form-tabs">{Object.keys(services).map((key) => <button className={category === key ? "is-active" : ""} type="button" onClick={() => selectCategory(key)} key={key}>{services[key].label.replace(" generation", "")}</button>)}</span></label>
                <label>Quantity<span className="quantity"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button><input value={quantity} onChange={(event) => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))} inputMode="numeric" /><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></span></label>
              </div>
              <label>Service<select value={serviceIndex} onChange={(event) => setServiceIndex(Number(event.target.value))}>{currentCategory.items.map((service, index) => <option value={index} key={service.title}>{service.title} - {service.price}</option>)}</select></label>
              <div className="notice"><b>Additional</b><span>USDT TRC20 payment</span></div>
              <label>Customer Telegram<input value={telegram} onChange={(event) => setTelegram(event.target.value)} type="text" placeholder="@username" required /></label>
              <label>Comment<textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="5" placeholder="Niche, offer, references or a short task brief" /></label>
              <div className="quick-tags" aria-label="Quick comment tags">{["Niche", "Offer", "References", "Deadline"].map((tag) => <button type="button" onClick={() => setComment(comment ? `${comment}\n${tag}: ` : `${tag}: `)} key={tag}>{tag}</button>)}</div>
              <div className="send-box"><span>{telegram.trim() ? "Telegram message will open with the request details" : "Fill Telegram to activate sending"}</span><button className="button button-primary full" type="submit">Send request <span>➤</span></button></div>
            </form>
          </div>
        </section>}
      </main>

      {false && !previewCases && <footer className="footer">
        <span>BOTTOMTXT DESIGN</span>
        <span>layer</span>
        <a href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" rel="noreferrer">@x50mykidney</a>
      </footer>}
    </div>
  );
}

export default App;
