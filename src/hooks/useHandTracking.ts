import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { GestureType, HandGesture } from '../types';

export function useHandTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gesture, setGesture] = useState<HandGesture>({
    type: GestureType.NONE,
    x: 0,
    y: 0,
    z: 0,
    pinchDistance: 0
  });
  const [isReady, setIsReady] = useState(false);

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Mirror the video
    canvasCtx.scale(-1, 1);
    canvasCtx.translate(-canvasRef.current.width, 0);
    
    canvasCtx.drawImage(
      results.image, 0, 0, canvasRef.current.width, canvasRef.current.height
    );

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      // Draw landmarks for visual feedback
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });

      // Gesture Analysis
      // 4: Thumb Tip, 8: Index Tip
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];
      const wrist = landmarks[0];

      const dist = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2)
      );

      // Simple Gesture Detection
      let type = GestureType.OPEN;
      
      // Pinch detection
      if (dist < 0.05) {
        type = GestureType.PINCH;
      } 
      // Fist detection (all fingertips close to wrist)
      else {
        const tips = [indexTip, middleTip, ringTip, pinkyTip];
        const avgDistToWrist = tips.reduce((acc, tip) => {
          return acc + Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2));
        }, 0) / 4;
        
        if (avgDistToWrist < 0.15) {
          type = GestureType.FIST;
        }
      }

      setGesture({
        type,
        x: (indexTip.x - 0.5) * 2, // Normalize to -1 to 1
        y: (indexTip.y - 0.5) * -2, // Invert Y and normalize
        z: indexTip.z,
        pinchDistance: dist
      });
    } else {
      setGesture(prev => ({ ...prev, type: GestureType.NONE }));
    }
    
    canvasCtx.restore();
  }, []);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(onResults);

    if (videoRef.current) {
      const CameraConstructor = (window as any).Camera;
      if (!CameraConstructor) {
        console.error('MediaPipe Camera utility not found. Please check index.html script tags.');
        return;
      }

      const camera = new CameraConstructor(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && hands) {
            try {
              await hands.send({ image: videoRef.current });
            } catch (err) {
              console.error('Hands.send error:', err);
            }
          }
        },
        width: 640,
        height: 480,
      });
      camera.start().then(() => setIsReady(true)).catch((err: any) => {
        console.error('Camera start error:', err);
      });
    }

    return () => {
      hands.close();
    };
  }, [onResults]);

  return { videoRef, canvasRef, gesture, isReady };
}
