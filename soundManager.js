/**
 * Sound Manager
 * Handles all audio effects for the game
 */
import { gameConfig } from './config.js';

class SoundManager {
    constructor() {
        this.audioContext = null;
    }
    
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    /**
     * Play a sound with given parameters
     */
    playSound(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) this.init();
        
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
    }
    
    playFlipSound() {
        const { flipFrequency, flipDuration, flipVolume } = gameConfig.sound;
        this.playSound(flipFrequency, flipDuration, 'sine', flipVolume);
    }
    
    playMatchSound() {
        const { matchNotes, matchNoteDelay, matchNoteDuration, matchVolume } = gameConfig.sound;
        matchNotes.forEach((freq, i) => {
            setTimeout(() => {
                this.playSound(freq, matchNoteDuration, 'sine', matchVolume);
            }, i * matchNoteDelay);
        });
    }
    
    playNoMatchSound() {
        const { noMatchFrequencies, noMatchDelay, noMatchDuration, noMatchVolume } = gameConfig.sound;
        noMatchFrequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playSound(freq, noMatchDuration, 'sine', noMatchVolume);
            }, i * noMatchDelay);
        });
    }
    
    playWinSound() {
        const { winNotes, winNoteDelay, winNoteDuration, winVolume } = gameConfig.sound;
        winNotes.forEach((freq, i) => {
            setTimeout(() => {
                this.playSound(freq, winNoteDuration, 'sine', winVolume);
            }, i * winNoteDelay);
        });
    }
}

// Export singleton instance
export const soundManager = new SoundManager();

