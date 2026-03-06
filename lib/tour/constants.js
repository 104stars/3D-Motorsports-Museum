export const EYE_HEIGHT = 1.7;
export const CAMERA_PROPS = { position: [0, EYE_HEIGHT, 0], fov: 75 };
export const POSITION_LOGGER_DEFAULT_ENABLED = false;

/**
 * Floor Y thresholds. Ground ~0, second floor ~9.08, third ~12.
 * First threshold at 5.69 to avoid jump triggering culling on ground floor.
 */
const FLOOR_THRESHOLDS = [5.69, 11];

/**
 * Map a Y position to floor index (0, 1, or 2).
 */
export function getCarFloor(y) {
  if (y < FLOOR_THRESHOLDS[0]) return 0;
  if (y < FLOOR_THRESHOLDS[1]) return 1;
  return 2;
}

/**
 * Get active floor indices based on camera Y (current floor only for culling).
 */
export function getActiveFloors(cameraY) {
  const floor = getCarFloor(cameraY);
  return new Set([floor]);
}

