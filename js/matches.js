/**
 * matches.js - Functions to manage match data and display
 */

// Function to render matches table
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
    
    // Clear the tbody
    tbody.innerHTML = '';
    
    // Populate the table with matches
    matches.forEach((match, index) => {
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
          <button class="view-btn" data-index="${index}">ดู</button>
          <button class="delete-btn" data-index="${index}">ลบ</button>
        `;
      } else {
        // If not imported, include edit button
        managementButtons = `
          <button class="view-btn" data-index="${index}">ดู</button>
          <button class="edit-btn" data-index="${index}">แก้ไข</button>
          <button class="delete-btn" data-index="${index}">ลบ</button>
        `;
      }
      
      // Create row HTML with sanitized values
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

// Function to view match details
// Enhanced viewMatch function with proper layout and hero images
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
    
    // Get hero images from localStorage
    let heroImages = {};
    try {
      heroImages = JSON.parse(localStorage.getItem('rovHeroImages')) || {};
    } catch (error) {
      console.error('Error parsing hero images:', error);
    }
    
    // Function to get hero image
    function getHeroImage(heroName) {
      // Try to get from stored hero images
      if (heroImages[heroName]) {
        return heroImages[heroName];
      }
      // Default placeholder
      return `https://via.placeholder.com/40?text=${encodeURIComponent(heroName)}`;
    }
    
    // Function to create hero list items with images
    function createHeroList(heroes = []) {
      if (!heroes || heroes.length === 0) {
        return '<li class="no-hero">ไม่มีข้อมูล</li>';
      }
      
      return heroes.map(hero => `
        <li class="hero-item">
          <div class="hero-image">
            <img src="${getHeroImage(hero)}" alt="${hero}" />
          </div>
          <span class="hero-name">${hero}</span>
        </li>
      `).join('');
    }
    
    // Create modal element
    const modalDiv = document.createElement('div');
    modalDiv.className = 'match-detail-modal';
    
    // Set the inner HTML (modal content)
    modalDiv.innerHTML = `
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
                  <ul class="hero-list">
                    ${createHeroList(match.picks1)}
                  </ul>
                </div>
                <div class="bans">
                  <h5>Bans:</h5>
                  <ul class="hero-list">
                    ${createHeroList(match.bans1)}
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="team-detail ${match.winner === match.team2 ? 'winner' : ''}">
              <h4>${match.team2} ${match.winner === match.team2 ? '(ผู้ชนะ)' : ''}</h4>
              <div class="team-heroes">
                <div class="picks">
                  <h5>Picks:</h5>
                  <ul class="hero-list">
                    ${createHeroList(match.picks2)}
                  </ul>
                </div>
                <div class="bans">
                  <h5>Bans:</h5>
                  <ul class="hero-list">
                    ${createHeroList(match.bans2)}
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
    
    // Add modal directly to body
    document.body.appendChild(modalDiv);
    
    // Add custom inline styles specific to the modal's hero display
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .match-detail-modal .modal-body {
        max-height: 60vh;
        overflow-y: auto;
      }
      
      .match-detail-modal .teams-container {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
      
      .match-detail-modal .team-detail {
        flex: 1;
        min-width: 250px;
        max-width: 100%;
        background-color: rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .match-detail-modal .team-detail.winner {
        border-color: #4caf50;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
      }
      
      .match-detail-modal .team-heroes {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      
      .match-detail-modal .picks, 
      .match-detail-modal .bans {
        flex: 1;
        min-width: 100px;
      }
      
      .match-detail-modal .hero-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 300px;
        overflow-y: auto;
      }
      
      .match-detail-modal .hero-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        background-color: rgba(0,0,0,0.2);
        border-radius: 6px;
        padding: 5px;
      }
      
      .match-detail-modal .hero-image {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 10px;
        border: 1px solid rgba(255,255,255,0.2);
      }
      
      .match-detail-modal .hero-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .match-detail-modal .hero-name {
        flex: 1;
        font-size: 0.9rem;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .match-detail-modal .team-heroes {
          flex-direction: column;
        }
        
        .match-detail-modal .hero-list {
          max-height: 200px;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Add event listeners for close buttons
    const closeElements = modalDiv.querySelectorAll('.close-modal, .close-btn');
    closeElements.forEach(el => {
      el.addEventListener('click', () => {
        document.body.removeChild(modalDiv);
        document.head.removeChild(styleElement); // Remove the added styles
      });
    });
    
    // Close modal when clicking outside
    modalDiv.addEventListener('click', (e) => {
      if (e.target === modalDiv) {
        document.body.removeChild(modalDiv);
        document.head.removeChild(styleElement); // Remove the added styles
      }
    });
  } catch (error) {
    console.error('Error viewing match:', error);
    alert('เกิดข้อผิดพลาดในการดูข้อมูลแมตช์');
  }
}

// Function to edit match (placeholder)
function editMatch(index) {
  alert('ฟังก์ชันแก้ไขแมตช์จะเพิ่มในเวอร์ชันถัดไป');
}

// Function to delete match
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
      
      // Update data if DataManager is available
      if (typeof DataManager !== 'undefined' && typeof DataManager.init === 'function') {
        DataManager.init().then(() => {
          if (typeof UIManager !== 'undefined' && typeof UIManager.render === 'function') {
            UIManager.render();
          }
        });
      }
      
      alert('ลบแมตช์เรียบร้อยแล้ว');
    }
  } catch (error) {
    console.error('Error deleting match:', error);
    alert('เกิดข้อผิดพลาดในการลบแมตช์');
  }
}

// Helper function to update filter dropdowns
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

// Function to filter matches based on search and filter criteria
function filterMatches() {
  try {
    const searchText = document.getElementById('match-search')?.value.toLowerCase() || '';
    const tournamentFilter = document.getElementById('tournament-filter')?.value || '';
    const teamFilter = document.getElementById('team-filter')?.value || '';
    
    // Get matches data
    const matches = JSON.parse(localStorage.getItem('rovMatchData')) || [];
    
    // Get tbody element
    const tbody = document.getElementById('matches-tbody');
    if (!tbody) {
      console.warn("matches-tbody element not found");
      return;
    }
    
    // Clear the tbody
    tbody.innerHTML = '';
    
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
    
    // Render filtered matches
    filteredMatches.forEach((match, index) => {
      const row = document.createElement('tr');
      
      // Original index in the full matches array
      const originalIndex = matches.indexOf(match);
      
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
    
    // Display message if no matches found
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
    
  } catch (error) {
    console.error('Error filtering matches:', error);
  }
}

// ลบข้อมูลแมตช์ทั้งหมด
function deleteAllMatches() {
  if (
    confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลแมตช์ทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้"
    )
  ) {
    try {
      // ลบข้อมูลแมตช์จาก localStorage
      localStorage.removeItem("rovMatchData");

      // ตั้งค่าข้อมูลแมตช์เป็นอาร์เรย์ว่าง
      localStorage.setItem("rovMatchData", JSON.stringify([]));

      // รีเฟรชหน้าแมตช์
      renderMatchesTable();

      // อัปเดตข้อมูล
      DataManager.init()
        .then(() => {
          render();
        })
        .catch((err) => {
          console.error("Error updating data after delete all matches:", err);
        });

      alert("ลบข้อมูลแมตช์ทั้งหมดเรียบร้อย");
    } catch (error) {
      console.error("Error deleting all matches:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูลแมตช์");
    }
  }
}