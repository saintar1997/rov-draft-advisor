/**
 * Hero Management System
 * This script handles hero data retrieval, class filtering, and hero selection
 */

// Hero Class Color Mapping for visual indicators
const HERO_CLASS_COLORS = {
  'Assassin': '#ff5252', // Red
  'Fighter': '#ff9800',  // Orange
  'Mage': '#2196f3',     // Blue
  'Carry': '#9c27b0',    // Purple
  'Support': '#4caf50',  // Green
  'Tank': '#607d8b'      // Gray
};

// Sample hero data with images (in case none exists in localStorage)
const DEFAULT_HEROES = {
  "Assassin": ["Airi", "Butterfly", "Keera", "Murad", "Nakroth", "Quillen", "Wukong", "Zuka"],
  "Fighter": ["Allain", "Arthur", "Astrid", "Florentino", "Lu Bu", "Omen", "Qi", "Riktor", "Valhein", "Yena"],
  "Mage": ["Azzen'Ka", "Dirak", "Ignis", "Ilumia", "Kahlii", "Krixi", "Lauriel", "Liliana", "Natalya", "Tulen", "Zata"],
  "Carry": ["Capheny", "Elsu", "Laville", "Lindis", "Slimz", "Tel'Annas", "Thorne", "Violet", "Wisp", "Yorn"],
  "Support": ["Alice", "Annette", "Chaugnar", "Enzo", "Ishar", "Krizzix", "Lumburr", "Rouie", "Zip"],
  "Tank": ["Arum", "Baldum", "Grakk", "Moren", "Omega", "Ormarr", "Roxie", "Skud", "Thane", "Y'bneth"]
};

