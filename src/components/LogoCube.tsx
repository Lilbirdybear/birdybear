import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import personalMark from "@/assets/personal-mark.png";

const HoverParticles = ({ active }: { active: boolean }) => {
  const count = 120;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.6;
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
    (ref.current.material as THREE.PointsMaterial).opacity = opacityRef.current * 0.6;
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.x += delta * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Cube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, personalMark);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.4);
    meshRef.current.rotation.x += delta * (hovered ? 0.6 : 0.15);
    // Smooth scale
    const target = hovered ? 1.12 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 5);
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhysicalMaterial
            map={texture}
            color="#e8edf5"
            metalness={0.05}
            roughness={0.15}
            transmission={0.3}
            thickness={0.5}
            ior={1.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={0.8}
            transparent
            opacity={0.92}
          />
        </mesh>
      </Float>
      <HoverParticles active={hovered} />
    </group>
  );
};

const LogoCube = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className} style={{ cursor: "grab" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} color="#f0f4ff" />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={0.4} color="#c4d4ff" />
        <pointLight position={[2, -2, 4]} intensity={0.3} color="#e0e8ff" />
        <Cube />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default LogoCube;
