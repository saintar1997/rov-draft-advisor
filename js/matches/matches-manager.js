/**
 * matches-manager.js - Functions to manage match data and display
 */

import DataManager from '../data/data-manager.js';

const MatchesManager = (() => {
  // Current page for pagination
  let currentPage = 1;
  const matchesPerPage = 10;
  
  /**
   * Initialize the matches manager
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async function init() {
    try {
      // Set up event listeners
      setupEventListeners();
      
      // Render matches table
      renderMatchesTable();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error initializing MatchesManager:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Set up event listeners for matches functionality
   */
  function setupEventListeners() {
    // Import file button
    const importFileBtn = document.getElementById('import-file-btn');
    if (importFileBtn) {
      importFileBtn.addEventListener('click', () => {
        const fileInput = document.getElementById('import-file');
        if (fileInput && fileInput.files.length > 0) {
          importMatchesFromFile(fileInput.files[0]);
        } else {
          alert('กรุณาเลือกไฟล์ก่อน');
        }
      });
    }
    
    // Import from URL button
    const fetchBtn = document.getElementById('fetch-btn');
    if (fetchBtn) {
      fetchBtn.addEventListener('click', fetchMatchDataFromUrl);
    }
    
    // Add new match button
    const addMatchBtn = document.getElementById('add-match-btn');
    if (addMatchBtn) {
      addMatchBtn.addEventListener('click', addNewMatch);
    }
    
    // Search and filter controls
    const matchSearch = document.getElementById('match-search');
    if (matchSearch) {
      matchSearch.addEventListener('input', filterMatches);
    }
    
    const tournamentFilter = document.getElementById('tournament-filter');
    if (tournamentFilter) {
      tournamentFilter.addEventListener('change', filterMatches);
    }
    
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
   * Render the matches table with current data
   */
  function renderMatchesTable() {
    console.log("Rendering matches table...");
    
    try {
      // Get matches from localStorage
      const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      
      // Get the tbody element
      const tbody = document.getElementById('matches-tbody');
      if (!tbody) {
        console.warn("matches-tbody element not found");
        return;
      }
      
      // Clear tbody
      tbody.innerHTML = '';
      
      // Calculate pagination
      const totalPages = Math.ceil(matches.length / matchesPerPage);
      const startIndex = (currentPage - 1) * matchesPerPage;
      const endIndex = Math.min(startIndex + matchesPerPage, matches.length);
      
      // Update page info
      const pageInfo = document.getElementById('page-info');
      if (pageInfo) {
        pageInfo.textContent = `หน้า ${currentPage} จาก ${Math.max(1, totalPages)}`;
      }
      
      // Get current page matches
      const currentMatches = matches.slice(startIndex, endIndex);
      
      // Populate the table with matches
      currentMatches.forEach((match, index) => {
        const row = document.createElement('tr');
        const originalIndex = startIndex + index;
        
        // Add class based on winner
        if (match.winner === match.team1) {
          row.classList.add('team1-won');
        } else if (match.winner === match.team2) {
          row.classList.add('team2-won');
        }
        
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
      
      // If no matches, show message
      if (matches.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'ไม่พบข้อมูลแมตช์ กรุณาเพิ่มหรือนำเข้าข้อมูลแมตช์';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      }
      
      // Add event listeners to buttons
      const viewButtons = tbody.querySelectorAll('.view-btn');
      const editButtons = tbody.querySelectorAll('.edit-btn');
      const deleteButtons = tbody.querySelectorAll('.delete-btn');
      
      viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          viewMatch(index);
        });
      });
      
      editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          editMatch(index);
        });
      });
      
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          deleteMatch(index);
        });
      });
      
      // Update filters with available tournaments and teams
      updateMatchFilters(matches);
      
    } catch (error) {
      console.error('Error rendering matches table:', error);
    }
  }
  
  /**
   * View match details
   * @param {number} index - Index of the match in the matches array
   */
  function viewMatch(index) {
    try {
      // Get matches data
      const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      
      // Check if index is valid
      if (index < 0 || index >= matches.length) {
        alert('ไม่พบข้อมูลแมตช์');
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
      alert('เกิดข้อผิดพลาดในการดูข้อมูลแมตช์');
    }
  }
  
  /**
   * Edit match (placeholder for future implementation)
   * @param {number} index - Index of the match in the matches array
   */
  function editMatch(index) {
    alert('ฟังก์ชันแก้ไขแมตช์จะเพิ่มในเวอร์ชันถัดไป');
  }
  
  /**
   * Delete match
   * @param {number} index - Index of the match in the matches array
   */
  function deleteMatch(index) {
    try {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแมตช์นี้?')) {
        // Get matches data
        const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
        
        // Check if index is valid
        if (index < 0 || index >= matches.length) {
          alert('ไม่พบข้อมูลแมตช์');
          return;
        }
        
        // Remove the match
        matches.splice(index, 1);
        
        // Save back to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
        // Refresh the table
        renderMatchesTable();
        
        // Update data in DataManager
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init();
        }
        
        alert('ลบแมตช์เรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('เกิดข้อผิดพลาดในการลบแมตช์');
    }
  }
  
  /**
   * Update filter dropdowns with available options
   * @param {Array} matches - Array of match objects
   */
  function updateMatchFilters(matches) {
    try {
      const tournamentFilter = document.getElementById('tournament-filter');
      const teamFilter = document.getElementById('team-filter');
      
      if (!tournamentFilter || !teamFilter) {
        console.warn('Filter elements not found');
        return;
      }
      
      // Clear current options
      tournamentFilter.innerHTML = '<option value="">ทุกทัวร์นาเมนต์</option>';
      teamFilter.innerHTML = '<option value="">ทุกทีม</option>';
      
      // Get unique tournaments
      const tournaments = [];
      matches.forEach(match => {
        if (match.tournament && !tournaments.includes(match.tournament)) {
          tournaments.push(match.tournament);
        }
      });
      
      // Sort tournaments alphabetically
      tournaments.sort();
      
      // Add tournament options
      tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament;
        option.textContent = tournament;
        tournamentFilter.appendChild(option);
      });
      
      // Get unique teams
      const teams = [];
      matches.forEach(match => {
        if (match.team1 && !teams.includes(match.team1)) {
          teams.push(match.team1);
        }
        if (match.team2 && !teams.includes(match.team2)) {
          teams.push(match.team2);
        }
      });
      
      // Sort teams alphabetically
      teams.sort();
      
      // Add team options
      teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
      });
      
    } catch (error) {
      console.error('Error updating match filters:', error);
    }
  }
  
  /**
   * Filter matches based on search and filter criteria
   */
  function filterMatches() {
    try {
      const searchText = document.getElementById('match-search')?.value.toLowerCase() || '';
      const tournamentFilter = document.getElementById('tournament-filter')?.value || '';
      const teamFilter = document.getElementById('team-filter')?.value || '';
      
      // Get matches data
      const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      
      // Filter matches
      const filteredMatches = matches.filter(match => {
        // Filter by search text
        const matchText = `${match.date || ''} ${match.tournament || ''} ${match.team1 || ''} ${match.team2 || ''} ${match.winner || ''}`.toLowerCase();
        const matchesSearch = !searchText || matchText.includes(searchText);
        
        // Filter by tournament
        const matchesTournament = !tournamentFilter || match.tournament === tournamentFilter;
        
        // Filter by team
        const matchesTeam = !teamFilter || match.team1 === teamFilter || match.team2 === teamFilter;
        
        return matchesSearch && matchesTournament && matchesTeam;
      });
      
      // Store filtered matches for pagination
      localStorage.setItem('rovFilteredMatches', JSON.stringify(filteredMatches));
      
      // Reset pagination to page 1
      currentPage = 1;
      
      // Render filtered matches
      renderFilteredMatches(filteredMatches);
    } catch (error) {
      console.error('Error filtering matches:', error);
    }
  }
  
  /**
   * Render filtered matches
   * @param {Array} filteredMatches - Array of filtered match objects
   */
  function renderFilteredMatches(filteredMatches) {
    try {
      // Get the tbody element
      const tbody = document.getElementById('matches-tbody');
      if (!tbody) {
        console.warn("matches-tbody element not found");
        return;
      }
      
      // Clear tbody
      tbody.innerHTML = '';
      
      // Calculate pagination
      const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
      const startIndex = (currentPage - 1) * matchesPerPage;
      const endIndex = Math.min(startIndex + matchesPerPage, filteredMatches.length);
      
      // Update page info
      const pageInfo = document.getElementById('page-info');
      if (pageInfo) {
        pageInfo.textContent = `หน้า ${currentPage} จาก ${Math.max(1, totalPages)}`;
      }
      
      // Get current page matches
      const currentMatches = filteredMatches.slice(startIndex, endIndex);
      
      // Get all matches for reference to original indices
      const allMatches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      
      // Populate the table with filtered matches
      currentMatches.forEach((match) => {
        const row = document.createElement('tr');
        
        // Find original index in all matches
        const originalIndex = allMatches.findIndex(m => 
          m.date === match.date && 
          m.team1 === match.team1 && 
          m.team2 === match.team2
        );
        
        // Create management buttons
        let managementButtons = '';
        if (match.isImported) {
          managementButtons = `
            <button class="view-btn" data-index="${originalIndex}">ดู</button>
            <button class="delete-btn" data-index="${originalIndex}">ลบ</button>
          `;
        } else {
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
      
      // If no matches found
      if (filteredMatches.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'ไม่พบแมตช์ที่ตรงตามเงื่อนไขการค้นหา';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      }
      
      // Add event listeners to buttons
      const viewButtons = tbody.querySelectorAll('.view-btn');
      const editButtons = tbody.querySelectorAll('.edit-btn');
      const deleteButtons = tbody.querySelectorAll('.delete-btn');
      
      viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          viewMatch(index);
        });
      });
      
      editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          editMatch(index);
        });
      });
      
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          deleteMatch(index);
        });
      });
      
    } catch (error) {
      console.error('Error rendering filtered matches:', error);
    }
  }
  
  /**
   * Navigate through match pages
   * @param {string} direction - Direction to navigate ('prev' or 'next')
   */
  function navigateMatchesPage(direction) {
    try {
      // Get filtered matches if available, otherwise all matches
      let matches;
      try {
        const filteredMatches = localStorage.getItem('rovFilteredMatches');
        if (filteredMatches) {
          matches = JSON.parse(filteredMatches);
        } else {
          matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
        }
      } catch (error) {
        matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      }
      
      // Calculate total pages
      const totalPages = Math.ceil(matches.length / matchesPerPage);
      
      // Update current page
      if (direction === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
      }
      
      // Render current page
      renderFilteredMatches(matches);
      
    } catch (error) {
      console.error('Error navigating matches page:', error);
    }
  }
  
  /**
   * Delete all matches
   */
  function deleteAllMatches() {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลแมตช์ทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้")) {
      try {
        // Clear match data
        localStorage.setItem("rovMatchData", JSON.stringify([]));
        localStorage.removeItem('rovFilteredMatches');
        
        // Reset pagination
        currentPage = 1;
        
        // Refresh table
        renderMatchesTable();
        
        // Update DataManager
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init();
        }
        
        alert("ลบข้อมูลแมตช์ทั้งหมดเรียบร้อย");
      } catch (error) {
        console.error("Error deleting all matches:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูลแมตช์");
      }
    }
  }
  
  /**
   * Import matches from Excel file - Implemented Excel support
   * @param {Event|File} eventOrFile - Either the file input change event or a file object
   */
  function importMatchesFromFile(eventOrFile) {
    let file;
    
    // Determine if we got an event or directly a file
    if (eventOrFile.target && eventOrFile.target.files) {
      file = eventOrFile.target.files[0];
    } else {
      file = eventOrFile;
    }
    
    if (!file) {
      alert('กรุณาเลือกไฟล์ก่อน');
      return;
    }
    
    // Show loading indicator
    showLoading();
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        let newMatches = [];
        
        // Process based on file type
        if (file.name.endsWith('.json')) {
          // Parse JSON file
          newMatches = JSON.parse(e.target.result);
        } else if (file.name.endsWith('.csv')) {
          // Alert for CSV support in the future
          alert('ยังไม่รองรับไฟล์ CSV ในตัวอย่างนี้');
          hideLoading();
          return;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Process Excel file
          try {
            // Check if XLSX is available
            if (typeof XLSX === 'undefined') {
              alert('กรุณาโหลดเว็บไซต์ใหม่เพื่อโหลดไลบรารี XLSX');
              hideLoading();
              return;
            }
            
            // Parse Excel file
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Check if data exists
            if (!jsonData || jsonData.length === 0) {
              alert('ไม่พบข้อมูลในไฟล์ Excel');
              hideLoading();
              return;
            }
            
            // Process each row into match format
            jsonData.forEach(row => {
              // Expected columns:
              // date, tournament, team1, team2, picks1, picks2, bans1, bans2, winner
              
              // Check if row has minimum required data
              if (!row.date || !row.team1 || !row.team2) {
                console.warn('Skipping row with missing required data:', row);
                return;
              }
              
              // Process pick and ban columns
              // They might be strings with comma/semicolon separated values
              const processList = (value) => {
                if (!value) return [];
                if (Array.isArray(value)) return value;
                if (typeof value === 'string') {
                  // Split by comma or semicolon
                  return value.split(/[,;]/).map(item => item.trim()).filter(Boolean);
                }
                return [];
              };
              
              const newMatch = {
                date: row.date,
                tournament: row.tournament || 'Unknown Tournament',
                team1: row.team1,
                team2: row.team2,
                picks1: processList(row.picks1),
                picks2: processList(row.picks2),
                bans1: processList(row.bans1),
                bans2: processList(row.bans2),
                winner: row.winner || '',
                isImported: true
              };
              
              newMatches.push(newMatch);
            });
            
          } catch (excelError) {
            console.error('Error processing Excel file:', excelError);
            alert('เกิดข้อผิดพลาดในการประมวลผลไฟล์ Excel: ' + excelError.message);
            hideLoading();
            return;
          }
        } else {
          alert('ไฟล์ไม่รองรับ กรุณาใช้ไฟล์ JSON, CSV หรือ Excel');
          hideLoading();
          return;
        }
        
        // Validate data format
        if (!Array.isArray(newMatches)) {
          alert('รูปแบบข้อมูลไม่ถูกต้อง ควรเป็นอาร์เรย์ของแมตช์');
          hideLoading();
          return;
        }
        
        // Get existing matches
        let matches = [];
        try {
          matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
        } catch (error) {
          matches = [];
        }
        
        // Mark new matches as imported
        newMatches.forEach(match => {
          match.isImported = true;
        });
        
        // Combine with existing matches
        matches = [...matches, ...newMatches];
        
        // Save to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
        // Reset search/filter state
        localStorage.removeItem('rovFilteredMatches');
        currentPage = 1;
        
        // Refresh table
        renderMatchesTable();
        
        // Update DataManager
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init();
        }
        
        // Reset file input
        const fileInput = document.getElementById('import-file');
        if (fileInput) {
          fileInput.value = '';
        }
        
        alert(`นำเข้าแมตช์สำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
      } catch (error) {
        console.error('Error importing matches from file:', error);
        alert('เกิดข้อผิดพลาดในการนำเข้าแมตช์: ' + error.message);
      } finally {
        hideLoading();
      }
    };
    
    reader.onerror = function() {
      hideLoading();
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
    };
    
    // Read file as ArrayBuffer for Excel files, or as text for JSON
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }
  
  /**
   * Fetch match data from URL (simulated)
   */
  function fetchMatchDataFromUrl() {
    const url = document.getElementById('import-url').value.trim();
    
    if (!url) {
      alert('กรุณาใส่ URL');
      return;
    }
    
    // Show loading indicator
    showLoading();
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // In a real implementation, this would be an API call
        // Generate some sample matches for demonstration
        const newMatches = [
          {
            date: `2025-03-${Math.floor(Math.random() * 28) + 1}`,
            tournament: "RoV Pro League 2025 Summer Playoffs",
            team1: "Team Flash",
            team2: "Buriram United Esports",
            picks1: ["Keera", "Valhein", "Tulen", "Alice", "Thane"],
            picks2: ["Riktor", "Violet", "Zata", "Zip", "Ormarr"],
            bans1: ["Airi", "Florentino"],
            bans2: ["Laville", "Capheny"],
            winner: Math.random() > 0.5 ? "Team Flash" : "Buriram United Esports",
            isImported: true
          },
          {
            date: `2025-03-${Math.floor(Math.random() * 28) + 1}`,
            tournament: "RoV Pro League 2025 Summer Playoffs",
            team1: "King of Gamers Club",
            team2: "EVOS Esports",
            picks1: ["Florentino", "Elsu", "Dirak", "Krizzix", "Grakk"],
            picks2: ["Yena", "Laville", "Zata", "Rouie", "Baldum"],
            bans1: ["Airi", "Violet"],
            bans2: ["Keera", "Capheny"],
            winner: Math.random() > 0.5 ? "King of Gamers Club" : "EVOS Esports",
            isImported: true
          },
          {
            date: `2025-03-${Math.floor(Math.random() * 28) + 1}`,
            tournament: "RoV Pro League 2025 Summer Playoffs",
            team1: "Bacon Time",
            team2: "Team Flash",
            picks1: ["Omen", "Capheny", "Dirak", "Ishar", "Grakk"],
            picks2: ["Airi", "Tel'Annas", "Tulen", "Alice", "Thane"],
            bans1: ["Keera", "Florentino"],
            bans2: ["Yena", "Laville"],
            winner: Math.random() > 0.5 ? "Bacon Time" : "Team Flash",
            isImported: true
          }
        ];
        
        // Get existing matches
        let matches = [];
        try {
          matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
        } catch (error) {
          matches = [];
        }
        
        // Combine with existing matches
        matches = [...matches, ...newMatches];
        
        // Save to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
        // Reset search/filter state
        localStorage.removeItem('rovFilteredMatches');
        currentPage = 1;
        
        // Refresh table
        renderMatchesTable();
        
        // Update DataManager
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init();
        }
        
        // Clear URL input
        document.getElementById('import-url').value = '';
        
        alert(`ดึงข้อมูลสำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
      } catch (error) {
        console.error('Error fetching match data from URL:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message);
      } finally {
        hideLoading();
      }
    }, 1500); // Simulate network delay
  }
  
  /**
   * Add new match (placeholder for future implementation)
   */
  function addNewMatch() {
    alert('ฟังก์ชันเพิ่มแมตช์ใหม่จะเพิ่มในเวอร์ชันถัดไป');
  }
  
  /**
   * Show loading indicator
   */
  function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }
  }
  
  /**
   * Hide loading indicator
   */
  function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }
  
  // Public API
  return {
    init,
    renderMatchesTable,
    viewMatch,
    editMatch,
    deleteMatch,
    filterMatches,
    importMatchesFromFile,
    fetchMatchDataFromUrl,
    addNewMatch,
    deleteAllMatches
  };
})();

// Initialize MatchesManager when the page loads
document.addEventListener('DOMContentLoaded', function() {
  MatchesManager.init();
});

export default MatchesManager;