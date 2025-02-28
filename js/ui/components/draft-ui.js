/**
 * draft-ui.js
 * Manages the draft interface UI components
 */

import DataManager from '../../data/data-manager.js';
import AnalyticsManager from '../../analytics/analytics-manager.js';
import HeroSelectionController from '../../heroes/hero-selection.js';

const DraftUI = (() => {
  // DOM elements cache
  let elements = {};
  
  /**
   * Initialize the draft UI
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async function init() {
    try {
      // Cache DOM elements
      cacheElements();
      
      // Set up event listeners
      setupEventListeners();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error initializing DraftUI:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Cache DOM elements for better performance
   */
  function cacheElements() {
    try {
      elements = {
        teamButtons: {
          team1: document.getElementById('team1-btn'),
          team2: document.getElementById('team2-btn'),
        },
        formatSelect: document.getElementById('format-select'),
        banSlots: {
          team1: Array.from(document.querySelectorAll('.ban-slot[data-team="1"]') || []),
          team2: Array.from(document.querySelectorAll('.ban-slot[data-team="2"]') || []),
        },
        pickSlots: {
          team1: Array.from(document.querySelectorAll('.pick-slot[data-team="1"]') || []),
          team2: Array.from(document.querySelectorAll('.pick-slot[data-team="2"]') || []),
        },
        positionButtons: Array.from(document.querySelectorAll('.position-btn') || []),
        recommendedHeroes: document.querySelector('.recommended-heroes'),
        winRateDisplay: {
          progress: document.querySelector('.progress'),
          percentage: document.querySelector('.percentage'),
        },
        resetButton: document.getElementById('reset-btn'),
      };
      
      // Log missing elements for debugging
      logMissingElements();
    } catch (error) {
      console.error('Error caching elements:', error);
    }
  }
  
  /**
   * Log missing elements to help with debugging
   */
  function logMissingElements() {
    // Check team buttons
    ['team1', 'team2'].forEach(team => {
      if (!elements.teamButtons[team]) {
        console.warn(`Missing team button for team ${team}`);
      }
    });
    
    // Check format select
    if (!elements.formatSelect) {
      console.warn('Missing format select');
    }
    
    // Check ban slots
    ['team1', 'team2'].forEach(team => {
      if (!elements.banSlots[team] || elements.banSlots[team].length === 0) {
        console.warn(`Missing ban slots for team ${team}`);
      }
    });
    
    // Check pick slots
    ['team1', 'team2'].forEach(team => {
      if (!elements.pickSlots[team] || elements.pickSlots[team].length === 0) {
        console.warn(`Missing pick slots for team ${team}`);
      }
    });
    
    // Check position buttons
    if (!elements.positionButtons || elements.positionButtons.length === 0) {
      console.warn('Missing position buttons');
    }
    
    // Check recommended heroes
    if (!elements.recommendedHeroes) {
      console.warn('Missing recommended heroes container');
    }
    
    // Check win rate display
    if (!elements.winRateDisplay.progress || !elements.winRateDisplay.percentage) {
      console.warn('Missing win rate display elements');
    }
    
    // Check reset button
    if (!elements.resetButton) {
      console.warn('Missing reset button');
    }
  }
  
  /**
   * Set up event listeners for draft interface
   */
  function setupEventListeners() {
    try {
      // Team selection
      if (elements.teamButtons.team1) {
        elements.teamButtons.team1.addEventListener('click', () => setActiveTeam(1));
      }
      
      if (elements.teamButtons.team2) {
        elements.teamButtons.team2.addEventListener('click', () => setActiveTeam(2));
      }
      
      // Format selection
      if (elements.formatSelect) {
        elements.formatSelect.addEventListener('change', () => {
          setFormat(elements.formatSelect.value);
        });
      }
      
      // Ban slots
      elements.banSlots.team1.forEach(slot => {
        slot.addEventListener('click', () => {
          const slotIndex = parseInt(slot.getAttribute('data-slot'));
          openHeroSelection('ban', 1, slotIndex);
        });
      });
      
      elements.banSlots.team2.forEach(slot => {
        slot.addEventListener('click', () => {
          const slotIndex = parseInt(slot.getAttribute('data-slot'));
          openHeroSelection('ban', 2, slotIndex);
        });
      });
      
      // Pick slots
      elements.pickSlots.team1.forEach(slot => {
        slot.addEventListener('click', () => {
          const slotIndex = parseInt(slot.getAttribute('data-slot'));
          openHeroSelection('pick', 1, slotIndex);
        });
      });
      
      elements.pickSlots.team2.forEach(slot => {
        slot.addEventListener('click', () => {
          const slotIndex = parseInt(slot.getAttribute('data-slot'));
          openHeroSelection('pick', 2, slotIndex);
        });
      });
      
      // Position buttons
      elements.positionButtons.forEach(button => {
        button.addEventListener('click', () => {
          const position = button.getAttribute('data-position');
          setActivePosition(position);
        });
      });
      
      // Reset button
      if (elements.resetButton) {
        elements.resetButton.addEventListener('click', resetDraft);
      }
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }
  
  /**
   * Set active team
   * @param {number} teamId - The team ID (1 or 2)
   */
  function setActiveTeam(teamId) {
    try {
      // Update UI
      if (elements.teamButtons.team1) {
        elements.teamButtons.team1.classList.toggle('active', teamId === 1);
      }
      
      if (elements.teamButtons.team2) {
        elements.teamButtons.team2.classList.toggle('active', teamId === 2);
      }
      
      // Update AnalyticsManager
      AnalyticsManager.setSelectedTeam(teamId);
      
      // Update recommendations
      renderRecommendations();
      
      // Update win rate
      renderWinRate();
    } catch (error) {
      console.error('Error setting active team:', error);
    }
  }
  
  /**
   * Set draft format
   * @param {string} format - Format to set ('ranking' or 'global')
   */
  function setFormat(format) {
    try {
      // Update AnalyticsManager
      AnalyticsManager.setFormat(format);
      
      // Update ban slots visibility
      updateBanSlots(format);
      
      // Update UI
      render();
    } catch (error) {
      console.error('Error setting format:', error);
    }
  }
  
  /**
   * Update ban slots based on format
   * @param {string} format - The format ('ranking' or 'global')
   */
  function updateBanSlots(format) {
    try {
      const maxBans = format === 'global' ? 4 : 3;
      
      // Update team 1 ban slots
      elements.banSlots.team1.forEach((slot, index) => {
        slot.style.display = index < maxBans ? 'block' : 'none';
      });
      
      // Update team 2 ban slots
      elements.banSlots.team2.forEach((slot, index) => {
        slot.style.display = index < maxBans ? 'block' : 'none';
      });
    } catch (error) {
      console.error('Error updating ban slots:', error);
    }
  }
  
  /**
   * Set active position for recommendations
   * @param {string} position - The position to set
   */
  function setActivePosition(position) {
    try {
      // Update UI
      elements.positionButtons.forEach(button => {
        button.classList.toggle(
          'active',
          button.getAttribute('data-position') === position
        );
      });
      
      // Update AnalyticsManager
      AnalyticsManager.setCurrentPosition(position);
      
      // Update recommendations
      renderRecommendations();
    } catch (error) {
      console.error('Error setting active position:', error);
    }
  }
  
  /**
   * Open hero selection modal
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} teamId - Team ID (1 or 2)
   * @param {number} slotIndex - Slot index
   */
  function openHeroSelection(type, teamId, slotIndex) {
    console.log('Opening hero selection:', { type, teamId, slotIndex });
    
    // Use HeroSelectionController
    HeroSelectionController.openModal(teamId, type, slotIndex);
  }
  
  /**
   * Render the entire draft UI
   */
  function render() {
    try {
      // Get current draft state
      const draft = AnalyticsManager.getCurrentDraft();
      
      // Render team selection
      setActiveTeam(draft.selectedTeam);
      
      // Render format selection
      if (elements.formatSelect) {
        elements.formatSelect.value = draft.format;
      }
      
      // Update ban slots
      updateBanSlots(draft.format);
      
      // Render bans
      renderBans(draft);
      
      // Render picks
      renderPicks(draft);
      
      // Render active position
      elements.positionButtons.forEach(button => {
        button.classList.toggle(
          'active',
          button.getAttribute('data-position') === draft.currentPosition
        );
      });
      
      // Render recommendations
      renderRecommendations();
      
      // Render win rate
      renderWinRate();
    } catch (error) {
      console.error('Error rendering draft UI:', error);
    }
  }
  
  /**
   * Render bans for both teams
   * @param {Object} draft - Current draft state
   */
  function renderBans(draft) {
    try {
      // Team 1 bans
      elements.banSlots.team1.forEach((slot, index) => {
        const heroName = draft.team1.bans[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          // Hero is banned
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          // Get hero data
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            // Create hero image
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          // Empty ban slot
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
        }
      });
      
      // Team 2 bans
      elements.banSlots.team2.forEach((slot, index) => {
        const heroName = draft.team2.bans[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          // Hero is banned
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          // Get hero data
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            // Create hero image
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          // Empty ban slot
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
        }
      });
    } catch (error) {
      console.error('Error rendering bans:', error);
    }
  }
  
  /**
   * Render picks for both teams
   * @param {Object} draft - Current draft state
   */
  function renderPicks(draft) {
    try {
      // Team 1 picks
      elements.pickSlots.team1.forEach((slot, index) => {
        const heroName = draft.team1.picks[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          // Hero is picked
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          // Get hero data
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            // Create hero image
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          // Empty pick slot
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
        }
      });
      
      // Team 2 picks
      elements.pickSlots.team2.forEach((slot, index) => {
        const heroName = draft.team2.picks[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          // Hero is picked
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          // Get hero data
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            // Create hero image
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          // Empty pick slot
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
        }
      });
    } catch (error) {
      console.error('Error rendering picks:', error);
    }
  }
  
  /**
   * Render hero recommendations
   */
  function renderRecommendations() {
    try {
      // Check if recommendations container exists
      if (!elements.recommendedHeroes) {
        console.warn('Recommended heroes container not found');
        return;
      }
      
      // Clear recommendations
      elements.recommendedHeroes.innerHTML = '';
      
      // Get recommendations
      const recommendations = AnalyticsManager.getRecommendedHeroes();
      
      // Display recommendations
      recommendations.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        const heroImage = document.createElement('img');
        heroImage.src = hero.image;
        heroImage.alt = hero.name;
        
        const heroName = document.createElement('div');
        heroName.className = 'hero-name';
        heroName.textContent = hero.name;
        
        const winRate = document.createElement('div');
        winRate.className = 'win-rate';
        winRate.textContent = `${hero.winRate}%`;
        
        heroCard.appendChild(heroImage);
        heroCard.appendChild(heroName);
        heroCard.appendChild(winRate);
        
        elements.recommendedHeroes.appendChild(heroCard);
      });
      
      // If no recommendations
      if (recommendations.length === 0) {
        const noRecommendations = document.createElement('p');
        noRecommendations.textContent = 'ไม่มีคำแนะนำสำหรับตำแหน่งนี้';
        elements.recommendedHeroes.appendChild(noRecommendations);
      }
    } catch (error) {
      console.error('Error rendering recommendations:', error);
    }
  }
  
  /**
   * Render win rate prediction
   */
  function renderWinRate() {
    try {
      // Check if win rate display elements exist
      if (!elements.winRateDisplay.progress || !elements.winRateDisplay.percentage) {
        console.warn('Win rate display elements not found');
        return;
      }
      
      // Get win rate
      const winRate = AnalyticsManager.calculateWinRate();
      
      // Update progress bar
      elements.winRateDisplay.progress.style.width = `${winRate}%`;
      
      // Update percentage text
      elements.winRateDisplay.percentage.textContent = `${Math.round(winRate)}%`;
    } catch (error) {
      console.error('Error rendering win rate:', error);
    }
  }
  
  /**
   * Reset draft to initial state
   */
  function resetDraft() {
    try {
      if (confirm('แน่ใจหรือไม่ว่าต้องการรีเซ็ตการดราฟ?')) {
        // Reset in AnalyticsManager
        AnalyticsManager.resetDraft();
        
        // Update UI
        render();
      }
    } catch (error) {
      console.error('Error resetting draft:', error);
    }
  }
  
  // Public API
  return {
    init,
    render,
    setActiveTeam,
    setFormat,
    setActivePosition,
    openHeroSelection,
    resetDraft,
  };
})();

export default DraftUI;