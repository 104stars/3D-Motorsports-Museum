export const EYE_HEIGHT = 1.7;
export const CAMERA_PROPS = { position: [0, EYE_HEIGHT, 0], fov: 75 };
export const POSITION_LOGGER_DEFAULT_ENABLED = false;

// Floor culling thresholds (Y values measured in-game for smooth stair transitions)
export const FLOOR_BOUNDARY_1_2 = 5.6;  // boundary between floor 1 and 2
export const FLOOR_BOUNDARY_2_3 = 11.2; // boundary between floor 2 and 3

/**
 * Returns a Set of active floor numbers (1, 2, 3) based on camera Y.
 * Inclusive boundaries allow overlap for smooth stair transitions.
 */
export function getActiveFloors(cameraY) {
  const floors = new Set();
  if (cameraY <= FLOOR_BOUNDARY_1_2) floors.add(1);
  if (cameraY >= FLOOR_BOUNDARY_1_2 && cameraY <= FLOOR_BOUNDARY_2_3) floors.add(2);
  if (cameraY >= FLOOR_BOUNDARY_2_3) floors.add(3);
  return floors;
}

/**
 * Returns the floor number (1, 2, or 3) a car belongs to based on its Y position.
 */
export function getCarFloor(carY) {
  if (carY < FLOOR_BOUNDARY_1_2) return 1;
  if (carY < FLOOR_BOUNDARY_2_3) return 2;
  return 3;
}

