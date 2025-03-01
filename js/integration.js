/**
 * integration.js - Component integration and compatibility layer
 * Ensures all components work together properly, with fallbacks for missing components
 */

// Component integration namespace
const RoVIntegration = (() => {
  // Track initialized state
  let initialized = false;
  
  /**
   * Initialize integration and ensure component compatibility
   */
  function init() {
    console.log("Initializing RoV Component Integration...");
    
    try {
      // Step 1: Create fallbacks for missing components
      createFallbackFunctions();
      
      // Step 2: Integrate UI components
      integrateHeroSelection();
      
      // Step 3: Add common styles
      addCommonStyles();
      
      // Mark as initialized
      initialized = true;
      
      console.log("RoV Component Integration initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing integration:", error);
      return false;
    }
  }
  
  /**
   * Create fallback functions for backward compatibility
   */
  function createFallbackFunctions() {
    // Create renderMatchesTable if not exists
    if (typeof window.renderMatchesTable !== 'function') {
      window.renderMatchesTable = function() {
        console.log("Calling renderMatchesTable fallback function");
        
        try {
          // Try to use MatchManager if available
          if (typeof MatchManager !== 'undefined' && typeof MatchManager.renderMatchesTable === 'function') {
            return MatchManager.renderMatchesTable();
          }
          
          // Basic fallback implementation
          const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
          const tbody = document.getElementById('matches-tbody');
          
          if (!tbody) {
            console.warn("matches-tbody element not found");
            return;
          }
          
          // Clear existing content
          tbody.innerHTML = '';
          
          if (matches.length === 0) {
            // No matches found
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 6;
            emptyCell.textContent = 'ไม่พบข้อมูลแมตช์ กรุณาเพิ่มหรือนำเข้าข้อมูลแมตช์';
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '20px';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
            return;
          }
          
          // Render matches
          matches.forEach((match, index) => {
            const row = document.createElement('tr');
            
            // Basic view button
            const viewBtn = `<button class="view-btn" data-index="${index}">ดู</button>`;
            
            // Add row content
            row.innerHTML = `
              <td>${match.date || 'N/A'}</td>
              <td>${match.tournament || 'N/A'}</td>
              <td>${match.team1 || 'N/A'}</td>
              <td>${match.team2 || 'N/A'}</td>
              <td>${match.winner || 'N/A'}</td>
              <td>${viewBtn}</td>
            `;
            
            tbody.appendChild(row);
          });
          
          // Add minimal event listeners
          const viewButtons = tbody.querySelectorAll('.view-btn');
          viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
              alert('แสดงรายละเอียดแมตช์ (ฟังก์ชันยังไม่พร้อมใช้งาน)');
            });
          });
        } catch (error) {
          console.error("Error in renderMatchesTable fallback:", error);
        }
      };
    }
    
    // Create renderHeroesTable if not exists
    if (typeof window.renderHeroesTable !== 'function') {
      window.renderHeroesTable = function() {
        console.log("Calling renderHeroesTable fallback function");
        
        try {
          const tbody = document.getElementById('heroes-tbody');
          if (!tbody) {
            console.warn("heroes-tbody element not found");
            return;
          }
          
          // Get hero data
          let heroes = {};
          try {
            heroes = JSON.parse(localStorage.getItem('rovHeroData')) || {};
          } catch (error) {
            console.error('Error parsing hero data:', error);
            heroes = {};
          }
          
          // Get hero images
          let heroImages = {};
          try {
            heroImages = JSON.parse(localStorage.getItem('rovHeroImages')) || {};
          } catch (error) {
            console.error('Error parsing hero images:', error);
            heroImages = {};
          }
          
          // Clear the table
          tbody.innerHTML = '';
          
          // Get unique heroes
          const allHeroes = [];
          const processedHeroes = new Set();
          
          for (const [heroClass, heroList] of Object.entries(heroes)) {
            heroList.forEach(heroName => {
              if (!processedHeroes.has(heroName)) {
                processedHeroes.add(heroName);
                
                // Get all classes for this hero
                const heroClasses = [];
                for (const [cls, list] of Object.entries(heroes)) {
                  if (list.includes(heroName)) {
                    heroClasses.push(cls);
                  }
                }
                
                allHeroes.push({
                  name: heroName,
                  classes: heroClasses,
                  classText: heroClasses.join(' | '),
                  primaryClass: heroClasses[0],
                  image: heroImages[heroName] || `https://via.placeholder.com/60?text=${encodeURIComponent(heroName)}`
                });
              }
            });
          }
          
          // Sort alphabetically
          allHeroes.sort((a, b) => a.name.localeCompare(b.name));
          
          // Render heroes
          allHeroes.forEach(hero => {
            const row = document.createElement('tr');
            
            const imageCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = hero.name;
            img.style.width = '60px';
            img.style.height = '60px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            imageCell.appendChild(img);
            
            const nameCell = document.createElement('td');
            nameCell.textContent = hero.name;
            
            const classCell = document.createElement('td');
            classCell.textContent = hero.classText;
            
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'ลบ';
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(imageCell);
            row.appendChild(nameCell);
            row.appendChild(classCell);
            row.appendChild(actionCell);
            
            tbody.appendChild(row);
          });
          
          // Show empty message if no heroes
          if (allHeroes.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 4;
            emptyCell.textContent = 'ไม่พบข้อมูลฮีโร่ กรุณาเพิ่มหรือนำเข้าข้อมูลฮีโร่';
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '20px';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
          }
        } catch (error) {
          console.error("Error in renderHeroesTable fallback:", error);
        }
      };
    }
    
    // Create filterHeroes if not exists
    if (typeof window.filterHeroes !== 'function') {
      window.filterHeroes = function() {
        console.log("Calling filterHeroes fallback function");
        
        try {
          const searchText = document.getElementById('hero-search')?.value.toLowerCase() || '';
          const classFilter = document.getElementById('class-filter')?.value || '';
          
          const rows = document.querySelectorAll('#heroes-tbody tr');
          
          rows.forEach(row => {
            const nameCell = row.querySelector('td:nth-child(2)');
            const classCell = row.querySelector('td:nth-child(3)');
            
            if (!nameCell || !classCell) return;
            
            const name = nameCell.textContent.toLowerCase();
            const classes = classCell.textContent;
            
            const matchesSearch = name.includes(searchText);
            const matchesClass = classFilter === '' || classes.includes(classFilter);
            
            row.style.display = matchesSearch && matchesClass ? '' : 'none';
          });
        } catch (error) {
          console.error("Error in filterHeroes fallback:", error);
        }
      };
    }
    
    // Create filterMatches if not exists
    if (typeof window.filterMatches !== 'function') {
      window.filterMatches = function() {
        console.log("Calling filterMatches fallback function");
        
        try {
          // If MatchManager exists, use its function
          if (typeof MatchManager !== 'undefined' && typeof MatchManager.filterMatches === 'function') {
            return MatchManager.filterMatches();
          }
          
          // Basic implementation
          const searchText = document.getElementById('match-search')?.value.toLowerCase() || '';
          const tournamentFilter = document.getElementById('tournament-filter')?.value || '';
          const teamFilter = document.getElementById('team-filter')?.value || '';
          
          // Get all matches
          const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
          
          // Filter matches
          const filteredMatches = matches.filter(match => {
            const matchText = `${match.date || ''} ${match.tournament || ''} ${match.team1 || ''} ${match.team2 || ''} ${match.winner || ''}`.toLowerCase();
            const matchesSearch = !searchText || matchText.includes(searchText);
            const matchesTournament = !tournamentFilter || match.tournament === tournamentFilter;
            const matchesTeam = !teamFilter || match.team1 === teamFilter || match.team2 === teamFilter;
            
            return matchesSearch && matchesTournament && matchesTeam;
          });
          
          // Render filtered matches
          const tbody = document.getElementById('matches-tbody');
          if (!tbody) return;
          
          tbody.innerHTML = '';
          
          if (filteredMatches.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 6;
            emptyCell.textContent = 'ไม่พบแมตช์ที่ตรงตามเงื่อนไขการค้นหา';
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '20px';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
            return;
          }
          
          // Render filtered matches
          filteredMatches.forEach((match, index) => {
            const originalIndex = matches.indexOf(match);
            
            const row = document.createElement('tr');
            
            // Basic view button
            const viewBtn = `<button class="view-btn" data-index="${originalIndex}">ดู</button>`;
            
            // Add row content
            row.innerHTML = `
              <td>${match.date || 'N/A'}</td>
              <td>${match.tournament || 'N/A'}</td>
              <td>${match.team1 || 'N/A'}</td>
              <td>${match.team2 || 'N/A'}</td>
              <td>${match.winner || 'N/A'}</td>
              <td>${viewBtn}</td>
            `;
            
            tbody.appendChild(row);
          });
          
          // Add minimal event listeners
          const viewButtons = tbody.querySelectorAll('.view-btn');
          viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
              alert('แสดงรายละเอียดแมตช์ (ฟังก์ชันยังไม่พร้อมใช้งาน)');
            });
          });
        } catch (error) {
          console.error("Error in filterMatches fallback:", error);
        }
      };
    }
  }
  
  /**
   * Integrate hero selection components
   */
  function integrateHeroSelection() {
    // Override UIManager's openHeroSelection if both UIManager and HeroSelectionController exist
    if (typeof UIManager !== 'undefined' && typeof HeroSelectionController !== 'undefined') {
      // Save original method if it exists
      const originalOpenHeroSelection = UIManager.openHeroSelection;
      
      // Override with HeroSelectionController's method
      UIManager.openHeroSelection = function(type, teamId, slotIndex) {
        console.log('Using integrated hero selection:', { type, teamId, slotIndex });
        
        if (typeof HeroSelectionController.openModal === 'function') {
          return HeroSelectionController.openModal(teamId, type, slotIndex);
        } else if (typeof originalOpenHeroSelection === 'function') {
          return originalOpenHeroSelection.call(UIManager, type, teamId, slotIndex);
        } else {
          console.warn('No hero selection method available');
        }
      };
      
      // Ensure getSelectionState exists on UIManager
      if (typeof UIManager.getSelectionState !== 'function') {
        UIManager.getSelectionState = function() {
          // Try to get from HeroSelectionController
          if (typeof HeroSelectionController.getSelectionState === 'function') {
            return HeroSelectionController.getSelectionState();
          }
          
          // Fallback
          return {
            targetTeam: 1,
            targetSlot: 0,
            targetType: 'ban'
          };
        };
      }
      
      console.log('Successfully integrated hero selection components');
    } else {
      console.warn('Hero selection integration skipped - components not available');
    }
  }
  
  /**
   * Add common styles for consistent UI
   */
  function addCommonStyles() {
    // Check if styles already exist
    if (document.getElementById('rov-integration-styles')) {
      return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'rov-integration-styles';
    
    style.textContent = `
      /* Common button styles */
      .action-btn, .menu-btn, .position-btn, .filter-btn {
        transition: all 0.2s ease;
      }
      
      .action-btn:hover, .menu-btn:hover, .position-btn:hover, .filter-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      
      .action-btn:active, .menu-btn:active, .position-btn:active, .filter-btn:active {
        transform: translateY(0);
      }
      
      /* Common table styles */
      table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
      }
      
      th {
        background-color: var(--primary-color);
        color: var(--secondary-color);
        font-weight: bold;
        padding: 12px 15px;
        text-align: left;
      }
      
      td {
        padding: 10px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      /* Animation for page transitions */
      .page {
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* Improved responsive design */
      @media (max-width: 768px) {
        .teams-container {
          flex-direction: column;
        }
        
        .team {
          width: 100%;
        }
        
        .position-selector {
          flex-wrap: wrap;
        }
        
        .import-options {
          flex-direction: column;
        }
      }
    `;
    
    // Add style to head
    document.head.appendChild(style);
  }
  
  /**
   * Check if HeroSelectionController exists and create if needed
   */
  function ensureHeroSelectionController() {
    if (typeof HeroSelectionController !== 'undefined') {
      return;
    }
    
    console.log('Creating simple HeroSelectionController');
    
    // Create a simple version
    window.HeroSelectionController = {
      // Current selection state
      currentSelection: null,
      
      // Initialize controller
      init: function() {
        console.log('Initializing simple HeroSelectionController');
        this.ensureModalExists();
        this.setupEventListeners();
      },
      
      // Ensure modal exists
      ensureModalExists: function() {
        if (document.getElementById('heroSelectionModal')) {
          return;
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'heroSelectionModal';
        modal.className = 'hero-selection-modal';
        
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
                <h3>เลือกฮีโร่</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
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
                
                <div class="heroes-grid">
                    <!-- Heroes will be dynamically populated here -->
                </div>
                
                <div class="empty-state" id="emptyState">
                    <i class="fas fa-search"></i>
                    <p>ไม่พบฮีโร่ที่ตรงกับการค้นหา</p>
                </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
      },
      
      // Set up event listeners
      setupEventListeners: function() {
        // Close button
        const closeBtn = document.querySelector('.hero-selection-modal .close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', this.closeModal.bind(this));
        }
        
        // Modal background
        const modal = document.getElementById('heroSelectionModal');
        if (modal) {
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              this.closeModal();
            }
          });
        }
      },
      
      // Open modal
      openModal: function(team, type, slot) {
        this.updateSelectionInfo(team, type, slot);
        this.populateHeroesGrid();
        
        const modal = document.getElementById('heroSelectionModal');
        if (modal) {
          modal.style.display = 'block';
        }
      },
      
      // Close modal
      closeModal: function() {
        const modal = document.getElementById('heroSelectionModal');
        if (modal) {
          modal.style.display = 'none';
        }
      },
      
      // Update selection info
      updateSelectionInfo: function(team, type, slot) {
        const selectionTeam = document.getElementById('selectionTeam');
        const selectionType = document.getElementById('selectionType');
        const selectionSlot = document.getElementById('selectionSlot');
        
        if (selectionTeam) selectionTeam.textContent = `ทีม ${team}`;
        if (selectionType) selectionType.textContent = type === 'ban' ? 'แบน' : 'เลือก';
        if (selectionSlot) selectionSlot.textContent = slot + 1;
        
        this.currentSelection = { team, type, slot };
      },
      
      // Get selection state
      getSelectionState: function() {
        return this.currentSelection;
      },
      
      // Basic implementation of hero grid population
      populateHeroesGrid: function() {
        const heroesGrid = document.querySelector('.heroes-grid');
        if (!heroesGrid) return;
        
        // Clear grid
        heroesGrid.innerHTML = '';
        
        // Get heroes
        let heroes = [];
        
        // Try DataManager
        if (typeof DataManager !== 'undefined' && typeof DataManager.getHeroesByRole === 'function') {
          heroes = DataManager.getHeroesByRole();
        } else {
          // Fallback to localStorage
          try {
            const heroData = JSON.parse(localStorage.getItem('rovHeroData')) || {};
            const heroImages = JSON.parse(localStorage.getItem('rovHeroImages')) || {};
            
            Object.entries(heroData).forEach(([className, heroList]) => {
              heroList.forEach(heroName => {
                const existingHero = heroes.find(h => h.name === heroName);
                if (existingHero) {
                  if (!existingHero.classes.includes(className)) {
                    existingHero.classes.push(className);
                  }
                } else {
                  heroes.push({
                    name: heroName,
                    classes: [className],
                    image: heroImages[heroName] || `https://via.placeholder.com/80?text=${encodeURIComponent(heroName)}`
                  });
                }
              });
            });
          } catch (error) {
            console.error('Error loading hero data:', error);
          }
        }
        
        // Add heroes to grid
        heroes.forEach(hero => {
          const heroCard = document.createElement('div');
          heroCard.className = 'hero-card';
          
          const heroImg = document.createElement('img');
          heroImg.src = hero.image;
          heroImg.alt = hero.name;
          
          const heroName = document.createElement('div');
          heroName.className = 'hero-name';
          heroName.textContent = hero.name;
          
          heroCard.appendChild(heroImg);
          heroCard.appendChild(heroName);
          
          // Add click handler
          heroCard.addEventListener('click', () => {
            this.selectHero(hero.name);
          });
          
          heroesGrid.appendChild(heroCard);
        });
      },
      
      // Select hero
      selectHero: function(heroName) {
        if (!this.currentSelection) return false;
        
        let success = false;
        
        if (this.currentSelection.type === 'ban') {
          if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.addBan === 'function') {
            success = AnalyticsManager.addBan(
              this.currentSelection.team,
              heroName,
              this.currentSelection.slot
            );
          }
        } else {
          if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.addPick === 'function') {
            success = AnalyticsManager.addPick(
              this.currentSelection.team,
              heroName,
              this.currentSelection.slot
            );
          }
        }
        
        if (success) {
          this.closeModal();
          
          if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
            UIManager.render();
          }
        } else {
          alert('ไม่สามารถเลือกฮีโร่นี้ได้ อาจเพราะถูกเลือกหรือแบนไปแล้ว');
        }
        
        return success;
      }
    };
  }
  
  // Public API
  return {
    init,
    initialized,
    ensureHeroSelectionController
  };
})();

// Initialize integration when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing RoV Draft Helper with enhanced integration...");
  
  // Initialize integration
  RoVIntegration.init();
  
  // Ensure critical components exist
  if (typeof HeroSelectionController === 'undefined') {
    RoVIntegration.ensureHeroSelectionController();
    HeroSelectionController.init();
  }
});