/**
 * FTUE Modal Manager
 * Handles first-time user experience modal
 */
import { gameConfig } from './config.js';
import { soundManager } from './soundManager.js';
import { getTextColor, getBrightness } from './colorUtils.js';

export class FTUEModal {
    constructor(modalElement) {
        this.modal = modalElement;
        this.closeBtn = document.getElementById('ftue-close-btn');
        this.gotItBtn = document.getElementById('ftue-got-it-btn');
        this.overlay = document.querySelector('.ftue-modal-overlay');
        this.exampleText = document.getElementById('ftue-example-text');
        
        this.flippedCards = [];
        this.isProcessing = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }
        
        if (this.gotItBtn) {
            this.gotItBtn.addEventListener('click', () => this.hide());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.hide());
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
        
        // Setup example cards
        this.setupExampleCards();
    }
    
    setupExampleCards() {
        const exampleCards = document.querySelectorAll('.ftue-example-card');
        exampleCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCardClick(card);
            });
        });
    }
    
    show() {
        if (!this.modal) {
            console.error('FTUE modal element is null!');
            return;
        }
        
        console.log('Showing FTUE modal');
        this.modal.classList.remove('hidden');
        this.reset();
        // Re-setup cards in case DOM was modified
        setTimeout(() => {
            this.setupExampleCards();
        }, 100);
    }
    
    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            localStorage.setItem(gameConfig.ftue.localStorageKey, 'true');
            this.reset();
        }
    }
    
    reset() {
        const exampleCards = document.querySelectorAll('.ftue-example-card');
        exampleCards.forEach(card => {
            card.classList.remove('ftue-flipped', 'ftue-matched');
            const cardInner = card.querySelector('.ftue-example-card-inner');
            if (cardInner) {
                cardInner.style.transform = '';
            }
            
            const cardFront = card.querySelector('.ftue-example-card-front');
            if (cardFront) {
                const cardType = card.dataset.ftueCard;
                const cardColor = card.dataset.ftueColor;
                const cardName = card.dataset.ftueName;
                
                cardFront.style.background = '';
                cardFront.style.color = '';
                cardFront.textContent = '';
                
                if (cardType === 'color') {
                    cardFront.style.background = cardColor;
                } else {
                    cardFront.style.background = '#ffffff';
                    cardFront.style.color = '#312e2b';
                    cardFront.textContent = cardName;
                }
            }
        });
        
        this.flippedCards = [];
        this.isProcessing = false;
        
        if (this.exampleText) {
            this.exampleText.textContent = 'Click the cards to flip them and find the match!';
        }
        
        if (this.gotItBtn) {
            this.gotItBtn.disabled = true;
        }
    }
    
    handleCardClick(cardElement) {
        if (this.isProcessing) return;
        
        if (cardElement.classList.contains('ftue-flipped') || 
            cardElement.classList.contains('ftue-matched')) {
            return;
        }
        
        if (this.flippedCards.length >= 2) return;
        
        cardElement.classList.add('ftue-flipped');
        this.flippedCards.push(cardElement);
        soundManager.playFlipSound();
        
        if (this.flippedCards.length === 2) {
            this.isProcessing = true;
            setTimeout(() => {
                this.checkMatch();
            }, gameConfig.timings.flipAnimation);
        }
    }
    
    checkMatch() {
        const [first, second] = this.flippedCards;
        const firstColor = first.dataset.ftueColor;
        const firstName = first.dataset.ftueName;
        const secondColor = second.dataset.ftueColor;
        const secondName = second.dataset.ftueName;
        
        const isMatch = firstColor === secondColor && firstName === secondName;
        
        if (isMatch) {
            soundManager.playMatchSound();
            
            const color = firstColor;
            const textColor = getTextColor(color);
            
            setTimeout(() => {
                [first, second].forEach(cardEl => {
                    const cardFront = cardEl.querySelector('.ftue-example-card-front');
                    if (cardFront) {
                        cardFront.style.background = color;
                        cardFront.style.color = textColor;
                        cardFront.textContent = firstName;
                    }
                });
                
                first.classList.add('ftue-matched');
                second.classList.add('ftue-matched');
                first.classList.remove('ftue-flipped');
                second.classList.remove('ftue-flipped');
                
                if (this.exampleText) {
                    this.exampleText.textContent = 'Perfect! These two cards match!';
                }
                
                if (this.gotItBtn) {
                    this.gotItBtn.disabled = false;
                }
                
                this.flippedCards = [];
                this.isProcessing = false;
            }, gameConfig.timings.matchDelay);
        } else {
            soundManager.playNoMatchSound();
            setTimeout(() => {
                first.classList.remove('ftue-flipped');
                second.classList.remove('ftue-flipped');
                this.flippedCards = [];
                this.isProcessing = false;
            }, gameConfig.timings.noMatchDelay);
        }
    }
    
    static hasSeenFTUE() {
        return !!localStorage.getItem(gameConfig.ftue.localStorageKey);
    }
}

