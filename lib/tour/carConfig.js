/**
 * Car model configurations for the museum tour.
 * Each car has a model path and transform (position, rotation, scale).
 */

import { getCarModelUrlById } from '@/lib/supabase/storage';

export const CAR_CONFIGS = [
  {
    id: "audi-quattro",
    name: "Audi Quattro",
    modelPath: getCarModelUrlById("audi-quattro"),
    position: [-10.42, 6.27, -5.05],
    rotation: [0, Math.PI, 0],
    scale: 0.0172,
    debugColor: "lime",
  },
  {
    id: "mazda-787b",
    name: "Mazda 787B",
    modelPath: getCarModelUrlById("mazda-787b"),
    position: [8.6, 0, -11.7],
    rotation: [0, Math.PI / 2, 0],
    scale: 4,
    debugColor: "magenta",
  },
  {
    id: "ferrari-499",
    name: "Ferrari 499",
    modelPath: getCarModelUrlById("ferrari-499"),
    position: [-9, 0.07, 2.0],
    rotation: [0, Math.PI, 0],
    scale: 167,
    debugColor: "cyan",
  },
  {
    id: "porsche-917",
    name: "Porsche 917",
    modelPath: getCarModelUrlById("porsche-917"),
    position: [17.74, 0, -1],
    rotation: [0, 3.06, 0],
    scale: 1.86,
    debugColor: "yellow",
  },
  {
    id: "yaris",
    name: "Toyota Yaris",
    modelPath: getCarModelUrlById("yaris"),
    position: [-10.05, 6.647, 15],
    rotation: [0, Math.PI , 0],
    scale: 1.8,
    debugColor: "orange",
  },
  {
    id: "toyota-celica",
    name: "Toyota Celica",
    modelPath: getCarModelUrlById("toyota-celica"),
    position: [3.6, 6.28, -13.17],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.7,
    debugColor: "red",
  },
  {
    id: "mclaren-mp45",
    name: "McLaren MP4/5",
    modelPath: getCarModelUrlById("mclaren-mp45"),
    position: [6.07, 12.07, -13.4],
    rotation: [0, Math.PI / 3, 0],
    scale: 1,
    debugColor: "pink",
  },
  {
    id: "redbull-rb9",
    name: "Red Bull RB9",
    modelPath: getCarModelUrlById("redbull-rb9"),
    position: [-6.1, 11.98, 6],
    rotation: [0, 0, 0],
    scale: 1.6,
    debugColor: "blue",
  },
];

/**
 * Get the primary car position (used for lighting setup).
 * Defaults to the first car in the config.
 */
export function getPrimaryCarPosition() {
  return CAR_CONFIGS[0].position;
}

