/**
 * Game configuration
 * Centralized settings for easy modification
 */
export const gameConfig = {
    // Grid settings
    gridSize: 4, // 4x4 grid = 16 cards = 8 pairs
    cardSize: 100, // pixels
    
    // Animation timings (milliseconds)
    animations: {
        cardFlip: 500,
        matchDelay: 500,
        noMatchDelay: 1000,
        winDelay: 500
    },
    
    // Sound settings
    sounds: {
        enabled: true,
        flipFrequency: 400,
        matchNotes: [523.25, 659.25, 783.99], // C5, E5, G5
        noMatchNotes: [400, 300],
        winNotes: [523.25, 587.33, 659.25, 698.46, 783.99] // C, D, E, F, G
    },
    
    // FTUE settings
    ftue: {
        localStorageKey: 'colorMemoryFTUESeen',
        showDelay: 300
    },
    
    // Progress bar settings
    progressBar: {
        width: 24, // pixels
        segmentGap: 1, // pixels
        tooltipOffset: 16, // pixels from bar
        animationDuration: 400 // milliseconds
    }
};


