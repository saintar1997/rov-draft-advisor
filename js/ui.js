/**
 * ui.js - Handles UI interactions and rendering
 */

const UIManager = (() => {
    // DOM elements
    let elements = {};
    
    // Hero selection state
    let selectionState = {
        targetTeam: 1,
        targetSlot: 0,
        targetType: 'ban' // 'ban' or 'pick'
    };
    
    // Initialize UI
    function init() {
        // Cache DOM elements
        cacheElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Render initial state
        render();
        
        return Promise.resolve();
    }
    
    // Cache DOM elements for better performance
    function cacheElements() {
        elements = {
            teamButtons: {
                team1: document.getElementById('team1-btn'),
                team2: document.getElementById('team2-btn')
            },
            banSlots: {
                team1: Array.from(document.querySelectorAll('.ban-slot[data-team="1"]')),
                team2: Array.from(document.querySelectorAll('.ban-slot[data-team="2"]'))
            },
            pickSlots: {
                team1: Array.from(document.querySelectorAll('.pick-slot[data-team="1"]')),
                team2: Array.from(document.querySelectorAll('.pick-slot[data-team="2"]'))
            },
            positionButtons: Array.from(document.querySelectorAll('.position-btn')),
            recommendedHeroes: document.querySelector('.recommended-heroes'),
            winRateDisplay: {
                progress: document.querySelector('.progress'),
                percentage: document.querySelector('.percentage')
            },
            modal: {
                container: document.getElementById('heroSelectionModal'),
                closeButton: document.querySelector('.close-btn'),
                searchInput: document.getElementById('heroSearch'),
                filterButtons: document.querySelectorAll('.filter-btn'),
                heroesGrid: document.querySelector('.heroes-grid')
            },
            resetButton: document.getElementById('reset-btn'),
            loadingOverlay: document.querySelector('.loading-overlay')
        };
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Team selection
        elements.teamButtons.team1.addEventListener('click', () => {
            setActiveTeam(1);
        });
        
        elements.teamButtons.team2.addEventListener('click', () => {
            setActiveTeam(2);
        });
        
        // Ban slots
        elements.banSlots.team1.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                openHeroSelection('ban', 1, index);
            });
        });
        
        elements.banSlots.team2.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                openHeroSelection('ban', 2, index);
            });
        });
        
        // Pick slots
        elements.pickSlots.team1.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                openHeroSelection('pick', 1, index);
            });
        });
        
        elements.pickSlots.team2.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                openHeroSelection('pick', 2, index);
            });
        });
        
        // Position buttons
        elements.positionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const position = button.getAttribute('data-position');
                setActivePosition(position);
            });
        });
        
        // Modal close button
        elements.modal.closeButton.addEventListener('click', closeHeroSelection);
        
        // Modal search input
        elements.modal.searchInput.addEventListener('input', filterHeroes);
        
        // Modal filter buttons
        elements.modal.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                setActiveFilter(filter);
                filterHeroes();
            });
        });
        
        // Reset button
        elements.resetButton.addEventListener('click', resetDraft);
    }
    
    // Set active team
    function setActiveTeam(teamId) {
        // Update UI
        elements.teamButtons.team1.classList.toggle('active', teamId === 1);
        elements.teamButtons.team2.classList.toggle('active', teamId === 2);
        
        // Update analytics
        AnalyticsManager.setSelectedTeam(teamId);
        
        // Update UI
        renderRecommendations();
        renderWinRate();
    }
    
    // Set active position
    function setActivePosition(position) {
        // Update UI
        elements.positionButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-position') === position);
        });
        
        // Update analytics
        AnalyticsManager.setCurrentPosition(position);
        
        // Update UI
        renderRecommendations();
    }
    
    // Open hero selection modal
    function openHeroSelection(type, teamId, slotIndex) {
        // Set selection state
        selectionState.targetType = type;
        selectionState.targetTeam = teamId;
        selectionState.targetSlot = slotIndex;
        
        // Show modal
        elements.modal.container.style.display = 'block';
        
        // Reset search
        elements.modal.searchInput.value = '';
        
        // Reset filter
        setActiveFilter('all');
        
        // Populate heroes
        populateHeroGrid();
    }
    
    // Close hero selection modal
    function closeHeroSelection() {
        elements.modal.container.style.display = 'none';
    }
    
    // Populate hero grid in modal
    function populateHeroGrid() {
        // Get heroes
        const heroes = DataManager.getHeroesByRole();
        
        // Clear grid
        elements.modal.heroesGrid.innerHTML = '';
        
        // Populate grid
        heroes.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';
            
            const heroImage = document.createElement('img');
            heroImage.src = hero.image;
            heroImage.alt = hero.name;
            
            const heroName = document.createElement('div');
            heroName.className = 'hero-name';
            heroName.textContent = hero.name;
            
            heroCard.appendChild(heroImage);
            heroCard.appendChild(heroName);
            
            // Add click event
            heroCard.addEventListener('click', () => {
                selectHero(hero.name);
            });
            
            elements.modal.heroesGrid.appendChild(heroCard);
        });
        
        // Initial filter
        filterHeroes();
    }
    
    // Filter heroes in grid
    function filterHeroes() {
        const searchText = elements.modal.searchInput.value.toLowerCase();
        const activeFilter = getActiveFilter();
        
        // Get all hero cards
        const heroCards = elements.modal.heroesGrid.querySelectorAll('.hero-card');
        
        // Filter by search text and role
        heroCards.forEach(card => {
            const heroName = card.querySelector('.hero-name').textContent.toLowerCase();
            const heroData = DataManager.getHeroByName(heroName);
            
            // Check if hero matches filter
            const matchesFilter = activeFilter === 'all' || heroData.roles.includes(activeFilter);
            
            // Check if hero matches search
            const matchesSearch = heroName.includes(searchText);
            
            // Show/hide card
            card.style.display = matchesFilter && matchesSearch ? 'block' : 'none';
        });
    }
    
    // Get active filter
    function getActiveFilter() {
        const activeFilterButton = Array.from(elements.modal.filterButtons).find(btn => 
            btn.classList.contains('active')
        );
        
        return activeFilterButton ? activeFilterButton.getAttribute('data-filter') : 'all';
    }
    
    // Set active filter
    function setActiveFilter(filter) {
        elements.modal.filterButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-filter') === filter);
        });
    }
    
    // Select hero from modal
    function selectHero(heroName) {
        // Add hero to draft
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
        
        // If successful, close modal and update UI
        if (success) {
            closeHeroSelection();
            render();
        } else {
            // Show error message
            alert('ไม่สามารถเลือกฮีโร่นี้ได้ เนื่องจากถูกเลือกหรือแบนไปแล้ว');
        }
    }
    
    // Render the entire UI
    function render() {
        // Get current draft
        const draft = AnalyticsManager.getCurrentDraft();
        
        // Render team selection
        elements.teamButtons.team1.classList.toggle('active', draft.selectedTeam === 1);
        elements.teamButtons.team2.classList.toggle('active', draft.selectedTeam === 2);
        
        // Render bans
        renderBans(draft);
        
        // Render picks
        renderPicks(draft);
        
        // Render active position
        elements.positionButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-position') === draft.currentPosition);
        });
        
        // Render recommendations
        renderRecommendations();
        
        // Render win rate
        renderWinRate();
    }
    
    // Render bans
    function renderBans(draft) {
        // Team 1 bans
        elements.banSlots.team1.forEach((slot, index) => {
            const heroName = draft.team1.bans[index];
            const heroPortrait = slot.querySelector('.hero-portrait');
            
            if (heroName) {
                heroPortrait.classList.remove('empty');
                heroPortrait.innerHTML = '';
                
                const hero = DataManager.getHeroByName(heroName);
                if (hero) {
                    const img = document.createElement('img');
                    img.src = hero.image;
                    img.alt = heroName;
                    heroPortrait.appendChild(img);
                }
            } else {
                heroPortrait.classList.add('empty');
                heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
            }
        });
        
        // Team 2 bans
        elements.banSlots.team2.forEach((slot, index) => {
            const heroName = draft.team2.bans[index];
            const heroPortrait = slot.querySelector('.hero-portrait');
            
            if (heroName) {
                heroPortrait.classList.remove('empty');
                heroPortrait.innerHTML = '';
                
                const hero = DataManager.getHeroByName(heroName);
                if (hero) {
                    const img = document.createElement('img');
                    img.src = hero.image;
                    img.alt = heroName;
                    heroPortrait.appendChild(img);
                }
            } else {
                heroPortrait.classList.add('empty');
                heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
            }
        });
    }
    
    // Render picks
    function renderPicks(draft) {
        // Team 1 picks
        elements.pickSlots.team1.forEach((slot, index) => {
            const heroName = draft.team1.picks[index];
            const heroPortrait = slot.querySelector('.hero-portrait');
            
            if (heroName) {
                heroPortrait.classList.remove('empty');
                heroPortrait.innerHTML = '';
                
                const hero = DataManager.getHeroByName(heroName);
                if (hero) {
                    const img = document.createElement('img');
                    img.src = hero.image;
                    img.alt = heroName;
                    heroPortrait.appendChild(img);
                }
            } else {
                heroPortrait.classList.add('empty');
                heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
            }
        });
        
        // Team 2 picks
        elements.pickSlots.team2.forEach((slot, index) => {
            const heroName = draft.team2.picks[index];
            const heroPortrait = slot.querySelector('.hero-portrait');
            
            if (heroName) {
                heroPortrait.classList.remove('empty');
                heroPortrait.innerHTML = '';
                
                const hero = DataManager.getHeroByName(heroName);
                if (hero) {
                    const img = document.createElement('img');
                    img.src = hero.image;
                    img.alt = heroName;
                    heroPortrait.appendChild(img);
                }
            } else {
                heroPortrait.classList.add('empty');
                heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
            }
        });
    }
    
    // Render recommendations
    function renderRecommendations() {
        // Get recommendations
        const recommendations = AnalyticsManager.getRecommendedHeroes();
        
        // Clear recommendations
        elements.recommendedHeroes.innerHTML = '';
        
        // Render recommendations
        recommendations.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';
            
            const heroImage = document.createElement('img');
            heroImage.src = hero.image;
            heroImage.alt = hero.name;
            
            const heroName = document.createElement('div');
            heroName.className = 'hero-name';
            heroName.textContent = hero.name;
            
            const winRate = document.createElement('div');
            winRate.className = 'win-rate';
            winRate.textContent = `${hero.winRate}%`;
            
            heroCard.appendChild(heroImage);
            heroCard.appendChild(heroName);
            heroCard.appendChild(winRate);
            
            elements.recommendedHeroes.appendChild(heroCard);
        });
        
        // If no recommendations
        if (recommendations.length === 0) {
            const noRecommendations = document.createElement('p');
            noRecommendations.textContent = 'ไม่มีคำแนะนำสำหรับตำแหน่งนี้';
            elements.recommendedHeroes.appendChild(noRecommendations);
        }
    }
    
    // Render win rate
    function renderWinRate() {
        // Get win rate
        const winRate = AnalyticsManager.calculateWinRate();
        
        // Update UI
        elements.winRateDisplay.progress.style.width = `${winRate}%`;
        elements.winRateDisplay.percentage.textContent = `${Math.round(winRate)}%`;
    }
    
    // Reset draft
    function resetDraft() {
        if (confirm('แน่ใจหรือไม่ว่าต้องการรีเซ็ตการดราฟ?')) {
            AnalyticsManager.resetDraft();
            render();
        }
    }
    
    // Show loading overlay
    function showLoading() {
        elements.loadingOverlay.style.display = 'flex';
    }
    
    // Hide loading overlay
    function hideLoading() {
        elements.loadingOverlay.style.display = 'none';
    }
    
    // Public API
    return {
        init,
        render,
        showLoading,
        hideLoading
    };
})();