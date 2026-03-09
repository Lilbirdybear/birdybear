import { useRef, useState, useMemo, useEffect, memo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import personalMark from "@/assets/personal-mark.png";

/* ── Stardust particles ── */
const StardustParticles = memo(({ active }: { active: boolean }) => {
  const count = 60;
  const ref = useRef<THREE.Points>(null);
  const opacityRef = useRef(0.3);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 0.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = active ? 0.7 : 0.25;
    opacityRef.current += (target - opacityRef.current) * delta * 3;
    (ref.current.material as THREE.PointsMaterial).opacity = opacityRef.current;
    ref.current.rotation.y += delta * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});
StardustParticles.displayName = "StardustParticles";

/* ── White mark texture ── */
function useWhiteMarkTexture(src: string) {
  const original = useLoader(THREE.TextureLoader, src);
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const img = original.image as HTMLImageElement;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
      const isDark = brightness < 128;
      d[i] = 255;
      d[i + 1] = 255;
      d[i + 2] = 255;
      d[i + 3] = isDark ? 255 : 0;
    }
    ctx.putImageData(imageData, 0, 0);
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    setTex(t);
  }, [original]);

  return tex;
}

/* ── 3D Coin ── */
const Coin = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const markTex = useWhiteMarkTexture(personalMark);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (hovered ? 1.6 : 0.3);
    const t = hovered ? 1.12 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(t, t, t), delta * 5);
  });

  const materials = useMemo(() => {
    if (!markTex) return null;

    // Face material with the BE mark
    const faceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#151520"),
      metalness: 0.85,
      roughness: 0.15,
      map: markTex,
      emissiveMap: markTex,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.5,
      transparent: true,
    });

    // Edge/rim material - metallic
    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a2e"),
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color("#222244"),
      emissiveIntensity: 0.2,
    });

    // CylinderGeometry material order: [side, top, bottom]
    return [rimMat, faceMat, faceMat];
  }, [markTex]);

  if (!materials) return null;

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh
          ref={meshRef}
          material={materials}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[1, 1, 0.2, 48]} />
        </mesh>
        {/* Rim glow */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.04}>
          <cylinderGeometry args={[1, 1, 0.22, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>
      <StardustParticles active={hovered} />
    </group>
  );
});
Coin.displayName = "Coin";

/* ── Canvas wrapper ── */
const LogoCube = ({ className = "" }: { className?: string }) => (
  <div className={className} style={{ cursor: "grab", width: "100%", height: "100%" }}>
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-2, 1, 3]} intensity={0.3} color="#ffffff" />
      <Coin />
    </Canvas>
  </div>
);

export default LogoCube;
