/**
 * FTUE (First Time User Experience) Modal
 * Interactive tutorial modal with example cards
 */
import { gameConfig } from '../config/gameConfig.js';
import { getBrightness } from '../utils/colorUtils.js';
import { soundManager } from '../audio/SoundManager.js';

export class FTUEModal {
    constructor(modalElement) {
        this.modal = modalElement;
        this.flippedCards = [];
        this.isProcessing = false;
        this.exampleColor = { name: 'Coral', hex: '#FF6B6B', lore: 'Coral, the color of the ocean\'s living gems, represents the vibrant ecosystems beneath the waves.' };
        
        this.init();
    }

    /**
     * Initialize modal
     */
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.resetExample();
    }

    /**
     * Setup DOM element references
     */
    setupElements() {
        this.closeBtn = this.modal.querySelector('#ftue-close-btn');
        this.gotItBtn = this.modal.querySelector('#ftue-got-it-btn');
        this.overlay = this.modal.querySelector('.ftue-modal-overlay');
        this.exampleText = this.modal.querySelector('#ftue-example-text');
        this.exampleCards = this.modal.querySelectorAll('.ftue-example-card');
    }

    /**
     * Setup event listeners
     */
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
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.isHidden()) {
                this.hide();
            }
        });
        
        // Example card clicks
        this.exampleCards.forEach(card => {
            card.addEventListener('click', () => this.handleCardClick(card));
        });
    }

    /**
     * Show modal
     */
    show() {
        this.modal.classList.remove('hidden');
        this.resetExample();
        this.setupExampleCards();
    }

    /**
     * Hide modal
     */
    hide() {
        this.modal.classList.add('hidden');
        localStorage.setItem(gameConfig.ftue.localStorageKey, 'true');
        this.resetExample();
    }

    /**
     * Check if modal is hidden
     */
    isHidden() {
        return this.modal.classList.contains('hidden');
    }

    /**
     * Check if user has seen FTUE
     */
    static hasSeenFTUE() {
        return localStorage.getItem(gameConfig.ftue.localStorageKey) === 'true';
    }

    /**
     * Reset example cards
     */
    resetExample() {
        this.flippedCards = [];
        this.isProcessing = false;
        
        this.exampleCards.forEach(card => {
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
        
        if (this.exampleText) {
            this.exampleText.textContent = 'Click the cards to flip them and find the match!';
        }
        
        if (this.gotItBtn) {
            this.gotItBtn.disabled = true;
        }
    }

    /**
     * Setup example cards (re-attach listeners after reset)
     */
    setupExampleCards() {
        this.exampleCards.forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            newCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCardClick(newCard);
            });
        });
        this.exampleCards = this.modal.querySelectorAll('.ftue-example-card');
    }

    /**
     * Handle card click
     */
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
            }, gameConfig.animations.cardFlip);
        }
    }

    /**
     * Check if flipped cards match
     */
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
            const brightness = getBrightness(color);
            const textColor = brightness > 128 ? '#312e2b' : '#ffffff';
            
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
            }, gameConfig.animations.matchDelay);
        } else {
            soundManager.playNoMatchSound();
            setTimeout(() => {
                first.classList.remove('ftue-flipped');
                second.classList.remove('ftue-flipped');
                this.flippedCards = [];
                this.isProcessing = false;
            }, gameConfig.animations.noMatchDelay);
        }
    }
}


