import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import personalMark from "@/assets/personal-mark.png";

const Cube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, personalMark);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.4);
    meshRef.current.rotation.x += delta * (hovered ? 0.6 : 0.15);
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.3}
          roughness={0.4}
          emissive={new THREE.Color("hsl(220, 60%, 30%)")}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </mesh>
    </Float>
  );
};

const LogoCube = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`${className}`} style={{ cursor: "grab" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, -3, 2]} intensity={0.5} color="#8b5cf6" />
        <Cube />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default LogoCube;
