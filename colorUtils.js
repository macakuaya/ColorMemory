/**
 * Color Utility Functions
 */
export function getBrightness(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

export function getTextColor(hex) {
    const brightness = getBrightness(hex);
    return brightness > 128 ? '#312e2b' : '#ffffff';
}

