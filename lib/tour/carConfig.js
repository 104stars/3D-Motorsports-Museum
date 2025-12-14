/**
 * Car model configurations for the museum tour.
 * Each car has a model path and transform (position, rotation, scale).
 */

export const CAR_CONFIGS = [
  {
    id: "audi-quattro",
    name: "Audi Quattro",
    modelPath: "/models/quattro.glb",
    position: [-10.42, 6.27, -5.05],
    rotation: [0, Math.PI, 0],
    scale: 0.0172,
    debugColor: "lime",
  },
  {
    id: "mazda-787b",
    name: "Mazda 787B",
    modelPath: "/models/787b.glb",
    position: [8.6, 0, -11.4],
    rotation: [0, Math.PI / 2, 0],
    scale: 4.7,
    debugColor: "magenta",
  },
  {
    id: "ferrari-499",
    name: "Ferrari 499",
    modelPath: "/models/499p.glb",
    position: [-9, 0.07, 2.0],
    rotation: [0, Math.PI, 0],
    scale: 167,
    debugColor: "cyan",
  },
  {
    id: "porsche-917",
    name: "Porsche 917",
    modelPath: "/models/917.glb",
    position: [17.74, 0, -1],
    rotation: [0, 3.06, 0],
    scale: 1.86,
    debugColor: "yellow",
  },
  {
    id: "yaris",
    name: "Toyota Yaris",
    modelPath: "/models/yaris.glb",
    position: [-10.2, 6.647, 15],
    rotation: [0, Math.PI , 0],
    scale: 1.8,
    debugColor: "orange",
  },
  {
    id: "toyota-celica",
    name: "Toyota Celica",
    modelPath: "/models/celica.glb",
    position: [3.6, 6.28, -13.17],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.7,
    debugColor: "red",
  },
  {
    id: "mclaren-mp45",
    name: "McLaren MP4/5",
    modelPath: "/models/mp45.glb",
    position: [6.07, 12.07, -13.4],
    rotation: [0, Math.PI / 3, 0],
    scale: 1,
    debugColor: "pink",
  },
  {
    id: "redbull-rb9",
    name: "Red Bull RB9",
    modelPath: "/models/rb19.glb",
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

