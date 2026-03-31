export interface PlanetData {
  name: string;
  color: string;
  size: number;
  distance: number;
  speed: number;
  description: string;
  texture?: string;
}

export enum GestureType {
  NONE = 'NONE',
  PINCH = 'PINCH',
  FIST = 'FIST',
  OPEN = 'OPEN',
  POINT = 'POINT'
}

export interface HandGesture {
  type: GestureType;
  x: number;
  y: number;
  z: number;
  pinchDistance: number;
}
