/**
 * matches-ui.js - Handles the matches UI component interactions
 * This module manages all UI interactions for the matches page, including
 * rendering, filtering, and CRUD operations for match data
 */

const MatchesUI = (() => {
  // Cache for DOM elements to improve performance
  let elements = {};
  
  // Current page information for pagination
  let currentPage = 1;
  let matchesPerPage = 10;
  let filteredMatches = [];
  
  /**
   * Initialize the Matches UI component
   * @returns {Promise} Promise that resolves when initialization is complete
   */
  function init() {
    try {
      console.log('Initializing Matches UI...');
      
      // Cache DOM elements
      cacheElements();
      
      // Set up event listeners
      setupEventListeners();
      
      // Initialize with default data if needed
      initializeMatchData();
      
      // Add styles for match table
      addMatchTableStyles();
      
      // Render the matches table if on the matches page
      if (document.getElementById('history-page')?.classList.contains('active')) {
        renderMatchesTable();
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error initializing Matches UI:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Cache DOM elements for better performance
   */
  function cacheElements() {
    elements = {
      // Match controls
      importUrl: document.getElementById('import-url'),
      fetchBtn: document.getElementById('fetch-btn'),
      importFile: document.getElementById('import-file'),
      importFileBtn: document.getElementById('import-file-btn'),
      addMatchBtn: document.getElementById('add-match-btn'),
      
      // Search and filter
      matchSearch: document.getElementById('match-search'),
      tournamentFilter: document.getElementById('tournament-filter'),
      teamFilter: document.getElementById('team-filter'),
      
      // Table elements
      matchesTbody: document.getElementById('matches-tbody'),
      
      // Pagination
      prevPageBtn: document.getElementById('prev-page'),
      nextPageBtn: document.getElementById('next-page'),
      pageInfo: document.getElementById('page-info'),
      
      // Actions
      deleteAllMatchesBtn: document.getElementById('delete-all-matches-btn'),
      
      // Pages
      historyPage: document.getElementById('history-page')
    };
  }
  
  /**
   * Set up event listeners for match page elements
   */
  function setupEventListeners() {
    // Import buttons
    if (elements.fetchBtn) {
      elements.fetchBtn.addEventListener('click', fetchMatchDataFromUrl);
    }
    
    if (elements.importFile) {
      elements.importFile.addEventListener('change', importMatchesFromFile);
    }
    
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
    
    // Listen for history button click to render matches
    const historyBtn = document.getElementById('history-btn');
    if (historyBtn) {
      historyBtn.addEventListener('click', function() {
        // Render after a short delay to ensure page transition is complete
        setTimeout(() => {
          renderMatchesTable();
        }, 100);
      });
    }
  }
  
  /**
   * Initialize match data with defaults if none exists
   */
  function initializeMatchData() {
    // Check if match data exists in localStorage
    if (!localStorage.getItem('rovMatchData')) {
      // Sample match data from data.js
      const sampleMatches = [
        {
          date: "2025-01-15",
          tournament: "RoV Pro League 2025 Summer Group Stage",
          team1: "Team Flash",
          team2: "Buriram United Esports",
          picks1: ["Florentino", "Valhein", "Tulen", "Alice", "Thane"],
          picks2: ["Riktor", "Violet", "Zata", "Zip", "Ormarr"],
          bans1: ["Keera", "Capheny"],
          bans2: ["Airi", "Laville"],
          winner: "Team Flash",
          isImported: true,
        },
        {
          date: "2025-01-20",
          tournament: "RoV Pro League 2025 Summer Group Stage",
          team1: "Bacon Time",
          team2: "King of Gamers Club",
          picks1: ["Airi", "Capheny", "Liliana", "Enzo", "Lumburr"],
          picks2: ["Florentino", "Elsu", "Dirak", "Krizzix", "Grakk"],
          bans1: ["Keera", "Yena"],
          bans2: ["Riktor", "Laville"],
          winner: "King of Gamers Club",
          isImported: true,
        },
        {
          date: "2025-01-25",
          tournament: "RoV Pro League 2025 Summer Group Stage",
          team1: "EVOS Esports",
          team2: "Team Flash",
          picks1: ["Yena", "Laville", "Zata", "Rouie", "Baldum"],
          picks2: ["Airi", "Tel'Annas", "Tulen", "Alice", "Thane"],
          bans1: ["Florentino", "Capheny"],
          bans2: ["Keera", "Violet"],
          winner: "Team Flash",
          isImported: true,
        }
      ];
      
      // Save to localStorage
      localStorage.setItem('rovMatchData', JSON.stringify(sampleMatches));
    }
  }
  
  /**
   * Add CSS styles for the match table
   */
  function addMatchTableStyles() {
    // This should ideally be in a CSS file, but included here for completeness
    const styleAlreadyExists = document.getElementById('matches-table-styles');
    if (styleAlreadyExists) return;
    
    const style = document.createElement('style');
    style.id = 'matches-table-styles';
    style.textContent = `
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
      
      /* Style for winning team */
      .matches-table .winner-team {
        font-weight: bold;
        color: #4caf50;
      }
      
      .matches-table .team1-won {
        background-color: rgba(76, 175, 80, 0.05);
      }
      
      .matches-table .team2-won {
        background-color: rgba(76, 175, 80, 0.05);
      }
      
      /* Button styles */
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
      
      .matches-table .view-btn:hover {
        background-color: #1976d2;
      }
      
      .matches-table .edit-btn {
        background-color: #ff9800;
        color: white;
      }
      
      .matches-table .edit-btn:hover {
        background-color: #f57c00;
      }
      
      .matches-table .delete-btn {
        background-color: #f44336;
        color: white;
      }
      
      .matches-table .delete-btn:hover {
        background-color: #d32f2f;
      }
      
      /* Match detail modal */
      .match-detail-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
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
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Render the matches table with current data
   */
  function renderMatchesTable() {
    console.log("Rendering matches table...");
    
    try {
      // Get matches from localStorage
      const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      
      // Update filtered matches
      updateFilteredMatches();
      
      // Get the tbody element
      const tbody = elements.matchesTbody;
      if (!tbody) {
        console.warn("matches-tbody element not found");
        return;
      }
      
      // Clear the tbody
      tbody.innerHTML = '';
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * matchesPerPage;
      const endIndex = Math.min(startIndex + matchesPerPage, filteredMatches.length);
      const currentMatches = filteredMatches.slice(startIndex, endIndex);
      
      // Populate the table with matches
      currentMatches.forEach((match) => {
        const originalIndex = matches.indexOf(match);
        const row = document.createElement('tr');
        
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
            <button class="view-btn" data-index="${originalIndex}">View</button>
            <button class="delete-btn" data-index="${originalIndex}">Delete</button>
          `;
        } else {
          // If not imported, include edit button
          managementButtons = `
            <button class="view-btn" data-index="${originalIndex}">View</button>
            <button class="edit-btn" data-index="${originalIndex}">Edit</button>
            <button class="delete-btn" data-index="${originalIndex}">Delete</button>
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
      if (currentMatches.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        
        if (filteredMatches.length === 0) {
          emptyCell.textContent = 'No match data found. Please add or import match data.';
        } else {
          emptyCell.textContent = 'No matches match your search criteria.';
        }
        
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      }
      
      // Add event listeners to buttons
      addButtonEventListeners(tbody);
      
      // Update pagination display
      updatePaginationDisplay();
      
      // Update filters with available tournaments and teams
      updateMatchFilters(matches);
      
    } catch (error) {
      console.error('Error rendering matches table:', error);
    }
  }
  
  /**
   * Add event listeners to the buttons in the matches table
   * @param {HTMLElement} tbody - The table body element containing the rows
   */
  function addButtonEventListeners(tbody) {
    // View buttons
    tbody.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        viewMatch(index);
      });
    });
    
    // Edit buttons
    tbody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        editMatch(index);
      });
    });
    
    // Delete buttons
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        deleteMatch(index);
      });
    });
  }
  
  /**
   * Update the filtered matches array based on current filters
   */
  function updateFilteredMatches() {
    try {
      const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      const searchText = elements.matchSearch?.value.toLowerCase() || '';
      const tournamentFilter = elements.tournamentFilter?.value || '';
      const teamFilter = elements.teamFilter?.value || '';
      
      // Filter matches based on search and filter criteria
      filteredMatches = matches.filter(match => {
        // Filter by search text
        const matchText = `${match.date || ''} ${match.tournament || ''} ${match.team1 || ''} ${match.team2 || ''} ${match.winner || ''}`.toLowerCase();
        const matchesSearch = !searchText || matchText.includes(searchText);
        
        // Filter by tournament
        const matchesTournament = !tournamentFilter || match.tournament === tournamentFilter;
        
        // Filter by team
        const matchesTeam = !teamFilter || match.team1 === teamFilter || match.team2 === teamFilter;
        
        return matchesSearch && matchesTournament && matchesTeam;
      });
      
      // Reset to first page when filters change
      currentPage = 1;
    } catch (error) {
      console.error('Error updating filtered matches:', error);
      filteredMatches = [];
    }
  }
  
  /**
   * Update the pagination display
   */
  function updatePaginationDisplay() {
    if (!elements.pageInfo) return;
    
    const totalPages = Math.max(1, Math.ceil(filteredMatches.length / matchesPerPage));
    elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Enable/disable pagination buttons
    if (elements.prevPageBtn) {
      elements.prevPageBtn.disabled = currentPage <= 1;
    }
    
    if (elements.nextPageBtn) {
      elements.nextPageBtn.disabled = currentPage >= totalPages;
    }
  }
  
  /**
   * Update the match filters with available options
   * @param {Array} matches - Array of match objects
   */
  function updateMatchFilters(matches) {
    try {
      if (!elements.tournamentFilter || !elements.teamFilter) {
        console.warn('Filter elements not found');
        return;
      }
      
      // Save current selections
      const currentTournament = elements.tournamentFilter.value;
      const currentTeam = elements.teamFilter.value;
      
      // Clear current options
      elements.tournamentFilter.innerHTML = '<option value="">All tournaments</option>';
      elements.teamFilter.innerHTML = '<option value="">All teams</option>';
      
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
        option.selected = tournament === currentTournament;
        elements.tournamentFilter.appendChild(option);
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
        option.selected = team === currentTeam;
        elements.teamFilter.appendChild(option);
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
      // Update filtered matches
      updateFilteredMatches();
      
      // Re-render the table with the filtered matches
      renderMatchesTable();
    } catch (error) {
      console.error('Error filtering matches:', error);
    }
  }
  
  /**
   * Navigate between pages in the matches table
   * @param {string} direction - Direction to navigate ('prev' or 'next')
   */
  function navigateMatchesPage(direction) {
    const totalPages = Math.max(1, Math.ceil(filteredMatches.length / matchesPerPage));
    
    if (direction === 'prev' && currentPage > 1) {
      currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
      currentPage++;
    }
    
    renderMatchesTable();
  }
  
  /**
   * View details of a specific match
   * @param {number} index - Index of the match in the matches array
   */
  function viewMatch(index) {
    try {
      // Get matches data
      const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
      
      // Check if index is valid
      if (index < 0 || index >= matches.length) {
        alert('Match not found');
        return;
      }
      
      const match = matches[index];
      
      // Create modal HTML
      const modalHTML = `
        <div class="match-detail-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Match Details</h3>
              <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
              <div class="match-info">
                <p><strong>Date:</strong> ${match.date || 'Not specified'}</p>
                <p><strong>Tournament:</strong> ${match.tournament || 'Not specified'}</p>
              </div>
              
              <div class="teams-container">
                <div class="team-detail ${match.winner === match.team1 ? 'winner' : ''}">
                  <h4>${match.team1} ${match.winner === match.team1 ? '(Winner)' : ''}</h4>
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
                  <h4>${match.team2} ${match.winner === match.team2 ? '(Winner)' : ''}</h4>
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
              <button class="close-btn">Close</button>
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
      alert('Error viewing match details');
    }
  }
  
  /**
   * Edit a specific match (placeholder for future implementation)
   * @param {number} index - Index of the match in the matches array
   */
  function editMatch(index) {
    alert('Edit match functionality will be added in a future version');
  }
  
  /**
   * Delete a specific match
   * @param {number} index - Index of the match in the matches array
   */
  function deleteMatch(index) {
    try {
      if (confirm('Are you sure you want to delete this match?')) {
        // Get matches data
        const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
        
        // Check if index is valid
        if (index < 0 || index >= matches.length) {
          alert('Match not found');
          return;
        }
        
        // Remove the match
        matches.splice(index, 1);
        
        // Save back to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
        // Refresh the table
        filterMatches();
        
        // Update data if DataManager is available
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init().then(() => {
            if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
              UIManager.render();
            }
          });
        }
        
        alert('Match deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error deleting match');
    }
  }
  
  /**
   * Delete all matches
   */
  function deleteAllMatches() {
    if (confirm('Are you sure you want to delete all matches? This action cannot be undone.')) {
      try {
        // Delete matches from localStorage
        localStorage.removeItem('rovMatchData');
        
        // Set matches to empty array
        localStorage.setItem('rovMatchData', JSON.stringify([]));
        
        // Refresh the matches page
        filterMatches();
        
        // Update data
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init().then(() => {
            if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
              UIManager.render();
            }
          });
        }
        
        alert('All matches deleted successfully');
      } catch (error) {
        console.error('Error deleting all matches:', error);
        alert('Error deleting all matches');
      }
    }
  }
  
  /**
   * Fetch match data from URL (placeholder implementation)
   */
  function fetchMatchDataFromUrl() {
    const url = elements.importUrl.value.trim();
    
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    
    // Show loading overlay
    showLoading();
    
    // Simulate API request (actual implementation would use fetch API)
    setTimeout(() => {
      try {
        // In a real implementation, we would send request to our server
        // to proxy the request to avoid CORS issues
        
        // Simulate fetching data
        const newMatches = [];
        
        // Check if URL looks like a Liquipedia URL with Game_history
        if (url.includes('liquipedia.net') && url.includes('Game_history')) {
          // Simulate successful data fetch
          
          // Simulate 3 new matches
          for (let i = 0; i < 3; i++) {
            newMatches.push({
              date: `2025-03-${10 + i}`,
              tournament: "RoV Pro League 2025 Summer Playoffs",
              team1: "Team Flash",
              team2: "Buriram United Esports",
              picks1: ["Keera", "Valhein", "Tulen", "Alice", "Thane"],
              picks2: ["Riktor", "Violet", "Zata", "Zip", "Ormarr"],
              bans1: ["Airi", "Florentino"],
              bans2: ["Laville", "Capheny"],
              winner: i % 2 === 0 ? "Team Flash" : "Buriram United Esports",
              isImported: true
            });
          }
          
          // Add new matches to localStorage
          let matches = [];
          try {
            matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
          } catch (error) {
            matches = [];
          }
          
          // Combine new matches with existing ones
          matches = [...matches, ...newMatches];
          
          // Save to localStorage
          localStorage.setItem('rovMatchData', JSON.stringify(matches));
          
          // Refresh the matches table
          filterMatches();
          
          // Update data
          if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
            DataManager.init().then(() => {
              if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
                UIManager.render();
              }
            });
          }
          
          alert(`Successfully fetched data. Added ${newMatches.length} new matches.`);
        } else {
          alert('Invalid URL. Please use a Liquipedia Game History URL.');
        }
      } catch (error) {
        console.error('Error fetching match data from URL:', error);
        alert('Error fetching match data');
      } finally {
        hideLoading();
      }
    }, 1500); // Simulate 1.5 second delay
  }
  
  /**
   * Import matches from a file
   * @param {Event} event - The file input change event
   */
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
          // CSV file - not implemented in this example
          alert('CSV import not supported in this example');
          hideLoading();
          return;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Excel file - not implemented in this example
          alert('Excel import not supported in this example');
          hideLoading();
          return;
        } else {
          alert('Unsupported file type. Please use JSON, CSV, or Excel file');
          hideLoading();
          return;
        }
        
        // Validate data format
        if (!Array.isArray(newMatches)) {
          alert('Invalid data format. Data should be an array of matches');
          hideLoading();
          return;
        }
        
        // Add new matches to localStorage
        let matches = [];
        try {
          matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
        } catch (error) {
          matches = [];
        }
        
        // Mark all imported matches
        newMatches = newMatches.map(match => ({
          ...match,
          isImported: true
        }));
        
        // Combine new matches with existing ones
        matches = [...matches, ...newMatches];
        
        // Save to localStorage
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
        // Refresh the matches table
        filterMatches();
        
        // Update data
        if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
          DataManager.init().then(() => {
            if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
              UIManager.render();
            }
          });
        }
        
        alert(`Successfully imported ${newMatches.length} matches`);
      } catch (error) {
        console.error('Error importing matches from file:', error);
        alert('Error importing matches');
      } finally {
        hideLoading();
      }
    };
    
    reader.onerror = function() {
      hideLoading();
      alert('Error reading file');
    };
    
    // Read the file as text
    reader.readAsText(file);
  }
  
  /**
   * Add a new match (placeholder for future implementation)
   */
  function addNewMatch() {
    alert('Add new match functionality will be added in a future version');
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
  
  // Public API
  return {
    init,
    renderMatchesTable,
    filterMatches,
    viewMatch,
    deleteMatch,
    deleteAllMatches,
    importMatchesFromFile,
    fetchMatchDataFromUrl,
    addNewMatch
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize MatchesUI
  MatchesUI.init().catch(error => {
    console.error('Failed to initialize MatchesUI:', error);
  });
});