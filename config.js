/**
 * Game Configuration
 * Centralized configuration for all game settings
 */
export const gameConfig = {
    // Grid settings
    gridSize: 4, // 4x4 grid
    pairsCount: 8, // 8 pairs = 16 cards
    
    // Card settings
    cardSize: {
        width: 100,
        height: 100
    },
    
    // Animation timings (in milliseconds)
    timings: {
        flipAnimation: 500,
        matchDelay: 500, // Wait after flip before showing match
        noMatchDelay: 1000, // Wait before flipping back on no match
        winDelay: 500 // Delay before showing win message
    },
    
    // UI dimensions
    ui: {
        gameInfoWidth: 424,
        gameInfoBorderRadius: 3,
        cardBorderRadius: 3
    },
    
    // Sound settings
    sound: {
        flipFrequency: 400,
        flipDuration: 0.1,
        flipVolume: 0.2,
        matchNotes: [523.25, 659.25, 783.99], // C5, E5, G5
        matchNoteDelay: 50,
        matchNoteDuration: 0.15,
        matchVolume: 0.25,
        noMatchFrequencies: [400, 300],
        noMatchDelay: 100,
        noMatchDuration: 0.2,
        noMatchVolume: 0.15,
        winNotes: [523.25, 587.33, 659.25, 698.46, 783.99], // C, D, E, F, G
        winNoteDelay: 80,
        winNoteDuration: 0.2,
        winVolume: 0.3
    },
    
    // FTUE settings
    ftue: {
        showDelay: 300,
        localStorageKey: 'colorMemoryFTUESeen'
    }
};

