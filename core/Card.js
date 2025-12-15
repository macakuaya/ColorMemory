/**
 * Card Model
 * Represents a single card in the game
 */
export class Card {
    constructor(type, color, id) {
        this.type = type; // 'color' or 'name'
        this.color = color; // Color object with name, hex, lore
        this.id = id; // Unique identifier
    }

    /**
     * Check if this card matches another card
     */
    matches(otherCard) {
        return this.color.name === otherCard.color.name && 
               this.type !== otherCard.type;
    }

    /**
     * Create a color card
     */
    static createColorCard(color) {
        return new Card('color', color, `color-${color.name}`);
    }

    /**
     * Create a name card
     */
    static createNameCard(color) {
        return new Card('name', color, `name-${color.name}`);
    }

    /**
     * Create pairs of cards for a color
     */
    static createPairs(colors) {
        const cards = [];
        colors.forEach(color => {
            cards.push(Card.createColorCard(color));
            cards.push(Card.createNameCard(color));
        });
        return cards;
    }
}


