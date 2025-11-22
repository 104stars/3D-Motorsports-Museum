/**
 * Car model configurations for the museum tour.
 * Each car has a model path and transform (position, rotation, scale).
 */

export const CAR_CONFIGS = [
  {
    id: "audi-quattro",
    name: "Audi Quattro",
    modelPath: "/models/cars/audiQuattro/scene.gltf",
    position: [-10.42, 6.27, -5.05],
    rotation: [0, Math.PI, 0],
    scale: 0.0172,
    debugColor: "lime",
  },
  {
    id: "mazda-787b",
    name: "Mazda 787B",
    modelPath: "/models/cars/787b/scene.gltf",
    position: [8.6, 0, -11.7],
    rotation: [0, Math.PI / 2, 0],
    scale: 176,
    debugColor: "magenta",
  },
  {
    id: "ferrari-499",
    name: "Ferrari 499",
    modelPath: "/models/cars/ferrari499/scene.gltf",
    position: [-9, 0.07, 2.0],
    rotation: [0, Math.PI, 0],
    scale: 167,
    debugColor: "cyan",
  },
  {
    id: "porsche-917",
    name: "Porsche 917",
    modelPath: "/models/cars/917/scene.gltf",
    position: [17.74, 0, -1],
    rotation: [0, 3.06, 0],
    scale: 1.86,
    debugColor: "yellow",
  },
  {
    id: "subaru-impreza",
    name: "Subaru Impreza",
    modelPath: "/models/cars/impreza/scene.gltf",
    position: [-10.6, 6.39, 13.9],
    rotation: [0, 0, 0],
    scale: 0.012,
    debugColor: "orange",
  },
  {
    id: "toyota-celica",
    name: "Toyota Celica",
    modelPath: "/models/cars/celica/scene.gltf",
    position: [3.6, 6.28, -13.17],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.7,
    debugColor: "red",
  },
  {
    id: "mclaren-mp45",
    name: "McLaren MP4/5",
    modelPath: "/models/cars/mp45/scene.gltf",
    position: [6.07, 12.07, -13.4],
    rotation: [0, Math.PI / 3, 0],
    scale: 1,
    debugColor: "pink",
  },
  {
    id: "redbull-rb9",
    name: "Red Bull RB9",
    modelPath: "/models/cars/rb19/scene.gltf",
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

