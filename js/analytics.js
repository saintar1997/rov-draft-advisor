/**
 * analytics.js - Handles win rate calculations and draft recommendations
 * Refactored for better organization, error handling, and performance
 */

const AnalyticsManager = (() => {
  // Default draft state with proper type initialization
  const DEFAULT_DRAFT_STATE = {
    team1: {
      bans: [null, null, null, null], // Support up to 4 bans (Global format)
      picks: [null, null, null, null, null],
    },
    team2: {
      bans: [null, null, null, null],
      picks: [null, null, null, null, null],
    },
    selectedTeam: 1,
    currentPosition: "Slayer",
    draftPhase: "ban", // 'ban' or 'pick'
    draftStep: 0,
    format: "ranking", // 'ranking' or 'global'
  };

  // Draft state (will be initialized in init())
  let currentDraft = {...DEFAULT_DRAFT_STATE};

  // Draft sequence for standard 1-2-2-2-2-1 format (10 total picks)
  const PICK_SEQUENCE = [
    { team: 1, count: 1 }, // Team 1 picks 1
    { team: 2, count: 2 }, // Team 2 picks 2
    { team: 1, count: 2 }, // Team 1 picks 2
    { team: 2, count: 2 }, // Team 2 picks 2
    { team: 1, count: 2 }, // Team 1 picks 2
    { team: 2, count: 1 }, // Team 2 picks 1
  ];

  // Position preferred order based on typical pick sequence
  const POSITION_ORDER = [
    "Slayer",   // Usually first pick (high impact solo lane)
    "Mid",      // High impact role (mage)
    "Farm",     // Carry role (marksman)
    "Support",  // Support for team
    "Abyssal",  // Flexible role (jungle)
  ];

  /**
   * Initialize analytics module
   * @returns {Promise} Promise that resolves when initialization is complete
   */
  function init() {
    // Load draft state from localStorage if available
    try {
      const savedDraft = localStorage.getItem("rovDraftState");
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        // Ensure all required properties exist
        currentDraft = {
          ...DEFAULT_DRAFT_STATE,
          ...parsedDraft
        };
      } else {
        // Use default state but respect the default format from settings
        const defaultFormat = localStorage.getItem("rovDefaultFormat") || "ranking";
        currentDraft = {
          ...DEFAULT_DRAFT_STATE,
          format: defaultFormat
        };
        saveDraftState();
      }
    } catch (error) {
      console.error("Error loading draft state:", error);
      // Reset to default on error
      currentDraft = {...DEFAULT_DRAFT_STATE};
      saveDraftState();
    }

    return Promise.resolve();
  }

  /**
   * Get current draft state
   * @returns {Object} Current draft state
   */
  function getCurrentDraft() {
    return currentDraft;
  }

  /**
   * Set team selection
   * @param {number} teamId - Team ID (1 or 2)
   */
  function setSelectedTeam(teamId) {
    if (teamId !== 1 && teamId !== 2) {
      console.warn(`Invalid team ID: ${teamId}. Must be 1 or 2.`);
      return;
    }
    
    currentDraft.selectedTeam = teamId;
    saveDraftState();
  }

  /**
   * Set current position for recommendations
   * @param {string} position - Position name
   */
  function setCurrentPosition(position) {
    // Validate position
    const validPositions = ["Slayer", "Farm", "Mid", "Abyssal", "Support"];
    if (!validPositions.includes(position)) {
      console.warn(`Invalid position: ${position}`);
      return;
    }
    
    currentDraft.currentPosition = position;
    saveDraftState();
  }

  /**
   * Add hero ban to draft
   * @param {number} teamId - Team ID (1 or 2)
   * @param {string} heroName - Hero name
   * @param {number} slot - Ban slot index
   * @returns {boolean} Success status
   */
  function addBan(teamId, heroName, slot) {
    if (!heroName) {
      console.warn("No hero name provided for ban");
      return false;
    }

    // Validate team ID
    if (teamId !== 1 && teamId !== 2) {
      console.warn(`Invalid team ID: ${teamId}. Must be 1 or 2.`);
      return false;
    }

    // Convert to number if string
    const slotIndex = Number(slot);
    
    // Validate slot index
    const maxBans = getMaxBans();
    if (slotIndex < 0 || slotIndex >= maxBans) {
      console.warn(`Invalid ban slot: ${slotIndex}. Max bans: ${maxBans}`);
      return false;
    }

    // Check if hero is already picked or banned
    if (isHeroPickedOrBanned(heroName)) {
      console.warn(`Hero ${heroName} is already picked or banned`);
      return false;
    }

    // Add ban
    currentDraft[`team${teamId}`].bans[slotIndex] = heroName;
    
    saveDraftState();
    return true;
  }

  /**
   * Add hero pick to draft
   * @param {number} teamId - Team ID (1 or 2)
   * @param {string} heroName - Hero name
   * @param {number} slot - Pick slot index
   * @returns {boolean} Success status
   */
  function addPick(teamId, heroName, slot) {
    if (!heroName) {
      console.warn("No hero name provided for pick");
      return false;
    }

    // Validate team ID
    if (teamId !== 1 && teamId !== 2) {
      console.warn(`Invalid team ID: ${teamId}. Must be 1 or 2.`);
      return false;
    }

    // Convert to number if string
    const slotIndex = Number(slot);
    
    // Validate slot index
    if (slotIndex < 0 || slotIndex > 4) {
      console.warn(`Invalid pick slot: ${slotIndex}. Must be between 0 and 4.`);
      return false;
    }

    // Check if hero is already picked or banned
    if (isHeroPickedOrBanned(heroName)) {
      console.warn(`Hero ${heroName} is already picked or banned`);
      return false;
    }

    // Add pick
    currentDraft[`team${teamId}`].picks[slotIndex] = heroName;

    // Update draft step
    updateDraftStep();

    saveDraftState();
    return true;
  }

  /**
   * Check if hero is already picked or banned
   * @param {string} heroName - Hero name
   * @returns {boolean} True if hero is picked or banned
   */
  function isHeroPickedOrBanned(heroName) {
    // Check team 1 picks
    if (currentDraft.team1.picks.includes(heroName)) return true;
    
    // Check team 2 picks
    if (currentDraft.team2.picks.includes(heroName)) return true;
    
    // Check team 1 bans
    if (currentDraft.team1.bans.includes(heroName)) return true;
    
    // Check team 2 bans
    if (currentDraft.team2.bans.includes(heroName)) return true;
    
    return false;
  }

  /**
   * Get recommended heroes for the current position
   * @returns {Array} Array of recommended heroes
   */
  function getRecommendedHeroes() {
    const position = currentDraft.currentPosition;
    const opposingTeam = currentDraft.selectedTeam === 1 ? 2 : 1;

    // Get opposing team's picks
    const opponentHeroes = currentDraft[`team${opposingTeam}`].picks.filter(
      hero => hero !== null
    );

    // If no opponent heroes picked yet, return general recommendations
    if (opponentHeroes.length === 0) {
      return DataManager.getRecommendationsForPosition(position);
    }

    // Get recommendations based on opponent picks
    return DataManager.getRecommendedHeroesAgainstOpponent(
      opponentHeroes,
      position
    );
  }

  /**
   * Calculate win rate for current draft
   * @returns {number} Win rate percentage for team 1
   */
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

  /**
   * Get next pick suggestion
   * @returns {Object|null} Suggested hero or null if draft complete
   */
  function getNextPickSuggestion() {
    // Get current pick turn
    const { team, pickIndex } = getCurrentPickTurn();

    // If no current turn (draft complete), return null
    if (team === null) return null;

    // Get recommended position based on pick order
    const suggestedPosition = POSITION_ORDER[pickIndex];

    // Get top heroes for that position
    const recommendations = DataManager.getRecommendationsForPosition(suggestedPosition);

    // Filter out heroes that are already picked or banned
    const availableHeroes = recommendations.filter(hero => 
      !isHeroPickedOrBanned(hero.name)
    );

    // Return the top hero if available
    return availableHeroes.length > 0 ? availableHeroes[0] : null;
  }

  /**
   * Get current pick turn
   * @returns {Object} Object with team and pickIndex properties
   */
  function getCurrentPickTurn() {
    // Count picks for each team
    const team1PickCount = currentDraft.team1.picks.filter(pick => pick !== null).length;
    const team2PickCount = currentDraft.team2.picks.filter(pick => pick !== null).length;
    
    // Total picks
    const totalPicks = team1PickCount + team2PickCount;
    
    // If all picks are done, return null
    if (totalPicks >= 10) {
      return { team: null, pickIndex: null };
    }
    
    // Find current step in sequence
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
    
    // Get team for current step
    const team = PICK_SEQUENCE[currentStep].team;
    
    // Calculate pick index within the team
    const pickIndex = team === 1 ? team1PickCount : team2PickCount;
    
    return { team, pickIndex };
  }

  /**
   * Update draft step
   */
  function updateDraftStep() {
    // Count total picks
    const team1PickCount = currentDraft.team1.picks.filter(pick => pick !== null).length;
    const team2PickCount = currentDraft.team2.picks.filter(pick => pick !== null).length;
    const totalPicks = team1PickCount + team2PickCount;
    
    // Update draft step
    currentDraft.draftStep = totalPicks;
    
    // Update phase (ban or pick)
    if (totalPicks > 0) {
      currentDraft.draftPhase = "pick";
    }
  }

  /**
   * Save draft state to localStorage
   */
  function saveDraftState() {
    try {
      localStorage.setItem("rovDraftState", JSON.stringify(currentDraft));
    } catch (error) {
      console.error("Error saving draft state:", error);
    }
  }

  /**
   * Set draft format
   * @param {string} format - Draft format ('ranking' or 'global')
   */
  function setFormat(format) {
    // Validate format
    if (format !== "ranking" && format !== "global") {
      console.warn(`Invalid format: ${format}. Must be 'ranking' or 'global'.`);
      return;
    }
    
    currentDraft.format = format;
    saveDraftState();
  }

  /**
   * Get maximum number of bans based on format
   * @returns {number} Maximum number of bans
   */
  function getMaxBans() {
    return currentDraft.format === "global" ? 4 : 3;
  }

  /**
   * Reset draft to initial state
   */
  function resetDraft() {
    // Preserve format
    const currentFormat = currentDraft.format;
    
    // Reset draft
    currentDraft = {
      ...DEFAULT_DRAFT_STATE,
      format: currentFormat
    };
    
    saveDraftState();
  }

  // Public API
  return {
    init,
    getCurrentDraft,
    setSelectedTeam,
    setCurrentPosition,
    setFormat,
    addBan,
    addPick,
    getRecommendedHeroes,
    calculateWinRate,
    getNextPickSuggestion,
    getCurrentPickTurn,
    getMaxBans,
    resetDraft
  };
})();