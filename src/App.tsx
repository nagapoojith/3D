import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing';
import { useHandTracking } from './hooks/useHandTracking';
import { SolarSystem } from './components/SolarSystem';
import { UI } from './components/UI';
import { AudioController } from './components/AudioController';

export default function App() {
  const { videoRef, canvasRef, gesture, isReady } = useHandTracking();
  const [timeScale, setTimeScale] = useState(1.0);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Hidden Video for MediaPipe */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      {/* Hand Tracking Visual Feedback */}
      <div className="absolute top-4 left-4 w-48 h-36 rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md z-40">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-80"
          width={640}
          height={480}
        />
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[8px] uppercase tracking-widest font-bold">
          Live Hand Tracking
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 30, 60], fov: 45 }}
        gl={{ antialias: true, stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <SolarSystem gesture={gesture} timeScale={timeScale} />
          
          <EffectComposer>
            <Bloom 
              luminanceThreshold={1} 
              intensity={1.0} 
              radius={0.4} 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UI 
        gesture={gesture} 
        timeScale={timeScale} 
        setTimeScale={setTimeScale} 
        isReady={isReady} 
      />

      {/* Audio Controller */}
      <AudioController gestureType={gesture.type} />

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-blue-900/10 via-transparent to-transparent opacity-50" />
    </div>
  );
}
