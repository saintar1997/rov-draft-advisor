/**
 * app.js - Main application entry point
 * Initializes all modules and manages the application lifecycle
 */

// Application modules
import DataManager from './data/data-manager.js';
import AnalyticsManager from './analytics/analytics-manager.js';
import UIManager from './ui/ui-manager.js';
import HeroManager from './heroes/hero-manager.js';
import HeroSelectionController from './heroes/hero-selection-controller.js';

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing RoV Draft Helper...');
        
        // Show loading overlay
        showLoadingOverlay();
        
        // Check if it's the first time running the app
        const isFirstRun = !localStorage.getItem('rovHeroData');
        console.log('Is first run?', isFirstRun);
        
        // Handle first run setup
        if (isFirstRun) {
            await handleFirstRun();
        } else {
            console.log('Not first run - using existing data');
        }
        
        // Initialize modules in proper sequence
        await initializeModules();
        
        // Hide loading overlay
        hideLoadingOverlay();
        
        console.log('RoV Draft Helper initialized successfully!');
    } catch (error) {
        handleInitializationError(error);
    }
});

/**
 * Set up default data and settings for first run
 * @returns {Promise} A promise that resolves when setup is complete
 */
async function handleFirstRun() {
    console.log('First run - setting default settings');
    
    // Set default format
    localStorage.setItem('rovDefaultFormat', 'ranking');
    
    // Default hero data will be initialized by DataManager
    console.log('Default settings configured');
    
    return Promise.resolve();
}

/**
 * Initialize all application modules in the correct order
 * @returns {Promise} A promise that resolves when all modules are initialized
 */
async function initializeModules() {
    // Initialize DataManager first as other modules depend on it
    try {
        console.log('Initializing DataManager...');
        await DataManager.init();
        console.log('DataManager initialized successfully');
    } catch (dataError) {
        console.error('Error initializing DataManager:', dataError);
        throw new Error(`DataManager initialization failed: ${dataError.message}`);
    }
    
    // Initialize AnalyticsManager which depends on DataManager
    try {
        console.log('Initializing AnalyticsManager...');
        await AnalyticsManager.init();
        console.log('AnalyticsManager initialized successfully');
    } catch (analyticsError) {
        console.error('Error initializing AnalyticsManager:', analyticsError);
        throw new Error(`AnalyticsManager initialization failed: ${analyticsError.message}`);
    }
    
    // Initialize UIManager which depends on DataManager and AnalyticsManager
    try {
        console.log('Initializing UIManager...');
        await UIManager.init();
        console.log('UIManager initialized successfully');
    } catch (uiError) {
        console.error('Error initializing UIManager:', uiError);
        throw new Error(`UIManager initialization failed: ${uiError.message}`);
    }
    
    // Initialize HeroManager
    try {
        console.log('Initializing HeroManager...');
        if (typeof HeroManager !== 'undefined' && typeof HeroManager.init === 'function') {
            await HeroManager.init();
            console.log('HeroManager initialized successfully');
        } else {
            console.warn('HeroManager not available or init method not found');
        }
    } catch (heroError) {
        console.error('Error initializing HeroManager:', heroError);
        // Non-critical error, continue initialization
    }
    
    // Initialize HeroSelectionController
    try {
        console.log('Initializing HeroSelectionController...');
        if (typeof HeroSelectionController !== 'undefined' && typeof HeroSelectionController.init === 'function') {
            await HeroSelectionController.init();
            console.log('HeroSelectionController initialized successfully');
        } else {
            console.warn('HeroSelectionController not available or init method not found');
        }
    } catch (selectionError) {
        console.error('Error initializing HeroSelectionController:', selectionError);
        // Non-critical error, continue initialization
    }
    
    return Promise.resolve();
}

/**
 * Show the loading overlay
 */
function showLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    } else {
        console.warn('Loading overlay element not found');
    }
}

/**
 * Hide the loading overlay
 */
function hideLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    } else {
        console.warn('Loading overlay element not found');
    }
}

/**
 * Handle initialization errors
 * @param {Error} error - The error that occurred during initialization
 */
function handleInitializationError(error) {
    console.error('Critical Error initializing application:', error);
    
    // Hide loading overlay even on error
    hideLoadingOverlay();
    
    // Show error to user
    alert('เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน กรุณาลองใหม่อีกครั้ง');
    
    // Additional error tracking could be added here
}

// Export app functions if needed
export {
    handleFirstRun,
    initializeModules,
    showLoadingOverlay,
    hideLoadingOverlay
};