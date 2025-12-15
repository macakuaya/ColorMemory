/**
 * Main Entry Point
 * Initializes and wires together all game components
 */
import { allColors } from './data/colors.js';
import { gameConfig } from './config/gameConfig.js';
import { GameController } from './core/GameController.js';
import { FTUEModal } from './components/FTUEModal.js';
import { soundManager } from './audio/SoundManager.js';

// DOM Elements
const gameBoardElement = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const newGameBtn = document.getElementById('new-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winMessage = document.getElementById('win-message');
const ftueModalElement = document.getElementById('ftue-modal');

// Initialize components
let gameController;
let ftueModal;

/**
 * Initialize the game
 */
function init() {
    // Initialize audio (requires user interaction)
    soundManager.init();
    
    // Initialize game controller
    gameController = new GameController(
        gameBoardElement,
        null, // No progress bar for now
        {
            updateMoves: (moves) => {
                movesDisplay.textContent = moves;
            },
            updateMatches: (matches) => {
                matchesDisplay.textContent = matches;
            },
            showWin: () => {
                winMessage.classList.remove('hidden');
                soundManager.playWinSound();
            },
            hideWin: () => {
                winMessage.classList.add('hidden');
            }
        }
    );
    
    // Initialize FTUE modal
    ftueModal = new FTUEModal(ftueModalElement);
    
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
    // New game button
    newGameBtn.addEventListener('click', () => {
        startNewGame();
    });
    
    // Play again button
    playAgainBtn.addEventListener('click', () => {
        startNewGame();
    });
    
    // Card clicks (delegated to game board)
    gameBoardElement.addEventListener('click', (e) => {
        const cardElement = e.target.closest('.card');
        if (cardElement) {
            const index = parseInt(cardElement.dataset.index);
            if (!isNaN(index)) {
                gameController.handleCardClick(index);
            }
        }
    });
    
    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        soundManager.init();
    }, { once: true });
}

/**
 * Start a new game
 */
function startNewGame() {
    gameController.initGame(allColors);
}

/**
 * Check and show FTUE modal if needed
 */
function checkFTUE() {
    if (!FTUEModal.hasSeenFTUE()) {
        setTimeout(() => {
            ftueModal.show();
        }, gameConfig.ftue.showDelay);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