// Hero Management Object
const HeroManager = {
  // All heroes from all classes
  allHeroes: [],
  
  // Hero images map (name -> image URL)
  heroImages: {},
  
  // Initialize hero data
  init: function() {
    console.log('Initializing Hero Manager...');
    
    // Load hero data from localStorage
    let heroes = {};
    try {
      const savedHeroes = localStorage.getItem('rovHeroData');
      heroes = savedHeroes ? JSON.parse(savedHeroes) : DEFAULT_HEROES;
    } catch (error) {
      console.error('Error loading hero data:', error);
      heroes = DEFAULT_HEROES;
    }
    
    // Load hero images
    try {
      const savedImages = localStorage.getItem('rovHeroImages');
      this.heroImages = savedImages ? JSON.parse(savedImages) : {};
    } catch (error) {
      console.error('Error loading hero images:', error);
      this.heroImages = {};
    }
    
    // Process heroes into a flat list with class information
    this.processHeroes(heroes);
    
    // Initialize the hero selection grid
    this.initHeroGrid();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('Hero Manager initialized with', this.allHeroes.length, 'heroes');
  },
  
  // Process heroes from class-based object to flat array
  processHeroes: function(heroClasses) {
    this.allHeroes = [];
    const processedNames = new Set(); // To avoid duplicates
    
    // Loop through each class and its heroes
    Object.entries(heroClasses).forEach(([className, heroes]) => {
      heroes.forEach(heroName => {
        if (!processedNames.has(heroName)) {
          processedNames.add(heroName);
          
          // Determine which classes this hero belongs to
          const heroClasses = [];
          Object.entries(heroClasses).forEach(([cls, heroList]) => {
            if (heroList.includes(heroName)) {
              heroClasses.push(cls);
            }
          });
          
          // Add hero to the flat list
          this.allHeroes.push({
            name: heroName,
            classes: heroClasses,
            primaryClass: heroClasses[0],
            image: this.getHeroImage(heroName)
          });
        }
      });
    });
    
    // Sort heroes alphabetically
    this.allHeroes.sort((a, b) => a.name.localeCompare(b.name));
  },
  
  // Get hero image URL (or placeholder if none exists)
  getHeroImage: function(heroName) {
    if (this.heroImages[heroName]) {
      return this.heroImages[heroName];
    }
    return `https://via.placeholder.com/80?text=${encodeURIComponent(heroName)}`;
  },
  
  // Initialize the hero selection grid
  initHeroGrid: function() {
    const heroesGrid = document.querySelector('.heroes-grid');
    if (!heroesGrid) {
      console.warn('Heroes grid element not found');
      return;
    }
    
    // Clear existing content
    heroesGrid.innerHTML = '';
    
    // Add heroes to the grid
    this.allHeroes.forEach(hero => {
      const heroCard = document.createElement('div');
      heroCard.className = 'hero-card';
      heroCard.dataset.name = hero.name;
      heroCard.dataset.classes = hero.classes.join(',');
      
      // Create hero image
      const heroImage = document.createElement('img');
      heroImage.src = hero.image;
      heroImage.alt = hero.name;
      
      // Create class indicators
      const classIndicators = document.createElement('div');
      classIndicators.className = 'class-indicators';
      
      hero.classes.forEach(cls => {
        const indicator = document.createElement('span');
        indicator.className = 'class-indicator';
        indicator.style.backgroundColor = HERO_CLASS_COLORS[cls] || '#888';
        indicator.title = cls;
        classIndicators.appendChild(indicator);
      });
      
      // Create hero name element
      const heroName = document.createElement('div');
      heroName.className = 'hero-name';
      heroName.textContent = hero.name;
      
      // Assemble hero card
      heroCard.appendChild(heroImage);
      heroCard.appendChild(classIndicators);
      heroCard.appendChild(heroName);
      
      // Add to grid
      heroesGrid.appendChild(heroCard);
    });
  },
  
  // Set up event listeners for the hero selection interface
  setupEventListeners: function() {
    // Filter buttons in the modal
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to the clicked button
        button.classList.add('active');
        
        // Apply the filter
        const filter = button.getAttribute('data-filter');
        this.filterHeroesByClass(filter);
      });
    });
    
    // Hero search input
    const searchInput = document.getElementById('heroSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.filterHeroesBySearch(searchInput.value);
      });
    }
    
    // Hero cards in the grid
    const heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach(card => {
      card.addEventListener('click', () => {
        const heroName = card.getAttribute('data-name');
        this.selectHero(heroName);
      });
    });
  },
  
  // Filter heroes by class
  filterHeroesByClass: function(classFilter) {
    const heroCards = document.querySelectorAll('.hero-card');
    const searchFilter = document.getElementById('heroSearch')?.value.toLowerCase() || '';
    
    heroCards.forEach(card => {
      const heroName = card.getAttribute('data-name').toLowerCase();
      const heroClasses = card.getAttribute('data-classes').split(',');
      
      const matchesClass = classFilter === 'all' || heroClasses.includes(classFilter);
      const matchesSearch = heroName.includes(searchFilter);
      
      card.style.display = matchesClass && matchesSearch ? 'block' : 'none';
    });
  },
  
  // Filter heroes by search term
  filterHeroesBySearch: function(searchTerm) {
    const heroCards = document.querySelectorAll('.hero-card');
    const searchFilter = searchTerm.toLowerCase();
    const activeClass = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    
    heroCards.forEach(card => {
      const heroName = card.getAttribute('data-name').toLowerCase();
      const heroClasses = card.getAttribute('data-classes').split(',');
      
      const matchesClass = activeClass === 'all' || heroClasses.includes(activeClass);
      const matchesSearch = heroName.includes(searchFilter);
      
      card.style.display = matchesClass && matchesSearch ? 'block' : 'none';
    });
  },
  
  // Handle hero selection for ban or pick
  selectHero: function(heroName) {
    console.log('Selected hero:', heroName);
    
    // Get the current selection state from the UI
    const selectionState = UIManager.getSelectionState();
    if (!selectionState) {
      console.warn('Selection state not available');
      return;
    }
    
    // Attempt to add the hero to the draft
    let success = false;
    
    if (selectionState.targetType === 'ban') {
      success = AnalyticsManager.addBan(
        selectionState.targetTeam,
        heroName,
        selectionState.targetSlot
      );
    } else {
      success = AnalyticsManager.addPick(
        selectionState.targetTeam,
        heroName,
        selectionState.targetSlot
      );
    }
    
    // Handle result
    if (success) {
      // Close the modal
      const modal = document.getElementById('heroSelectionModal');
      if (modal) {
        modal.style.display = 'none';
      }
      
      // Refresh the UI
      if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
        UIManager.render();
      }
    } else {
      // Show error message
      alert('ไม่สามารถเลือกฮีโร่นี้ได้ อาจเพราะถูกเลือกหรือแบนไปแล้ว');
    }
  },
  
  // Get a hero by name
  getHeroByName: function(name) {
    return this.allHeroes.find(hero => hero.name === name);
  },
  
  // Apply visual enhancements to the hero selection grid
  enhanceHeroGrid: function() {
    // Add CSS for the hero grid enhancements
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced Hero Grid Styles */
      .heroes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;
        margin-top: 15px;
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
      
      /* Filter button styles */
      .filter-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
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
        font-size: 0.9rem;
      }
      
      .filter-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      .filter-btn.active {
        background-color: #2e3192;
      }
      
      /* Class-specific filter buttons */
      .filter-btn[data-filter="Assassin"] {
        border-left: 4px solid ${HERO_CLASS_COLORS.Assassin};
      }
      
      .filter-btn[data-filter="Fighter"] {
        border-left: 4px solid ${HERO_CLASS_COLORS.Fighter};
      }
      
      .filter-btn[data-filter="Mage"] {
        border-left: 4px solid ${HERO_CLASS_COLORS.Mage};
      }
      
      .filter-btn[data-filter="Carry"] {
        border-left: 4px solid ${HERO_CLASS_COLORS.Carry};
      }
      
      .filter-btn[data-filter="Support"] {
        border-left: 4px solid ${HERO_CLASS_COLORS.Support};
      }
      
      .filter-btn[data-filter="Tank"] {
        border-left: 4px solid ${HERO_CLASS_COLORS.Tank};
      }
      
      /* Hero search input */
      #heroSearch {
        width: 100%;
        padding: 10px 15px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background-color: rgba(0, 0, 0, 0.2);
        color: #fff;
        font-family: 'Kanit', sans-serif;
        font-size: 1rem;
        margin-bottom: 15px;
        transition: all 0.3s ease;
      }
      
      #heroSearch:focus {
        border-color: #1baeea;
        outline: none;
        box-shadow: 0 0 0 2px rgba(27, 174, 234, 0.2);
      }
    `;
    
    // Add style to head
    document.head.appendChild(style);
  }
};

// Extend UIManager to expose the selection state
if (typeof UIManager !== 'undefined') {
  UIManager.getSelectionState = function() {
    return this.selectionState || {
      targetTeam: 1,
      targetSlot: 0,
      targetType: 'ban' // 'ban' or 'pick'
    };
  };
}

// Initialize the hero manager when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize HeroManager
  HeroManager.init();
  
  // Apply visual enhancements
  HeroManager.enhanceHeroGrid();
  
  // Override the populateHeroGrid method in UIManager if it exists
  if (typeof UIManager !== 'undefined' && typeof UIManager.populateHeroGrid === 'function') {
    const originalPopulateHeroGrid = UIManager.populateHeroGrid;
    
    UIManager.populateHeroGrid = function() {
      // Call the original method
      originalPopulateHeroGrid.call(UIManager);
      
      // Then enhance the grid
      HeroManager.enhanceHeroGrid();
      
      // Re-setup event listeners for the hero cards
      const heroCards = document.querySelectorAll('.hero-card');
      heroCards.forEach(card => {
        // Remove any existing click listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Add new click listener
        newCard.addEventListener('click', () => {
          const heroName = newCard.querySelector('.hero-name').textContent;
          HeroManager.selectHero(heroName);
        });
      });
    };
  }
});