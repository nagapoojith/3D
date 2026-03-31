import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, Group } from 'three';
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Planet } from './Planet';
import { Sun } from './Sun';
import { PLANETS, SUN_SIZE } from '../constants';
import { HandGesture, GestureType } from '../types';

interface SolarSystemProps {
  gesture: HandGesture;
  timeScale: number;
}

export function SolarSystem({ gesture, timeScale }: SolarSystemProps) {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const targetCameraPos = useRef(new Vector3(0, 30, 60));
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Handle Gesture Control
    if (gesture.type === GestureType.FIST) {
      // Rotate the entire system
      targetRotation.current.y += gesture.x * 0.05;
      targetRotation.current.x += gesture.y * 0.05;
    }

    if (gesture.type === GestureType.PINCH) {
      // Zoom in/out based on pinch distance
      // If pinch distance is small, we zoom in
      const zoomFactor = MathUtils.clamp(1 / (gesture.pinchDistance * 10), 0.5, 3);
      targetCameraPos.current.z = MathUtils.lerp(targetCameraPos.current.z, 60 / zoomFactor, 0.1);
    }

    // Smoothly interpolate rotation
    currentRotation.current.x = MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 0.1);
    currentRotation.current.y = MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 0.1);
    
    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;

    // Smoothly interpolate camera position
    camera.position.lerp(targetCameraPos.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  const handlePlanetSelect = (name: string) => {
    if (focusedPlanet === name) {
      setFocusedPlanet(null);
      targetCameraPos.current.set(0, 30, 60);
    } else {
      setFocusedPlanet(name);
      const planet = PLANETS.find(p => p.name === name);
      if (planet) {
        // Focus on planet
        targetCameraPos.current.set(planet.distance + 5, 5, planet.distance + 5);
      }
    }
  };

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sun />

      {PLANETS.map((planet) => (
        <Planet 
          key={planet.name} 
          data={planet} 
          timeScale={timeScale} 
          onSelect={handlePlanetSelect}
          isFocused={focusedPlanet === planet.name}
        />
      ))}

      {/* Hand Cursor Visualization */}
      {gesture.type !== GestureType.NONE && (
        <mesh position={[gesture.x * 20, gesture.y * 20, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial 
            color={gesture.type === GestureType.PINCH ? "#FF0000" : "#00FF00"} 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}
    </group>
  );
}
