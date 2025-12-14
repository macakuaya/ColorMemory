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

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const newGameBtn = document.getElementById('new-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winMessage = document.getElementById('win-message');
const finalMovesDisplay = document.getElementById('final-moves');

// Initialize game
function initGame() {
    // Reset game state
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    isProcessing = false;
    cards = [];
    
    // Randomly select 4 colors for testing (3x3 grid = 9 positions, 8 cards = 4 pairs)
    const shuffled = [...allColors].sort(() => Math.random() - 0.5);
    selectedColors = shuffled.slice(0, 4);
    
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
        // Match found!
        setTimeout(() => {
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            
            // Update matched cards to show color + name
            const color = first.card.color;
            const brightness = getBrightness(color.hex);
            const textColor = brightness > 128 ? '#312e2b' : '#ffffff';
            
            // Update both cards to show the same: color background + name
            [first.element, second.element].forEach(cardEl => {
                const cardFront = cardEl.querySelector('.card-front');
                if (cardFront) {
                    cardFront.style.background = color.hex;
                    cardFront.style.color = textColor;
                    cardFront.textContent = color.name;
                    cardFront.classList.add('matched-text');
                }
            });
            
            flippedCards = [];
            matchedPairs++;
            updateDisplay();
            isProcessing = false;
            
            // Check for win
            if (matchedPairs === 4) {
                setTimeout(showWinMessage, 500);
            }
        }, 500);
    } else {
        // No match - flip back
        setTimeout(() => {
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            flippedCards = [];
            isProcessing = false;
        }, 1000);
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

// Event listeners
newGameBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start the game
initGame();

