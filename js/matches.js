/**
 * matches.js - Match data management system
 * Refactored for better organization, error handling, and performance
 */

const MatchManager = (() => {
  // Private state
  let currentPage = 1;
  const matchesPerPage = 10;
  let filteredMatches = [];
  
  /**
   * Initialize Match Manager
   * @returns {boolean} Whether initialization was successful
   */
  function init() {
    console.log('Initializing Match Manager...');
    
    try {
      // Setup event handlers for filter controls
      setupFilterControls();
      
      // Add custom styles
      addMatchTableStyles();
      
      console.log('Match Manager initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Match Manager:', error);
      return false;
    }
  }
  
  /**
   * Setup event handlers for filter controls
   */
  function setupFilterControls() {
    // Match search input
    const matchSearch = document.getElementById('match-search');
    if (matchSearch) {
      matchSearch.addEventListener('input', filterMatches);
    }
    
    // Tournament filter
    const tournamentFilter = document.getElementById('tournament-filter');
    if (tournamentFilter) {
      tournamentFilter.addEventListener('change', filterMatches);
    }
    
    // Team filter
    const teamFilter = document.getElementById('team-filter');
    if (teamFilter) {
      teamFilter.addEventListener('change', filterMatches);
    }
    
    // Pagination buttons
    const prevPageBtn = document.getElementById('prev-page');
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => navigateMatchesPage('prev'));
    }
    
    const nextPageBtn = document.getElementById('next-page');
    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => navigateMatchesPage('next'));
    }
    
    // Delete all matches button
    const deleteAllMatchesBtn = document.getElementById('delete-all-matches-btn');
    if (deleteAllMatchesBtn) {
      deleteAllMatchesBtn.addEventListener('click', deleteAllMatches);
    }
  }
  
  /**
   * Add custom styles for match table
   */
  function addMatchTableStyles() {
    // Check if styles already exist
    if (document.getElementById('match-table-styles')) {
      return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'match-table-styles';
    
    style.textContent = `
      /* Match Table Styles */
      .matches-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      }
      
      .matches-table th {
        background-color: var(--primary-color);
        color: var(--secondary-color);
        padding: 12px 15px;
        text-align: left;
        font-weight: bold;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .matches-table td {
        padding: 10px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .matches-table tr:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
      
      .matches-table .winner-team {
        font-weight: bold;
        color: var(--success-color);
      }
      
      /* Match detail modal */
      .match-detail-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
      }
      
      .match-detail-modal .modal-content {
        background-color: var(--light-bg);
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .match-detail-modal .modal-header {
        padding: 15px 20px;
        background-color: var(--dark-bg);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .match-detail-modal .modal-header h3 {
        margin: 0;
        color: var(--secondary-color);
      }
      
      .match-detail-modal .modal-body {
        padding: 20px;
      }
      
      .match-detail-modal .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: right;
      }
      
      .match-detail-modal .teams-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 15px;
      }
      
      .match-detail-modal .team-detail {
        flex: 1;
        min-width: 250px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 15px;
      }
      
      .match-detail-modal .team-detail.winner {
        border: 1px solid var(--success-color);
      }
      
      .match-detail-modal .team-detail h4 {
        margin-top: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 8px;
      }
      
      .match-detail-modal .team-heroes {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .match-detail-modal .picks,
      .match-detail-modal .bans {
        flex: 1;
        min-width: 120px;
      }
      
      .close-modal {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .close-modal:hover {
        color: #fff;
      }
      
      @media (max-width: 768px) {
        .match-detail-modal .teams-container {
          flex-direction: column;
        }
      }
    `;
    
    // Add style to head
    document.head.appendChild(style);
  }
  
  /**
   * Render matches table
   */
  function renderMatchesTable() {
    console.log('Rendering matches table...');
    
    try {
      // Get matches from localStorage
      const matches = loadMatchData();
      
      // Get the tbody element
      const tbody = document.getElementById('matches-tbody');
      if (!tbody) {
        console.warn('matches-tbody element not found');
        return;
      }
      
      // Reset filtered matches and pagination
      filteredMatches = [...matches];
      currentPage = 1;
      
      // Apply any active filters
      applyActiveFilters();
      
      // Update filter options
      updateFilterOptions(matches);
      
      // Render the current page
      renderCurrentPage();
    } catch (error) {
      console.error('Error rendering matches table:', error);
      showError('เกิดข้อผิดพลาดในการแสดงข้อมูลแมตช์');
    }
  }
  
  /**
   * Load match data from localStorage
   * @returns {Array} Array of match objects
   */
  function loadMatchData() {
    try {
      return JSON.parse(localStorage.getItem('rovMatchData')) || [];
    } catch (error) {
      console.error('Error loading match data:', error);
      return [];
    }
  }
  
  /**
   * Update filter dropdown options based on available data
   * @param {Array} matches - Array of match objects
   */
  function updateFilterOptions(matches) {
    try {
      const tournamentFilter = document.getElementById('tournament-filter');
      const teamFilter = document.getElementById('team-filter');
      
      if (!tournamentFilter || !teamFilter) {
        return;
      }
      
      // Clear existing options
      tournamentFilter.innerHTML = '<option value="">ทุกทัวร์นาเมนต์</option>';
      teamFilter.innerHTML = '<option value="">ทุกทีม</option>';
      
      // Get unique tournaments
      const tournaments = [...new Set(matches.map(match => match.tournament).filter(Boolean))];
      tournaments.sort();
      
      // Add tournament options
      tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.textContent = tournament;
        tournamentFilter.appendChild(option);
      });
      
      // Get unique teams
      const teams = [
        ...new Set([
          ...matches.map(match => match.team1).filter(Boolean),
          ...matches.map(match => match.team2).filter(Boolean)
        ])
      ];
      teams.sort();
      
      // Add team options
      teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
      });
    } catch (error) {
      console.error('Error updating filter options:', error);
    }
  }
  
  /**
   * Apply active filters to matches
   */
  function applyActiveFilters() {
    try {
      const searchText = document.getElementById('match-search')?.value.toLowerCase() || '';
      const tournamentFilter = document.getElementById('tournament-filter')?.value || '';
      const teamFilter = document.getElementById('team-filter')?.value || '';
      
      const allMatches = loadMatchData();
      
      // Filter matches based on criteria
      filteredMatches = allMatches.filter(match => {
        // Search text filter
        const matchText = `${match.date || ''} ${match.tournament || ''} ${match.team1 || ''} ${match.team2 || ''} ${match.winner || ''}`.toLowerCase();
        const matchesSearch = !searchText || matchText.includes(searchText);
        
        // Tournament filter
        const matchesTournament = !tournamentFilter || match.tournament === tournamentFilter;
        
        // Team filter
        const matchesTeam = !teamFilter || match.team1 === teamFilter || match.team2 === teamFilter;
        
        return matchesSearch && matchesTournament && matchesTeam;
      });
      
      // Reset to first page when filters change
      currentPage = 1;
      
      // Update pagination
      updatePagination();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }
  
  /**
   * Render the current page of matches
   */
  function renderCurrentPage() {
    try {
      const tbody = document.getElementById('matches-tbody');
      if (!tbody) return;
      
      // Clear the tbody
      tbody.innerHTML = '';
      
      // Calculate slice indices for pagination
      const startIndex = (currentPage - 1) * matchesPerPage;
      const endIndex = startIndex + matchesPerPage;
      
      // Get matches for the current page
      const currentMatches = filteredMatches.slice(startIndex, endIndex);
      
      // If no matches after filtering
      if (currentMatches.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.textContent = filteredMatches.length === 0 ? 
          'ไม่พบแมตช์ที่ตรงตามเงื่อนไขการค้นหา' : 
          'ไม่พบข้อมูลแมตช์ กรุณาเพิ่มหรือนำเข้าข้อมูลแมตช์';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
      }
      
      // Render matches for current page
      const allMatches = loadMatchData();
      
      currentMatches.forEach(match => {
        const originalIndex = allMatches.findIndex(m => 
          m.date === match.date && 
          m.team1 === match.team1 && 
          m.team2 === match.team2
        );
        
        if (originalIndex === -1) return;
        
        const row = document.createElement('tr');
        
        // Create management buttons
        let managementButtons = `
          <button class="view-btn" data-index="${originalIndex}">ดู</button>
        `;
        
        // Add edit button if not imported
        if (!match.isImported) {
          managementButtons += `<button class="edit-btn" data-index="${originalIndex}">แก้ไข</button>`;
        }
        
        // Add delete button
        managementButtons += `<button class="delete-btn" data-index="${originalIndex}">ลบ</button>`;
        
        // Create row HTML
        row.innerHTML = `
          <td>${formatDate(match.date) || 'N/A'}</td>
          <td>${match.tournament || 'N/A'}</td>
          <td class="${match.winner === match.team1 ? 'winner-team' : ''}">${match.team1 || 'N/A'}</td>
          <td class="${match.winner === match.team2 ? 'winner-team' : ''}">${match.team2 || 'N/A'}</td>
          <td>${match.winner || 'N/A'}</td>
          <td>${managementButtons}</td>
        `;
        
        tbody.appendChild(row);
      });
      
      // Add event listeners to buttons
      addButtonEventListeners(tbody);
      
      // Update pagination info
      updatePagination();
    } catch (error) {
      console.error('Error rendering current page:', error);
    }
  }
  
  /**
   * Update pagination controls
   */
  function updatePagination() {
    try {
      const pageInfo = document.getElementById('page-info');
      const prevPageBtn = document.getElementById('prev-page');
      const nextPageBtn = document.getElementById('next-page');
      
      if (!pageInfo || !prevPageBtn || !nextPageBtn) return;
      
      // Calculate total pages
      const totalPages = Math.ceil(filteredMatches.length / matchesPerPage) || 1;
      
      // Update page info
      pageInfo.textContent = `หน้า ${currentPage} จาก ${totalPages}`;
      
      // Update button states
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= totalPages;
      
      // Add visual indication for disabled buttons
      prevPageBtn.style.opacity = prevPageBtn.disabled ? '0.5' : '1';
      nextPageBtn.style.opacity = nextPageBtn.disabled ? '0.5' : '1';
    } catch (error) {
      console.error('Error updating pagination:', error);
    }
  }
  
  /**
   * Navigate between pages
   * @param {string} direction - Navigation direction ('prev' or 'next')
   */
  function navigateMatchesPage(direction) {
    try {
      // Calculate total pages
      const totalPages = Math.ceil(filteredMatches.length / matchesPerPage) || 1;
      
      // Update current page based on direction
      if (direction === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
      }
      
      // Render the new page
      renderCurrentPage();
    } catch (error) {
      console.error('Error navigating matches page:', error);
    }
  }
  
  /**
   * Add event listeners to buttons in the table
   * @param {HTMLElement} tbody - Table body element
   */
  function addButtonEventListeners(tbody) {
    try {
      // Add event listeners to view buttons
      const viewButtons = tbody.querySelectorAll('.view-btn');
      viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          viewMatch(index);
        });
      });
      
      // Add event listeners to edit buttons
      const editButtons = tbody.querySelectorAll('.edit-btn');
      editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          editMatch(index);
        });
      });
      
      // Add event listeners to delete buttons
      const deleteButtons = tbody.querySelectorAll('.delete-btn');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          deleteMatch(index);
        });
      });
    } catch (error) {
      console.error('Error adding button event listeners:', error);
    }
  }
  
  /**
   * View match details
   * @param {number} index - Match index
   */
  function viewMatch(index) {
    try {
      // Get match data
      const matches = loadMatchData();
      
      // Check if index is valid
      if (index < 0 || index >= matches.length) {
        showError('ไม่พบข้อมูลแมตช์');
        return;
      }
      
      const match = matches[index];
      
      // Create modal container
      const modalContainer = document.createElement('div');
      modalContainer.className = 'match-detail-modal';
      
      // Create modal content
      const modalHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>รายละเอียดแมตช์</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="match-info">
              <p><strong>วันที่:</strong> ${formatDate(match.date) || 'ไม่ระบุ'}</p>
              <p><strong>ทัวร์นาเมนต์:</strong> ${match.tournament || 'ไม่ระบุ'}</p>
            </div>
            
            <div class="teams-container">
              <div class="team-detail ${match.winner === match.team1 ? 'winner' : ''}">
                <h4>${match.team1} ${match.winner === match.team1 ? '(ผู้ชนะ)' : ''}</h4>
                <div class="team-heroes">
                  <div class="picks">
                    <h5>Picks:</h5>
                    <ul>
                      ${(match.picks1 || []).map(hero => `<li>${hero}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="bans">
                    <h5>Bans:</h5>
                    <ul>
                      ${(match.bans1 || []).map(hero => `<li>${hero}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="team-detail ${match.winner === match.team2 ? 'winner' : ''}">
                <h4>${match.team2} ${match.winner === match.team2 ? '(ผู้ชนะ)' : ''}</h4>
                <div class="team-heroes">
                  <div class="picks">
                    <h5>Picks:</h5>
                    <ul>
                      ${(match.picks2 || []).map(hero => `<li>${hero}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="bans">
                    <h5>Bans:</h5>
                    <ul>
                      ${(match.bans2 || []).map(hero => `<li>${hero}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="close-btn">ปิด</button>
          </div>
        </div>
      `;
      
      // Set modal content
      modalContainer.innerHTML = modalHTML;
      
      // Add to DOM
      document.body.appendChild(modalContainer);
      
      // Add event listeners for closing
      const closeElements = modalContainer.querySelectorAll('.close-modal, .close-btn');
      closeElements.forEach(el => {
        el.addEventListener('click', () => {
          document.body.removeChild(modalContainer);
        });
      });
      
      // Close when clicking outside
      modalContainer.addEventListener('click', event => {
        if (event.target === modalContainer) {
          document.body.removeChild(modalContainer);
        }
      });
    } catch (error) {
      console.error('Error viewing match:', error);
      showError('เกิดข้อผิดพลาดในการดูข้อมูลแมตช์');
    }
  }
  
  /**
   * Edit match (placeholder for future implementation)
   * @param {number} index - Match index
   */
  function editMatch(index) {
    alert('ฟังก์ชันแก้ไขแมตช์จะเพิ่มในเวอร์ชันถัดไป');
  }
  
  /**
   * Delete match
   * @param {number} index - Match index
   */
  function deleteMatch(index) {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแมตช์นี้?')) {
        // Get matches
        const matches = loadMatchData();
        
        // Check if index is valid
        if (index < 0 || index >= matches.length) {
          showError('ไม่พบข้อมูลแมตช์');
          return;
        }
        
        // Remove the match
        matches.splice(index, 1);
        
        // Save back to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
        // Refresh the table
        renderMatchesTable();
        
        // Update data if DataManager is available
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init().then(() => {
            if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
              UIManager.render();
            }
          });
        }
        
        showSuccess('ลบแมตช์เรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      showError('เกิดข้อผิดพลาดในการลบแมตช์');
    }
  }
  
  /**
   * Delete all matches
   */
  function deleteAllMatches() {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลแมตช์ทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
        // Clear match data
        localStorage.removeItem('rovMatchData');
        localStorage.setItem('rovMatchData', JSON.stringify([]));
        
        // Refresh the table
        renderMatchesTable();
        
        // Update data if DataManager is available
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init().then(() => {
            if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
              UIManager.render();
            }
          });
        }
        
        showSuccess('ลบข้อมูลแมตช์ทั้งหมดเรียบร้อย');
      }
    } catch (error) {
      console.error('Error deleting all matches:', error);
      showError('เกิดข้อผิดพลาดในการลบข้อมูลแมตช์');
    }
  }
  
  /**
   * Filter matches based on current filter settings
   */
  function filterMatches() {
    console.log('Filtering matches...');
    
    try {
      // Apply filters
      applyActiveFilters();
      
      // Render filtered matches
      renderCurrentPage();
    } catch (error) {
      console.error('Error filtering matches:', error);
    }
  }
  
  /**
   * Import matches from file
   * @param {Event} event - File input change event
   */
  function importMatchesFromFile(event) {
    try {
      const file = event.target.files[0];
      
      if (!file) {
        return;
      }
      
      showLoading();
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          let newMatches = [];
          
          // Process file based on type
          if (file.name.endsWith('.json')) {
            // JSON file
            newMatches = JSON.parse(e.target.result);
          } else if (file.name.endsWith('.csv')) {
            showError('ยังไม่รองรับไฟล์ CSV ในตัวอย่างนี้');
            hideLoading();
            return;
          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            showError('ยังไม่รองรับไฟล์ Excel ในตัวอย่างนี้');
            hideLoading();
            return;
          } else {
            showError('ไฟล์ไม่รองรับ กรุณาใช้ไฟล์ JSON, CSV หรือ Excel');
            hideLoading();
            return;
          }
          
          // Validate data
          if (!Array.isArray(newMatches)) {
            showError('รูปแบบข้อมูลไม่ถูกต้อง ควรเป็นอาร์เรย์ของแมตช์');
            hideLoading();
            return;
          }
          
          // Get existing matches
          const matches = loadMatchData();
          
          // Combine with new matches
          const combinedMatches = [...matches, ...newMatches];
          
          // Save to localStorage
          localStorage.setItem('rovMatchData', JSON.stringify(combinedMatches));
          
          // Refresh table
          renderMatchesTable();
          
          // Update data if DataManager is available
          if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
            DataManager.init().then(() => {
              if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
                UIManager.render();
              }
            });
          }
          
          showSuccess(`นำเข้าแมตช์สำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
        } catch (error) {
          console.error('Error processing imported matches:', error);
          showError('เกิดข้อผิดพลาดในการนำเข้าแมตช์: ' + error.message);
        } finally {
          hideLoading();
        }
      };
      
      reader.onerror = function() {
        hideLoading();
        showError('เกิดข้อผิดพลาดในการอ่านไฟล์');
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing matches from file:', error);
      hideLoading();
      showError('เกิดข้อผิดพลาดในการนำเข้าแมตช์');
    }
  }
  
  /**
   * Add a new match (placeholder for future implementation)
   */
  function addNewMatch() {
    alert('ฟังก์ชันเพิ่มแมตช์ใหม่จะเพิ่มในเวอร์ชันถัดไป');
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
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date string
   */
  function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message
   */
  function showError(message) {
    alert(message);
  }
  
  /**
   * Show success message
   * @param {string} message - Success message
   */
  function showSuccess(message) {
    alert(message);
  }
  
  // Public API
  return {
    init,
    renderMatchesTable,
    filterMatches,
    viewMatch,
    editMatch,
    deleteMatch,
    deleteAllMatches,
    importMatchesFromFile,
    addNewMatch
  };
})();

// Initialize the Match Manager if not already initialized by app.js
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if not already initialized by app.js
  if (typeof RoVDraftHelper === 'undefined' || !RoVDraftHelper.initialized) {
    MatchManager.init();
  }
  
  // Make renderMatchesTable globally available for backward compatibility
  window.renderMatchesTable = MatchManager.renderMatchesTable;
});