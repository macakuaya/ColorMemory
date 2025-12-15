/**
 * Game Controller
 * Main game logic orchestrator
 */
import { GameState } from './GameState.js';
import { Card } from './Card.js';
import { GameBoard } from './GameBoard.js';
import { selectRandom, shuffleArray } from '../utils/colorUtils.js';
import { gameConfig } from '../config/gameConfig.js';
import { soundManager } from '../audio/SoundManager.js';

export class GameController {
    constructor(gameBoardElement, progressBar, displayCallbacks) {
        this.gameState = new GameState();
        this.gameBoard = new GameBoard(gameBoardElement, this.gameState);
        this.progressBar = progressBar;
        this.displayCallbacks = displayCallbacks; // { updateMoves, updateMatches, showWin }
        
        this.setupStateListeners();
    }

    /**
     * Setup state change listeners
     */
    setupStateListeners() {
        this.gameState.subscribe('moveIncremented', (moves) => {
            if (this.displayCallbacks.updateMoves) {
                this.displayCallbacks.updateMoves(moves);
            }
        });

        this.gameState.subscribe('pairMatched', ({ color, total }) => {
            if (this.displayCallbacks.updateMatches) {
                this.displayCallbacks.updateMatches(total);
            }
            // Progress bar removed for now
            // if (this.progressBar) {
            //     this.progressBar.addMatchedColor(color);
            // }
        });
    }

    /**
     * Initialize a new game
     */
    initGame(availableColors) {
        this.gameState.startNewInstance();
        this.gameState.reset();
        
        // Select random colors
        const selectedColors = selectRandom(availableColors, gameConfig.gridSize);
        this.gameState.setSelectedColors(selectedColors);
        
        // Create card pairs
        const cardPairs = Card.createPairs(selectedColors);
        const shuffledCards = shuffleArray(cardPairs);
        this.gameState.setCards(shuffledCards);
        
        // Render board
        this.gameBoard.render(shuffledCards);
        
        // Progress bar removed for now
        // if (this.progressBar) {
        //     this.progressBar.reset();
        // }
        
        // Update display
        this.updateDisplay();
        
        // Hide win message
        if (this.displayCallbacks.hideWin) {
            this.displayCallbacks.hideWin();
        }
    }

    /**
     * Handle card click
     */
    handleCardClick(index) {
        const state = this.gameState.getState();
        
        // Don't process if already processing
        if (state.isProcessing) return;
        
        // Don't allow clicking already flipped or matched cards
        if (this.gameBoard.isFlipped(index)) {
            return;
        }
        
        // Don't allow clicking more than 2 cards
        if (state.flippedCards.length >= 2) return;
        
        // Flip the card
        this.gameBoard.flipCard(index);
        const card = state.cards[index];
        const cardElement = this.gameBoard.getCardElement(index);
        
        this.gameState.addFlippedCard({ index, card, element: cardElement });
        soundManager.playFlipSound();
        
        // Check for match when 2 cards are flipped
        const newState = this.gameState.getState();
        if (newState.flippedCards.length === 2) {
            this.gameState.incrementMoves();
            this.checkMatch();
        }
    }

    /**
     * Check if flipped cards match
     */
    checkMatch() {
        this.gameState.setProcessing(true);
        const state = this.gameState.getState();
        const [first, second] = state.flippedCards;
        const currentInstanceId = state.gameInstanceId;
        
        const isMatch = first.card.matches(second.card);
        
        if (isMatch) {
            soundManager.playMatchSound();
            
            // Mark as matched
            this.gameBoard.markMatched([first.index, second.index], first.card.color);
            
            // Wait for animation, then complete match
            const matchTimeoutId = setTimeout(() => {
                const currentState = this.gameState.getState();
                
                // Check if game was reset
                if (currentState.gameInstanceId !== currentInstanceId || 
                    currentState.cards.length === 0 ||
                    !first.element.parentNode || 
                    !second.element.parentNode) {
                    return;
                }
                
                // Complete the match
                this.gameState.addMatchedPair(first.card.color);
                this.gameState.clearFlippedCards();
                this.gameState.setProcessing(false);
                
                // Check for win
                if (this.gameState.isWon()) {
                    const winTimeoutId = setTimeout(() => {
                        const finalState = this.gameState.getState();
                        if (finalState.gameInstanceId === currentInstanceId && 
                            finalState.cards.length > 0) {
                            if (this.displayCallbacks.showWin) {
                                this.displayCallbacks.showWin();
                            }
                            soundManager.playWinSound();
                        }
                    }, gameConfig.animations.winDelay);
                    this.gameState.addTimeout(winTimeoutId);
                }
            }, gameConfig.animations.matchDelay);
            
            this.gameState.addTimeout(matchTimeoutId);
        } else {
            // No match - flip back
            soundManager.playNoMatchSound();
            const noMatchTimeoutId = setTimeout(() => {
                const currentState = this.gameState.getState();
                
                // Check if game was reset
                if (currentState.gameInstanceId !== currentInstanceId || 
                    currentState.cards.length === 0 ||
                    !first.element.parentNode || 
                    !second.element.parentNode) {
                    return;
                }
                
                this.gameBoard.unflipCard(first.index);
                this.gameBoard.unflipCard(second.index);
                this.gameState.clearFlippedCards();
                this.gameState.setProcessing(false);
            }, gameConfig.animations.noMatchDelay);
            
            this.gameState.addTimeout(noMatchTimeoutId);
        }
    }

    /**
     * Update display
     */
    updateDisplay() {
        const state = this.gameState.getState();
        if (this.displayCallbacks.updateMoves) {
            this.displayCallbacks.updateMoves(state.moves);
        }
        if (this.displayCallbacks.updateMatches) {
            this.displayCallbacks.updateMatches(state.matchedPairs);
        }
    }
}

