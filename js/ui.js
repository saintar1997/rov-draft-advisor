/**
 * ui.js - Handles UI interactions and rendering
 * Refactored for better organization, efficient event handling, and error recovery
 */

const UIManager = (() => {
  // DOM elements cache
  let elements = {};
  
  // UI state 
  let state = {
    activePage: 'draft',
    selectedTeam: 1,
    currentPosition: 'Slayer',
    selectionState: {
      targetTeam: 1,
      targetSlot: 0,
      targetType: 'ban' // 'ban' or 'pick'
    },
    currentFilter: 'all',
    searchTerm: ''
  };

  /**
   * Initialize UI Manager
   * @returns {Promise} Promise that resolves when initialization is complete
   */
  async function init() {
    try {
      // Cache DOM elements for better performance
      cacheElements();
      
      // Set up event listeners
      setupEventListeners();
      
      // Load initial settings
      loadInitialSettings();
      
      // Set the active page to draft by default
      setActivePage('draft');
      
      // Initial UI render
      render();
      
      console.log('UIManager initialized successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error initializing UI Manager:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Cache DOM elements for better performance
   */
  function cacheElements() {
    try {
      elements = {
        // Main navigation
        menuButtons: {
          draft: document.getElementById('draft-btn'),
          history: document.getElementById('history-btn'),
          heroes: document.getElementById('heroes-btn'),
          settings: document.getElementById('settings-btn')
        },
        pages: {
          draft: document.getElementById('draft-page'),
          history: document.getElementById('history-page'),
          heroes: document.getElementById('heroes-page'),
          settings: document.getElementById('settings-page')
        },
        
        // Draft page elements
        teamButtons: {
          team1: document.getElementById('team1-btn'),
          team2: document.getElementById('team2-btn')
        },
        formatSelect: document.getElementById('format-select'),
        banSlots: {
          team1: Array.from(document.querySelectorAll('.ban-slot[data-team="1"]') || []),
          team2: Array.from(document.querySelectorAll('.ban-slot[data-team="2"]') || [])
        },
        pickSlots: {
          team1: Array.from(document.querySelectorAll('.pick-slot[data-team="1"]') || []),
          team2: Array.from(document.querySelectorAll('.pick-slot[data-team="2"]') || [])
        },
        positionButtons: Array.from(document.querySelectorAll('.position-btn') || []),
        recommendedHeroes: document.querySelector('.recommended-heroes'),
        winRateDisplay: {
          progress: document.querySelector('.progress'),
          percentage: document.querySelector('.percentage')
        },
        
        // Hero modal
        modal: {
          container: document.getElementById('heroSelectionModal'),
          closeButton: document.querySelector('.close-btn'),
          searchInput: document.getElementById('heroSearch'),
          filterButtons: document.querySelectorAll('.filter-btn'),
          heroesGrid: document.querySelector('.heroes-grid')
        },
        
        // Common elements
        resetButton: document.getElementById('reset-btn'),
        loadingOverlay: document.querySelector('.loading-overlay')
      };
      
      // Log missing critical elements
      validateCriticalElements();
    } catch (error) {
      console.error('Error caching DOM elements:', error);
      throw error;
    }
  }
  
  /**
   * Validate critical UI elements exist and log warnings if not
   */
  function validateCriticalElements() {
    // Check main pages
    Object.entries(elements.pages).forEach(([name, element]) => {
      if (!element) {
        console.warn(`Critical page element not found: ${name}-page`);
      }
    });
    
    // Check main navigation buttons
    Object.entries(elements.menuButtons).forEach(([name, element]) => {
      if (!element) {
        console.warn(`Critical navigation button not found: ${name}-btn`);
      }
    });
  }
  
  /**
   * Helper to safely add event listener with element validation
   * @param {Element} element - DOM element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  function addSafeEventListener(element, event, handler) {
    if (element) {
      element.addEventListener(event, handler);
    }
  }
  
  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    try {
      // Main navigation
      setupNavigationListeners();
      
      // Draft page
      setupDraftPageListeners();
      
      // Heroes page
      setupHeroesPageListeners();
      
      // Match history page
      setupMatchesPageListeners();
      
      // Settings page
      setupSettingsPageListeners();
      
      // Common controls
      setupCommonControlListeners();
    } catch (error) {
      console.error('Error setting up event listeners:', error);
      throw error;
    }
  }
  
  /**
   * Set up main navigation listeners
   */
  function setupNavigationListeners() {
    // Menu buttons
    Object.entries(elements.menuButtons).forEach(([pageName, button]) => {
      addSafeEventListener(button, 'click', () => setActivePage(pageName));
    });
  }
  
  /**
   * Set up draft page listeners
   */
  function setupDraftPageListeners() {
    // Team selection
    addSafeEventListener(elements.teamButtons.team1, 'click', () => setActiveTeam(1));
    addSafeEventListener(elements.teamButtons.team2, 'click', () => setActiveTeam(2));
    
    // Format selection
    addSafeEventListener(elements.formatSelect, 'change', () => {
      if (elements.formatSelect) {
        setFormat(elements.formatSelect.value);
      }
    });
    
    // Ban slots
    elements.banSlots.team1.forEach(slot => {
      addSafeEventListener(slot, 'click', () => {
        const slotIndex = parseInt(slot.getAttribute('data-slot'));
        openHeroSelection('ban', 1, slotIndex);
      });
    });
    
    elements.banSlots.team2.forEach(slot => {
      addSafeEventListener(slot, 'click', () => {
        const slotIndex = parseInt(slot.getAttribute('data-slot'));
        openHeroSelection('ban', 2, slotIndex);
      });
    });
    
    // Pick slots
    elements.pickSlots.team1.forEach(slot => {
      addSafeEventListener(slot, 'click', () => {
        const slotIndex = parseInt(slot.getAttribute('data-slot'));
        openHeroSelection('pick', 1, slotIndex);
      });
    });
    
    elements.pickSlots.team2.forEach(slot => {
      addSafeEventListener(slot, 'click', () => {
        const slotIndex = parseInt(slot.getAttribute('data-slot'));
        openHeroSelection('pick', 2, slotIndex);
      });
    });
    
    // Position buttons
    elements.positionButtons.forEach(button => {
      addSafeEventListener(button, 'click', () => {
        const position = button.getAttribute('data-position');
        setActivePosition(position);
      });
    });
  }
  
  /**
   * Set up heroes page listeners
   */
  function setupHeroesPageListeners() {
    // Hero search input
    const heroSearch = document.getElementById('hero-search');
    addSafeEventListener(heroSearch, 'input', () => {
      if (typeof filterHeroes === 'function') {
        filterHeroes();
      }
    });
    
    // Hero class filter
    const classFilter = document.getElementById('class-filter');
    addSafeEventListener(classFilter, 'change', () => {
      if (typeof filterHeroes === 'function') {
        filterHeroes();
      }
    });
    
    // Import heroes button
    const importHeroesBtn = document.getElementById('import-heroes-btn');
    addSafeEventListener(importHeroesBtn, 'click', () => {
      // This function is defined in hero-manager.js
      if (typeof importHeroesFromFile === 'function') {
        importHeroesFromFile();
      } else {
        console.warn('importHeroesFromFile function not found');
      }
    });
    
    // Add hero button
    const addHeroBtn = document.getElementById('add-hero-btn');
    addSafeEventListener(addHeroBtn, 'click', () => {
      // This function should be defined in hero-manager.js
      if (typeof addNewHero === 'function') {
        addNewHero();
      } else {
        console.warn('addNewHero function not found');
      }
    });
    
    // Delete all heroes button
    const deleteAllHeroesBtn = document.getElementById('delete-all-heroes-btn');
    addSafeEventListener(deleteAllHeroesBtn, 'click', () => {
      if (typeof deleteAllHeroes === 'function') {
        deleteAllHeroes();
      } else {
        console.warn('deleteAllHeroes function not found');
      }
    });
  }
  
  /**
   * Set up matches page listeners
   */
  function setupMatchesPageListeners() {
    // Match search
    const matchSearch = document.getElementById('match-search');
    addSafeEventListener(matchSearch, 'input', () => {
      if (typeof filterMatches === 'function') {
        filterMatches();
      }
    });
    
    // Tournament filter
    const tournamentFilter = document.getElementById('tournament-filter');
    addSafeEventListener(tournamentFilter, 'change', () => {
      if (typeof filterMatches === 'function') {
        filterMatches();
      }
    });
    
    // Team filter
    const teamFilter = document.getElementById('team-filter');
    addSafeEventListener(teamFilter, 'change', () => {
      if (typeof filterMatches === 'function') {
        filterMatches();
      }
    });
    
    // Import matches button
    const importFileBtn = document.getElementById('import-file-btn');
    addSafeEventListener(importFileBtn, 'click', () => {
      const importFile = document.getElementById('import-file');
      if (importFile && importFile.files.length > 0) {
        if (typeof importMatchesFromFile === 'function') {
          importMatchesFromFile({ target: importFile });
        } else {
          console.warn('importMatchesFromFile function not found');
        }
      } else {
        alert('กรุณาเลือกไฟล์ก่อน');
      }
    });
    
    // Fetch matches button
    const fetchBtn = document.getElementById('fetch-btn');
    addSafeEventListener(fetchBtn, 'click', () => {
      if (typeof fetchMatchDataFromUrl === 'function') {
        fetchMatchDataFromUrl();
      } else {
        console.warn('fetchMatchDataFromUrl function not found');
      }
    });
    
    // Add match button
    const addMatchBtn = document.getElementById('add-match-btn');
    addSafeEventListener(addMatchBtn, 'click', () => {
      if (typeof addNewMatch === 'function') {
        addNewMatch();
      } else {
        console.warn('addNewMatch function not found');
      }
    });
    
    // Delete all matches button
    const deleteAllMatchesBtn = document.getElementById('delete-all-matches-btn');
    addSafeEventListener(deleteAllMatchesBtn, 'click', () => {
      if (typeof deleteAllMatches === 'function') {
        deleteAllMatches();
      } else {
        console.warn('deleteAllMatches function not found');
      }
    });
    
    // Pagination buttons
    const prevPageBtn = document.getElementById('prev-page');
    addSafeEventListener(prevPageBtn, 'click', () => {
      if (typeof navigateMatchesPage === 'function') {
        navigateMatchesPage('prev');
      } else {
        console.warn('navigateMatchesPage function not found');
      }
    });
    
    const nextPageBtn = document.getElementById('next-page');
    addSafeEventListener(nextPageBtn, 'click', () => {
      if (typeof navigateMatchesPage === 'function') {
        navigateMatchesPage('next');
      } else {
        console.warn('navigateMatchesPage function not found');
      }
    });
  }
  
  /**
   * Set up settings page listeners
   */
  function setupSettingsPageListeners() {
    // Default format setting
    const defaultFormat = document.getElementById('default-format');
    addSafeEventListener(defaultFormat, 'change', () => {
      if (defaultFormat) {
        localStorage.setItem('rovDefaultFormat', defaultFormat.value);
      }
    });
    
    // Export data button
    const exportDataBtn = document.getElementById('export-data-btn');
    addSafeEventListener(exportDataBtn, 'click', exportData);
    
    // Import data button
    const importDataBtn = document.getElementById('import-data-btn');
    addSafeEventListener(importDataBtn, 'click', importData);
    
    // Clear data button
    const clearDataBtn = document.getElementById('clear-data-btn');
    addSafeEventListener(clearDataBtn, 'click', clearData);
  }
  
  /**
   * Set up common control listeners
   */
  function setupCommonControlListeners() {
    // Reset button
    addSafeEventListener(elements.resetButton, 'click', resetDraft);
  }
  
  /**
   * Load initial settings
   */
  function loadInitialSettings() {
    try {
      // Load default format
      const defaultFormat = localStorage.getItem('rovDefaultFormat') || 'ranking';
      
      // Set format in UI
      if (elements.formatSelect) {
        elements.formatSelect.value = defaultFormat;
      }
      
      // Set format in state
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.setFormat === 'function') {
        AnalyticsManager.setFormat(defaultFormat);
      }
      
      // Load selected team from analytics if available
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.getCurrentDraft === 'function') {
        const draft = AnalyticsManager.getCurrentDraft();
        state.selectedTeam = draft.selectedTeam || 1;
        state.currentPosition = draft.currentPosition || 'Slayer';
      }
    } catch (error) {
      console.error('Error loading initial settings:', error);
    }
  }
  
  /**
   * Set active page
   * @param {string} pageId - Page ID to activate
   */
  function setActivePage(pageId) {
    try {
      // Update state
      state.activePage = pageId;
      
      // Update menu buttons
      Object.entries(elements.menuButtons).forEach(([id, button]) => {
        if (button) {
          button.classList.toggle('active', id === pageId);
        }
      });
      
      // Update pages
      Object.entries(elements.pages).forEach(([id, page]) => {
        if (page) {
          page.classList.toggle('active', id === pageId);
        }
      });
      
      // Perform page-specific actions
      switch (pageId) {
        case 'draft':
          render();
          break;
        case 'history':
          if (typeof renderMatchesTable === 'function') {
            renderMatchesTable();
          }
          break;
        case 'heroes':
          if (typeof renderHeroesTable === 'function') {
            renderHeroesTable();
          }
          break;
        case 'settings':
          loadSettingsValues();
          break;
      }
    } catch (error) {
      console.error(`Error setting active page to ${pageId}:`, error);
    }
  }
  
  /**
   * Set active team
   * @param {number} teamId - Team ID (1 or 2)
   */
  function setActiveTeam(teamId) {
    try {
      // Update state
      state.selectedTeam = teamId;
      
      // Update UI
      if (elements.teamButtons.team1) {
        elements.teamButtons.team1.classList.toggle('active', teamId === 1);
      }
      if (elements.teamButtons.team2) {
        elements.teamButtons.team2.classList.toggle('active', teamId === 2);
      }
      
      // Update analytics
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.setSelectedTeam === 'function') {
        AnalyticsManager.setSelectedTeam(teamId);
      }
      
      // Update recommendations and win rate
      renderRecommendations();
      renderWinRate();
    } catch (error) {
      console.error(`Error setting active team to ${teamId}:`, error);
    }
  }
  
  /**
   * Set active position
   * @param {string} position - Position name
   */
  function setActivePosition(position) {
    try {
      // Update state
      state.currentPosition = position;
      
      // Update UI
      elements.positionButtons.forEach(button => {
        if (button) {
          button.classList.toggle('active', button.getAttribute('data-position') === position);
        }
      });
      
      // Update analytics
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.setCurrentPosition === 'function') {
        AnalyticsManager.setCurrentPosition(position);
      }
      
      // Update recommendations
      renderRecommendations();
    } catch (error) {
      console.error(`Error setting active position to ${position}:`, error);
    }
  }
  
  /**
   * Set draft format
   * @param {string} format - Format name ('ranking' or 'global')
   */
  function setFormat(format) {
    try {
      // Update analytics
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.setFormat === 'function') {
        AnalyticsManager.setFormat(format);
      }
      
      // Update ban slots visibility
      updateBanSlots(format);
      
      // Re-render
      render();
    } catch (error) {
      console.error(`Error setting format to ${format}:`, error);
    }
  }
  
  /**
   * Update ban slots based on format
   * @param {string} format - Format name ('ranking' or 'global')
   */
  function updateBanSlots(format) {
    try {
      const maxBans = format === 'global' ? 4 : 3;
      
      // Update team 1 ban slots
      elements.banSlots.team1.forEach((slot, index) => {
        if (slot) {
          slot.style.display = index < maxBans ? 'block' : 'none';
        }
      });
      
      // Update team 2 ban slots
      elements.banSlots.team2.forEach((slot, index) => {
        if (slot) {
          slot.style.display = index < maxBans ? 'block' : 'none';
        }
      });
    } catch (error) {
      console.error(`Error updating ban slots for format ${format}:`, error);
    }
  }
  
  /**
   * Open hero selection modal
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} teamId - Team ID (1 or 2)
   * @param {number} slotIndex - Slot index
   */
  function openHeroSelection(type, teamId, slotIndex) {
    try {
      console.log('Opening hero selection:', { type, teamId, slotIndex });
      
      // Update selection state
      state.selectionState = {
        targetTeam: teamId,
        targetSlot: slotIndex,
        targetType: type
      };
      
      // Use HeroSelectionController if available
      if (typeof HeroSelectionController !== 'undefined' && 
          typeof HeroSelectionController.openModal === 'function') {
        HeroSelectionController.openModal(teamId, type, slotIndex);
        return;
      }
      
      // Fallback to simple modal
      showSimpleHeroSelectionModal(teamId, type, slotIndex);
    } catch (error) {
      console.error('Error opening hero selection:', error);
    }
  }
  
  /**
   * Show simple hero selection modal (fallback)
   * @param {number} teamId - Team ID (1 or 2)
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} slotIndex - Slot index
   */
  function showSimpleHeroSelectionModal(teamId, type, slotIndex) {
    alert(`การเลือกฮีโร่สำหรับทีม ${teamId} - ${type} ตำแหน่งที่ ${slotIndex+1} ยังไม่พร้อมใช้งาน`);
  }
  
  /**
   * Get selection state
   * @returns {Object} Selection state
   */
  function getSelectionState() {
    return state.selectionState;
  }
  
  /**
   * Render the entire UI
   */
  function render() {
    try {
      // Check if Analytics Manager is available
      if (typeof AnalyticsManager === 'undefined' || 
          typeof AnalyticsManager.getCurrentDraft !== 'function') {
        console.warn('AnalyticsManager not available for rendering');
        return;
      }
      
      // Get current draft
      const draft = AnalyticsManager.getCurrentDraft();
      
      // Render team selection
      if (elements.teamButtons.team1) {
        elements.teamButtons.team1.classList.toggle('active', draft.selectedTeam === 1);
      }
      if (elements.teamButtons.team2) {
        elements.teamButtons.team2.classList.toggle('active', draft.selectedTeam === 2);
      }
      
      // Render format selection
      if (elements.formatSelect) {
        elements.formatSelect.value = draft.format;
      }
      
      // Update ban slots based on format
      updateBanSlots(draft.format);
      
      // Render bans
      renderBans(draft);
      
      // Render picks
      renderPicks(draft);
      
      // Render active position
      elements.positionButtons.forEach(button => {
        if (button) {
          button.classList.toggle('active', button.getAttribute('data-position') === draft.currentPosition);
        }
      });
      
      // Render recommendations
      renderRecommendations();
      
      // Render win rate
      renderWinRate();
    } catch (error) {
      console.error('Error rendering UI:', error);
    }
  }
  
  /**
   * Render bans
   * @param {Object} draft - Current draft state
   */
  function renderBans(draft) {
    try {
      if (!draft || !draft.team1 || !draft.team2) return;
      
      // Check if DataManager is available
      if (typeof DataManager === 'undefined' || 
          typeof DataManager.getHeroByName !== 'function') {
        console.warn('DataManager not available for rendering bans');
        return;
      }
      
      // Render team 1 bans
      elements.banSlots.team1.forEach((slot, index) => {
        if (!slot) return;
        
        const heroName = draft.team1.bans[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
        }
      });
      
      // Render team 2 bans
      elements.banSlots.team2.forEach((slot, index) => {
        if (!slot) return;
        
        const heroName = draft.team2.bans[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
        }
      });
    } catch (error) {
      console.error('Error rendering bans:', error);
    }
  }
  
  /**
   * Render picks
   * @param {Object} draft - Current draft state
   */
  function renderPicks(draft) {
    try {
      if (!draft || !draft.team1 || !draft.team2) return;
      
      // Check if DataManager is available
      if (typeof DataManager === 'undefined' || 
          typeof DataManager.getHeroByName !== 'function') {
        console.warn('DataManager not available for rendering picks');
        return;
      }
      
      // Render team 1 picks
      elements.pickSlots.team1.forEach((slot, index) => {
        if (!slot) return;
        
        const heroName = draft.team1.picks[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
          heroPortrait.classList.add('empty');
          heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
        }
      });
      
      // Render team 2 picks
      elements.pickSlots.team2.forEach((slot, index) => {
        if (!slot) return;
        
        const heroName = draft.team2.picks[index];
        const heroPortrait = slot.querySelector('.hero-portrait');
        
        if (!heroPortrait) return;
        
        if (heroName) {
          heroPortrait.classList.remove('empty');
          heroPortrait.innerHTML = '';
          
          const hero = DataManager.getHeroByName(heroName);
          if (hero) {
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = heroName;
            heroPortrait.appendChild(img);
          }
        } else {
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
      // Check if AnalyticsManager is available
      if (typeof AnalyticsManager === 'undefined' || 
          typeof AnalyticsManager.getRecommendedHeroes !== 'function') {
        console.warn('AnalyticsManager not available for rendering recommendations');
        return;
      }
      
      // Get recommendations
      const recommendations = AnalyticsManager.getRecommendedHeroes();
      
      // Clear recommendations container
      if (elements.recommendedHeroes) {
        elements.recommendedHeroes.innerHTML = '';
      } else {
        return;
      }
      
      // Render heroes
      recommendations.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        const heroImage = document.createElement('img');
        heroImage.src = hero.image;
        heroImage.alt = hero.name;
        heroImage.loading = 'lazy'; // Add lazy loading for performance
        
        const heroName = document.createElement('div');
        heroName.className = 'hero-name';
        heroName.textContent = hero.name;
        
        const winRate = document.createElement('div');
        winRate.className = 'win-rate';
        winRate.textContent = `${hero.winRate}%`;
        
        heroCard.appendChild(heroImage);
        heroCard.appendChild(heroName);
        heroCard.appendChild(winRate);
        
        // Add click event to select hero
        heroCard.addEventListener('click', () => {
          // If there's a current pick turn, select this hero
          if (typeof AnalyticsManager !== 'undefined' && 
              typeof AnalyticsManager.getCurrentPickTurn === 'function') {
            const { team, pickIndex } = AnalyticsManager.getCurrentPickTurn();
            if (team !== null && pickIndex !== null) {
              openHeroSelection('pick', team, pickIndex);
            }
          }
        });
        
        elements.recommendedHeroes.appendChild(heroCard);
      });
      
      // Show message if no recommendations
      if (recommendations.length === 0) {
        const noRecommendations = document.createElement('p');
        noRecommendations.className = 'no-recommendations';
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
      // Check if AnalyticsManager is available
      if (typeof AnalyticsManager === 'undefined' || 
          typeof AnalyticsManager.calculateWinRate !== 'function') {
        console.warn('AnalyticsManager not available for calculating win rate');
        return;
      }
      
      // Get win rate
      const winRate = AnalyticsManager.calculateWinRate();
      
      // Update progress bar
      if (elements.winRateDisplay.progress) {
        elements.winRateDisplay.progress.style.width = `${winRate}%`;
      }
      
      // Update percentage text
      if (elements.winRateDisplay.percentage) {
        elements.winRateDisplay.percentage.textContent = `${Math.round(winRate)}%`;
      }
    } catch (error) {
      console.error('Error rendering win rate:', error);
    }
  }
  
  /**
   * Reset the draft
   */
  function resetDraft() {
    try {
      if (confirm('แน่ใจหรือไม่ว่าต้องการรีเซ็ตการดราฟ?')) {
        // Check if AnalyticsManager is available
        if (typeof AnalyticsManager === 'undefined' || 
            typeof AnalyticsManager.resetDraft !== 'function') {
          console.warn('AnalyticsManager not available for resetting draft');
          return;
        }
        
        AnalyticsManager.resetDraft();
        render();
      }
    } catch (error) {
      console.error('Error resetting draft:', error);
    }
  }
  
  /**
   * Show loading overlay
   */
  function showLoading() {
    try {
      if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error showing loading overlay:', error);
    }
  }
  
  /**
   * Hide loading overlay
   */
  function hideLoading() {
    try {
      if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = 'none';
      }
    } catch (error) {
      console.error('Error hiding loading overlay:', error);
    }
  }
  
  /**
   * Load settings values
   */
  function loadSettingsValues() {
    try {
      // Load default format setting
      const defaultFormat = localStorage.getItem('rovDefaultFormat') || 'ranking';
      const defaultFormatElement = document.getElementById('default-format');
      
      if (defaultFormatElement) {
        defaultFormatElement.value = defaultFormat;
      }
    } catch (error) {
      console.error('Error loading settings values:', error);
    }
  }
  
  /**
   * Export data to JSON file
   */
  function exportData() {
    try {
      // Collect all application data
      const data = {
        heroes: JSON.parse(localStorage.getItem('rovHeroData') || '{}'),
        matches: JSON.parse(localStorage.getItem('rovMatchData') || '[]'),
        settings: {
          defaultFormat: localStorage.getItem('rovDefaultFormat') || 'ranking'
        }
      };
      
      // Convert to JSON string
      const dataStr = JSON.stringify(data, null, 2);
      
      // Create data URI for download
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      // Create download link
      const exportFileName = `rov_draft_helper_data_${new Date().toISOString().slice(0, 10)}.json`;
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', exportFileName);
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      alert('ส่งออกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล: ' + error.message);
    }
  }
  
  /**
   * Import data from JSON file
   */
  function importData() {
    try {
      // Create file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';
      
      fileInput.onchange = (e) => {
        if (!e.target.files.length) return;
        
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            // Parse JSON data
            const data = JSON.parse(event.target.result);
            
            // Validate data structure
            if (!data.heroes || !data.matches) {
              throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
            }
            
            // Show loading overlay
            showLoading();
            
            // Import data with timeout to allow UI to update
            setTimeout(() => {
              // Save data to localStorage
              localStorage.setItem('rovHeroData', JSON.stringify(data.heroes));
              localStorage.setItem('rovMatchData', JSON.stringify(data.matches));
              
              // Import settings
              if (data.settings && data.settings.defaultFormat) {
                localStorage.setItem('rovDefaultFormat', data.settings.defaultFormat);
              }
              
              // Hide loading overlay
              hideLoading();
              
              alert('นำเข้าข้อมูลสำเร็จ จะรีโหลดหน้าเว็บเพื่อใช้งานข้อมูลใหม่');
              window.location.reload();
            }, 500);
          } catch (error) {
            console.error('Error parsing imported data:', error);
            alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + error.message);
          }
        };
        
        reader.onerror = () => {
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
        };
        
        reader.readAsText(file);
      };
      
      // Trigger file selection
      fileInput.click();
    } catch (error) {
      console.error('Error importing data:', error);
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + error.message);
    }
  }
  
  /**
   * Clear all application data
   */
  function clearData() {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
        // Show loading overlay
        showLoading();
        
        // Clear with timeout to allow UI to update
        setTimeout(() => {
          // Save default format setting
          const defaultFormat = localStorage.getItem('rovDefaultFormat');
          
          // Clear all data
          localStorage.clear();
          
          // Restore default format
          if (defaultFormat) {
            localStorage.setItem('rovDefaultFormat', defaultFormat);
          }
          
          // Hide loading overlay
          hideLoading();
          
          alert('ล้างข้อมูลเรียบร้อย จะรีโหลดหน้าเว็บเพื่อเริ่มต้นใหม่');
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('เกิดข้อผิดพลาดในการล้างข้อมูล: ' + error.message);
      hideLoading();
    }
  }
  
  // Public API
  return {
    init,
    render,
    getSelectionState,
    openHeroSelection,
    setActivePage,
    showLoading,
    hideLoading
  };
})();

// Initialize UI utilities for match table
document.addEventListener('DOMContentLoaded', function() {
  // Add match table styles
  const matchTableStyles = document.createElement('style');
  matchTableStyles.textContent = `
    /* Match table styles */
    .matches-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .matches-table th {
      background-color: #2e3192;
      color: #1baeea;
      padding: 12px 15px;
      text-align: left;
      font-weight: bold;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    .matches-table td {
      padding: 10px 15px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .matches-table tr:last-child td {
      border-bottom: none;
    }
    
    /* Winner team styling */
    .matches-table .winner-team {
      font-weight: bold;
      color: #4caf50;
    }
    
    /* Table buttons */
    .matches-table button {
      margin-right: 5px;
      padding: 5px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .matches-table .view-btn {
      background-color: #2196f3;
      color: white;
    }
    
    .matches-table .edit-btn {
      background-color: #ff9800;
      color: white;
    }
    
    .matches-table .delete-btn {
      background-color: #f44336;
      color: white;
    }
  `;
  
  document.head.appendChild(matchTableStyles);
});