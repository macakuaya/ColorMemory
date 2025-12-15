/**
 * Progress Bar Component
 * Vertical rainbow spectrogram showing matched colors with tooltips
 */
import { gameConfig } from '../config/gameConfig.js';
import { getTextColor } from '../utils/colorUtils.js';

export class ProgressBar {
    constructor(containerElement, totalColors) {
        this.container = containerElement;
        this.totalColors = totalColors;
        this.matchedColors = [];
        this.tooltip = null;
        this.currentHoverIndex = -1;
        
        this.init();
    }

    /**
     * Initialize the progress bar
     */
    init() {
        this.container.innerHTML = '';
        this.container.className = 'progress-bar-container';
        
        // Create the bar
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.style.width = `${gameConfig.progressBar.width}px`;
        
        // Create segments container
        const segmentsContainer = document.createElement('div');
        segmentsContainer.className = 'progress-bar-segments';
        bar.appendChild(segmentsContainer);
        
        // Create empty segments
        for (let i = 0; i < this.totalColors; i++) {
            const segment = document.createElement('div');
            segment.className = 'progress-bar-segment';
            segment.dataset.index = i;
            segment.style.height = `${100 / this.totalColors}%`;
            segment.style.marginBottom = `${gameConfig.progressBar.segmentGap}px`;
            
            // Add hover events
            segment.addEventListener('mouseenter', (e) => this.showTooltip(e, i));
            segment.addEventListener('mouseleave', () => this.hideTooltip());
            
            segmentsContainer.appendChild(segment);
        }
        
        this.container.appendChild(bar);
        this.segmentsContainer = segmentsContainer;
        
        // Create tooltip
        this.createTooltip();
    }

    /**
     * Create tooltip element
     */
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'progress-bar-tooltip hidden';
        this.container.appendChild(this.tooltip);
    }

    /**
     * Add a matched color
     */
    addMatchedColor(color) {
        this.matchedColors.push(color);
        const index = this.matchedColors.length - 1;
        this.updateSegment(index, color);
        this.animateSegment(index);
    }

    /**
     * Update a segment with color
     */
    updateSegment(index, color) {
        const segments = this.segmentsContainer.querySelectorAll('.progress-bar-segment');
        const segment = segments[index];
        
        if (segment) {
            segment.style.background = color.hex;
            segment.dataset.colorName = color.name;
            segment.dataset.colorHex = color.hex;
            segment.dataset.colorLore = color.lore;
            segment.classList.add('filled');
        }
    }

    /**
     * Animate segment appearance
     */
    animateSegment(index) {
        const segments = this.segmentsContainer.querySelectorAll('.progress-bar-segment');
        const segment = segments[index];
        
        if (segment) {
            segment.style.opacity = '0';
            segment.style.transform = 'scaleY(0)';
            segment.style.transformOrigin = 'bottom';
            
            requestAnimationFrame(() => {
                segment.style.transition = `all ${gameConfig.progressBar.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
                segment.style.opacity = '1';
                segment.style.transform = 'scaleY(1)';
            });
        }
    }

    /**
     * Show tooltip on hover
     */
    showTooltip(event, index) {
        if (index >= this.matchedColors.length) return;
        
        const color = this.matchedColors[index];
        if (!color) return;
        
        this.currentHoverIndex = index;
        const segment = event.currentTarget;
        const rect = segment.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        // Update tooltip content
        this.tooltip.innerHTML = `
            <div class="tooltip-title">${color.name}</div>
            <div class="tooltip-hex">${color.hex}</div>
            <div class="tooltip-lore">${color.lore}</div>
        `;
        
        // Position tooltip
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const segmentCenterY = rect.top + rect.height / 2;
        
        // Position to the right of the bar
        this.tooltip.style.left = `${rect.right - containerRect.left + gameConfig.progressBar.tooltipOffset}px`;
        this.tooltip.style.top = `${segmentCenterY - tooltipRect.height / 2}px`;
        
        // Show tooltip
        this.tooltip.classList.remove('hidden');
        
        // Add arrow pointing to segment
        this.updateTooltipArrow(segmentCenterY - containerRect.top);
    }

    /**
     * Update tooltip arrow position
     */
    updateTooltipArrow(arrowTop) {
        // Remove existing arrow
        const existingArrow = this.tooltip.querySelector('.tooltip-arrow');
        if (existingArrow) {
            existingArrow.remove();
        }
        
        // Create arrow
        const arrow = document.createElement('div');
        arrow.className = 'tooltip-arrow';
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        const relativeTop = arrowTop - (tooltipRect.top - containerRect.top);
        arrow.style.top = `${relativeTop}px`;
        this.tooltip.appendChild(arrow);
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.classList.add('hidden');
        this.currentHoverIndex = -1;
    }

    /**
     * Reset progress bar
     */
    reset() {
        this.matchedColors = [];
        const segments = this.segmentsContainer.querySelectorAll('.progress-bar-segment');
        segments.forEach(segment => {
            segment.style.background = '';
            segment.style.opacity = '1';
            segment.style.transform = 'scaleY(1)';
            segment.classList.remove('filled');
            delete segment.dataset.colorName;
            delete segment.dataset.colorHex;
            delete segment.dataset.colorLore;
        });
        this.hideTooltip();
    }

    /**
     * Get current progress percentage
     */
    getProgress() {
        return (this.matchedColors.length / this.totalColors) * 100;
    }
}

