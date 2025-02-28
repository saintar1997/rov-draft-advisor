/**
 * ui-manager.js - Main UI controller
 * Orchestrates the application UI and integrates with other UI components
 */

import DraftUI from './components/draft-ui.js';
import HeroSelectionController from '../heroes/hero-selection.js';
import HeroManager from '../heroes/hero-manager.js';
import MatchesManager from '../matches/matches-manager.js';

const UIManager = (() => {
  // Current active page
  let activePage = 'draft';
  
  // Selection state for hero selection
  let selectionState = {
    targetTeam: 1,
    targetSlot: 0,
    targetType: 'ban' // 'ban' or 'pick'
  };
  
  /**
   * Initialize UI Manager
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async function init() {
    try {
      console.log('Initializing UI Manager...');
      
      // Set up navigation and page switching
      setupNavigation();
      
      // Load default settings
      loadSettings();
      
      // Initialize DraftUI
      await DraftUI.init();
      
      // Set initial page
      setActivePage('draft');
      
      // Set up event handlers for heroes management
      setupHeroesManagement();
      
      // Set up event handlers for settings
      setupSettingsHandlers();
      
      console.log('UI Manager initialized successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error initializing UI Manager:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Set up navigation between pages
   */
  function setupNavigation() {
    try {
      // Page navigation buttons
      const draftBtn = document.getElementById('draft-btn');
      const historyBtn = document.getElementById('history-btn');
      const heroesBtn = document.getElementById('heroes-btn');
      const settingsBtn = document.getElementById('settings-btn');
      
      if (draftBtn) {
        draftBtn.addEventListener('click', () => setActivePage('draft'));
      }
      
      if (historyBtn) {
        historyBtn.addEventListener('click', () => setActivePage('history'));
      }
      
      if (heroesBtn) {
        heroesBtn.addEventListener('click', () => setActivePage('heroes'));
      }
      
      if (settingsBtn) {
        settingsBtn.addEventListener('click', () => setActivePage('settings'));
      }
    } catch (error) {
      console.error('Error setting up navigation:', error);
    }
  }
  
  /**
   * Set active page
   * @param {string} pageId - ID of the page to activate
   */
  function setActivePage(pageId) {
    try {
      console.log('Setting active page:', pageId);
      
      // Update active page
      activePage = pageId;
      
      // Update menu buttons
      const menuButtons = {
        draft: document.getElementById('draft-btn'),
        history: document.getElementById('history-btn'),
        heroes: document.getElementById('heroes-btn'),
        settings: document.getElementById('settings-btn')
      };
      
      Object.keys(menuButtons).forEach(key => {
        const button = menuButtons[key];
        if (button) {
          button.classList.toggle('active', key === pageId);
        }
      });
      
      // Update pages
      const pages = {
        draft: document.getElementById('draft-page'),
        history: document.getElementById('history-page'),
        heroes: document.getElementById('heroes-page'),
        settings: document.getElementById('settings-page')
      };
      
      Object.keys(pages).forEach(key => {
        const page = pages[key];
        if (page) {
          page.classList.toggle('active', key === pageId);
        }
      });
      
      // Page-specific initialization
      if (pageId === 'draft') {
        DraftUI.render();
      } else if (pageId === 'history') {
        MatchesManager.renderMatchesTable();
      } else if (pageId === 'heroes') {
        renderHeroesTable();
      } else if (pageId === 'settings') {
        loadSettings();
      }
    } catch (error) {
      console.error('Error setting active page:', error);
    }
  }
  
  /**
   * Render the current UI state
   */
  function render() {
    try {
      // Render page-specific content
      if (activePage === 'draft') {
        DraftUI.render();
      } else if (activePage === 'history') {
        MatchesManager.renderMatchesTable();
      } else if (activePage === 'heroes') {
        renderHeroesTable();
      }
    } catch (error) {
      console.error('Error rendering UI:', error);
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
      // Save selection state
      selectionState = {
        targetTeam: teamId,
        targetSlot: slotIndex,
        targetType: type
      };
      
      // Delegate to HeroSelectionController
      HeroSelectionController.openModal(teamId, type, slotIndex);
    } catch (error) {
      console.error('Error opening hero selection:', error);
    }
  }
  
  /**
   * Get the current selection state
   * @returns {Object} Selection state object
   */
  function getSelectionState() {
    return selectionState;
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
   * Render heroes table
   */
  function renderHeroesTable() {
    try {
      const tbody = document.getElementById('heroes-tbody');
      if (!tbody) return;
      
      // Clear table
      tbody.innerHTML = '';
      
      // Get heroes
      const heroes = HeroManager.allHeroes;
      
      // Sort heroes alphabetically
      heroes.sort((a, b) => a.name.localeCompare(b.name));
      
      // Add heroes to table
      heroes.forEach(hero => {
        const row = document.createElement('tr');
        
        // Image cell
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = hero.image;
        img.alt = hero.name;
        imageCell.appendChild(img);
        
        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = hero.name;
        
        // Classes cell
        const classesCell = document.createElement('td');
        const heroClasses = document.createElement('div');
        heroClasses.className = 'hero-classes';
        
        hero.classes.forEach((cls, index) => {
          // Create class badge
          const badge = document.createElement('span');
          badge.className = `class-badge class-badge-${cls.toLowerCase()}`;
          badge.textContent = cls;
          heroClasses.appendChild(badge);
          
          // Add separator if not last class
          if (index < hero.classes.length - 1) {
            const separator = document.createElement('span');
            separator.textContent = ' | ';
            separator.className = 'class-separator';
            heroClasses.appendChild(separator);
          }
        });
        
        classesCell.appendChild(heroClasses);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'ลบ';
        deleteBtn.addEventListener('click', () => deleteHero(hero.name));
        actionsCell.appendChild(deleteBtn);
        
        // Add cells to row
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(classesCell);
        row.appendChild(actionsCell);
        
        // Add row to table
        tbody.appendChild(row);
      });
      
      // If no heroes
      if (heroes.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.textContent = 'ไม่พบข้อมูลฮีโร่ กรุณาเพิ่มหรือนำเข้าข้อมูลฮีโร่';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      }
      
      // Update filters
      updateHeroFilters();
    } catch (error) {
      console.error('Error rendering heroes table:', error);
    }
  }
  
  /**
   * Update hero filters with available classes
   */
  function updateHeroFilters() {
    try {
      const classFilter = document.getElementById('class-filter');
      if (!classFilter) return;
      
      // Clear existing options except first one
      while (classFilter.options.length > 1) {
        classFilter.remove(1);
      }
      
      // Get unique classes
      const classes = new Set();
      HeroManager.allHeroes.forEach(hero => {
        hero.classes.forEach(cls => classes.add(cls));
      });
      
      // Sort classes
      const sortedClasses = Array.from(classes).sort();
      
      // Add class options
      sortedClasses.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classFilter.appendChild(option);
      });
    } catch (error) {
      console.error('Error updating hero filters:', error);
    }
  }
  
  /**
   * Delete a hero
   * @param {string} heroName - Name of the hero to delete
   */
  async function deleteHero(heroName) {
    try {
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบฮีโร่ ${heroName}?`)) {
        showLoading();
        
        // Delete hero using HeroManager
        const success = await HeroManager.deleteHero(heroName);
        
        if (success) {
          // Refresh table
          renderHeroesTable();
          alert(`ลบฮีโร่ ${heroName} เรียบร้อยแล้ว`);
        } else {
          alert('เกิดข้อผิดพลาดในการลบฮีโร่');
        }
        
        hideLoading();
      }
    } catch (error) {
      console.error('Error deleting hero:', error);
      hideLoading();
      alert('เกิดข้อผิดพลาดในการลบฮีโร่');
    }
  }
  
  /**
   * Set up event handlers for heroes management
   */
  function setupHeroesManagement() {
    try {
      // Hero search
      const heroSearch = document.getElementById('hero-search');
      if (heroSearch) {
        heroSearch.addEventListener('input', filterHeroes);
      }
      
      // Class filter
      const classFilter = document.getElementById('class-filter');
      if (classFilter) {
        classFilter.addEventListener('change', filterHeroes);
      }
      
      // Delete all heroes button
      const deleteAllHeroesBtn = document.getElementById('delete-all-heroes-btn');
      if (deleteAllHeroesBtn) {
        deleteAllHeroesBtn.addEventListener('click', deleteAllHeroes);
      }
      
      // Add hero button
      const addHeroBtn = document.getElementById('add-hero-btn');
      if (addHeroBtn) {
        addHeroBtn.addEventListener('click', addHero);
      }
      
      // Hero image preview
      const heroImageInput = document.getElementById('hero-image');
      if (heroImageInput) {
        heroImageInput.addEventListener('change', previewHeroImage);
      }
      
      // Import heroes button
      const importHeroesBtn = document.getElementById('import-heroes-btn');
      if (importHeroesBtn) {
        importHeroesBtn.addEventListener('click', importHeroes);
      }
    } catch (error) {
      console.error('Error setting up heroes management:', error);
    }
  }
  
  /**
   * Filter heroes table based on search and class filter
   */
  function filterHeroes() {
    try {
      const searchText = document.getElementById('hero-search')?.value.toLowerCase() || '';
      const classFilter = document.getElementById('class-filter')?.value || '';
      
      const tbody = document.getElementById('heroes-tbody');
      if (!tbody) return;
      
      const rows = tbody.querySelectorAll('tr');
      
      rows.forEach(row => {
        // Skip empty row message
        if (row.querySelector('td[colspan]')) return;
        
        const nameCell = row.querySelector('td:nth-child(2)');
        const classesCell = row.querySelector('td:nth-child(3)');
        
        if (!nameCell || !classesCell) return;
        
        const name = nameCell.textContent.toLowerCase();
        const classBadges = classesCell.querySelectorAll('.class-badge');
        const classes = Array.from(classBadges).map(badge => badge.textContent);
        
        const matchesSearch = name.includes(searchText);
        const matchesClass = classFilter === '' || classes.includes(classFilter);
        
        row.style.display = matchesSearch && matchesClass ? '' : 'none';
      });
    } catch (error) {
      console.error('Error filtering heroes:', error);
    }
  }
  
  /**
   * Delete all heroes
   */
  async function deleteAllHeroes() {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลฮีโร่ทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
        showLoading();
        
        // Clear hero data in localStorage
        localStorage.setItem('rovHeroData', JSON.stringify({}));
        localStorage.setItem('rovHeroImages', JSON.stringify({}));
        
        // Reinitialize HeroManager
        await HeroManager.init();
        
        // Refresh table
        renderHeroesTable();
        
        hideLoading();
        
        alert('ลบข้อมูลฮีโร่ทั้งหมดเรียบร้อย');
      }
    } catch (error) {
      console.error('Error deleting all heroes:', error);
      hideLoading();
      alert('เกิดข้อผิดพลาดในการลบข้อมูลฮีโร่');
    }
  }
  
  /**
   * Preview hero image when file is selected
   * @param {Event} event - Change event from file input
   */
  function previewHeroImage(event) {
    try {
      const preview = document.getElementById('image-preview');
      if (!preview) return;
      
      preview.innerHTML = '';
      
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = e => {
          const img = document.createElement('img');
          img.src = e.target.result;
          preview.appendChild(img);
        };
        
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = '<span>ตัวอย่างรูปภาพ</span>';
      }
    } catch (error) {
      console.error('Error previewing hero image:', error);
    }
  }
  
  /**
   * Add a new hero
   */
  async function addHero() {
    try {
      const heroName = document.getElementById('hero-name')?.value.trim();
      const heroClass = document.getElementById('hero-class')?.value;
      const heroImageInput = document.getElementById('hero-image');
      
      if (!heroName) {
        alert('กรุณาใส่ชื่อฮีโร่');
        return;
      }
      
      if (!heroClass) {
        alert('กรุณาเลือกคลาสฮีโร่');
        return;
      }
      
      if (!heroImageInput || !heroImageInput.files || heroImageInput.files.length === 0) {
        alert('กรุณาเลือกรูปภาพ');
        return;
      }
      
      const file = heroImageInput.files[0];
      
      showLoading();
      
      try {
        // Process hero image
        const imageData = await HeroManager.processHeroImage(file);
        
        // Add hero
        const success = await HeroManager.addHero(heroName, heroClass, imageData);
        
        if (success) {
          // Reset form
          document.getElementById('hero-name').value = '';
          document.getElementById('hero-image').value = '';
          document.getElementById('image-preview').innerHTML = '<span>ตัวอย่างรูปภาพ</span>';
          
          // Refresh table
          renderHeroesTable();
          
          alert(`เพิ่มฮีโร่ ${heroName} สำเร็จ`);
        } else {
          alert('ไม่สามารถเพิ่มฮีโร่ได้ ชื่อฮีโร่อาจซ้ำ');
        }
      } catch (error) {
        console.error('Error processing hero image:', error);
        alert('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
      } finally {
        hideLoading();
      }
    } catch (error) {
      console.error('Error adding hero:', error);
      hideLoading();
      alert('เกิดข้อผิดพลาดในการเพิ่มฮีโร่');
    }
  }
  
  /**
   * Import heroes from file
   */
  async function importHeroes() {
    try {
      const fileInput = document.getElementById('import-heroes-file');
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('กรุณาเลือกไฟล์ก่อน');
        return;
      }
      
      const file = fileInput.files[0];
      
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('กรุณาเลือกไฟล์ Excel (.xlsx หรือ .xls) เท่านั้น');
        return;
      }
      
      // Ask whether to clear existing heroes
      const clearAll = confirm('คุณต้องการลบข้อมูลฮีโร่เก่าทั้งหมดและนำเข้าใหม่หรือไม่?\n\nกด "OK" เพื่อลบข้อมูลเก่าและนำเข้าใหม่ทั้งหมด\nกด "Cancel" เพื่อเพิ่มข้อมูลเข้าไปในข้อมูลเดิม');
      
      showLoading();
      
      try {
        // Load XLSX library if needed
        if (typeof XLSX === 'undefined') {
          alert('กรุณาโหลดเว็บไซต์ใหม่เพื่อโหลดไลบรารี XLSX');
          hideLoading();
          return;
        }
        
        // Read Excel file
        const reader = new FileReader();
        
        reader.onload = async function(e) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Check if data exists
            if (jsonData.length <= 1) {
              alert('ไม่พบข้อมูลในไฟล์');
              hideLoading();
              return;
            }
            
            // If clearing existing heroes
            if (clearAll) {
              localStorage.setItem('rovHeroData', JSON.stringify({}));
              localStorage.setItem('rovHeroImages', JSON.stringify({}));
            }
            
            // Get existing hero data
            let heroes = {};
            try {
              heroes = JSON.parse(localStorage.getItem('rovHeroData')) || {};
            } catch (error) {
              heroes = {};
            }
            
            // Process heroes
            let heroCount = 0;
            
            // Skip header row
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              
              // Check if row has enough data
              if (row.length < 2) continue;
              
              const heroName = row[0];
              const heroClassesRaw = row[1];
              
              if (!heroName || !heroClassesRaw) continue;
              
              // Split classes
              const heroClasses = heroClassesRaw.split('|').map(cls => cls.trim());
              
              // Add hero to each class
              for (const heroClass of heroClasses) {
                if (!heroes[heroClass]) {
                  heroes[heroClass] = [];
                }
                
                if (!heroes[heroClass].includes(heroName)) {
                  heroes[heroClass].push(heroName);
                  heroCount++;
                }
              }
            }
            
            // Save hero data
            localStorage.setItem('rovHeroData', JSON.stringify(heroes));
            
            // Reinitialize HeroManager
            await HeroManager.init();
            
            // Refresh table
            renderHeroesTable();
            
            // Reset file input
            fileInput.value = '';
            
            const message = clearAll ? 
              `ลบข้อมูลเก่าและนำเข้าข้อมูลฮีโร่ใหม่สำเร็จ เพิ่มฮีโร่ ${heroCount} ตัว` : 
              `นำเข้าข้อมูลฮีโร่สำเร็จ เพิ่มฮีโร่ใหม่ ${heroCount} ตัว`;
            
            alert(message);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel: ' + error.message);
          } finally {
            hideLoading();
          }
        };
        
        reader.onerror = function() {
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
          hideLoading();
        };
        
        // Read file as ArrayBuffer
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error importing heroes from file:', error);
        hideLoading();
        alert('เกิดข้อผิดพลาดในการนำเข้าฮีโร่: ' + error.message);
      }
    } catch (error) {
      console.error('Error importing heroes:', error);
      hideLoading();
      alert('เกิดข้อผิดพลาดในการนำเข้าฮีโร่');
    }
  }
  
  /**
   * Set up event handlers for settings
   */
  function setupSettingsHandlers() {
    try {
      // Default format
      const defaultFormat = document.getElementById('default-format');
      if (defaultFormat) {
        defaultFormat.addEventListener('change', () => {
          localStorage.setItem('rovDefaultFormat', defaultFormat.value);
        });
      }
      
      // Export data
      const exportDataBtn = document.getElementById('export-data-btn');
      if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
      }
      
      // Import data
      const importDataBtn = document.getElementById('import-data-btn');
      if (importDataBtn) {
        importDataBtn.addEventListener('click', importData);
      }
      
      // Clear data
      const clearDataBtn = document.getElementById('clear-data-btn');
      if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearData);
      }
    } catch (error) {
      console.error('Error setting up settings handlers:', error);
    }
  }
  
  /**
   * Load settings
   */
  function loadSettings() {
    try {
      // Load default format
      const defaultFormat = localStorage.getItem('rovDefaultFormat') || 'ranking';
      const defaultFormatSelect = document.getElementById('default-format');
      if (defaultFormatSelect) {
        defaultFormatSelect.value = defaultFormat;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  /**
   * Export application data
   */
  function exportData() {
    try {
      // Collect data
      const data = {
        heroes: JSON.parse(localStorage.getItem('rovHeroData') || '{}'),
        heroImages: JSON.parse(localStorage.getItem('rovHeroImages') || '{}'),
        matches: JSON.parse(localStorage.getItem('rovMatchData') || '[]'),
        draftState: JSON.parse(localStorage.getItem('rovDraftState') || '{}'),
        settings: {
          defaultFormat: localStorage.getItem('rovDefaultFormat') || 'ranking'
        }
      };
      
      // Convert to JSON string
      const dataStr = JSON.stringify(data, null, 2);
      
      // Create data URI
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      // Create download link
      const exportFileDefaultName = 'rov_draft_helper_data.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      
      // Trigger download
      linkElement.click();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  }
  
  /**
   * Import application data
   */
  function importData() {
    try {
      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        showLoading();
        
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const data = JSON.parse(event.target.result);
            
            // Validate data
            if (!data.heroes || !data.matches) {
              alert('ไฟล์ข้อมูลไม่ถูกต้อง');
              hideLoading();
              return;
            }
            
            // Save data
            localStorage.setItem('rovHeroData', JSON.stringify(data.heroes));
            
            if (data.heroImages) {
              localStorage.setItem('rovHeroImages', JSON.stringify(data.heroImages));
            }
            
            localStorage.setItem('rovMatchData', JSON.stringify(data.matches));
            
            if (data.draftState) {
              localStorage.setItem('rovDraftState', JSON.stringify(data.draftState));
            }
            
            if (data.settings && data.settings.defaultFormat) {
              localStorage.setItem('rovDefaultFormat', data.settings.defaultFormat);
            }
            
            alert('นำเข้าข้อมูลสำเร็จ จะรีโหลดหน้าเว็บเพื่อใช้ข้อมูลใหม่');
            
            // Reload page
            window.location.reload();
          } catch (error) {
            console.error('Error parsing imported data:', error);
            alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + error.message);
            hideLoading();
          }
        };
        
        reader.onerror = function() {
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
          hideLoading();
        };
        
        reader.readAsText(file);
      };
      
      // Trigger file selection
      input.click();
    } catch (error) {
      console.error('Error importing data:', error);
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    }
  }
  
  /**
   * Clear all application data
   */
  function clearData() {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
        // Save default format setting
        const defaultFormat = localStorage.getItem('rovDefaultFormat');
        
        // Clear localStorage
        localStorage.clear();
        
        // Restore default format
        if (defaultFormat) {
          localStorage.setItem('rovDefaultFormat', defaultFormat);
        }
        
        alert('ล้างข้อมูลสำเร็จ จะรีโหลดหน้าเว็บ');
        
        // Reload page
        window.location.reload();
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('เกิดข้อผิดพลาดในการล้างข้อมูล');
    }
  }
  
  // Public API
  return {
    init,
    render,
    openHeroSelection,
    getSelectionState,
    showLoading,
    hideLoading,
    setActivePage,
    renderHeroesTable
  };
})();

// Make UIManager globally available
window.UIManager = UIManager;

export default UIManager;