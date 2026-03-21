/**
 * Default avatar configurations for user profile selection.
 * Each avatar has a thumbnail (for UI) and a 3D model (for future multiplayer / 3rd-person).
 */

const BUCKET_BASE =
  "https://ikzlplpyrebqnialxroe.supabase.co/storage/v1/object/public/avatars";

export const DEFAULT_AVATARS = [
  {
    id: "mixamo_01",
    name: "Avatar 1",
    thumbUrl: `${BUCKET_BASE}/mixamo_01/thumb.png`,
    modelUrl: `${BUCKET_BASE}/mixamo_01/model.glb`,
  },
  {
    id: "mixamo_02",
    name: "Avatar 2",
    thumbUrl: `${BUCKET_BASE}/mixamo_02/thumb.png`,
    modelUrl: `${BUCKET_BASE}/mixamo_02/model.glb`,
  },
  {
    id: "mixamo_03",
    name: "Avatar 3",
    thumbUrl: `${BUCKET_BASE}/mixamo_03/thumb.png`,
    modelUrl: `${BUCKET_BASE}/mixamo_03/model.glb`,
  },
  {
    id: "mixamo_04",
    name: "Avatar 4",
    thumbUrl: `${BUCKET_BASE}/mixamo_04/thumb.png`,
    modelUrl: `${BUCKET_BASE}/mixamo_04/model.glb`,
  },
  {
    id: "mixamo_05",
    name: "Avatar 5",
    thumbUrl: `${BUCKET_BASE}/mixamo_05/thumb.png`,
    modelUrl: `${BUCKET_BASE}/mixamo_05/model.glb`,
  },
];

/**
 * Look up a full avatar entry by its id.
 * @param {string} id - e.g. "mixamo_01"
 * @returns {object|undefined}
 */
export function getAvatarById(id) {
  return DEFAULT_AVATARS.find((a) => a.id === id);
}

/**
 * Convenience: get only the thumbnail URL for an avatar id.
 * Returns null when the id is unknown or falsy.
 * @param {string} id
 * @returns {string|null}
 */
export function getAvatarThumbUrl(id) {
  if (!id) return null;
  return getAvatarById(id)?.thumbUrl ?? null;
}
