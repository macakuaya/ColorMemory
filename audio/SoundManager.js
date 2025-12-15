/**
 * Sound Manager
 * Handles all audio effects for the game
 */
import { gameConfig } from '../config/gameConfig.js';

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = gameConfig.sounds.enabled;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (!this.audioContext && this.enabled) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * Play a sound with specified parameters
     */
    playSound(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    /**
     * Play card flip sound
     */
    playFlipSound() {
        const { flipFrequency } = gameConfig.sounds;
        this.playSound(flipFrequency, 0.1, 'sine', 0.2);
    }

    /**
     * Play match success sound
     */
    playMatchSound() {
        const { matchNotes } = gameConfig.sounds;
        matchNotes.forEach((freq, i) => {
            setTimeout(() => {
                this.playSound(freq, 0.15, 'sine', 0.25);
            }, i * 50);
        });
    }

    /**
     * Play no match sound
     */
    playNoMatchSound() {
        const { noMatchNotes } = gameConfig.sounds;
        noMatchNotes.forEach((freq, i) => {
            setTimeout(() => {
                this.playSound(freq, 0.2, 'sine', 0.15);
            }, i * 100);
        });
    }

    /**
     * Play win sound
     */
    playWinSound() {
        const { winNotes } = gameConfig.sounds;
        winNotes.forEach((freq, i) => {
            setTimeout(() => {
                this.playSound(freq, 0.2, 'sine', 0.3);
            }, i * 80);
        });
    }
}

// Export singleton instance
export const soundManager = new SoundManager();


