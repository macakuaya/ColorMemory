/**
 * Game Board Renderer
 * Handles rendering and DOM manipulation for the game board
 */
import { Card } from './Card.js';
import { getTextColor } from '../utils/colorUtils.js';
import { shuffleArray } from '../utils/colorUtils.js';
import { gameConfig } from '../config/gameConfig.js';

export class GameBoard {
    constructor(containerElement, gameState) {
        this.container = containerElement;
        this.gameState = gameState;
        this.cardElements = new Map();
    }

    /**
     * Render the board with cards
     */
    render(cards) {
        this.container.innerHTML = '';
        this.cardElements.clear();

        cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            this.container.appendChild(cardElement);
            this.cardElements.set(index, cardElement);
        });
    }

    /**
     * Create a card DOM element
     */
    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.colorName = card.color.name;

        if (card.type === 'color') {
            cardElement.classList.add('color-card');
            cardElement.style.setProperty('--card-color', card.color.hex);
        } else {
            cardElement.classList.add('name-card');
        }

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front">
                    ${card.type === 'name' ? card.color.name : ''}
                </div>
            </div>
        `;

        return cardElement;
    }

    /**
     * Flip a card
     */
    flipCard(index) {
        const cardElement = this.cardElements.get(index);
        if (cardElement) {
            cardElement.classList.add('flipped');
        }
    }

    /**
     * Unflip a card
     */
    unflipCard(index) {
        const cardElement = this.cardElements.get(index);
        if (cardElement) {
            cardElement.classList.remove('flipped');
        }
    }

    /**
     * Mark cards as matched
     */
    markMatched(indices, color) {
        const textColor = getTextColor(color.hex);
        
        indices.forEach(index => {
            const cardElement = this.cardElements.get(index);
            if (cardElement) {
                cardElement.classList.add('matched');
                
                // Update card front to show matched state
                setTimeout(() => {
                    const cardFront = cardElement.querySelector('.card-front');
                    if (cardFront) {
                        cardFront.classList.add('matched-text');
                        cardFront.style.transition = 'none';
                        cardFront.style.background = color.hex;
                        cardFront.style.color = textColor;
                        cardFront.textContent = color.name;
                    }
                }, gameConfig.animations.matchDelay);
            }
        });
    }

    /**
     * Get card element by index
     */
    getCardElement(index) {
        return this.cardElements.get(index);
    }

    /**
     * Check if card is flipped
     */
    isFlipped(index) {
        const cardElement = this.cardElements.get(index);
        return cardElement?.classList.contains('flipped') || 
               cardElement?.classList.contains('matched');
    }

    /**
     * Clear the board
     */
    clear() {
        this.container.innerHTML = '';
        this.cardElements.clear();
    }
}


