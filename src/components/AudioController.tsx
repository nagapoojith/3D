import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { GestureType } from '../types';

interface AudioControllerProps {
  gestureType: GestureType;
}

export function AudioController({ gestureType }: AudioControllerProps) {
  const ambientRef = useRef<Howl | null>(null);
  const interactionRef = useRef<Howl | null>(null);
  const lastGesture = useRef<GestureType>(GestureType.NONE);

  useEffect(() => {
    // Ambient Space Sound
    ambientRef.current = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-deep-space-ambience-944.mp3'],
      loop: true,
      volume: 0.3,
      autoplay: true
    });

    // Interaction Sound
    interactionRef.current = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-interface-zoom-890.mp3'],
      volume: 0.5
    });

    return () => {
      ambientRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (gestureType !== lastGesture.current && gestureType !== GestureType.NONE) {
      interactionRef.current?.play();
    }
    lastGesture.current = gestureType;
  }, [gestureType]);

  return null;
}
