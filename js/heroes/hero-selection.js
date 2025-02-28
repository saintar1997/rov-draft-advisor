/**
 * hero-manager.js
 * Manages hero data and provides methods for hero management
 */

import { HERO_CLASS_COLORS } from '../data/default-data.js';
import DataManager from '../data/data-manager.js';

const HeroManager = (() => {
  // All heroes from all classes
  let allHeroes = [];
  
  // Hero images map (name -> image URL)
  let heroImages = {};

  /**
   * Initialize hero data
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async function init() {
    console.log('Initializing Hero Manager...');
    
    try {
      // Load hero images from localStorage
      try {
        const savedImages = localStorage.getItem('rovHeroImages');
        heroImages = savedImages ? JSON.parse(savedImages) : {};
      } catch (error) {
        console.error('Error loading hero images:', error);
        heroImages = {};
      }
      
      // Get heroes from DataManager
      await loadHeroes();
      
      console.log('Hero Manager initialized with', allHeroes.length, 'heroes');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error initializing Hero Manager:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Load heroes from DataManager
   * @returns {Promise} A promise that resolves when heroes are loaded
   */
  async function loadHeroes() {
    try {
      // Get heroes from DataManager
      allHeroes = DataManager.getHeroesByRole();
      
      // Sort heroes alphabetically
      allHeroes.sort((a, b) => a.name.localeCompare(b.name));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading heroes:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Get hero image URL (or placeholder if none exists)
   * @param {string} heroName - Name of the hero
   * @returns {string} URL of hero image
   */
  function getHeroImage(heroName) {
    if (heroImages[heroName]) {
      return heroImages[heroName];
    }
    return `https://via.placeholder.com/80?text=${encodeURIComponent(heroName)}`;
  }

  /**
   * Get heroes by class
   * @param {string} heroClass - Class to filter by, or 'all' for all classes
   * @returns {Array} Array of hero objects
   */
  function getHeroesByClass(heroClass = 'all') {
    if (heroClass === 'all') {
      return [...allHeroes];
    }
    
    return allHeroes.filter(hero => hero.classes.includes(heroClass));
  }

  /**
   * Get a hero by name
   * @param {string} name - Hero name to search for
   * @returns {Object|undefined} Hero object or undefined if not found
   */
  function getHeroByName(name) {
    return allHeroes.find(hero => hero.name === name);
  }

  /**
   * Add a new hero
   * @param {string} name - Hero name
   * @param {string} heroClass - Hero class
   * @param {string} imageUrl - Hero image URL
   * @returns {boolean} Success indicator
   */
  async function addHero(name, heroClass, imageUrl) {
    try {
      // Use DataManager to add hero
      const success = DataManager.addHero(name, heroClass, imageUrl);
      
      if (success) {
        // Update local hero list
        await loadHeroes();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding hero:', error);
      return false;
    }
  }

  /**
   * Delete a hero
   * @param {string} name - Hero name to delete
   * @returns {boolean} Success indicator
   */
  async function deleteHero(name) {
    try {
      // Use DataManager to delete hero
      const success = DataManager.deleteHero(name);
      
      if (success) {
        // Update local hero list
        await loadHeroes();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting hero:', error);
      return false;
    }
  }

  /**
   * Format hero class with appropriate styling
   * @param {string} heroClass - Hero class name
   * @returns {Object} Object with text and style properties
   */
  function formatHeroClass(heroClass) {
    return {
      text: heroClass,
      color: HERO_CLASS_COLORS[heroClass] || '#777'
    };
  }

  /**
   * Filter heroes by search term and class
   * @param {string} searchTerm - Term to search for
   * @param {string} classFilter - Class to filter by
   * @returns {Array} Filtered array of hero objects
   */
  function filterHeroes(searchTerm = '', classFilter = 'all') {
    searchTerm = searchTerm.toLowerCase();
    
    return allHeroes.filter(hero => {
      const matchesSearch = searchTerm === '' || hero.name.toLowerCase().includes(searchTerm);
      const matchesClass = classFilter === 'all' || hero.classes.includes(classFilter);
      
      return matchesSearch && matchesClass;
    });
  }

  /**
   * Process a new hero image
   * @param {File} file - Image file
   * @returns {Promise<string>} Promise resolving to base64 image data
   */
  function processHeroImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = e => resolve(e.target.result);
      reader.onerror = err => reject(err);
      
      reader.readAsDataURL(file);
    });
  }

  // Public API
  return {
    init,
    getHeroImage,
    getHeroesByClass,
    getHeroByName,
    addHero,
    deleteHero,
    formatHeroClass,
    filterHeroes,
    processHeroImage,
    get allHeroes() { return [...allHeroes]; }
  };
})();

export default HeroManager;