import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRollerCoaster } from "@/lib/stores/useRollerCoaster";

export function Ground() {
  const { weatherType } = useRollerCoaster();
  const basePath = import.meta.env.BASE_URL || '/';
  const texture = useTexture(`${basePath}textures/grass.png`);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(200, 200);
  
  // Smooth transitions for ground material properties
  useFrame(() => {
    if (materialRef.current) {
      if (weatherType === "rain") {
        // Wet ground: darker, more reflective
        materialRef.current.color.lerp(new THREE.Color(0.4, 0.5, 0.4), 0.05);
        materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, 0.3, 0.05);
        materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, 0.1, 0.05);
      } else if (weatherType === "snow") {
        // Snowy ground: lighter, less reflective
        materialRef.current.color.lerp(new THREE.Color(0.9, 0.95, 1.0), 0.05);
        materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, 0.8, 0.05);
        materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, 0.0, 0.05);
      } else {
        // Sunny: normal grass
        materialRef.current.color.lerp(new THREE.Color(1, 1, 1), 0.05);
        materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, 1.0, 0.05);
        materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, 0.0, 0.05);
      }
    }
  });
  
  const initialColor = useMemo(() => {
    if (weatherType === "rain") return new THREE.Color(0.4, 0.5, 0.4);
    if (weatherType === "snow") return new THREE.Color(0.9, 0.95, 1.0);
    return new THREE.Color(1, 1, 1);
  }, [weatherType]);
  
  const initialRoughness = useMemo(() => {
    if (weatherType === "rain") return 0.3;
    if (weatherType === "snow") return 0.8;
    return 1.0;
  }, [weatherType]);
  
  const initialMetalness = useMemo(() => {
    if (weatherType === "rain") return 0.1;
    return 0.0;
  }, [weatherType]);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[800, 800]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        color={initialColor}
        roughness={initialRoughness}
        metalness={initialMetalness}
      />
    </mesh>
  );
}
