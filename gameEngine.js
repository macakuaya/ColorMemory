/**
 * Game Engine
 * Core game logic and state management
 */
import { gameConfig } from './config.js';
import { CardManager } from './cardManager.js';
import { soundManager } from './soundManager.js';

export class GameEngine {
    constructor(gameBoardElement, callbacks = {}) {
        this.cardManager = new CardManager(gameBoardElement);
        this.callbacks = callbacks;
        
        // Game state
        this.cards = [];
        this.selectedColors = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isProcessing = false;
        this.activeTimeouts = [];
        this.gameInstanceId = 0;
    }
    
    /**
     * Initialize a new game
     */
    initGame(allColors) {
        // Increment instance ID to invalidate pending callbacks
        this.gameInstanceId++;
        
        // Cancel all active timeouts
        this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this.activeTimeouts = [];
        
        // Reset game state
        this.matchedPairs = 0;
        this.moves = 0;
        this.flippedCards = [];
        this.isProcessing = false;
        this.cards = [];
        
        // Select random colors
        const shuffled = [...allColors].sort(() => Math.random() - 0.5);
        this.selectedColors = shuffled.slice(0, gameConfig.pairsCount);
        
        // Create card pairs
        this.cards = [];
        this.selectedColors.forEach(color => {
            // Color swatch card
            this.cards.push({
                type: 'color',
                color: color,
                id: `color-${color.name}`
            });
            // Color name card
            this.cards.push({
                type: 'name',
                color: color,
                id: `name-${color.name}`
            });
        });
        
        // Shuffle all cards
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        
        // Render board
        this.cardManager.renderCards(this.cards, (index) => this.handleCardClick(index));
        this.updateDisplay();
        
        // Hide win message
        if (this.callbacks.hideWin) {
            this.callbacks.hideWin();
        }
    }
    
    /**
     * Handle card click
     */
    handleCardClick(index) {
        if (this.isProcessing) return;
        
        const card = this.cards[index];
        const cardElement = this.cardManager.gameBoardElement.children[index];
        
        // Validate click
        if (!this.cardManager.isCardClickable(cardElement)) {
            return;
        }
        
        if (this.flippedCards.length >= 2) return;
        
        // Flip the card
        this.cardManager.flipCard(cardElement);
        this.flippedCards.push({ index, card, element: cardElement });
        soundManager.playFlipSound();
        
        // Check for match when 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }
    
    /**
     * Check if the two flipped cards match
     */
    checkMatch() {
        this.isProcessing = true;
        
        const [first, second] = this.flippedCards;
        const isMatch = first.card.color.name === second.card.color.name && 
                        first.card.type !== second.card.type;
        
        if (isMatch) {
            this.handleMatch(first, second);
        } else {
            this.handleNoMatch(first, second);
        }
    }
    
    /**
     * Handle a successful match
     */
    handleMatch(first, second) {
        soundManager.playMatchSound();
        
        const color = first.card.color;
        const currentInstanceId = this.gameInstanceId;
        
        // Mark as matched immediately
        first.element.classList.add('matched');
        second.element.classList.add('matched');
        
        // Wait for flip animation, then show match state
        const matchTimeoutId = setTimeout(() => {
            if (this.gameInstanceId !== currentInstanceId || 
                this.cards.length === 0 || 
                !first.element.parentNode || 
                !second.element.parentNode) {
                return;
            }
            
            this.cardManager.markMatched([first.element, second.element], color);
            
            this.flippedCards = [];
            this.matchedPairs++;
            this.updateDisplay();
            this.isProcessing = false;
            
            // Check for win
            if (this.matchedPairs === gameConfig.pairsCount) {
                const winInstanceId = this.gameInstanceId;
                const winTimeoutId = setTimeout(() => {
                    if (this.gameInstanceId === winInstanceId && this.cards.length > 0) {
                        soundManager.playWinSound();
                        if (this.callbacks.showWin) {
                            this.callbacks.showWin();
                        }
                    }
                }, gameConfig.timings.winDelay);
                this.activeTimeouts.push(winTimeoutId);
            }
        }, gameConfig.timings.matchDelay);
        
        this.activeTimeouts.push(matchTimeoutId);
    }
    
    /**
     * Handle a failed match
     */
    handleNoMatch(first, second) {
        soundManager.playNoMatchSound();
        const currentInstanceId = this.gameInstanceId;
        
        const noMatchTimeoutId = setTimeout(() => {
            if (this.gameInstanceId !== currentInstanceId || 
                this.cards.length === 0 || 
                !first.element.parentNode || 
                !second.element.parentNode) {
                return;
            }
            
            this.cardManager.unflipCard(first.element);
            this.cardManager.unflipCard(second.element);
            this.flippedCards = [];
            this.isProcessing = false;
        }, gameConfig.timings.noMatchDelay);
        
        this.activeTimeouts.push(noMatchTimeoutId);
    }
    
    /**
     * Update the display
     */
    updateDisplay() {
        if (this.callbacks.updateMoves) {
            this.callbacks.updateMoves(this.moves);
        }
        if (this.callbacks.updateMatches) {
            this.callbacks.updateMatches(this.matchedPairs);
        }
    }
}

