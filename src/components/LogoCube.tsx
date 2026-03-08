import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import personalMark from "@/assets/personal-mark.png";

const StardustParticles = ({ active }: { active: boolean }) => {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = active ? 1 : 0.4; // Always partially visible!
    opacityRef.current += (target - opacityRef.current) * delta * 3;
    (ref.current.material as THREE.PointsMaterial).opacity = opacityRef.current * 0.7;
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.x += delta * 0.15;

    // Animate positions slightly
    const posAttr = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.setX(i, posAttr.getX(i) + velocities[i * 3] * delta * 10);
      posAttr.setY(i, posAttr.getY(i) + velocities[i * 3 + 1] * delta * 10);
      posAttr.setZ(i, posAttr.getZ(i) + velocities[i * 3 + 2] * delta * 10);
      
      // Keep particles within bounds
      const dist = Math.sqrt(
        posAttr.getX(i) ** 2 + posAttr.getY(i) ** 2 + posAttr.getZ(i) ** 2
      );
      if (dist > 2.5 || dist < 1.2) {
        velocities[i * 3] *= -1;
        velocities[i * 3 + 1] *= -1;
        velocities[i * 3 + 2] *= -1;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#1cd2e0"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Secondary stardust ring
const StardustRing = () => {
  const count = 120;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const r = 1.8 + Math.random() * 0.3;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;
    ref.current.rotation.z += delta * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

function useInvertedTexture(src: string) {
  const original = useLoader(THREE.TextureLoader, src);
  const [inverted, setInverted] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const img = original.image as HTMLImageElement;
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const invertedBrightness = 255 - brightness;
      const alpha = invertedBrightness > 30 ? 255 : 0;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = alpha;
    }

    ctx.putImageData(imageData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    setInverted(tex);
  }, [original]);

  return { original, inverted };
}

const Cube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { original, inverted } = useInvertedTexture(personalMark);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (hovered ? 2.0 : 0.4);
    meshRef.current.rotation.x += delta * (hovered ? 0.6 : 0.12);
    const target = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 6);
  });

  const materials = useMemo(() => {
    if (!inverted) return undefined;

    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a14"),
      metalness: 0.8,
      roughness: 0.2,
      emissiveMap: inverted,
      emissive: new THREE.Color("#1cd2e0"),
      emissiveIntensity: 1.2,
    });

    const plainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a14"),
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color("#1a1a3e"),
      emissiveIntensity: 0.2,
    });

    return [plainMat, plainMat, plainMat, plainMat, baseMat, baseMat];
  }, [inverted]);

  if (!materials) return null;

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh ref={meshRef} material={materials}>
          <boxGeometry args={[2, 2, 2]} />
        </mesh>
        {/* Edge glow - more visible */}
        <mesh scale={2.1}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#1cd2e0"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>
      <StardustParticles active={hovered} />
      <StardustRing />
    </group>
  );
};

const LogoCube = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className} style={{ cursor: "grab", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[3, 4, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-2, 1, 3]} intensity={0.5} color="#1cd2e0" />
        <pointLight position={[2, -1, -2]} intensity={0.3} color="#4488ff" />
        <Cube />
      </Canvas>
    </div>
  );
};

export default LogoCube;
