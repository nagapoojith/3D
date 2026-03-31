import { useState } from 'react';
import { HandGesture, GestureType } from '../types';
import { MousePointer2, Hand, ZoomIn, ZoomOut, Info, Settings, Play, Pause } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UIProps {
  gesture: HandGesture;
  timeScale: number;
  setTimeScale: (val: number) => void;
  isReady: boolean;
}

export function UI({ gesture, timeScale, setTimeScale, isReady }: UIProps) {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 text-white font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic">Solaris Gesture</h1>
          <p className="text-xs opacity-50 uppercase tracking-widest mt-1">3D Space Simulation v1.0</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Gesture Status Indicator */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-4 items-center">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300",
          gesture.type === GestureType.NONE ? "border-white/10 bg-black/20" : "border-green-500 bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        )}>
          {gesture.type === GestureType.PINCH && <ZoomIn className="animate-pulse" />}
          {gesture.type === GestureType.FIST && <Hand className="animate-pulse" />}
          {gesture.type === GestureType.OPEN && <MousePointer2 />}
          {gesture.type === GestureType.NONE && <Pause size={16} className="opacity-20" />}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">
          {gesture.type === GestureType.NONE ? "No Hand Detected" : gesture.type}
        </span>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        {/* Info Panel */}
        {showInfo && (
          <div className="max-w-xs bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Control Guide</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Hand size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">Fist Gesture</p>
                  <p className="text-[10px] opacity-50">Grab and move to rotate the system</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <ZoomIn size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">Pinch Gesture</p>
                  <p className="text-[10px] opacity-50">Pinch to zoom in/out</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <MousePointer2 size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">Hover & Click</p>
                  <p className="text-[10px] opacity-50">Use mouse to select planets</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orbit Speed Control */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex justify-between items-center gap-8">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Orbit Speed</span>
            <span className="text-xs font-mono">{timeScale.toFixed(1)}x</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1" 
            value={timeScale} 
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            className="w-48 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {!isReady && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-sm uppercase tracking-[0.3em] animate-pulse">Initializing Camera & AI...</p>
        </div>
      )}
    </div>
  );
}
