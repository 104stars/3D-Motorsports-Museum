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
    scale: 2,
    debugColor: "lime",
  },
  {
    id: "mazda-787b",
    name: "Mazda 787B",
    modelPath: "/models/787b.glb",
    position: [8.6, 0, -11.4],
    rotation: [0, Math.PI / 2, 0],
    scale: 2,
    debugColor: "magenta",
  },
  {
    id: "ferrari-499",
    name: "Ferrari 499",
    modelPath: "/models/499p.glb",
    position: [-9, 0.07, 2.0],
    rotation: [0, Math.PI, 0],
    scale: 2,
    debugColor: "cyan",
  },
  {
    id: "porsche-917",
    name: "Porsche 917",
    modelPath: "/models/917.glb",
    position: [17.74, 0, -1],
    rotation: [0, 3.06, 0],
    scale: 2,
    debugColor: "yellow",
  },
  {
    id: "yaris",
    name: "Toyota Yaris",
    modelPath: "/models/yaris.glb",
    position: [-10.2, 6.647, 15],
    rotation: [0, Math.PI , 0],
    scale: 2,
    debugColor: "orange",
  },
  {
    id: "toyota-celica",
    name: "Toyota Celica",
    modelPath: "/models/celica.glb",
    position: [3.6, 6.28, -13.17],
    rotation: [0, Math.PI / 2, 0],
    scale: 2,
    debugColor: "red",
  },
  {
    id: "mclaren-mp45",
    name: "McLaren MP4/5",
    modelPath: "/models/mp45.glb",
    position: [6.07, 12.07, -13.4],
    rotation: [0, Math.PI / 3, 0],
    scale: 2,
    debugColor: "pink",
  },
  {
    id: "redbull-rb9",
    name: "Red Bull RB9",
    modelPath: "/models/rb9.glb",
    position: [-6.1, 11.98, 6],
    rotation: [0, 0, 0],
    scale: 2,
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

/**
 * Mapping of car IDs to their Supabase bucket filenames.
 * Used for loading high-quality models from Supabase storage.
 */
const CAR_ID_TO_BUCKET_FILENAME = {
  "audi-quattro": "audiQuattro.glb",
  "mazda-787b": "787b.glb",
  "ferrari-499": "499p.glb",
  "porsche-917": "917.glb",
  "yaris": "yaris.glb",
  "toyota-celica": "celica.glb",
  "mclaren-mp45": "mp45.glb",
  "redbull-rb9": "rb9.glb",
};

/**
 * Supabase storage bucket base URL for car models.
 */
const SUPABASE_BUCKET_BASE_URL = "https://ikzlplpyrebqnialxroe.supabase.co/storage/v1/object/public/cars";

/**
 * Get the Supabase bucket filename for a given car ID.
 * @param {string} carId - The car's unique identifier
 * @returns {string|null} The bucket filename or null if not found
 */
export function getBucketFilename(carId) {
  return CAR_ID_TO_BUCKET_FILENAME[carId] || null;
}

/**
 * Get the full Supabase storage URL for a high-quality car model.
 * @param {string} carId - The car's unique identifier
 * @returns {string|null} The full URL to the model file or null if carId is invalid
 */
export function getHighQualityModelUrl(carId) {
  const filename = getBucketFilename(carId);
  if (!filename) return null;
  return `${SUPABASE_BUCKET_BASE_URL}/${filename}`;
}
