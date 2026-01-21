import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRollerCoaster } from "@/lib/stores/useRollerCoaster";

export function Ground() {
  const { groundType } = useRollerCoaster();
  const basePath = import.meta.env.BASE_URL || '/';
  
  const texturePath = groundType === 'grass' 
    ? 'textures/grass.png' 
    : groundType === 'desert' 
      ? 'textures/sand.jpg' 
      : 'textures/snow.jpg';
  
  const texture = useTexture(`${basePath}${texturePath}`);
  
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(200, 200);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[800, 800]} />
      <meshStandardMaterial 
        map={texture} 
        color={groundType === 'snow' ? "#ffffff" : "#ffffff"} 
        roughness={groundType === 'snow' ? 1.0 : 0.8}
        metalness={0.0}
      />
    </mesh>
  );
}
