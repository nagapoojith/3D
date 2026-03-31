import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import { Sphere, Float, Sparkles, Stars } from '@react-three/drei';
import { SUN_SIZE } from '../constants';

export function Sun() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <group>
      {/* Sun Core */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[SUN_SIZE, 64, 64]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FF4500" 
            emissiveIntensity={2} 
            roughness={0}
          />
          
          {/* Sun Glow */}
          <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[SUN_SIZE, 64, 64]} />
            <meshBasicMaterial color="#FF8C00" transparent opacity={0.3} />
          </mesh>
          
          {/* Outer Glow */}
          <mesh scale={[1.3, 1.3, 1.3]}>
            <sphereGeometry args={[SUN_SIZE, 64, 64]} />
            <meshBasicMaterial color="#FF4500" transparent opacity={0.1} />
          </mesh>
        </mesh>
      </Float>

      {/* Sun Particles */}
      <Sparkles 
        count={50} 
        scale={SUN_SIZE * 2} 
        size={2} 
        speed={0.5} 
        color="#FFD700" 
        opacity={0.5} 
      />

      {/* Point Light from Sun */}
      <pointLight intensity={200} distance={100} color="#FFD700" />
      <ambientLight intensity={0.1} />
    </group>
  );
}
