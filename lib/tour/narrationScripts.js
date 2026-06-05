import { NARRATION_SCRIPTS as SCRIPTS_EN } from "@/content/narration.en";
import { NARRATION_SCRIPTS as SCRIPTS_ES } from "@/content/narration.es";

const SCRIPTS = { en: SCRIPTS_EN, es: SCRIPTS_ES };

/**
 * Get all narration scripts for a given locale.
 * @param {string} locale - "en" | "es"
 * @returns {object}
 */
export function getNarrationScripts(locale = "es") {
  return SCRIPTS[locale] || SCRIPTS.es;
}

/**
 * Get narration script for a specific car.
 * @param {string} carId
 * @param {string} locale
 * @returns {object|null}
 */
export function getNarrationScript(carId, locale = "es") {
  const scripts = SCRIPTS[locale] || SCRIPTS.es;
  return scripts[carId] || SCRIPTS.es[carId] || SCRIPTS.en[carId] || null;
}

// Re-export English as default for backward compat
export const NARRATION_SCRIPTS = SCRIPTS_EN;
