/**
 * matches-ui.js - Handles UI interactions for matches page
 * Provides functionality for rendering, filtering, and managing match data display
 */

const MatchesUI = (() => {
  // DOM elements cache
  let elements = {};
  
  // Current pagination state
  let paginationState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  };
  
  // Initialize UI
  function init() {
    try {
      console.log("Initializing Matches UI...");
      
      // Cache DOM elements
      cacheElements();
      
      // Set up event listeners
      setupEventListeners();
      
      // Initialize table
      renderMatchesTable();
      
      // Initialize styles
      addMatchTableStyles();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing Matches UI:", error);
      return Promise.reject(error);
    }
  }
  
  // Cache DOM elements for better performance
  function cacheElements() {
    elements = {
      // Import controls
      importUrl: document.getElementById('import-url'),
      fetchBtn: document.getElementById('fetch-btn'),
      importFile: document.getElementById('import-file'),
      importFileBtn: document.getElementById('import-file-btn'),
      addMatchBtn: document.getElementById('add-match-btn'),
      
      // Filter controls
      matchSearch: document.getElementById('match-search'),
      tournamentFilter: document.getElementById('tournament-filter'),
      teamFilter: document.getElementById('team-filter'),
      
      // Table elements
      matchesTbody: document.getElementById('matches-tbody'),
      
      // Pagination
      prevPageBtn: document.getElementById('prev-page'),
      nextPageBtn: document.getElementById('next-page'),
      pageInfo: document.getElementById('page-info'),
      
      // Delete all
      deleteAllMatchesBtn: document.getElementById('delete-all-matches-btn')
    };
  }
  
  // Set up event listeners with error handling
  function setupEventListeners() {
    try {
      // Import URL
      if (elements.fetchBtn) {
        elements.fetchBtn.addEventListener('click', fetchMatchDataFromUrl);
      }
      
      // Import file
      if (elements.importFile) {
        elements.importFile.addEventListener('change', importMatchesFromFile);
      }
      
      // Add new match
      if (elements.addMatchBtn) {
        elements.addMatchBtn.addEventListener('click', addNewMatch);
      }
      
      // Search and filter
      if (elements.matchSearch) {
        elements.matchSearch.addEventListener('input', filterMatches);
      }
      
      if (elements.tournamentFilter) {
        elements.tournamentFilter.addEventListener('change', filterMatches);
      }
      
      if (elements.teamFilter) {
        elements.teamFilter.addEventListener('change', filterMatches);
      }
      
      // Pagination
      if (elements.prevPageBtn) {
        elements.prevPageBtn.addEventListener('click', () => navigateMatchesPage('prev'));
      }
      
      if (elements.nextPageBtn) {
        elements.nextPageBtn.addEventListener('click', () => navigateMatchesPage('next'));
      }
      
      // Delete all matches
      if (elements.deleteAllMatchesBtn) {
        elements.deleteAllMatchesBtn.addEventListener('click', deleteAllMatches);
      }
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }
  }
  
  // Render the matches table with current filters and pagination
  function renderMatchesTable() {
    console.log("Rendering matches table...");
    
    try {
      // Get matches from localStorage
      const matches = getMatchesData();
      
      // Get the tbody element
      const tbody = elements.matchesTbody;
      if (!tbody) {
        console.warn("matches-tbody element not found");
        return;
      }
      
      // Clear the tbody
      tbody.innerHTML = '';
      
      // Apply filters if any
      const filteredMatches = filterMatchesData(matches);
      
      // Update pagination info
      updatePaginationState(filteredMatches);
      
      // Get current page matches
      const currentPageMatches = getCurrentPageMatches(filteredMatches);
      
      // Render matches
      renderMatchRows(currentPageMatches, matches, tbody);
      
      // Update filters dropdown options
      updateFilterOptions(matches);
      
      // Update pagination display
      updatePaginationDisplay();
    } catch (error) {
      console.error('Error rendering matches table:', error);
      showErrorMessage("เกิดข้อผิดพลาดในการแสดงตารางแมตช์");
    }
  }
  
  // Helper function to get matches data from localStorage
  function getMatchesData() {
    try {
      return JSON.parse(localStorage.getItem('rovMatchData')) || [];
    } catch (error) {
      console.error("Error parsing match data:", error);
      return [];
    }
  }
  
  // Filter matches based on search and dropdown filters
  function filterMatchesData(matches) {
    const searchText = elements.matchSearch?.value.toLowerCase() || '';
    const tournamentFilter = elements.tournamentFilter?.value || '';
    const teamFilter = elements.teamFilter?.value || '';
    
    return matches.filter(match => {
      // Text search across multiple fields
      const matchText = `${match.date || ''} ${match.tournament || ''} ${match.team1 || ''} ${match.team2 || ''} ${match.winner || ''}`.toLowerCase();
      const matchesSearch = !searchText || matchText.includes(searchText);
      
      // Tournament filter
      const matchesTournament = !tournamentFilter || match.tournament === tournamentFilter;
      
      // Team filter
      const matchesTeam = !teamFilter || match.team1 === teamFilter || match.team2 === teamFilter;
      
      return matchesSearch && matchesTournament && matchesTeam;
    });
  }
  
  // Update pagination state based on filtered matches
  function updatePaginationState(filteredMatches) {
    paginationState.totalPages = Math.max(1, Math.ceil(filteredMatches.length / paginationState.itemsPerPage));
    paginationState.currentPage = Math.min(paginationState.currentPage, paginationState.totalPages);
  }
  
  // Get matches for current page
  function getCurrentPageMatches(filteredMatches) {
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = startIndex + paginationState.itemsPerPage;
    return filteredMatches.slice(startIndex, endIndex);
  }
  
  // Render match rows in the table
  function renderMatchRows(matchesToRender, allMatches, tbody) {
    if (matchesToRender.length === 0) {
      // If no matches found, show empty state
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 6;
      emptyCell.textContent = 'ไม่พบข้อมูลแมตช์ที่ตรงกับการค้นหา';
      emptyCell.style.textAlign = 'center';
      emptyCell.style.padding = '20px';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return;
    }
    
    // Render each match
    matchesToRender.forEach(match => {
      const row = document.createElement('tr');
      
      // Add class based on winner
      if (match.winner === match.team1) {
        row.classList.add('team1-won');
      } else if (match.winner === match.team2) {
        row.classList.add('team2-won');
      }
      
      // Find original index in all matches array for button data attributes
      const originalIndex = allMatches.indexOf(match);
      
      // Create management buttons
      let managementButtons = '';
      if (match.isImported) {
        // If imported, no edit button
        managementButtons = `
          <button class="view-btn" data-index="${originalIndex}">ดู</button>
          <button class="delete-btn" data-index="${originalIndex}">ลบ</button>
        `;
      } else {
        // If not imported, include edit button
        managementButtons = `
          <button class="view-btn" data-index="${originalIndex}">ดู</button>
          <button class="edit-btn" data-index="${originalIndex}">แก้ไข</button>
          <button class="delete-btn" data-index="${originalIndex}">ลบ</button>
        `;
      }
      
      // Create row HTML
      row.innerHTML = `
        <td>${match.date || 'N/A'}</td>
        <td>${match.tournament || 'N/A'}</td>
        <td class="${match.winner === match.team1 ? 'winner-team' : ''}">${match.team1 || 'N/A'}</td>
        <td class="${match.winner === match.team2 ? 'winner-team' : ''}">${match.team2 || 'N/A'}</td>
        <td>${match.winner || 'N/A'}</td>
        <td>${managementButtons}</td>
      `;
      
      tbody.appendChild(row);
    });
    
    // Add event listeners to the buttons
    addButtonEventListeners(tbody);
  }
  
  // Add event listeners to buttons in the table
  function addButtonEventListeners(tbody) {
    tbody.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        viewMatch(index);
      });
    });
    
    tbody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        editMatch(index);
      });
    });
    
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        deleteMatch(index);
      });
    });
  }
  
  // Update filter dropdown options
  function updateFilterOptions(matches) {
    try {
      // Get unique tournaments for dropdown
      const tournaments = [...new Set(matches.map(match => match.tournament).filter(Boolean))];
      tournaments.sort();
      
      // Clear and repopulate tournament dropdown
      const tournamentFilter = elements.tournamentFilter;
      if (tournamentFilter) {
        tournamentFilter.innerHTML = '<option value="">ทุกทัวร์นาเมนต์</option>';
        tournaments.forEach(tournament => {
          const option = document.createElement('option');
          option.value = tournament;
          option.textContent = tournament;
          tournamentFilter.appendChild(option);
        });
      }
      
      // Get unique teams for dropdown
      const teams = [...new Set([
        ...matches.map(match => match.team1).filter(Boolean),
        ...matches.map(match => match.team2).filter(Boolean)
      ])];
      teams.sort();
      
      // Clear and repopulate team dropdown
      const teamFilter = elements.teamFilter;
      if (teamFilter) {
        teamFilter.innerHTML = '<option value="">ทุกทีม</option>';
        teams.forEach(team => {
          const option = document.createElement('option');
          option.value = team;
          option.textContent = team;
          teamFilter.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error updating filter options:", error);
    }
  }
  
  // Update pagination display
  function updatePaginationDisplay() {
    const { currentPage, totalPages } = paginationState;
    
    // Update page info text
    if (elements.pageInfo) {
      elements.pageInfo.textContent = `หน้า ${currentPage} จาก ${totalPages}`;
    }
    
    // Enable/disable prev/next buttons
    if (elements.prevPageBtn) {
      elements.prevPageBtn.disabled = currentPage <= 1;
    }
    
    if (elements.nextPageBtn) {
      elements.nextPageBtn.disabled = currentPage >= totalPages;
    }
  }
  
  // Navigate pages
  function navigateMatchesPage(direction) {
    const { currentPage, totalPages } = paginationState;
    
    if (direction === 'prev' && currentPage > 1) {
      paginationState.currentPage -= 1;
      renderMatchesTable();
    } else if (direction === 'next' && currentPage < totalPages) {
      paginationState.currentPage += 1;
      renderMatchesTable();
    }
  }
  
  // View match details - shows a modal with match details
  function viewMatch(index) {
    try {
      // Get matches data
      const matches = getMatchesData();
      
      // Check if index is valid
      if (index < 0 || index >= matches.length) {
        showErrorMessage('ไม่พบข้อมูลแมตช์');
        return;
      }
      
      const match = matches[index];
      
      // Create modal HTML
      const modalHTML = `
        <div class="match-detail-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>รายละเอียดแมตช์</h3>
              <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
              <div class="match-info">
                <p><strong>วันที่:</strong> ${match.date || 'ไม่ระบุ'}</p>
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
        </div>
      `;
      
      // Add modal to the DOM
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer);
      
      // Add event listeners for close buttons
      const closeElements = modalContainer.querySelectorAll('.close-modal, .close-btn');
      closeElements.forEach(el => {
        el.addEventListener('click', () => {
          document.body.removeChild(modalContainer);
        });
      });
      
      // Close modal when clicking outside
      modalContainer.querySelector('.match-detail-modal').addEventListener('click', (e) => {
        if (e.target === modalContainer.querySelector('.match-detail-modal')) {
          document.body.removeChild(modalContainer);
        }
      });
    } catch (error) {
      console.error('Error viewing match:', error);
      showErrorMessage('เกิดข้อผิดพลาดในการดูข้อมูลแมตช์');
    }
  }
  
  // Edit match (placeholder)
  function editMatch(index) {
    console.log(`Editing match at index ${index}`);
    showMessage('ฟังก์ชันแก้ไขแมตช์จะเพิ่มในเวอร์ชันถัดไป');
  }
  
  // Delete match
  function deleteMatch(index) {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแมตช์นี้?')) {
        // Get matches data
        const matches = getMatchesData();
        
        // Check if index is valid
        if (index < 0 || index >= matches.length) {
          showErrorMessage('ไม่พบข้อมูลแมตช์');
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
        
        showMessage('ลบแมตช์เรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      showErrorMessage('เกิดข้อผิดพลาดในการลบแมตช์');
    }
  }
  
  // Delete all matches
  function deleteAllMatches() {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลแมตช์ทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
      try {
        // ลบข้อมูลแมตช์จาก localStorage
        localStorage.removeItem('rovMatchData');
        
        // ตั้งค่าข้อมูลแมตช์เป็นอาร์เรย์ว่าง
        localStorage.setItem('rovMatchData', JSON.stringify([]));
        
        // รีเฟรชหน้าแมตช์
        renderMatchesTable();
        
        // อัปเดตข้อมูล
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init().then(() => {
            if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
              UIManager.render();
            }
          });
        }
        
        showMessage('ลบข้อมูลแมตช์ทั้งหมดเรียบร้อย');
      } catch (error) {
        console.error('Error deleting all matches:', error);
        showErrorMessage('เกิดข้อผิดพลาดในการลบข้อมูลแมตช์');
      }
    }
  }
  
  // Filter matches based on search and filter criteria
  function filterMatches() {
    // Just re-render the table with current filters
    paginationState.currentPage = 1; // Reset to first page when filtering
    renderMatchesTable();
  }
  
  // Fetch match data from URL
  function fetchMatchDataFromUrl() {
    const url = elements.importUrl?.value.trim();
    
    if (!url) {
      showErrorMessage('กรุณาใส่ URL');
      return;
    }
    
    // Show loading overlay
    showLoading();
    
    // Simulate fetching data (in a real app, use fetch API)
    setTimeout(() => {
      try {
        // Check if URL is from a supported source
        if (url.includes('liquipedia.net') && url.includes('Game_history')) {
          // Simulate successfully fetched data
          const newMatches = generateSampleMatches(3);
          
          // Add to existing matches
          let matches = getMatchesData();
          matches = [...matches, ...newMatches];
          
          // Save to localStorage
          localStorage.setItem('rovMatchData', JSON.stringify(matches));
          
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
          
          showMessage(`ดึงข้อมูลสำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
        } else {
          showErrorMessage('URL ไม่ถูกต้อง กรุณาใช้ URL ของ Liquipedia Game History');
        }
      } catch (error) {
        console.error('Error fetching data from URL:', error);
        showErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        hideLoading();
      }
    }, 1000);
  }
  
  // Helper function to generate sample matches (for demo)
  function generateSampleMatches(count) {
    const matches = [];
    const teams = ['Team Flash', 'Buriram United Esports', 'EVOS Esports', 'King of Gamers Club', 'Bacon Time'];
    const tournaments = ['RoV Pro League 2025 Summer Group Stage', 'RoV Pro League 2025 Summer Playoffs', 'RoV World Cup 2025'];
    
    for (let i = 0; i < count; i++) {
      const team1 = teams[Math.floor(Math.random() * teams.length)];
      let team2 = teams[Math.floor(Math.random() * teams.length)];
      
      // Ensure team2 is different from team1
      while (team2 === team1) {
        team2 = teams[Math.floor(Math.random() * teams.length)];
      }
      
      matches.push({
        date: `2025-03-${10 + i}`,
        tournament: tournaments[Math.floor(Math.random() * tournaments.length)],
        team1,
        team2,
        picks1: ['Keera', 'Valhein', 'Tulen', 'Alice', 'Thane'],
        picks2: ['Riktor', 'Violet', 'Zata', 'Zip', 'Ormarr'],
        bans1: ['Airi', 'Florentino'],
        bans2: ['Laville', 'Capheny'],
        winner: Math.random() > 0.5 ? team1 : team2,
        isImported: true
      });
    }
    
    return matches;
  }
  
  // Import matches from file
  function importMatchesFromFile(event) {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Show loading overlay
    showLoading();
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        let newMatches = [];
        
        // Check file type
        if (file.name.endsWith('.json')) {
          // JSON file
          newMatches = JSON.parse(e.target.result);
        } else if (file.name.endsWith('.csv')) {
          // CSV file - in a real app, use a CSV parser
          showErrorMessage('ยังไม่รองรับไฟล์ CSV ในตัวอย่างนี้');
          hideLoading();
          return;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Excel file - in a real app, use a library like SheetJS
          showErrorMessage('ยังไม่รองรับไฟล์ Excel ในตัวอย่างนี้');
          hideLoading();
          return;
        } else {
          showErrorMessage('ไฟล์ไม่รองรับ กรุณาใช้ไฟล์ JSON, CSV หรือ Excel');
          hideLoading();
          return;
        }
        
        // Validate data
        if (!Array.isArray(newMatches)) {
          showErrorMessage('รูปแบบข้อมูลไม่ถูกต้อง ควรเป็นอาร์เรย์ของแมตช์');
          hideLoading();
          return;
        }
        
        // Add to existing matches
        let matches = getMatchesData();
        matches = [...matches, ...newMatches];
        
        // Save to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
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
        
        // Reset file input
        event.target.value = '';
        
        showMessage(`นำเข้าแมตช์สำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
      } catch (error) {
        console.error('Error importing matches from file:', error);
        showErrorMessage('เกิดข้อผิดพลาดในการนำเข้าแมตช์');
      } finally {
        hideLoading();
      }
    };
    
    reader.onerror = function() {
      hideLoading();
      showErrorMessage('เกิดข้อผิดพลาดในการอ่านไฟล์');
    };
    
    // Read file as text
    reader.readAsText(file);
  }
  
  // Add new match
  function addNewMatch() {
    console.log('Add new match clicked');
    showMessage('ฟังก์ชันเพิ่มแมตช์ใหม่จะเพิ่มในเวอร์ชันถัดไป');
    
    // Here you would typically open a modal or form for adding a new match
    // For now we just show a message
  }
  
  // Add CSS styles for match table and UI
  function addMatchTableStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Matches table styles */
      .matches-table-container {
        overflow-x: auto;
        margin-bottom: 15px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
      }
      
      .matches-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .matches-table th, 
      .matches-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .matches-table th {
        background-color: rgba(0, 0, 0, 0.3);
        color: #1baeea;
        position: sticky;
        top: 0;
      }
      
      .matches-table tr:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
      
      /* Winner team highlighting */
      .matches-table .winner-team {
        color: #4caf50;
        font-weight: bold;
      }
      
      /* Button styles in table */
      .matches-table td button {
        margin-right: 5px;
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Kanit", sans-serif;
        font-size: 0.9rem;
        transition: all 0.2s;
      }
      
      .matches-table td .view-btn {
        background-color: #2e3192;
        color: white;
      }
      
      .matches-table td .view-btn:hover {
        background-color: #1baeea;
      }
      
      .matches-table td .edit-btn {
        background-color: #ff9800;
        color: white;
      }
      
      .matches-table td .edit-btn:hover {
        background-color: #f57c00;
      }
      
      .matches-table td .delete-btn {
        background-color: #f44336;
        color: white;
      }
      
      .matches-table td .delete-btn:hover {
        background-color: #d32f2f;
      }
      
      /* Match detail modal styles */
      .match-detail-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .match-detail-modal .modal-content {
        background-color: #1f2a40;
        border-radius: 8px;
        width: 80%;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        animation: modalFadeIn 0.3s;
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .match-detail-modal .modal-header {
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .match-detail-modal .modal-header h3 {
        margin: 0;
        color: #1baeea;
      }
      
      .match-detail-modal .close-modal {
        font-size: 24px;
        cursor: pointer;
        color: #aaa;
        transition: color 0.2s;
      }
      
      .match-detail-modal .close-modal:hover {
        color: white;
      }
      
      .match-detail-modal .modal-body {
        padding: 20px;
      }
      
      .match-detail-modal .match-info {
        margin-bottom: 20px;
      }
      
      .match-detail-modal .teams-container {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
      
      .match-detail-modal .team-detail {
        flex: 1;
        min-width: 250px;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 8px;
      }
      
      .match-detail-modal .team-detail.winner {
        border: 1px solid #4caf50;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
      }
      
      .match-detail-modal .team-detail h4 {
        color: white;
        margin-top: 0;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .match-detail-modal .team-detail.winner h4 {
        color: #4caf50;
      }
      
      .match-detail-modal .team-heroes {
        display: flex;
        gap: 15px;
      }
      
      .match-detail-modal .picks,
      .match-detail-modal .bans {
        flex: 1;
      }
      
      .match-detail-modal h5 {
        color: #1baeea;
        margin-bottom: 10px;
      }
      
      .match-detail-modal ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      
      .match-detail-modal ul li {
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .match-detail-modal .modal-footer {
        padding: 15px 20px;
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .match-detail-modal .close-btn {
        padding: 8px 16px;
        background-color: #2e3192;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .match-detail-modal .close-btn:hover {
        background-color: #1baeea;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .match-detail-modal .teams-container {
          flex-direction: column;
        }
        
        .match-detail-modal .modal-content {
          width: 95%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Show loading overlay
  function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }
  }
  
  // Hide loading overlay
  function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }
  
  // Show success message
  function showMessage(message) {
    alert(message);
  }
  
  // Show error message
  function showErrorMessage(message) {
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
    fetchMatchDataFromUrl,
    importMatchesFromFile,
    addNewMatch,
    showLoading,
    hideLoading
  };
})();

// Initialize MatchesUI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize MatchesUI if we're on the matches page
  if (document.getElementById('history-page')) {
    MatchesUI.init();
    
    // If matches page is active, render matches table
    if (document.getElementById('history-page').classList.contains('active')) {
      MatchesUI.renderMatchesTable();
    }
    
    // If we have a history button, add event listener to render matches when clicked
    const historyBtn = document.getElementById('history-btn');
    if (historyBtn && !historyBtn._matchesUiInitialized) {
      historyBtn.addEventListener('click', function() {
        setTimeout(() => {
          MatchesUI.renderMatchesTable();
        }, 100);
      });
      historyBtn._matchesUiInitialized = true; // Mark as initialized to prevent duplicate event listeners
    }
  }
});