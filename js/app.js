/**
 * app.js - Main application entry point with enhanced initialization
 * This file handles the startup sequence and module loading for the RoV Draft Helper
 */

// Main initialization function for the application
const App = (() => {
  /**
   * Initialize the application
   * Coordinates the loading sequence of all modules and components
   */
  async function init() {
    try {
      console.log('Initializing RoV Draft Helper...');
      
      // Show loading overlay for better UX during initialization
      showLoading();
      
      // Check if it's the first time running the app
      const isFirstRun = !localStorage.getItem('rovHeroData');
      console.log('Is first run?', isFirstRun);
      
      // Handle first-time setup
      if (isFirstRun) {
        await setupFirstRun();
      }
      
      // Initialize modules in proper sequence with better error handling
      await initializeModules();
      
      // Hide loading overlay
      hideLoading();
      
      console.log('RoV Draft Helper initialized successfully!');
    } catch (error) {
      handleInitializationError(error);
    }
  }
  
  /**
   * Show loading overlay
   */
  function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }
  }
  
  /**
   * Hide loading overlay
   */
  function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }
  
  /**
   * Set up default data and settings for first-time users
   */
  async function setupFirstRun() {
    console.log('First run - setting default settings');
    
    // Set default format
    localStorage.setItem('rovDefaultFormat', 'ranking');
    
    // Initialize with default hero data if none exists
    if (!localStorage.getItem('rovHeroData')) {
      const DEFAULT_HERO_DATA = {
        Assassin: ['Airi', 'Butterfly', 'Keera', 'Murad', 'Nakroth', 'Quillen', 'Wukong', 'Zuka'],
        Fighter: ['Allain', 'Arthur', 'Astrid', 'Florentino', 'Lu Bu', 'Omen', 'Qi', 'Riktor', 'Valhein', 'Yena'],
        Mage: ['Azzen\'Ka', 'Dirak', 'Ignis', 'Ilumia', 'Kahlii', 'Krixi', 'Lauriel', 'Liliana', 'Natalya', 'Tulen', 'Zata'],
        Carry: ['Capheny', 'Elsu', 'Laville', 'Lindis', 'Slimz', 'Tel\'Annas', 'Thorne', 'Violet', 'Wisp', 'Yorn'],
        Support: ['Alice', 'Annette', 'Chaugnar', 'Enzo', 'Ishar', 'Krizzix', 'Lumburr', 'Rouie', 'Zip'],
        Tank: ['Arum', 'Baldum', 'Grakk', 'Moren', 'Omega', 'Ormarr', 'Roxie', 'Skud', 'Thane', 'Y\'bneth']
      };
      
      localStorage.setItem('rovHeroData', JSON.stringify(DEFAULT_HERO_DATA));
      console.log('Initialized default hero data');
      
      // Create empty hero images object
      localStorage.setItem('rovHeroImages', JSON.stringify({}));
      console.log('Initialized empty hero images');
    }
    
    // Initialize with default match data if none exists
    if (!localStorage.getItem('rovMatchData')) {
      const DEFAULT_MATCH_DATA = [
        {
          date: "2025-01-15",
          tournament: "RoV Pro League 2025 Summer Group Stage",
          team1: "Team Flash",
          team2: "Buriram United Esports",
          picks1: ["Florentino", "Valhein", "Tulen", "Alice", "Thane"],
          picks2: ["Riktor", "Violet", "Zata", "Zip", "Ormarr"],
          bans1: ["Keera", "Capheny"],
          bans2: ["Airi", "Laville"],
          winner: "Team Flash"
        },
        {
          date: "2025-01-20",
          tournament: "RoV Pro League 2025 Summer Group Stage",
          team1: "Bacon Time",
          team2: "King of Gamers Club",
          picks1: ["Airi", "Capheny", "Liliana", "Enzo", "Lumburr"],
          picks2: ["Florentino", "Elsu", "Dirak", "Krizzix", "Grakk"],
          bans1: ["Keera", "Yena"],
          bans2: ["Riktor", "Laville"],
          winner: "King of Gamers Club"
        }
      ];
      
      localStorage.setItem('rovMatchData', JSON.stringify(DEFAULT_MATCH_DATA));
      console.log('Initialized default match data');
    }
  }
  
  /**
   * Initialize all modules in proper sequence
   * Uses Promise chaining to ensure proper initialization order
   */
  async function initializeModules() {
    // Initialize DataManager first since other modules depend on it
    try {
      console.log('Initializing DataManager...');
      if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
        await DataManager.init();
        console.log('DataManager initialized successfully');
      } else {
        console.warn('DataManager not available or missing init function');
      }
    } catch (dataError) {
      console.error('Error initializing DataManager:', dataError);
      // Continue initialization despite errors
    }
    
    // Initialize AnalyticsManager next
    try {
      console.log('Initializing AnalyticsManager...');
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.init === 'function') {
        await AnalyticsManager.init();
        console.log('AnalyticsManager initialized successfully');
      } else {
        console.warn('AnalyticsManager not available or missing init function');
      }
    } catch (analyticsError) {
      console.error('Error initializing AnalyticsManager:', analyticsError);
    }
    
    // Initialize UI components
    try {
      console.log('Initializing UIManager...');
      if (typeof UIManager !== 'undefined' && typeof UIManager.init === 'function') {
        await UIManager.init();
        console.log('UIManager initialized successfully');
      } else {
        console.warn('UIManager not available or missing init function');
      }
    } catch (uiError) {
      console.error('Error initializing UIManager:', uiError);
    }
    
    // Initialize HeroManager component
    try {
      console.log('Initializing HeroManager...');
      if (typeof HeroManager !== 'undefined' && typeof HeroManager.init === 'function') {
        HeroManager.init();
        console.log('HeroManager initialized successfully');
      } else {
        console.warn('HeroManager not available');
      }
    } catch (heroError) {
      console.error('Error initializing HeroManager:', heroError);
    }
    
    // Initialize HeroSelectionController component
    try {
      console.log('Initializing HeroSelectionController...');
      if (typeof HeroSelectionController !== 'undefined' && typeof HeroSelectionController.init === 'function') {
        HeroSelectionController.init();
        console.log('HeroSelectionController initialized successfully');
      } else {
        console.warn('HeroSelectionController not available');
      }
    } catch (selectionError) {
      console.error('Error initializing HeroSelectionController:', selectionError);
    }
    
    // Initialize MatchesUI component
    try {
      console.log('Initializing MatchesUI...');
      if (typeof MatchesUI !== 'undefined' && typeof MatchesUI.init === 'function') {
        await MatchesUI.init();
        console.log('MatchesUI initialized successfully');
      } else {
        console.warn('MatchesUI not available');
      }
    } catch (matchesError) {
      console.error('Error initializing MatchesUI:', matchesError);
    }
  }
  
  /**
   * Handle initialization errors and show appropriate messages
   * @param {Error} error - The error that occurred during initialization
   */
  function handleInitializationError(error) {
    console.error('Critical Error initializing application:', error);
    
    // Hide loading overlay even on error
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
    
    // Show error message to user
    alert('An error occurred while loading the application. Please try again.');
  }
  
  // Return public API
  return {
    init
  };
})();

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init().catch(error => {
    console.error('Uncaught error during application initialization:', error);
  });
});