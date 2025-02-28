/**
 * analytics.js - Handles win rate calculations and recommendations
 */

const AnalyticsManager = (() => {
    // Store the draft state
    let currentDraft = {
        team1: {
            bans: [null, null, null],
            picks: [null, null, null, null, null]
        },
        team2: {
            bans: [null, null, null],
            picks: [null, null, null, null, null]
        },
        selectedTeam: 1,
        currentPosition: 'Slayer',
        draftPhase: 'ban', // 'ban' or 'pick'
        draftStep: 0
    };

    // Draft sequence for 1-2-2-2-2-1 format
    const PICK_SEQUENCE = [
        { team: 1, count: 1 }, // Team 1 picks 1
        { team: 2, count: 2 }, // Team 2 picks 2
        { team: 1, count: 2 }, // Team 1 picks 2
        { team: 2, count: 2 }, // Team 2 picks 2
        { team: 1, count: 2 }, // Team 1 picks 2
        { team: 2, count: 1 }  // Team 2 picks 1
    ];

    // Position preferred order based on pick sequence
    const POSITION_ORDER = [
        'Slayer',   // Usually first pick
        'Mid',      // High impact role
        'Farm',     // Carry role
        'Support',  // Support for team
        'Abyssal'   // Flexible role
    ];

    // Initialize analytics
    function init() {
        // Load draft state from localStorage if available
        const savedDraft = localStorage.getItem('rovDraftState');
        if (savedDraft) {
            currentDraft = JSON.parse(savedDraft);
        }
        
        return Promise.resolve();
    }

    // Get current draft state
    function getCurrentDraft() {
        return currentDraft;
    }

    // Set team selection
    function setSelectedTeam(teamId) {
        currentDraft.selectedTeam = teamId;
        saveDraftState();
    }

    // Set current position for recommendations
    function setCurrentPosition(position) {
        currentDraft.currentPosition = position;
        saveDraftState();
    }

    // Add a ban for a team
    function addBan(teamId, heroName, slot) {
        // Validate slot
        if (slot < 0 || slot > 2) return false;
        
        // Check if hero is already banned
        const isAlreadyBanned = 
            currentDraft.team1.bans.includes(heroName) || 
            currentDraft.team2.bans.includes(heroName);
        
        if (isAlreadyBanned) return false;
        
        // Add the ban
        currentDraft[`team${teamId}`].bans[slot] = heroName;
        saveDraftState();
        return true;
    }

    // Add a pick for a team
    function addPick(teamId, heroName, slot) {
        // Validate slot
        if (slot < 0 || slot > 4) return false;
        
        // Check if hero is already picked
        const isAlreadyPicked = 
            currentDraft.team1.picks.includes(heroName) || 
            currentDraft.team2.picks.includes(heroName);
            
        // Check if hero is banned
        const isHeroBanned = 
            currentDraft.team1.bans.includes(heroName) || 
            currentDraft.team2.bans.includes(heroName);
        
        if (isAlreadyPicked || isHeroBanned) return false;
        
        // Add the pick
        currentDraft[`team${teamId}`].picks[slot] = heroName;
        saveDraftState();
        
        // Update draft step
        updateDraftStep();
        
        return true;
    }

    // Get recommended heroes for the current position
    function getRecommendedHeroes() {
        const position = currentDraft.currentPosition;
        const team = currentDraft.selectedTeam;
        
        // Get base recommendations from DataManager
        let recommendations = DataManager.getRecommendationsForPosition(position);
        
        // Filter out heroes that are already picked or banned
        recommendations = recommendations.filter(hero => {
            const heroName = hero.name;
            
            // Check if already picked
            const isAlreadyPicked = 
                currentDraft.team1.picks.includes(heroName) || 
                currentDraft.team2.picks.includes(heroName);
                
            // Check if banned
            const isHeroBanned = 
                currentDraft.team1.bans.includes(heroName) || 
                currentDraft.team2.bans.includes(heroName);
            
            return !isAlreadyPicked && !isHeroBanned;
        });
        
        return recommendations;
    }

    // Calculate win rate for current draft
    function calculateWinRate() {
        const team1Picks = currentDraft.team1.picks.filter(pick => pick !== null);
        const team2Picks = currentDraft.team2.picks.filter(pick => pick !== null);
        
        // If no picks, return 50%
        if (team1Picks.length === 0 && team2Picks.length === 0) {
            return 50;
        }
        
        // Get win rate from DataManager
        return DataManager.getWinRateForComposition(team1Picks, team2Picks);
    }

    // Get next pick suggestion
    function getNextPickSuggestion() {
        // Get current draft step
        const { team, pickIndex } = getCurrentPickTurn();
        
        // If no current turn (draft complete), return null
        if (team === null) return null;
        
        // Get recommended position based on pick order
        const suggestedPosition = POSITION_ORDER[pickIndex];
        
        // Get top hero for that position
        const recommendations = DataManager.getRecommendationsForPosition(suggestedPosition);
        
        // Filter out heroes that are already picked or banned
        const availableHeroes = recommendations.filter(hero => {
            const heroName = hero.name;
            
            // Check if already picked
            const isAlreadyPicked = 
                currentDraft.team1.picks.includes(heroName) || 
                currentDraft.team2.picks.includes(heroName);
                
            // Check if banned
            const isHeroBanned = 
                currentDraft.team1.bans.includes(heroName) || 
                currentDraft.team2.bans.includes(heroName);
            
            return !isAlreadyPicked && !isHeroBanned;
        });
        
        // Return the top hero if available
        return availableHeroes.length > 0 ? availableHeroes[0] : null;
    }

    // Get current pick turn
    function getCurrentPickTurn() {
        // Count how many picks each team has
        const team1PickCount = currentDraft.team1.picks.filter(pick => pick !== null).length;
        const team2PickCount = currentDraft.team2.picks.filter(pick => pick !== null).length;
        
        // Total pick count
        const totalPicks = team1PickCount + team2PickCount;
        
        // If all picks are done, return null
        if (totalPicks >= 10) {
            return { team: null, pickIndex: null };
        }
        
        // Find the current step in the sequence
        let currentStep = 0;
        let picksAccountedFor = 0;
        
        for (let i = 0; i < PICK_SEQUENCE.length; i++) {
            const step = PICK_SEQUENCE[i];
            picksAccountedFor += step.count;
            
            if (picksAccountedFor > totalPicks) {
                currentStep = i;
                break;
            }
        }
        
        // Get the team for the current step
        const team = PICK_SEQUENCE[currentStep].team;
        
        // Calculate the pick index within the team
        let pickIndex = 0;
        if (team === 1) {
            pickIndex = team1PickCount;
        } else {
            pickIndex = team2PickCount;
        }
        
        return { team, pickIndex };
    }

    // Update draft step
    function updateDraftStep() {
        // Count total picks
        const team1PickCount = currentDraft.team1.picks.filter(pick => pick !== null).length;
        const team2PickCount = currentDraft.team2.picks.filter(pick => pick !== null).length;
        const totalPicks = team1PickCount + team2PickCount;
        
        // Update draft step
        currentDraft.draftStep = totalPicks;
        
        // Update phase
        if (totalPicks > 0) {
            currentDraft.draftPhase = 'pick';
        }
        
        saveDraftState();
    }

    // Save draft state to localStorage
    function saveDraftState() {
        localStorage.setItem('rovDraftState', JSON.stringify(currentDraft));
    }

    // Reset draft
    function resetDraft() {
        currentDraft = {
            team1: {
                bans: [null, null, null],
                picks: [null, null, null, null, null]
            },
            team2: {
                bans: [null, null, null],
                picks: [null, null, null, null, null]
            },
            selectedTeam: 1,
            currentPosition: 'Slayer',
            draftPhase: 'ban',
            draftStep: 0
        };
        
        saveDraftState();
    }
    
    // Public API
    return {
        init,
        getCurrentDraft,
        setSelectedTeam,
        setCurrentPosition,
        addBan,
        addPick,
        getRecommendedHeroes,
        calculateWinRate,
        getNextPickSuggestion,
        getCurrentPickTurn,
        resetDraft
    };
})();