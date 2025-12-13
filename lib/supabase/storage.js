import { createClient } from './client';

const CARS_BUCKET_NAME = 'cars';

/**
 * Get the public URL for a file from a Supabase storage bucket.
 * @param {string} bucketName - The bucket name
 * @param {string} fileName - The file name
 * @returns {string} Public URL to the file
 */
function getStorageUrl(bucketName, fileName) {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Get the public URL for a car model file from Supabase storage.
 * @param {string} fileName - The GLB file name (e.g., "787b.glb", "quattro.glb")
 * @returns {string} Public URL to the file
 */
export function getCarModelUrl(fileName) {
  return getStorageUrl(CARS_BUCKET_NAME, fileName);
}

/**
 * Get the public URL for the gallery model from Supabase storage.
 * The gallery model is stored in the same 'cars' bucket.
 * @param {string} fileName - The gallery model file name (defaults to "gallery.glb")
 * @returns {string} Public URL to the file
 */
export function getGalleryModelUrl(fileName = 'gallery.glb') {
  return getStorageUrl(CARS_BUCKET_NAME, fileName);
}

/**
 * Map car ID to the corresponding GLB file name in Supabase storage.
 * File names match the bucket.md documentation.
 */
const CAR_ID_TO_FILENAME = {
  'audi-quattro': 'quattro.glb',
  'mazda-787b': '787b.glb',
  'ferrari-499': '499p.glb',
  'porsche-917': '917.glb',
  'yaris': 'yaris.glb',
  'toyota-celica': 'celica.glb',
  'mclaren-mp45': 'mp45.glb',
  'redbull-rb9': 'rb19.glb',
};

/**
 * Get the Supabase storage URL for a car by its ID.
 * @param {string} carId - The car ID from CAR_CONFIGS
 * @returns {string} Public URL to the GLB file
 */
export function getCarModelUrlById(carId) {
  const fileName = CAR_ID_TO_FILENAME[carId];
  if (!fileName) {
    throw new Error(`No file mapping found for car ID: ${carId}`);
  }
  return getCarModelUrl(fileName);
}

