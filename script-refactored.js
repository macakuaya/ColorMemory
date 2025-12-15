/**
 * Main Game Script (Refactored)
 * Clean, modular entry point
 */
import { allColors } from './colors.js';
import { gameConfig } from './config.js';
import { GameEngine } from './gameEngine.js';
import { FTUEModal } from './ftueModal.js';
import { soundManager } from './soundManager.js';

// DOM Elements
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const newGameBtn = document.getElementById('new-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winMessage = document.getElementById('win-message');
const ftueModalElement = document.getElementById('ftue-modal');

// Game instances
let gameEngine;
let ftueModal;

/**
 * Initialize the game
 */
function init() {
    // Check if DOM elements exist
    if (!gameBoard) {
        console.error('Game board element not found!');
        return;
    }
    
    if (!ftueModalElement) {
        console.error('FTUE modal element not found!');
    }
    
    // Initialize game engine
    gameEngine = new GameEngine(gameBoard, {
        updateMoves: (moves) => {
            if (movesDisplay) movesDisplay.textContent = moves;
        },
        updateMatches: (matches) => {
            if (matchesDisplay) matchesDisplay.textContent = matches;
        },
        showWin: () => {
            if (winMessage) winMessage.classList.remove('hidden');
        },
        hideWin: () => {
            if (winMessage) winMessage.classList.add('hidden');
        }
    });
    
    // Initialize FTUE modal
    if (ftueModalElement) {
        ftueModal = new FTUEModal(ftueModalElement);
    } else {
        console.warn('FTUE modal element not found, skipping FTUE initialization');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Start first game
    startNewGame();
    
    // Check and show FTUE if needed
    checkFTUE();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    newGameBtn.addEventListener('click', startNewGame);
    playAgainBtn.addEventListener('click', startNewGame);
    
    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        soundManager.init();
    }, { once: true });
}

/**
 * Start a new game
 */
function startNewGame() {
    gameEngine.initGame(allColors);
}

/**
 * Check and show FTUE modal if needed
 */
function checkFTUE() {
    if (!ftueModalElement) {
        console.error('FTUE modal element not found!');
        return;
    }
    
    if (!FTUEModal.hasSeenFTUE()) {
        setTimeout(() => {
            if (ftueModal) {
                ftueModal.show();
            } else {
                console.error('FTUE modal instance not initialized!');
            }
        }, gameConfig.ftue.showDelay);
    } else {
        console.log('FTUE already seen, skipping modal');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Debug helper: Force show FTUE modal (for testing)
// Run in console: window.showFTUE()
window.showFTUE = function() {
    if (ftueModal) {
        ftueModal.show();
    } else {
        console.error('FTUE modal not initialized');
    }
};

// Debug helper: Clear FTUE flag (for testing)
// Run in console: window.clearFTUE()
window.clearFTUE = function() {
    localStorage.removeItem(gameConfig.ftue.localStorageKey);
    console.log('FTUE flag cleared. Refresh page to see modal.');
};

