import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Phase 1 (0-0.4): Start zoomed into left side, panning right across letters
    // Phase 2 (0.4-0.7): Pull back to reveal full text
    // Phase 3 (0.7-1): Settle into centered view with gentle float

    const phase1 = Math.min(ease / 0.4, 1); // 0→1 during first 40%
    const phase2 = Math.max(0, Math.min((ease - 0.4) / 0.3, 1)); // 0→1 during 40-70%
    const phase3 = Math.max(0, Math.min((ease - 0.7) / 0.3, 1)); // 0→1 during 70-100%

    // Pan across: start at left edge (-5), sweep right to center (0)
    const panX = THREE.MathUtils.lerp(-5, 0, phase1);
    // Zoom: start very close, pull back to reveal
    const zoomZ = THREE.MathUtils.lerp(4, 9, phase1);
    // Then refine to final position
    const finalZ = THREE.MathUtils.lerp(zoomZ, 10, phase2);
    // Gentle vertical float in phase 3
    const floatY = Math.sin(t * 0.8) * 0.15 * phase3;
    const floatX = Math.sin(t * 0.5) * 0.1 * phase3;

    camera.position.x = THREE.MathUtils.lerp(panX, 0, phase2) + floatX;
    camera.position.y = THREE.MathUtils.lerp(0.3, 0, phase2) + floatY;
    camera.position.z = finalZ;

    camera.lookAt(
      THREE.MathUtils.lerp(panX + 2, 0, phase2),
      0,
      0
    );
  });

  return null;
}

// Generate particle positions that form text
function getTextParticles(text: string, count: number): { positions: Float32Array; depths: Float32Array; regions: Float32Array } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 6144;
  canvas.height = 1536;

  const font = "600 480px 'Jost', 'Futura', 'Century Gothic', sans-serif";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Measure "The Eli " to find where "Design" starts
  const fullText = text;
  const prefixText = "The Eli ";
  const fullWidth = ctx.measureText(fullText).width;
  const prefixWidth = ctx.measureText(prefixText).width;
  // "Design" starts at this x offset from center
  const designStartX = canvas.width / 2 - fullWidth / 2 + prefixWidth;

  ctx.fillStyle = "white";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels: [number, number, number][] = []; // x, y, region (0=TheEli, 1=Design)

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const i = (y * canvas.width + x) * 4;
      const alpha = imageData.data[i + 3];
      if (alpha > 100) {
        const region = x >= designStartX ? 1 : 0;
        pixels.push([
          (x - canvas.width / 2) * 0.002,
          -(y - canvas.height / 2) * 0.002,
          region,
        ]);
      }
    }
  }

  for (let i = pixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
  }

  const EXTRUDE_DEPTH = 0.35;
  const LAYERS = 6;

  const positions = new Float32Array(count * 3);
  const depths = new Float32Array(count);
  const regions = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const idx = i % pixels.length;
    const layer = Math.floor(Math.random() * LAYERS);
    const depthT = layer / (LAYERS - 1);
    positions[i * 3] = pixels[idx][0];
    positions[i * 3 + 1] = pixels[idx][1];
    positions[i * 3 + 2] = -depthT * EXTRUDE_DEPTH;
    depths[i] = depthT;
    regions[i] = pixels[idx][2];
  }
  return { positions, depths, regions };
}

const PARTICLE_COUNT = 40000;

function ParticleSystem({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { targetPositions, targetDepths, initialPositions, randomVelocities } = useMemo(() => {
    const { positions: target, depths } = getTextParticles("The Eli Design", PARTICLE_COUNT);
    const initial = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 8;
      initial[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      initial[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      initial[i * 3 + 2] = r * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { targetPositions: target, targetDepths: depths, initialPositions: initial, randomVelocities: velocities };
  }, []);

  const currentPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = Math.random() * 0.3 + 0.15;
    }
    return s;
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor1: { value: new THREE.Color("#cc2222") },
        uColor2: { value: new THREE.Color("#cc4422") },
        uColor3: { value: new THREE.Color("#dddddd") },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aDepth;
        uniform float uTime;
        uniform float uProgress;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vColorMix;
        varying float vDepth;
        varying float vLighting;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = length(position.xy);
          
          vDepth = aDepth;
          
          // Directional lighting from top-right-front
          vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
          // Front face gets full light, sides get less
          float facingLight = mix(1.0, 0.3, aDepth);
          // Add subtle top-down gradient lighting
          float topLight = smoothstep(-2.0, 2.0, position.y) * 0.3;
          vLighting = facingLight + topLight;
          
          vAlpha = smoothstep(0.0, 0.2, uProgress) * (0.85 + 0.15 * sin(uTime * 2.0 + dist * 0.5));
          vColorMix = sin(position.x * 0.3 + uTime) * 0.5 + 0.5;
          gl_PointSize = aSize * uPixelRatio * (1.0 + 0.05 * sin(uTime * 3.0 + dist)) * (160.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying float vAlpha;
        varying float vColorMix;
        varying float vDepth;
        varying float vLighting;

        void main() {
          vec2 uv = gl_PointCoord;
          float edgeX = smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.95, uv.x);
          float edgeY = smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.95, uv.y);
          float alpha = edgeX * edgeY * vAlpha;
          
          vec3 color = mix(uColor1, uColor2, vColorMix);
          color = mix(color, uColor3, smoothstep(0.7, 1.0, vColorMix));
          
          // Apply 3D lighting — front face bright, back face dark
          color *= vLighting;
          
          // Darken deeper layers for depth
          color *= mix(1.0, 0.35, vDepth);
          
          // Slight ambient so back isn't pure black
          color += vec3(0.03);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = Math.min(progress, 1);
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      currentPositions[i3] = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], ease)
        + Math.sin(t * 1.5 + i * 0.01) * (1 - ease) * 0.3
        + randomVelocities[i3] * Math.sin(t + i) * (1 - ease * 0.8);
      currentPositions[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], targetPositions[i3 + 1], ease)
        + Math.cos(t * 1.2 + i * 0.01) * (1 - ease) * 0.3
        + randomVelocities[i3 + 1] * Math.cos(t + i) * (1 - ease * 0.8);
      currentPositions[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], targetPositions[i3 + 2], ease)
        + Math.sin(t * 0.8 + i * 0.02) * 0.05;
    }

    posAttr.array.set(currentPositions);
    posAttr.needsUpdate = true;

    shaderMaterial.uniforms.uTime.value = t;
    shaderMaterial.uniforms.uProgress.value = p;
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={initialPositions.slice()}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aDepth"
          count={PARTICLE_COUNT}
          array={targetDepths}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const start = Date.now();
    const duration = 2400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100]"
          style={{ background: "hsl(var(--background))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <Canvas
            camera={{ position: [0, 0, 14], fov: 50 }}
            dpr={[1, 2]}
            style={{ position: "absolute", inset: 0 }}
          >
            <CameraRig progress={progress} />
            <ParticleSystem progress={progress} />
            <EffectComposer>
              <Bloom
                intensity={0.1}
                luminanceThreshold={0.7}
                luminanceSmoothing={0.2}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>

          {/* Subtle loading indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ background: "hsl(var(--primary))" }}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
