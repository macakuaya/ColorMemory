/**
 * Card Manager
 * Handles card creation, rendering, and state management
 */
import { gameConfig } from './config.js';
import { getTextColor, getBrightness } from './colorUtils.js';

export class CardManager {
    constructor(gameBoardElement) {
        this.gameBoardElement = gameBoardElement;
    }
    
    /**
     * Create a card element
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
            const brightness = getBrightness(card.color.hex);
            cardElement.style.color = brightness > 128 ? '#333' : '#fff';
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
     * Render all cards to the board
     */
    renderCards(cards, onClickHandler) {
        this.gameBoardElement.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            cardElement.addEventListener('click', () => onClickHandler(index));
            this.gameBoardElement.appendChild(cardElement);
        });
    }
    
    /**
     * Flip a card
     */
    flipCard(cardElement) {
        cardElement.classList.add('flipped');
    }
    
    /**
     * Unflip a card
     */
    unflipCard(cardElement) {
        cardElement.classList.remove('flipped');
    }
    
    /**
     * Mark cards as matched
     */
    markMatched(cardElements, color) {
        const textColor = getTextColor(color.hex);
        
        cardElements.forEach(cardEl => {
            cardEl.classList.add('matched');
            const cardFront = cardEl.querySelector('.card-front');
            if (cardFront) {
                cardFront.classList.add('matched-text');
                cardFront.style.transition = 'none';
                cardFront.style.background = color.hex;
                cardFront.style.color = textColor;
                cardFront.textContent = color.name;
            }
        });
    }
    
    /**
     * Check if card is clickable
     */
    isCardClickable(cardElement) {
        return !cardElement.classList.contains('flipped') && 
               !cardElement.classList.contains('matched');
    }
}

