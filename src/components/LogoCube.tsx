import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import personalMark from "@/assets/personal-mark.png";

const HoverParticles = ({ active }: { active: boolean }) => {
  const count = 80;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6 + Math.random() * 0.4;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    opacityRef.current += ((active ? 1 : 0) - opacityRef.current) * delta * 4;
    (ref.current.material as THREE.PointsMaterial).opacity = opacityRef.current * 0.5;
    ref.current.rotation.y += delta * 0.4;
    ref.current.rotation.x += delta * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ff3333"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Invert texture so black mark becomes white on transparent
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
      // Dark pixels become bright white, light pixels become transparent
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
    meshRef.current.rotation.y += delta * (hovered ? 1.8 : 0.35);
    meshRef.current.rotation.x += delta * (hovered ? 0.5 : 0.1);
    const target = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 6);
  });

  // Use the inverted texture as emissive map for the mark to glow
  const materials = useMemo(() => {
    if (!inverted) return undefined;

    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a0f"),
      metalness: 0.7,
      roughness: 0.25,
      emissiveMap: inverted,
      emissive: new THREE.Color("#cc3333"),
      emissiveIntensity: 0.8,
    });

    const plainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a0f"),
      metalness: 0.7,
      roughness: 0.25,
      emissive: new THREE.Color("#1a1a2e"),
      emissiveIntensity: 0.15,
    });

    // Front face has the mark, other faces are plain dark
    return [plainMat, plainMat, plainMat, plainMat, baseMat, baseMat];
  }, [inverted]);

  if (!materials) return null;

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef} material={materials}>
          <boxGeometry args={[2, 2, 2]} />
        </mesh>
        {/* Subtle edge glow */}
        <mesh scale={2.08}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#cc3333"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>
      <HoverParticles active={hovered} />
    </group>
  );
};

const LogoCube = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className} style={{ cursor: "grab", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight position={[3, 4, 5]} intensity={1.0} color="#ffffff" />
        <pointLight position={[-2, 1, 3]} intensity={0.3} color="#cc3333" />
        <Cube />
      </Canvas>
    </div>
  );
};

export default LogoCube;
