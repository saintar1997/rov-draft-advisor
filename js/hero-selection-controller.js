/**
 * hero-selection-controller.js
 * Manages the hero selection modal and interaction
 * Refactored for better organization, error handling, and performance
 */

const HeroSelectionController = (() => {
  // Private state
  let currentSelection = null;
  let heroData = [];
  
  // Hero class color mapping for visual indicators
  const CLASS_COLORS = {
    'Assassin': '#ff5252',
    'Fighter': '#ff9800',
    'Mage': '#2196f3',
    'Carry': '#9c27b0',
    'Support': '#4caf50',
    'Tank': '#607d8b'
  };

  /**
   * Initialize the controller
   */
  function init() {
    console.log("Initializing Hero Selection Controller...");

    try {
      // Ensure modal exists and update structure if needed
      updateModalStructure();
      
      // Set up event listeners
      setupEventListeners();
      
      // Load custom CSS
      injectCustomStyles();
      
      console.log("Hero Selection Controller initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing Hero Selection Controller:", error);
      return false;
    }
  }

  /**
   * Create or update modal structure
   */
  function updateModalStructure() {
    const modal = document.getElementById("heroSelectionModal");
    
    // Create modal if it doesn't exist
    if (!modal) {
      console.log("Creating hero selection modal");
      
      const modalContainer = document.createElement("div");
      modalContainer.id = "heroSelectionModal";
      modalContainer.className = "hero-selection-modal";
      
      document.body.appendChild(modalContainer);
    }
    
    // Update modal content
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
            <h3>เลือกฮีโร่</h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <!-- Current selection information -->
            <div class="selection-info" id="selectionInfo">
                <span>กำลังเลือกฮีโร่สำหรับ: <strong id="selectionTeam">ทีม 1</strong> - <strong id="selectionType">แบน</strong> ตำแหน่งที่ <strong id="selectionSlot">1</strong></span>
            </div>
            
            <div class="search-filter">
                <div class="search-wrapper">
                    <input type="text" placeholder="ค้นหาฮีโร่..." id="heroSearch">
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">ทั้งหมด</button>
                    <button class="filter-btn" data-filter="Assassin">Assassin</button>
                    <button class="filter-btn" data-filter="Fighter">Fighter</button>
                    <button class="filter-btn" data-filter="Mage">Mage</button>
                    <button class="filter-btn" data-filter="Carry">Carry</button>
                    <button class="filter-btn" data-filter="Support">Support</button>
                    <button class="filter-btn" data-filter="Tank">Tank</button>
                </div>
            </div>
            
            <!-- Heroes grid -->
            <div class="heroes-grid">
                <!-- Heroes will be dynamically populated here -->
            </div>
            
            <!-- Empty state when no heroes found -->
            <div class="empty-state" id="emptyState">
                <i class="fas fa-search"></i>
                <p>ไม่พบฮีโร่ที่ตรงกับการค้นหา</p>
            </div>
        </div>
      </div>
    `;
    
    document.getElementById("heroSelectionModal").innerHTML = modalContent;
  }

  /**
   * Set up event listeners for all interactive elements
   */
  function setupEventListeners() {
    // Close button
    const closeBtn = document.querySelector(".hero-selection-modal .close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll(".hero-selection-modal .filter-btn");
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Update active class
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        
        // Apply filter
        const filter = button.getAttribute("data-filter");
        filterHeroesByClass(filter);
      });
    });

    // Search input
    const searchInput = document.getElementById("heroSearch");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        filterHeroesBySearch(searchInput.value);
      });
    }

    // Modal background click to close
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });
    }
  }

  /**
   * Inject custom CSS styles for the modal
   */
  function injectCustomStyles() {
    // Check if styles already exist
    if (document.getElementById("hero-selection-styles")) {
      return;
    }
    
    const styleElement = document.createElement("style");
    styleElement.id = "hero-selection-styles";
    
    styleElement.textContent = `
      /* Hero Selection Modal Styles */
      .hero-selection-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        overflow-y: auto;
        backdrop-filter: blur(5px);
        animation: modalFadeIn 0.3s ease;
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .modal-content {
        background-color: #1f2a40;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        margin: 40px auto;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(27, 174, 234, 0.2);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from { transform: translateY(-20px); }
        to { transform: translateY(0); }
      }
      
      .modal-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #131c2e;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .modal-header h3 {
        margin: 0;
        color: #1baeea;
        font-size: 1.5rem;
      }
      
      .close-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.8rem;
        cursor: pointer;
        transition: all 0.3s;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      
      .close-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
        transform: rotate(90deg);
      }
      
      .modal-body {
        padding: 20px;
        max-height: 70vh;
        overflow-y: auto;
      }
      
      /* Selection info */
      .selection-info {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 10px 15px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        border-left: 4px solid #1baeea;
      }
      
      .selection-info strong {
        color: #fff;
      }
      
      /* Search and filter */
      .search-filter {
        margin-bottom: 25px;
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: #1f2a40;
        padding: 10px 0;
        border-radius: 8px;
      }
      
      .search-wrapper {
        position: relative;
        margin-bottom: 15px;
      }
      
      .search-wrapper::before {
        content: '\\f002'; /* Search icon from FontAwesome */
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.4);
      }
      
      #heroSearch {
        width: 100%;
        padding: 12px 15px 12px 45px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background-color: rgba(0, 0, 0, 0.2);
        color: #fff;
        font-family: 'Kanit', sans-serif;
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      
      #heroSearch:focus {
        border-color: #1baeea;
        outline: none;
        box-shadow: 0 0 0 3px rgba(27, 174, 234, 0.2);
      }
      
      /* Filter buttons */
      .filter-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 5px 0;
      }
      
      .filter-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Kanit', sans-serif;
      }
      
      .filter-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      .filter-btn.active {
        background-color: #2e3192;
      }
      
      /* Hero grid */
      .heroes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;
        padding-bottom: 20px;
      }
      
      .hero-card {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .hero-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        background-color: rgba(0, 0, 0, 0.3);
      }
      
      .hero-card img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 8px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }
      
      .hero-card:hover img {
        border-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
      }
      
      .hero-name {
        font-size: 0.9rem;
        color: #fff;
        margin-top: 5px;
        font-weight: 500;
      }
      
      .class-indicators {
        display: flex;
        justify-content: center;
        gap: 3px;
        margin-top: 8px;
      }
      
      .class-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      
      /* Empty state */
      .empty-state {
        text-align: center;
        padding: 40px 0;
        color: rgba(255, 255, 255, 0.5);
        font-style: italic;
        display: none;
      }
      
      .empty-state i {
        font-size: 2rem;
        margin-bottom: 10px;
        display: block;
      }
      
      /* Class-specific styling */
      .filter-btn[data-filter="Assassin"] {
        border-left: 4px solid ${CLASS_COLORS.Assassin};
      }
      
      .filter-btn[data-filter="Fighter"] {
        border-left: 4px solid ${CLASS_COLORS.Fighter};
      }
      
      .filter-btn[data-filter="Mage"] {
        border-left: 4px solid ${CLASS_COLORS.Mage};
      }
      
      .filter-btn[data-filter="Carry"] {
        border-left: 4px solid ${CLASS_COLORS.Carry};
      }
      
      .filter-btn[data-filter="Support"] {
        border-left: 4px solid ${CLASS_COLORS.Support};
      }
      
      .filter-btn[data-filter="Tank"] {
        border-left: 4px solid ${CLASS_COLORS.Tank};
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .modal-content {
          width: 95%;
          margin: 20px auto;
        }
        
        .heroes-grid {
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
        }
        
        .hero-card img {
          width: 70px;
          height: 70px;
        }
        
        .filter-buttons {
          gap: 5px;
        }
        
        .filter-btn {
          padding: 6px 10px;
          font-size: 0.8rem;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  }

  /**
   * Open the hero selection modal
   * @param {number} team - Team ID (1 or 2)
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} slotIndex - Slot index
   */
  function openModal(team, type, slotIndex) {
    console.log("Opening hero selection modal:", { team, type, slotIndex });
    
    // Update selection info
    updateSelectionInfo(team, type, slotIndex);
    
    // Populate heroes grid
    populateHeroesGrid();
    
    // Show the modal
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.style.display = "block";
      
      // Focus on search input
      setTimeout(() => {
        const searchInput = document.getElementById("heroSearch");
        if (searchInput) {
          searchInput.focus();
          searchInput.value = "";
        }
        
        // Reset filter to "all"
        const filterButtons = document.querySelectorAll(".hero-selection-modal .filter-btn");
        filterButtons.forEach(btn => {
          btn.classList.toggle("active", btn.getAttribute("data-filter") === "all");
        });
        
        // Reset hero display
        filterHeroesByClass("all");
      }, 100);
    }
  }

  /**
   * Close the hero selection modal
   */
  function closeModal() {
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  /**
   * Update selection info displayed in the modal
   * @param {number} team - Team ID (1 or 2)
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} slotIndex - Slot index
   */
  function updateSelectionInfo(team, type, slotIndex) {
    // Update UI elements
    const selectionTeam = document.getElementById("selectionTeam");
    const selectionType = document.getElementById("selectionType");
    const selectionSlot = document.getElementById("selectionSlot");
    
    if (selectionTeam) selectionTeam.textContent = `ทีม ${team}`;
    if (selectionType) selectionType.textContent = type === "ban" ? "แบน" : "เลือก";
    if (selectionSlot) selectionSlot.textContent = slotIndex + 1; // Display 1-based index
    
    // Save current selection
    currentSelection = {
      team,
      type,
      slot: slotIndex
    };
    
    console.log("Current selection updated:", currentSelection);
  }

  /**
   * Populate the heroes grid with available heroes
   */
  function populateHeroesGrid() {
    try {
      const heroesGrid = document.querySelector(".heroes-grid");
      if (!heroesGrid) {
        console.error("Heroes grid element not found");
        return;
      }
      
      // Clear the grid
      heroesGrid.innerHTML = "";
      
      // Get heroes from data sources
      loadHeroes();
      
      // Get current draft state
      const currentDraft = getCurrentDraft();
      
      // Filter out heroes that are already picked or banned
      const availableHeroes = heroData.filter(hero => {
        return !isHeroPicked(hero.name, currentDraft) && !isHeroBanned(hero.name, currentDraft);
      });
      
      console.log(`Found ${availableHeroes.length} available heroes`);
      
      // Add heroes to the grid
      availableHeroes.forEach(hero => {
        const heroCard = document.createElement("div");
        heroCard.className = "hero-card";
        heroCard.dataset.name = hero.name;
        heroCard.dataset.classes = hero.classes.join(",");
        
        // Create hero image
        const heroImage = document.createElement("img");
        heroImage.src = hero.image;
        heroImage.alt = hero.name;
        heroImage.loading = "lazy"; // Lazy load images for better performance
        
        // Create class indicators
        const classIndicators = document.createElement("div");
        classIndicators.className = "class-indicators";
        
        hero.classes.forEach(cls => {
          const indicator = document.createElement("span");
          indicator.className = "class-indicator";
          indicator.style.backgroundColor = CLASS_COLORS[cls] || "#888";
          indicator.title = cls;
          classIndicators.appendChild(indicator);
        });
        
        // Create hero name
        const heroName = document.createElement("div");
        heroName.className = "hero-name";
        heroName.textContent = hero.name;
        
        // Assemble hero card
        heroCard.appendChild(heroImage);
        heroCard.appendChild(classIndicators);
        heroCard.appendChild(heroName);
        
        // Add click event
        heroCard.addEventListener("click", () => {
          selectHero(hero.name);
        });
        
        // Add to grid
        heroesGrid.appendChild(heroCard);
      });
      
      // Show/hide empty state
      updateEmptyState(availableHeroes.length === 0);
    } catch (error) {
      console.error("Error populating hero grid:", error);
    }
  }

  /**
   * Load heroes from available data sources
   */
  function loadHeroes() {
    // Try DataManager first
    if (typeof DataManager !== 'undefined' && typeof DataManager.getHeroesByRole === 'function') {
      heroData = DataManager.getHeroesByRole();
      return;
    }
    
    // Try HeroManager if DataManager not available
    if (typeof HeroManager !== 'undefined' && Array.isArray(HeroManager.allHeroes)) {
      heroData = HeroManager.allHeroes;
      return;
    }
    
    // Use default heroes if no data source is available
    console.warn("No hero data source found, using defaults");
    
    // Get default heroes from localStorage or fallback to minimal set
    try {
      const savedHeroes = localStorage.getItem('rovHeroData');
      if (savedHeroes) {
        const heroClasses = JSON.parse(savedHeroes);
        
        heroData = [];
        const processedNames = new Set();
        
        Object.entries(heroClasses).forEach(([className, heroList]) => {
          heroList.forEach(heroName => {
            if (!processedNames.has(heroName)) {
              processedNames.add(heroName);
              
              // Find all classes for this hero
              const classes = [];
              Object.entries(heroClasses).forEach(([cls, list]) => {
                if (list.includes(heroName)) {
                  classes.push(cls);
                }
              });
              
              heroData.push({
                name: heroName,
                image: `https://via.placeholder.com/80?text=${encodeURIComponent(heroName)}`,
                classes: classes
              });
            }
          });
        });
      } else {
        // Minimal fallback
        heroData = [
          { name: "Airi", image: "https://via.placeholder.com/80?text=Airi", classes: ["Assassin"] },
          { name: "Tulen", image: "https://via.placeholder.com/80?text=Tulen", classes: ["Mage"] },
          { name: "Thane", image: "https://via.placeholder.com/80?text=Thane", classes: ["Tank"] },
        ];
      }
    } catch (error) {
      console.error("Error loading heroes from localStorage:", error);
      
      // Minimal fallback
      heroData = [
        { name: "Airi", image: "https://via.placeholder.com/80?text=Airi", classes: ["Assassin"] },
        { name: "Tulen", image: "https://via.placeholder.com/80?text=Tulen", classes: ["Mage"] },
        { name: "Thane", image: "https://via.placeholder.com/80?text=Thane", classes: ["Tank"] },
      ];
    }
  }

  /**
   * Get current draft state from AnalyticsManager
   * @returns {Object} Current draft state
   */
  function getCurrentDraft() {
    // Try to get draft from AnalyticsManager
    if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.getCurrentDraft === 'function') {
      return AnalyticsManager.getCurrentDraft();
    }
    
    // Return empty draft if AnalyticsManager not available
    return {
      team1: { bans: [], picks: [] },
      team2: { bans: [], picks: [] }
    };
  }

  /**
   * Check if a hero is already picked
   * @param {string} heroName - Hero name
   * @param {Object} draft - Current draft state
   * @returns {boolean} True if hero is picked
   */
  function isHeroPicked(heroName, draft) {
    return draft.team1.picks.includes(heroName) || draft.team2.picks.includes(heroName);
  }

  /**
   * Check if a hero is already banned
   * @param {string} heroName - Hero name
   * @param {Object} draft - Current draft state
   * @returns {boolean} True if hero is banned
   */
  function isHeroBanned(heroName, draft) {
    return draft.team1.bans.includes(heroName) || draft.team2.bans.includes(heroName);
  }

  /**
   * Update empty state message visibility
   * @param {boolean} isEmpty - Whether there are no heroes to display
   */
  function updateEmptyState(isEmpty) {
    const emptyState = document.getElementById("emptyState");
    if (emptyState) {
      emptyState.style.display = isEmpty ? "block" : "none";
    }
  }

  /**
   * Filter heroes by class
   * @param {string} classFilter - Class to filter by or 'all'
   */
  function filterHeroesByClass(classFilter) {
    const heroCards = document.querySelectorAll(".hero-selection-modal .hero-card");
    const searchInput = document.getElementById("heroSearch");
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    
    let visibleCount = 0;
    
    heroCards.forEach(card => {
      const heroName = card.dataset.name.toLowerCase();
      const heroClasses = card.dataset.classes.split(",");
      
      const matchesClass = classFilter === "all" || heroClasses.includes(classFilter);
      const matchesSearch = !searchTerm || heroName.includes(searchTerm);
      
      // Update visibility
      card.style.display = (matchesClass && matchesSearch) ? "block" : "none";
      
      if (matchesClass && matchesSearch) {
        visibleCount++;
      }
    });
    
    // Update empty state
    updateEmptyState(visibleCount === 0);
  }

  /**
   * Filter heroes by search term
   * @param {string} searchTerm - Search term
   */
  function filterHeroesBySearch(searchTerm) {
    const filterButtons = document.querySelectorAll(".hero-selection-modal .filter-btn");
    const activeButton = Array.from(filterButtons).find(btn => btn.classList.contains("active"));
    const activeFilter = activeButton ? activeButton.getAttribute("data-filter") : "all";
    
    filterHeroesByClass(activeFilter);
  }

  /**
   * Select a hero from the modal
   * @param {string} heroName - Hero name
   * @returns {boolean} Success status
   */
  function selectHero(heroName) {
    console.log("Hero selected:", heroName);
    
    // Validate current selection
    if (!currentSelection) {
      console.error("No active selection");
      return false;
    }
    
    // Try to add hero to draft
    let success = false;
    
    try {
      if (currentSelection.type === "ban") {
        if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.addBan === 'function') {
          success = AnalyticsManager.addBan(
            currentSelection.team,
            heroName,
            currentSelection.slot
          );
        }
      } else {
        if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.addPick === 'function') {
          success = AnalyticsManager.addPick(
            currentSelection.team,
            heroName,
            currentSelection.slot
          );
        }
      }
      
      if (success) {
        // Close modal
        closeModal();
        
        // Update UI
        if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
          UIManager.render();
        }
        
        return true;
      } else {
        console.warn("Failed to add hero");
        alert("ไม่สามารถเลือกฮีโร่นี้ได้ อาจเพราะถูกเลือกหรือแบนไปแล้ว");
        return false;
      }
    } catch (error) {
      console.error("Error selecting hero:", error);
      alert("เกิดข้อผิดพลาดในการเลือกฮีโร่");
      return false;
    }
  }

  /**
   * Get current selection state
   * @returns {Object} Current selection state
   */
  function getSelectionState() {
    return currentSelection;
  }

  // Public API
  return {
    init,
    openModal,
    closeModal,
    getSelectionState,
    selectHero,
    currentSelection,
    filterHeroesByClass,
    filterHeroesBySearch
  };
})();

// Initialize when the page loads if not loaded by app.js
if (document.readyState === "complete") {
  HeroSelectionController.init();
} else {
  document.addEventListener("DOMContentLoaded", function() {
    // Only initialize if not already initialized by app.js
    if (typeof RoVDraftHelper === 'undefined' || !RoVDraftHelper.initialized) {
      HeroSelectionController.init();
    }
  });
}