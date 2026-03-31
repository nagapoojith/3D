import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color } from 'three';
import { Text, Trail, Float } from '@react-three/drei';
import { PlanetData } from '../types';

interface PlanetProps {
  data: PlanetData;
  timeScale: number;
  onSelect: (name: string) => void;
  isFocused: boolean;
}

export function Planet({ data, timeScale, onSelect, isFocused }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const orbitRef = useRef<Mesh>(null);
  
  // Random starting angle for variety
  const startAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime() * timeScale * data.speed;
    const angle = startAngle + time;
    
    const x = Math.cos(angle) * data.distance;
    const z = Math.sin(angle) * data.distance;
    
    meshRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group>
      {/* Orbit Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>

      {/* Planet */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={meshRef} 
          onClick={() => onSelect(data.name)}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={isFocused ? 1 : 0.2}
            roughness={0.7}
            metalness={0.3}
          />
          
          {/* Planet Label */}
          <Text
            position={[0, data.size + 0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            visible={isFocused}
          >
            {data.name}
          </Text>

          {/* Glow/Atmosphere if focused */}
          {isFocused && (
            <mesh scale={[1.2, 1.2, 1.2]}>
              <sphereGeometry args={[data.size, 32, 32]} />
              <meshBasicMaterial color={data.color} transparent opacity={0.2} />
            </mesh>
          )}
        </mesh>
      </Float>

      {/* Trail effect */}
      <Trail
        width={1}
        length={5}
        color={new Color(data.color)}
        attenuation={(t) => t * t}
        target={meshRef}
      />
    </group>
  );
}
