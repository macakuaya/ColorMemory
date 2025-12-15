// All 69 colors from the book
const allColors = [
    // Whites & Neutrals
    { name: "Lead white", hex: "#F5F5F0" },
    { name: "Ivory", hex: "#FFFFF0" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Whitewash", hex: "#F8F8F0" },
    { name: "Isabelline", hex: "#F4F0EC" },
    { name: "Chalk", hex: "#F7F7F7" },
    { name: "Beige", hex: "#F5F5DC" },
    
    // Yellows
    { name: "Blonde", hex: "#FAF0BE" },
    { name: "Lead-tin yellow", hex: "#F4D03F" },
    { name: "Indian yellow", hex: "#E3A857" },
    { name: "Acid yellow", hex: "#EFFF00" },
    { name: "Naples yellow", hex: "#FADA5E" },
    { name: "Chrome yellow", hex: "#FFA700" },
    { name: "Gamboge", hex: "#E49B0F" },
    { name: "Orpiment", hex: "#EDC9AF" },
    { name: "Imperial yellow", hex: "#FFB300" },
    { name: "Gold", hex: "#FFD700" },
    
    // Oranges
    { name: "Dutch orange", hex: "#FF6600" },
    { name: "Saffron", hex: "#F4C430" },
    { name: "Amber", hex: "#FFBF00" },
    { name: "Ginger", hex: "#B06500" },
    { name: "Minium", hex: "#E34234" },
    { name: "Nude", hex: "#E3BC9A" },
    
    // Pinks
    { name: "Baker-Miller pink", hex: "#FF91AF" },
    { name: "Mountbatten pink", hex: "#997A8D" },
    { name: "Puce", hex: "#CC8899" },
    { name: "Fuchsia", hex: "#FF00FF" },
    { name: "Shocking pink", hex: "#FC0FC0" },
    { name: "Fluorescent pink", hex: "#FF1493" },
    { name: "Amaranth", hex: "#E52B50" },
    
    // Reds
    { name: "Scarlet", hex: "#FF2400" },
    { name: "Cochineal", hex: "#9D2933" },
    { name: "Vermilion", hex: "#E34234" },
    { name: "Rosso corsa", hex: "#DC143C" },
    { name: "Hematite", hex: "#7E2639" },
    { name: "Madder", hex: "#A50021" },
    { name: "Dragon's blood", hex: "#B22222" },
    
    // Purples
    { name: "Tyrian purple", hex: "#66023C" },
    { name: "Orchil", hex: "#B794F6" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Mauve", hex: "#E0B0FF" },
    { name: "Heliotrope", hex: "#DF73FF" },
    { name: "Violet", hex: "#8B00FF" },
    
    // Blues
    { name: "Ultramarine", hex: "#120A8F" },
    { name: "Cobalt", hex: "#0047AB" },
    { name: "Indigo", hex: "#4B0082" },
    { name: "Prussian blue", hex: "#003153" },
    { name: "Egyptian blue", hex: "#1034A6" },
    { name: "Woad", hex: "#4C516D" },
    { name: "Electric blue", hex: "#7DF9FF" },
    { name: "Cerulean", hex: "#007BA7" },
    
    // Greens
    { name: "Verdigris", hex: "#43B3AE" },
    { name: "Absinthe", hex: "#7FDD4C" },
    { name: "Emerald", hex: "#50C878" },
    { name: "Kelly green", hex: "#4CBB17" },
    { name: "Scheele's green", hex: "#478778" },
    { name: "Terre verte", hex: "#8A9A5B" },
    { name: "Avocado", hex: "#568203" },
    { name: "Celadon", hex: "#ACE1AF" },
    
    // Browns & Earth Tones
    { name: "Khaki", hex: "#C3B091" },
    { name: "Buff", hex: "#F0DC82" },
    { name: "Fallow", hex: "#C19A6B" },
    { name: "Russet", hex: "#80461B" },
    { name: "Sepia", hex: "#704214" },
    { name: "Umber", hex: "#635147" },
    { name: "Mummy", hex: "#8B7355" },
    { name: "Taupe", hex: "#483C32" },
    
    // Blacks & Dark Grays
    { name: "Kohl", hex: "#2C1810" },
    { name: "Payne's grey", hex: "#536878" },
    { name: "Obsidian", hex: "#0B0B0B" },
    { name: "Ink", hex: "#1B1B1B" },
    { name: "Charcoal", hex: "#36454F" },
    { name: "Jet", hex: "#343434" },
    { name: "Melanin", hex: "#1C1C1C" },
    { name: "Pitch black", hex: "#000000" }
];

// Game state
let selectedColors = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isProcessing = false;
let activeTimeouts = []; // Track active timeouts to cancel on reset
let gameInstanceId = 0; // Track game instances to prevent stale callbacks

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const newGameBtn = document.getElementById('new-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winMessage = document.getElementById('win-message');
const finalMovesDisplay = document.getElementById('final-moves');
const ftueModal = document.getElementById('ftue-modal');
const ftueCloseBtn = document.getElementById('ftue-close-btn');
const ftueGotItBtn = document.getElementById('ftue-got-it-btn');
const ftueModalOverlay = document.querySelector('.ftue-modal-overlay');

// Initialize game
function initGame() {
    // Increment game instance ID to invalidate any pending callbacks
    gameInstanceId++;
    // Cancel all active timeouts to prevent race conditions
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts = [];
    // Reset game state
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    isProcessing = false;
    cards = [];
    
    // Randomly select 8 colors (4x4 grid = 16 positions, 16 cards = 8 pairs)
    const shuffled = [...allColors].sort(() => Math.random() - 0.5);
    selectedColors = shuffled.slice(0, 8);
    
    // Create cards: 32 color swatches + 32 color names
    cards = [];
    selectedColors.forEach(color => {
        // Color swatch card
        cards.push({
            type: 'color',
            color: color,
            id: `color-${color.name}`
        });
        // Color name card
        cards.push({
            type: 'name',
            color: color,
            id: `name-${color.name}`
        });
    });
    
    // Shuffle all cards
    cards = cards.sort(() => Math.random() - 0.5);
    
    // Render board
    renderBoard();
    updateDisplay();
    winMessage.classList.add('hidden');
}

// Render the game board
function renderBoard() {
    gameBoard.innerHTML = '';
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.colorName = card.color.name;
        
        if (card.type === 'color') {
            cardElement.classList.add('color-card');
            cardElement.style.setProperty('--card-color', card.color.hex);
            
            // Determine text color based on brightness
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
        
        cardElement.addEventListener('click', () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
    });
}

// Calculate brightness of a color to determine text color
function getBrightness(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Handle card click
function handleCardClick(index) {
    if (isProcessing) return;
    
    const card = cards[index];
    const cardElement = gameBoard.children[index];
    
    // Don't allow clicking already flipped or matched cards
    if (cardElement.classList.contains('flipped') || 
        cardElement.classList.contains('matched')) {
        return;
    }
    
    // Don't allow clicking more than 2 cards
    if (flippedCards.length >= 2) return;
    
    // Flip the card
    cardElement.classList.add('flipped');
    flippedCards.push({ index, card, element: cardElement });
    
    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateDisplay();
        checkMatch();
    }
}

// Check if the two flipped cards match
function checkMatch() {
    isProcessing = true;
    
    const [first, second] = flippedCards;
    
    // Match if they have the same color name but different types
    const isMatch = first.card.color.name === second.card.color.name && 
                    first.card.type !== second.card.type;
    
    if (isMatch) {
        // Match found! Wait for flip animation to finish, then show match state instantly
        const color = first.card.color;
        const brightness = getBrightness(color.hex);
        const textColor = brightness > 128 ? '#312e2b' : '#ffffff';
        
        // Mark cards as matched immediately
        first.element.classList.add('matched');
        second.element.classList.add('matched');
        
        // Wait for flip animation to finish (500ms), then show match state instantly
        const currentInstanceId = gameInstanceId;
        const matchTimeoutId = setTimeout(() => {
            // Check if game was reset (instance changed or DOM invalid)
            if (gameInstanceId !== currentInstanceId || cards.length === 0 || !first.element.parentNode || !second.element.parentNode) {
                return;
            }
            
            [first.element, second.element].forEach(cardEl => {
                const cardFront = cardEl.querySelector('.card-front');
                if (cardFront) {
                    cardFront.classList.add('matched-text');
                    // No transition - instant change
                    cardFront.style.transition = 'none';
                    cardFront.style.background = color.hex;
                    cardFront.style.color = textColor;
                    cardFront.textContent = color.name;
                }
            });
            
            // Complete the match
            flippedCards = [];
            matchedPairs++;
            updateDisplay();
            isProcessing = false;
            
            // Check for win
            if (matchedPairs === 8 && cards.length > 0) {
                const winInstanceId = gameInstanceId;
                const winTimeoutId = setTimeout(() => {
                    if (gameInstanceId === winInstanceId && cards.length > 0) {
                        showWinMessage();
                    }
                }, 500);
                activeTimeouts.push(winTimeoutId);
            }
        }, 500); // Wait for flip animation (500ms)
        activeTimeouts.push(matchTimeoutId);
    } else {
        // No match - flip back
        const currentInstanceId = gameInstanceId;
        const noMatchTimeoutId = setTimeout(() => {
            // Check if game was reset (instance changed or DOM invalid)
            if (gameInstanceId !== currentInstanceId || cards.length === 0 || !first.element.parentNode || !second.element.parentNode) {
                return;
            }
            
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            flippedCards = [];
            isProcessing = false;
        }, 1000);
        activeTimeouts.push(noMatchTimeoutId);
    }
}

// Update display
function updateDisplay() {
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matchedPairs;
}

// Show win message
function showWinMessage() {
    finalMovesDisplay.textContent = moves;
    winMessage.classList.remove('hidden');
}

// FTUE Modal functions
let ftueFlippedCards = [];
let ftueIsProcessing = false;

function showFTUEModal() {
    if (ftueModal) {
        ftueModal.classList.remove('hidden');
        // Reset example cards
        resetFTUEExample();
        // Set up event listeners for example cards
        setTimeout(() => {
            setupFTUEExampleCards();
        }, 100);
    }
}

function hideFTUEModal() {
    if (ftueModal) {
        ftueModal.classList.add('hidden');
        // Save to localStorage that user has seen the modal
        localStorage.setItem('colorMemoryFTUESeen', 'true');
        // Reset example cards
        resetFTUEExample();
    }
}

function resetFTUEExample() {
    const exampleCards = document.querySelectorAll('.ftue-example-card');
    exampleCards.forEach(card => {
        card.classList.remove('ftue-flipped', 'ftue-matched');
        const cardInner = card.querySelector('.ftue-example-card-inner');
        if (cardInner) {
            // Remove inline transform to let CSS handle it
            cardInner.style.transform = '';
        }
        // Reset card front to original state
        const cardFront = card.querySelector('.ftue-example-card-front');
        if (cardFront) {
            const cardType = card.dataset.ftueCard;
            const cardColor = card.dataset.ftueColor;
            const cardName = card.dataset.ftueName;
            
            // Clear inline styles that might interfere
            cardFront.style.background = '';
            cardFront.style.color = '';
            cardFront.textContent = '';
            
            if (cardType === 'color') {
                // Color card: show just the color background, no text
                cardFront.style.background = cardColor;
            } else {
                // Name card: show white background with text
                cardFront.style.background = '#ffffff';
                cardFront.style.color = '#312e2b';
                cardFront.textContent = cardName;
            }
        }
    });
    ftueFlippedCards = [];
    ftueIsProcessing = false;
    
    const exampleText = document.getElementById('ftue-example-text');
    if (exampleText) {
        exampleText.textContent = 'Click the cards to flip them and find the match!';
    }
    
    // Disable the "Got it!" button
    if (ftueGotItBtn) {
        ftueGotItBtn.disabled = true;
    }
}

function handleFTUECardClick(cardElement) {
    if (ftueIsProcessing) return;
    
    // Don't allow clicking already flipped or matched cards
    if (cardElement.classList.contains('ftue-flipped') || 
        cardElement.classList.contains('ftue-matched')) {
        return;
    }
    
    // Don't allow clicking more than 2 cards
    if (ftueFlippedCards.length >= 2) return;
    
    // Flip the card
    cardElement.classList.add('ftue-flipped');
    ftueFlippedCards.push(cardElement);
    playFlipSound();
    
    // Check for match when 2 cards are flipped
    if (ftueFlippedCards.length === 2) {
        ftueIsProcessing = true;
        setTimeout(() => {
            checkFTUEMatch();
        }, 500); // Wait for flip animation
    }
}

function checkFTUEMatch() {
    const [first, second] = ftueFlippedCards;
    const firstColor = first.dataset.ftueColor;
    const firstName = first.dataset.ftueName;
    const secondColor = second.dataset.ftueColor;
    const secondName = second.dataset.ftueName;
    
    // Match if they have the same color and name
    const isMatch = firstColor === secondColor && firstName === secondName;
    
    if (isMatch) {
        // Match found!
        playMatchSound();
        
        // Update both cards to show the matched state (wait for flip animation to finish)
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
            
            // Mark as matched after showing the match state
            first.classList.add('ftue-matched');
            second.classList.add('ftue-matched');
            first.classList.remove('ftue-flipped');
            second.classList.remove('ftue-flipped');
            
            // Update text
            const exampleText = document.getElementById('ftue-example-text');
            if (exampleText) {
                exampleText.textContent = 'Perfect! These two cards match!';
            }
            
            // Enable the "Got it!" button
            if (ftueGotItBtn) {
                ftueGotItBtn.disabled = false;
            }
            
            ftueFlippedCards = [];
            ftueIsProcessing = false;
        }, 500); // Wait for flip animation to finish
    } else {
        // No match - flip back
        playNoMatchSound();
        setTimeout(() => {
            first.classList.remove('ftue-flipped');
            second.classList.remove('ftue-flipped');
            ftueFlippedCards = [];
            ftueIsProcessing = false;
        }, 1000);
    }
}

function checkFTUE() {
    // Check if user has seen the FTUE modal before
    const hasSeenFTUE = localStorage.getItem('colorMemoryFTUESeen');
    if (!hasSeenFTUE) {
        // Show modal after a short delay for better UX
        setTimeout(() => {
            showFTUEModal();
        }, 300);
    }
}

// Event listeners
newGameBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// FTUE Modal event listeners
if (ftueCloseBtn) {
    ftueCloseBtn.addEventListener('click', hideFTUEModal);
}

if (ftueGotItBtn) {
    ftueGotItBtn.addEventListener('click', hideFTUEModal);
}

if (ftueModalOverlay) {
    ftueModalOverlay.addEventListener('click', hideFTUEModal);
}

// FTUE Example cards interactivity
document.addEventListener('DOMContentLoaded', () => {
    const exampleCards = document.querySelectorAll('.ftue-example-card');
    exampleCards.forEach(card => {
        card.addEventListener('click', () => handleFTUECardClick(card));
    });
});

// Also set up listeners after modal is shown (in case DOMContentLoaded already fired)
function setupFTUEExampleCards() {
    const exampleCards = document.querySelectorAll('.ftue-example-card');
    exampleCards.forEach(card => {
        // Remove any existing event listeners by cloning (without listeners)
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        // Add click listener
        newCard.addEventListener('click', (e) => {
            e.stopPropagation();
            handleFTUECardClick(newCard);
        });
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ftueModal && !ftueModal.classList.contains('hidden')) {
        hideFTUEModal();
    }
});

// Start the game
initGame();

// Check and show FTUE modal if needed
checkFTUE();

