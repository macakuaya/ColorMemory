/**
 * Color utility functions
 */

/**
 * Calculate brightness of a hex color
 * Returns a value between 0 (dark) and 255 (light)
 */
export function getBrightness(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Get appropriate text color (dark or light) for a background color
 */
export function getTextColor(hex) {
    const brightness = getBrightness(hex);
    return brightness > 128 ? '#312e2b' : '#ffffff';
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Select random items from an array
 */
export function selectRandom(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, count);
}


