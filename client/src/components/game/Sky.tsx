import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRollerCoaster, WeatherType } from "@/lib/stores/useRollerCoaster";

// Rain particle component
function RainParticles() {
  const rainRef = useRef<THREE.Points>(null);
  const particleCount = 5000;
  
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = Math.random() * 100 + 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);
  
  useFrame(() => {
    if (rainRef.current && rainRef.current.geometry) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= 0.5; // Fall speed
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 100 + Math.random() * 50;
          positions[i * 3] = (Math.random() - 0.5) * 400;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={rainRef} geometry={geometry}>
      <pointsMaterial size={0.1} color="#88AAFF" transparent opacity={0.6} />
    </points>
  );
}

// Snow particle component
function SnowParticles() {
  const snowRef = useRef<THREE.Points>(null);
  const particleCount = 3000;
  
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = Math.random() * 100 + 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);
  
  useFrame(() => {
    if (snowRef.current && snowRef.current.geometry) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += Math.sin(i) * 0.02; // Sway side to side
        positions[i * 3 + 1] -= 0.15; // Fall speed (slower than rain)
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 100 + Math.random() * 50;
          positions[i * 3] = (Math.random() - 0.5) * 400;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={snowRef} geometry={geometry}>
      <pointsMaterial size={0.3} color="#FFFFFF" transparent opacity={0.8} />
    </points>
  );
}

// Helper to get colors based on weather and time
function getWeatherColors(isNightMode: boolean, weatherType: WeatherType) {
  if (isNightMode) {
    if (weatherType === "rain") {
      return { sky: "#0A0A1A", fog: "#0A0A1A" };
    } else if (weatherType === "snow") {
      return { sky: "#1A1A2E", fog: "#1A1A2E" };
    } else {
      return { sky: "#101025", fog: "#101025" };
    }
  } else {
    if (weatherType === "rain") {
      return { sky: "#4A5568", fog: "#4A5568" };
    } else if (weatherType === "snow") {
      return { sky: "#B0C4DE", fog: "#B0C4DE" };
    } else {
      return { sky: "#87CEEB", fog: "#87CEEB" };
    }
  }
}

