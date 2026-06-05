import { CAR_INFO as CAR_INFO_EN } from "@/content/cars.en";
import { CAR_INFO as CAR_INFO_ES } from "@/content/cars.es";

const CAR_DATA = { en: CAR_INFO_EN, es: CAR_INFO_ES };

/**
 * Get car information by ID, optionally localized.
 * @param {string} carId
 * @param {string} locale - "en" | "es"
 * @returns {object|null}
 */
export function getCarInfo(carId, locale = "es") {
  return CAR_DATA[locale]?.[carId] || CAR_DATA.es[carId] || CAR_DATA.en[carId] || null;
}

/**
 * Get all car IDs that have information available.
 * @returns {string[]}
 */
export function getAvailableCarIds() {
  return Object.keys(CAR_INFO_EN);
}

// Re-export English as default for backward compat in non-i18n contexts
export const CAR_INFO = CAR_INFO_EN;
