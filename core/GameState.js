/**
 * Game State Manager
 * Manages all game state and provides reactive updates
 */
import { gameConfig } from '../config/gameConfig.js';

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.selectedColors = [];
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.matchedColors = []; // Track matched colors in order
        this.moves = 0;
        this.isProcessing = false;
        this.activeTimeouts = [];
        this.gameInstanceId = 0;
        this.listeners = new Map();
    }

    /**
     * Subscribe to state changes
     */
    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Emit state change event
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    /**
     * Start new game instance
     */
    startNewInstance() {
        this.gameInstanceId++;
        this.cancelAllTimeouts();
    }

    /**
     * Cancel all active timeouts
     */
    cancelAllTimeouts() {
        this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this.activeTimeouts = [];
    }

    /**
     * Add timeout to tracking
     */
    addTimeout(timeoutId) {
        this.activeTimeouts.push(timeoutId);
    }

    /**
     * Set selected colors for the game
     */
    setSelectedColors(colors) {
        this.selectedColors = colors;
        this.emit('colorsSelected', colors);
    }

    /**
     * Set cards array
     */
    setCards(cards) {
        this.cards = cards;
        this.emit('cardsSet', cards);
    }

    /**
     * Add flipped card
     */
    addFlippedCard(cardData) {
        this.flippedCards.push(cardData);
        this.emit('cardFlipped', { card: cardData, totalFlipped: this.flippedCards.length });
    }

    /**
     * Clear flipped cards
     */
    clearFlippedCards() {
        this.flippedCards = [];
        this.emit('flippedCleared');
    }

    /**
     * Increment moves
     */
    incrementMoves() {
        this.moves++;
        this.emit('moveIncremented', this.moves);
    }

    /**
     * Add matched pair
     */
    addMatchedPair(color) {
        this.matchedPairs++;
        this.matchedColors.push(color);
        this.emit('pairMatched', { color, total: this.matchedPairs });
    }

    /**
     * Set processing state
     */
    setProcessing(value) {
        this.isProcessing = value;
        this.emit('processingChanged', value);
    }

    /**
     * Check if game is won
     */
    isWon() {
        return this.matchedPairs === gameConfig.gridSize && this.cards.length > 0;
    }

    /**
     * Get current state snapshot
     */
    getState() {
        return {
            selectedColors: this.selectedColors,
            cards: this.cards,
            flippedCards: this.flippedCards,
            matchedPairs: this.matchedPairs,
            matchedColors: this.matchedColors,
            moves: this.moves,
            isProcessing: this.isProcessing,
            gameInstanceId: this.gameInstanceId
        };
    }
}