export function Sky() {
  const { isNightMode, weatherType } = useRollerCoaster();
  
  const parkLights = useMemo(() => {
    const lights: { x: number; z: number; height: number; color: string }[] = [];
    
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 60 + (i * 7) % 100;
      lights.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height: 8 + (i % 4),
        color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#FF69B4", "#00CED1", "#FFFFFF"][i % 6]
      });
    }
    return lights;
  }, []);
  
  const stars = useMemo(() => {
    const s: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < 100; i++) {
      s.push({
        x: (i * 17 % 500) - 250,
        y: 60 + (i * 13 % 50),
        z: (i * 23 % 500) - 250,
        size: 0.15 + (i % 3) * 0.05
      });
    }
    return s;
  }, []);
  
  const ferrisWheel = useMemo(() => {
    const spokes: { angle: number; color: string }[] = [];
    for (let i = 0; i < 12; i++) {
      spokes.push({
        angle: (i / 12) * Math.PI * 2,
        color: ["#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#FF00FF", "#00FFFF"][i % 6]
      });
    }
    return spokes;
  }, []);
  
  // Smooth color transitions based on weather
  useFrame(() => {
    let targetSkyColor: THREE.Color;
    let targetFogColor: THREE.Color;
    
    if (isNightMode) {
      // Night mode colors
      if (weatherType === "rain") {
        targetSkyColor = new THREE.Color("#0A0A1A");
        targetFogColor = new THREE.Color("#0A0A1A");
      } else if (weatherType === "snow") {
        targetSkyColor = new THREE.Color("#1A1A2E");
        targetFogColor = new THREE.Color("#1A1A2E");
      } else {
        targetSkyColor = new THREE.Color("#101025");
        targetFogColor = new THREE.Color("#101025");
      }
    } else {
      // Day mode colors
      if (weatherType === "rain") {
        targetSkyColor = new THREE.Color("#4A5568");
        targetFogColor = new THREE.Color("#4A5568");
      } else if (weatherType === "snow") {
        targetSkyColor = new THREE.Color("#B0C4DE");
        targetFogColor = new THREE.Color("#B0C4DE");
      } else {
        targetSkyColor = new THREE.Color("#87CEEB");
        targetFogColor = new THREE.Color("#87CEEB");
      }
    }
    
    // Smooth interpolation
    currentSkyColor.current.lerp(targetSkyColor, 0.05);
    currentFogColor.current.lerp(targetFogColor, 0.05);
  });
  
  // Initialize colors
  useEffect(() => {
    if (isNightMode) {
      currentSkyColor.current.set(weatherType === "rain" ? "#0A0A1A" : weatherType === "snow" ? "#1A1A2E" : "#101025");
      currentFogColor.current.set(weatherType === "rain" ? "#0A0A1A" : weatherType === "snow" ? "#1A1A2E" : "#101025");
    } else {
      currentSkyColor.current.set(weatherType === "rain" ? "#4A5568" : weatherType === "snow" ? "#B0C4DE" : "#87CEEB");
      currentFogColor.current.set(weatherType === "rain" ? "#4A5568" : weatherType === "snow" ? "#B0C4DE" : "#87CEEB");
    }
  }, [isNightMode, weatherType]);
  
  const colors = useMemo(() => getWeatherColors(isNightMode, weatherType), [isNightMode, weatherType]);
  
  if (isNightMode) {
    return (
      <>
        <color attach="background" args={[colors.sky]} />
        <fog attach="fog" args={[colors.fog, 150, 500]} />
        
        <ambientLight intensity={weatherType === "rain" ? 0.3 : weatherType === "snow" ? 0.5 : 0.4} color={weatherType === "snow" ? "#AABBCC" : "#6688cc"} />
        <directionalLight position={[50, 50, 25]} intensity={weatherType === "rain" ? 0.3 : weatherType === "snow" ? 0.6 : 0.5} color={weatherType === "snow" ? "#CCDDEE" : "#8899bb"} />
        
        <pointLight position={[0, 30, 0]} intensity={2} color="#FFFFFF" distance={150} />
        <pointLight position={[100, 40, -80]} intensity={1.5} color="#FF88FF" distance={100} />
        <pointLight position={[-80, 35, 60]} intensity={1.5} color="#FFAA44" distance={100} />
        
        {weatherType !== "snow" && (
          <mesh position={[-60, 45, -80]}>
            <sphereGeometry args={[6, 32, 32]} />
            <meshBasicMaterial color="#FFFFEE" />
          </mesh>
        )}
        
        {weatherType !== "rain" && weatherType !== "snow" && stars.map((star, i) => (
          <mesh key={i} position={[star.x, star.y, star.z]}>
            <sphereGeometry args={[star.size, 6, 6]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
        
        {parkLights.map((light, i) => (
          <group key={`post-${i}`} position={[light.x, 0, light.z]}>
            <mesh position={[0, light.height / 2, 0]}>
              <cylinderGeometry args={[0.15, 0.2, light.height, 6]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            <mesh position={[0, light.height + 0.5, 0]}>
              <sphereGeometry args={[0.8, 12, 12]} />
              <meshBasicMaterial color={light.color} />
            </mesh>
          </group>
        ))}
        
        <group position={[120, 0, -100]}>
          <mesh position={[0, 22, 0]}>
            <cylinderGeometry args={[1, 1.5, 44, 8]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          <mesh position={[0, 28, 0]}>
            <torusGeometry args={[18, 0.6, 8, 32]} />
            <meshBasicMaterial color="#FF00FF" />
          </mesh>
          {ferrisWheel.map((spoke, i) => (
            <mesh key={i} position={[Math.cos(spoke.angle) * 18, 28 + Math.sin(spoke.angle) * 18, 0]}>
              <boxGeometry args={[3, 3, 3]} />
              <meshBasicMaterial color={spoke.color} />
            </mesh>
          ))}
        </group>
        
        <group position={[-100, 0, 80]}>
          <mesh position={[0, 35, 0]}>
            <cylinderGeometry args={[4, 6, 70, 10]} />
            <meshStandardMaterial color="#444466" />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, 10 + i * 12, 0]}>
              <torusGeometry args={[8, 0.4, 6, 24]} />
              <meshBasicMaterial color={["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#FF00FF"][i]} />
            </mesh>
          ))}
        </group>
        
        <group position={[80, 0, 100]}>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[12, 14, 8, 16]} />
            <meshStandardMaterial color="#774499" />
          </mesh>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 10, 5, Math.sin(angle) * 10]}>
                <boxGeometry args={[2, 3, 1.5]} />
                <meshBasicMaterial color={["#FF0000", "#00FF00", "#0000FF", "#FFFF00"][i % 4]} />
              </mesh>
            );
          })}
        </group>
        
        <group position={[-80, 0, -120]}>
          <mesh position={[0, 25, 0]}>
            <cylinderGeometry args={[2, 3, 50, 8]} />
            <meshStandardMaterial color="#553333" />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <group key={i}>
              <mesh position={[8, 12 + i * 10, 0]}>
                <boxGeometry args={[14, 0.6, 2]} />
                <meshBasicMaterial color={i % 2 === 0 ? "#FF6600" : "#FFFF00"} />
              </mesh>
              <mesh position={[-8, 12 + i * 10, 0]}>
                <boxGeometry args={[14, 0.6, 2]} />
                <meshBasicMaterial color={i % 2 === 0 ? "#FFFF00" : "#FF6600"} />
              </mesh>
            </group>
          ))}
        </group>
        
        <group position={[150, 0, 50]}>
          <mesh position={[0, 20, 0]}>
            <cylinderGeometry args={[1.5, 2, 40, 8]} />
            <meshStandardMaterial color="#336633" />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <group key={i}>
                <mesh position={[Math.cos(angle) * 6, 35, Math.sin(angle) * 6]} rotation={[0, angle, 0]}>
                  <boxGeometry args={[12, 0.5, 1]} />
                  <meshBasicMaterial color="#00FF00" />
                </mesh>
                <mesh position={[Math.cos(angle) * 12, 33, Math.sin(angle) * 12]}>
                  <boxGeometry args={[2, 4, 2]} />
                  <meshBasicMaterial color={["#FF0000", "#FFFF00", "#00FFFF"][i % 3]} />
                </mesh>
              </group>
            );
          })}
        </group>
        
        <group position={[-150, 0, -50]}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const x = (i % 4) * 10 - 15;
            const z = Math.floor(i / 4) * 10 - 10;
            return (
              <mesh key={i} position={[x, 3, z]}>
                <boxGeometry args={[4, 6, 4]} />
                <meshBasicMaterial color={["#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#FF00FF"][i % 5]} />
              </mesh>
            );
          })}
        </group>
        
        {weatherType === "rain" && <RainParticles />}
        {weatherType === "snow" && <SnowParticles />}
      </>
    );
  }
  
  return (
    <>
      <color attach="background" args={[colors.sky]} />
      <fog attach="fog" args={[colors.fog, 100, 400]} />
      
      {weatherType === "sunny" && (
        <mesh position={[50, 40, -50]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#FFFF88" />
        </mesh>
      )}
      
      <ambientLight intensity={weatherType === "rain" ? 0.3 : weatherType === "snow" ? 0.5 : 0.4} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={weatherType === "rain" ? 0.6 : weatherType === "snow" ? 0.8 : 1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <hemisphereLight args={[weatherType === "rain" ? "#4A5568" : weatherType === "snow" ? "#B0C4DE" : "#87CEEB", "#228B22", 0.3]} />
      
      {weatherType === "rain" && <RainParticles />}
      {weatherType === "snow" && <SnowParticles />}
    </>
  );
}
