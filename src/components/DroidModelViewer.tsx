import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useRef, Suspense } from "react";
import * as THREE from "three";

const DroidModel = () => {
  const obj = useLoader(OBJLoader, "/models/DroidMini.obj");
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotate
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Center and scale the model
  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.2 / maxDim;

  return (
    <group ref={groupRef}>
      <primitive
        object={obj}
        scale={[scale, scale, scale]}
        position={[-center.x * scale, -center.y * scale, -center.z * scale]}
      >
        <meshStandardMaterial
          color="#8ecae6"
          metalness={0.6}
          roughness={0.3}
          emissive="#1a3a4a"
          emissiveIntensity={0.15}
        />
      </primitive>
    </group>
  );
};

const DroidModelViewer = () => {
  return (
    <Canvas
      gl={{ powerPreference: "low-power", antialias: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 3.5], fov: 45 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#6ec8f7" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#a0d8ef" />
      <Suspense fallback={null}>
        <DroidModel />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
};

export default DroidModelViewer;
