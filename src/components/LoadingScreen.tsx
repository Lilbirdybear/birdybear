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
function getTextParticles(text: string, count: number): Float32Array {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 2048;
  canvas.height = 512;

  ctx.fillStyle = "white";
  ctx.font = "bold 160px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels: [number, number][] = [];

  // Sample every pixel for maximum text clarity
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const i = (y * canvas.width + x) * 4;
      if (imageData.data[i + 3] > 128) {
        pixels.push([
          (x - canvas.width / 2) * 0.006,
          -(y - canvas.height / 2) * 0.006,
        ]);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor((i / count) * pixels.length);
    positions[i * 3] = pixels[idx][0];
    positions[i * 3 + 1] = pixels[idx][1];
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
  }
  return positions;
}

const PARTICLE_COUNT = 15000;

function ParticleSystem({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { targetPositions, initialPositions, randomVelocities } = useMemo(() => {
    const target = getTextParticles("The Eli Design", PARTICLE_COUNT);
    const initial = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start scattered in a sphere
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
    return { targetPositions: target, initialPositions: initial, randomVelocities: velocities };
  }, []);

  const currentPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = Math.random() * 1.2 + 0.3;
    }
    return s;
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor1: { value: new THREE.Color("#ff3333") },
        uColor2: { value: new THREE.Color("#ff6644") },
        uColor3: { value: new THREE.Color("#ffffff") },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        uniform float uTime;
        uniform float uProgress;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = length(position.xy);
          vAlpha = smoothstep(0.0, 0.3, uProgress) * (0.6 + 0.4 * sin(uTime * 2.0 + dist * 0.5));
          vColorMix = sin(position.x * 0.3 + uTime) * 0.5 + 0.5;
          gl_PointSize = aSize * uPixelRatio * (1.0 + 0.3 * sin(uTime * 3.0 + dist)) * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          // Sharp circular particle with crisp edge
          float alpha = smoothstep(0.5, 0.35, d) * vAlpha;
          vec3 color = mix(uColor1, uColor2, vColorMix);
          color = mix(color, uColor3, smoothstep(0.7, 1.0, vColorMix));
          // Tiny bright core, no heavy glow
          float core = smoothstep(0.3, 0.0, d) * 0.2;
          gl_FragColor = vec4(color + core, alpha);
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
      // Lerp from initial scattered positions to text positions
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
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
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
                intensity={0.4}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.4}
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
