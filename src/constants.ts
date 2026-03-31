import { PlanetData } from './types';

export const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    color: '#A5A5A5',
    size: 0.4,
    distance: 5,
    speed: 0.04,
    description: 'The smallest planet in our solar system and closest to the Sun.'
  },
  {
    name: 'Venus',
    color: '#E3BB76',
    size: 0.9,
    distance: 8,
    speed: 0.015,
    description: 'Often called Earth\'s twin because they are similar in size and structure.'
  },
  {
    name: 'Earth',
    color: '#2271B3',
    size: 1,
    distance: 11,
    speed: 0.01,
    description: 'Our home planet, the only place we know of so far that\'s inhabited by living things.'
  },
  {
    name: 'Mars',
    color: '#E27B58',
    size: 0.5,
    distance: 14,
    speed: 0.008,
    description: 'A dusty, cold, desert world with a very thin atmosphere.'
  },
  {
    name: 'Jupiter',
    color: '#D39C7E',
    size: 2.5,
    distance: 20,
    speed: 0.002,
    description: 'The largest planet in our solar system, more than twice as massive as all the other planets combined.'
  },
  {
    name: 'Saturn',
    color: '#C5AB6E',
    size: 2.1,
    distance: 26,
    speed: 0.0009,
    description: 'Adorned with a dazzling, complex system of icy rings.'
  },
  {
    name: 'Uranus',
    color: '#B5E3E3',
    size: 1.5,
    distance: 32,
    speed: 0.0004,
    description: 'An ice giant that rotates on its side at nearly a 90-degree angle.'
  },
  {
    name: 'Neptune',
    color: '#4B70DD',
    size: 1.4,
    distance: 38,
    speed: 0.0001,
    description: 'The most distant major planet orbiting our Sun.'
  }
];

export const SUN_SIZE = 4;
export const ORBIT_SCALE = 1.5;
export const SIZE_SCALE = 1.2;
