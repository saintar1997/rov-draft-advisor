/**
 * hero-manager.js - Hero data management system
 * Refactored for better organization, error handling, and performance
 */

const HeroManager = (() => {
  // State variables
  let allHeroes = [];
  let heroImages = {};
  
  // Hero class color mapping (for UI consistency)
  const HERO_CLASS_COLORS = {
    'Assassin': '#ff5252', // Red
    'Fighter': '#ff9800',  // Orange
    'Mage': '#2196f3',     // Blue
    'Carry': '#9c27b0',    // Purple
    'Support': '#4caf50',  // Green
    'Tank': '#607d8b'      // Gray
  };
  
  // Sample hero data (in case none exists in localStorage)
  const DEFAULT_HEROES = {
    "Assassin": ["Airi", "Butterfly", "Keera", "Murad", "Nakroth", "Quillen", "Wukong", "Zuka"],
    "Fighter": ["Allain", "Arthur", "Astrid", "Florentino", "Lu Bu", "Omen", "Qi", "Riktor", "Valhein", "Yena"],
    "Mage": ["Azzen'Ka", "Dirak", "Ignis", "Ilumia", "Kahlii", "Krixi", "Lauriel", "Liliana", "Natalya", "Tulen", "Zata"],
    "Carry": ["Capheny", "Elsu", "Laville", "Lindis", "Slimz", "Tel'Annas", "Thorne", "Violet", "Wisp", "Yorn"],
    "Support": ["Alice", "Annette", "Chaugnar", "Enzo", "Ishar", "Krizzix", "Lumburr", "Rouie", "Zip"],
    "Tank": ["Arum", "Baldum", "Grakk", "Moren", "Omega", "Ormarr", "Roxie", "Skud", "Thane", "Y'bneth"]
  };

  /**
   * Initialize Hero Manager
   * @returns {boolean} Whether initialization was successful
   */
  function init() {
    console.log('Initializing Hero Manager...');
    
    try {
      // Load hero data
      loadHeroData();
      
      // Setup event handlers
      setupEventListeners();
      
      // Apply UI enhancements
      enhanceHeroGrid();
      
      console.log('Hero Manager initialized with', allHeroes.length, 'heroes');
      return true;
    } catch (error) {
      console.error('Error initializing Hero Manager:', error);
      return false;
    }
  }
  
  /**
   * Load hero data from localStorage or default data
   */
  function loadHeroData() {
    // Load hero class data
    try {
      const savedHeroes = localStorage.getItem('rovHeroData');
      const heroClasses = savedHeroes ? JSON.parse(savedHeroes) : DEFAULT_HEROES;
      
      // Convert class-based object to flat array
      processHeroes(heroClasses);
    } catch (error) {
      console.error('Error loading hero data:', error);
      // Fallback to default data
      processHeroes(DEFAULT_HEROES);
    }
    
    // Load hero images
    try {
      const savedImages = localStorage.getItem('rovHeroImages');
      heroImages = savedImages ? JSON.parse(savedImages) : {};
    } catch (error) {
      console.error('Error loading hero images:', error);
      heroImages = {};
    }
  }
  
  /**
   * Process heroes from class-based object to flat array
   * @param {Object} heroClasses - Hero classes object
   */
  function processHeroes(heroClasses) {
    allHeroes = [];
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
          allHeroes.push({
            name: heroName,
            classes: heroClasses,
            primaryClass: heroClasses[0],
            image: getHeroImage(heroName)
          });
        }
      });
    });
    
    // Sort heroes alphabetically
    allHeroes.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  /**
   * Get hero image URL (or placeholder if none exists)
   * @param {string} heroName - Hero name
   * @returns {string} Hero image URL
   */
  function getHeroImage(heroName) {
    if (heroImages[heroName]) {
      return heroImages[heroName];
    }
    return `https://via.placeholder.com/80?text=${encodeURIComponent(heroName)}`;
  }
  
  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Hero search input in heroes page
    const heroSearch = document.getElementById('hero-search');
    if (heroSearch) {
      heroSearch.addEventListener('input', filterHeroesBySearch);
    }
    
    // Hero class filter in heroes page
    const classFilter = document.getElementById('class-filter');
    if (classFilter) {
      classFilter.addEventListener('change', filterHeroesByClass);
    }
    
    // Import heroes button
    const importHeroesBtn = document.getElementById('import-heroes-btn');
    if (importHeroesBtn) {
      importHeroesBtn.addEventListener('click', handleImportHeroes);
    }
    
    // Add hero button
    const addHeroBtn = document.getElementById('add-hero-btn');
    if (addHeroBtn) {
      addHeroBtn.addEventListener('click', handleAddHero);
    }
    
    // Hero image preview
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
      heroImage.addEventListener('change', previewHeroImage);
    }
    
    // Delete all heroes button
    const deleteAllHeroesBtn = document.getElementById('delete-all-heroes-btn');
    if (deleteAllHeroesBtn) {
      deleteAllHeroesBtn.addEventListener('click', handleDeleteAllHeroes);
    }
  }
  
  /**
   * Handle hero import from Excel file
   */
  function handleImportHeroes() {
    console.log("Import heroes button clicked");
    const fileInput = document.getElementById('import-heroes-file');
    
    if (!fileInput || !fileInput.files.length) {
      alert('กรุณาเลือกไฟล์ก่อน');
      return;
    }
    
    const file = fileInput.files[0];
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('กรุณาเลือกไฟล์ Excel (.xlsx หรือ .xls) เท่านั้น');
      return;
    }
    
    console.log("Starting import from Excel file:", file.name);
    
    // Ask user if they want to clear existing data
    const clearAll = confirm(
      'คุณต้องการลบข้อมูลฮีโร่เก่าทั้งหมดและนำเข้าใหม่หรือไม่?\n\n' +
      'กด "OK" เพื่อลบข้อมูลเก่าและนำเข้าใหม่ทั้งหมด\n' +
      'กด "Cancel" เพื่อเพิ่มข้อมูลเข้าไปในข้อมูลเดิม'
    );
    
    // Show loading overlay
    showLoading();
    
    try {
      // Check for XLSX library
      if (typeof XLSX === 'undefined') {
        loadXlsxLibrary()
          .then(() => processExcelFile(file, clearAll))
          .catch(error => {
            console.error('Error loading XLSX library:', error);
            alert('ไม่สามารถโหลดไลบรารี XLSX ได้: ' + error.message);
            hideLoading();
          });
      } else {
        processExcelFile(file, clearAll);
      }
    } catch (error) {
      console.error('Error importing heroes:', error);
      alert('เกิดข้อผิดพลาดในการนำเข้าฮีโร่: ' + error.message);
      hideLoading();
    }
  }
  
  /**
   * Load XLSX library if not available
   * @returns {Promise} Promise that resolves when the library is loaded
   */
  function loadXlsxLibrary() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  /**
   * Process Excel file for hero import
   * @param {File} file - Excel file
   * @param {boolean} clearAll - Whether to clear existing data
   */
  function processExcelFile(file, clearAll) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length <= 1) {
          alert('ไม่พบข้อมูลในไฟล์');
          hideLoading();
          return;
        }
        
        // Process heroes
        let heroes = {};
        
        // Clear existing data if requested
        if (clearAll) {
          heroes = {};
          localStorage.removeItem('rovHeroImages');
          localStorage.setItem('rovHeroImages', JSON.stringify({}));
        } else {
          try {
            heroes = JSON.parse(localStorage.getItem('rovHeroData')) || {};
          } catch (error) {
            console.error('Error parsing hero data:', error);
            heroes = {};
          }
        }
        
        // Process each row (skip header)
        let heroCount = 0;
        let processedHeroes = new Set(); // Track unique heroes
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Check row has enough data
          if (row.length < 2) continue;
          
          // Extract hero data
          const heroName = row[0];
          const heroClassesRaw = row[1];
          const imagePath = row[2] || '';
          
          if (!heroName || !heroClassesRaw) continue;
          
          // Process hero classes
          const heroClasses = heroClassesRaw.split('|').map(cls => cls.trim());
          
          // Add hero to each class
          for (const heroClass of heroClasses) {
            if (!heroes[heroClass]) {
              heroes[heroClass] = [];
            }
            
            if (!heroes[heroClass].includes(heroName)) {
              heroes[heroClass].push(heroName);
            }
          }
          
          // Count unique heroes
          if (!processedHeroes.has(heroName)) {
            heroCount++;
            processedHeroes.add(heroName);
          }
          
          // Save image path if provided
          if (imagePath) {
            let heroImages = {};
            try {
              heroImages = JSON.parse(localStorage.getItem('rovHeroImages')) || {};
            } catch (error) {
              console.error('Error parsing hero images:', error);
              heroImages = {};
            }
            
            heroImages[heroName] = imagePath;
            localStorage.setItem('rovHeroImages', JSON.stringify(heroImages));
          }
        }
        
        // Save hero data
        localStorage.setItem('rovHeroData', JSON.stringify(heroes));
        
        // Refresh table
        if (typeof renderHeroesTable === 'function') {
          renderHeroesTable();
        }
        
        // Reset form
        document.getElementById('import-heroes-file').value = '';
        
        const message = clearAll ? 
          `ลบข้อมูลเก่าและนำเข้าข้อมูลฮีโร่ใหม่สำเร็จ เพิ่มฮีโร่ ${heroCount} ตัว` : 
          `นำเข้าข้อมูลฮีโร่สำเร็จ เพิ่มฮีโร่ใหม่ ${heroCount} ตัว`;
        
        alert(message);
        
        // Reload hero data
        loadHeroData();
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('เกิดข้อผิดพลาดในการประมวลผลไฟล์ Excel: ' + error.message);
      } finally {
        hideLoading();
      }
    };
    
    reader.onerror = function() {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
      hideLoading();
    };
    
    reader.readAsArrayBuffer(file);
  }
  
  /**
   * Handle adding a new hero
   */
  function handleAddHero() {
    const heroName = document.getElementById('hero-name').value.trim();
    const heroClass = document.getElementById('hero-class').value;
    const heroImageInput = document.getElementById('hero-image');
    
    // Validate inputs
    if (!heroName) {
      alert('กรุณาใส่ชื่อฮีโร่');
      return;
    }
    
    if (!heroImageInput.files || heroImageInput.files.length === 0) {
      alert('กรุณาเลือกรูปภาพ');
      return;
    }
    
    const file = heroImageInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const imageData = e.target.result; // Base64 encoded image
        
        // Load existing heroes
        let heroes = {};
        try {
          heroes = JSON.parse(localStorage.getItem('rovHeroData')) || {};
        } catch (error) {
          console.error('Error parsing hero data:', error);
          heroes = {};
        }
        
        // Add hero to class
        if (!heroes[heroClass]) {
          heroes[heroClass] = [];
        }
        
        if (!heroes[heroClass].includes(heroName)) {
          heroes[heroClass].push(heroName);
        }
        
        // Save hero data
        localStorage.setItem('rovHeroData', JSON.stringify(heroes));
        
        // Save hero image
        let heroImages = {};
        try {
          heroImages = JSON.parse(localStorage.getItem('rovHeroImages')) || {};
        } catch (error) {
          console.error('Error parsing hero images:', error);
          heroImages = {};
        }
        
        heroImages[heroName] = imageData;
        localStorage.setItem('rovHeroImages', JSON.stringify(heroImages));
        
        // Reset form
        document.getElementById('hero-name').value = '';
        document.getElementById('hero-image').value = '';
        document.getElementById('image-preview').innerHTML = '<span>ตัวอย่างรูปภาพ</span>';
        
        // Refresh table
        if (typeof renderHeroesTable === 'function') {
          renderHeroesTable();
        }
        
        // Reload hero data
        loadHeroData();
        
        alert(`เพิ่มฮีโร่ ${heroName} (${heroClass}) สำเร็จ`);
      } catch (error) {
        console.error('Error adding hero:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มฮีโร่: ' + error.message);
      }
    };
    
    reader.onerror = function() {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ');
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * Preview hero image before upload
   * @param {Event} e - Change event
   */
  function previewHeroImage(e) {
    const preview = document.getElementById('image-preview');
    if (!preview) return;
    
    preview.innerHTML = '';
    
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        preview.appendChild(img);
      };
      
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = '<span>ตัวอย่างรูปภาพ</span>';
    }
  }
  
  /**
   * Handle deleting all heroes
   */
  function handleDeleteAllHeroes() {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลฮีโร่ทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
      try {
        // Clear hero data
        localStorage.removeItem('rovHeroData');
        localStorage.removeItem('rovHeroImages');
        
        // Set empty objects
        localStorage.setItem('rovHeroData', JSON.stringify({}));
        localStorage.setItem('rovHeroImages', JSON.stringify({}));
        
        // Refresh table
        if (typeof renderHeroesTable === 'function') {
          renderHeroesTable();
        }
        
        // Reload hero data
        loadHeroData();
        
        alert('ลบข้อมูลฮีโร่ทั้งหมดเรียบร้อย');
      } catch (error) {
        console.error('Error deleting all heroes:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูลฮีโร่: ' + error.message);
      }
    }
  }
  
  /**
   * Filter heroes by search term
   */
  function filterHeroesBySearch() {
    const searchText = document.getElementById('hero-search')?.value.toLowerCase() || '';
    const activeClass = document.getElementById('class-filter')?.value || '';
    
    filterHeroes(searchText, activeClass);
  }
  
  /**
   * Filter heroes by class
   */
  function filterHeroesByClass() {
    const searchText = document.getElementById('hero-search')?.value.toLowerCase() || '';
    const activeClass = document.getElementById('class-filter')?.value || '';
    
    filterHeroes(searchText, activeClass);
  }
  
  /**
   * Filter heroes in the table
   * @param {string} searchText - Search text
   * @param {string} classFilter - Class filter
   */
  function filterHeroes(searchText, classFilter) {
    const rows = document.querySelectorAll('#heroes-tbody tr');
    
    rows.forEach(row => {
      const nameCell = row.querySelector('td:nth-child(2)');
      const classCell = row.querySelector('td:nth-child(3)');
      
      if (!nameCell || !classCell) return;
      
      const name = nameCell.textContent.toLowerCase();
      
      // Get hero classes from spans
      const classSpans = classCell.querySelectorAll('span');
      const heroClasses = Array.from(classSpans)
        .filter(span => span.textContent !== '|')
        .map(span => span.textContent);
      
      const matchesSearch = name.includes(searchText);
      const matchesClass = classFilter === '' || heroClasses.includes(classFilter);
      
      row.style.display = matchesSearch && matchesClass ? '' : 'none';
    });
  }
  
  /**
   * Handle hero selection for ban or pick
   * @param {string} heroName - Hero name
   */
  function selectHero(heroName) {
    console.log('Selected hero:', heroName);
    
    // Get current selection state from UI Manager
    const selectionState = getSelectionState();
    if (!selectionState) {
      console.warn('Selection state not available');
      return;
    }
    
    // Attempt to add the hero to the draft
    let success = false;
    
    if (selectionState.targetType === 'ban') {
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.addBan === 'function') {
        success = AnalyticsManager.addBan(
          selectionState.targetTeam,
          heroName,
          selectionState.targetSlot
        );
      }
    } else {
      if (typeof AnalyticsManager !== 'undefined' && typeof AnalyticsManager.addPick === 'function') {
        success = AnalyticsManager.addPick(
          selectionState.targetTeam,
          heroName,
          selectionState.targetSlot
        );
      }
    }
    
    // Handle result
    if (success) {
      // Close modal
      closeHeroSelectionModal();
      
      // Refresh UI
      if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
        UIManager.render();
      }
    } else {
      alert('ไม่สามารถเลือกฮีโร่นี้ได้ อาจเพราะถูกเลือกหรือแบนไปแล้ว');
    }
  }
  
  /**
   * Get selection state from UI Manager
   * @returns {Object|null} Selection state or null if not available
   */
  function getSelectionState() {
    if (typeof UIManager !== 'undefined' && typeof UIManager.getSelectionState === 'function') {
      return UIManager.getSelectionState();
    }
    
    if (typeof HeroSelectionController !== 'undefined' && typeof HeroSelectionController.getSelectionState === 'function') {
      return HeroSelectionController.getSelectionState();
    }
    
    return {
      targetTeam: 1,
      targetSlot: 0,
      targetType: 'ban'
    };
  }
  
  /**
   * Close hero selection modal
   */
  function closeHeroSelectionModal() {
    const modal = document.getElementById('heroSelectionModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  /**
   * Get a hero by name
   * @param {string} name - Hero name
   * @returns {Object|null} Hero object or null if not found
   */
  function getHeroByName(name) {
    return allHeroes.find(hero => hero.name === name) || null;
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
   * Apply visual enhancements to the hero selection grid
   */
  function enhanceHeroGrid() {
    // Check if styles already exist
    if (document.getElementById('hero-grid-styles')) {
      return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'hero-grid-styles';
    
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
    `;
    
    // Add style to head
    document.head.appendChild(style);
  }
  
  // Public API
  return {
    init,
    allHeroes,
    getHeroByName,
    selectHero,
    getHeroImage,
    enhanceHeroGrid
  };
})();

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if not already initialized by app.js
  if (typeof RoVDraftHelper === 'undefined' || !RoVDraftHelper.initialized) {
    HeroManager.init();
  }
});