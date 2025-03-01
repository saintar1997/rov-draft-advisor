/**
 * app.js - Main application entry point with enhanced initialization
 */

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing RoV Draft Helper...');
        
        // Show loading overlay using direct DOM manipulation for safety
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Check if it's the first time running the app
        const isFirstRun = !localStorage.getItem('rovHeroData');
        console.log('Is first run?', isFirstRun);
        
        // Load default settings if it's the first run
        if (isFirstRun) {
            console.log('First run - setting default settings');
            
            // Set default format
            localStorage.setItem('rovDefaultFormat', 'ranking');
            
            // Initialize with default hero data if none exists
            if (!localStorage.getItem('rovHeroData')) {
                const DEFAULT_HERO_DATA = {
                    Assassin: ['Airi', 'Butterfly', 'Keera', 'Murad', 'Nakroth', 'Quillen', 'Wukong', 'Zuka'],
                    Fighter: ['Allain', 'Arthur', 'Astrid', 'Florentino', 'Lu Bu', 'Omen', 'Qi', 'Riktor', 'Valhein', 'Yena'],
                    Mage: ['Azzen\'Ka', 'Dirak', 'Ignis', 'Ilumia', 'Kahlii', 'Krixi', 'Lauriel', 'Liliana', 'Natalya', 'Tulen', 'Zata'],
                    Carry: ['Capheny', 'Elsu', 'Laville', 'Lindis', 'Slimz', 'Tel\'Annas', 'Thorne', 'Violet', 'Wisp', 'Yorn'],
                    Support: ['Alice', 'Annette', 'Chaugnar', 'Enzo', 'Ishar', 'Krizzix', 'Lumburr', 'Rouie', 'Zip'],
                    Tank: ['Arum', 'Baldum', 'Grakk', 'Moren', 'Omega', 'Ormarr', 'Roxie', 'Skud', 'Thane', 'Y\'bneth']
                };
                
                localStorage.setItem('rovHeroData', JSON.stringify(DEFAULT_HERO_DATA));
                console.log('Initialized default hero data');
                
                // Create empty hero images object
                localStorage.setItem('rovHeroImages', JSON.stringify({}));
                console.log('Initialized empty hero images');
            }
            
            // Initialize with default match data if none exists
            if (!localStorage.getItem('rovMatchData')) {
                const DEFAULT_MATCH_DATA = [
                    {
                        date: "2025-01-15",
                        tournament: "RoV Pro League 2025 Summer Group Stage",
                        team1: "Team Flash",
                        team2: "Buriram United Esports",
                        picks1: ["Florentino", "Valhein", "Tulen", "Alice", "Thane"],
                        picks2: ["Riktor", "Violet", "Zata", "Zip", "Ormarr"],
                        bans1: ["Keera", "Capheny"],
                        bans2: ["Airi", "Laville"],
                        winner: "Team Flash"
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
                        winner: "King of Gamers Club"
                    }
                ];
                
                localStorage.setItem('rovMatchData', JSON.stringify(DEFAULT_MATCH_DATA));
                console.log('Initialized default match data');
            }
        } else {
            console.log('Not first run - using existing data');
        }
        
        // Initialize in proper sequence with better error handling
        try {
            console.log('Initializing DataManager...');
            await DataManager.init();
            console.log('DataManager initialized successfully');
        } catch (dataError) {
            console.error('Error initializing DataManager:', dataError);
        }
        
        try {
            console.log('Initializing AnalyticsManager...');
            await AnalyticsManager.init();
            console.log('AnalyticsManager initialized successfully');
        } catch (analyticsError) {
            console.error('Error initializing AnalyticsManager:', analyticsError);
        }
        
        try {
            console.log('Initializing UIManager...');
            await UIManager.init();
            console.log('UIManager initialized successfully');
        } catch (uiError) {
            console.error('Error initializing UIManager:', uiError);
        }
        
        try {
            console.log('Initializing HeroManager...');
            if (typeof HeroManager !== 'undefined' && typeof HeroManager.init === 'function') {
                HeroManager.init();
                console.log('HeroManager initialized successfully');
            } else {
                console.warn('HeroManager not available');
            }
        } catch (heroError) {
            console.error('Error initializing HeroManager:', heroError);
        }
        
        try {
            console.log('Initializing HeroSelectionController...');
            if (typeof HeroSelectionController !== 'undefined' && typeof HeroSelectionController.init === 'function') {
                HeroSelectionController.init();
                console.log('HeroSelectionController initialized successfully');
            } else {
                console.warn('HeroSelectionController not available');
            }
        } catch (selectionError) {
            console.error('Error initializing HeroSelectionController:', selectionError);
        }
        
        // Hide loading overlay using the UI manager (now it's safe)
        try {
            if (typeof UIManager !== 'undefined' && typeof UIManager.hideLoading === 'function') {
                UIManager.hideLoading();
            } else {
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            }
        } catch (error) {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }
        
        console.log('RoV Draft Helper initialized successfully!');
    } catch (error) {
        console.error('Critical Error initializing application:', error);
        
        // Hide loading overlay even on error
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        alert('เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน กรุณาลองใหม่อีกครั้ง');
    }
});