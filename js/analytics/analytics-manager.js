/**
 * analytics-manager.js - Handles win rate calculations and recommendations
 * Manages the current draft state and provides analytical features
 */

import DataManager from '../data/data-manager.js';

const AnalyticsManager = (() => {
  // Store the draft state
  let currentDraft = {
    team1: {
      bans: [null, null, null, null], // Maximum 4 for global format
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

  // Draft sequence for 1-2-2-2-2-1 format
  const PICK_SEQUENCE = [
    { team: 1, count: 1 }, // Team 1 picks 1
    { team: 2, count: 2 }, // Team 2 picks 2
    { team: 1, count: 2 }, // Team 1 picks 2
    { team: 2, count: 2 }, // Team 2 picks 2
    { team: 1, count: 2 }, // Team 1 picks 2
    { team: 2, count: 1 }, // Team 2 picks 1
  ];

  // Position preferred order based on pick sequence
  const POSITION_ORDER = [
    "Slayer", // Usually first pick
    "Mid", // High impact role
    "Farm", // Carry role
    "Support", // Support for team
    "Abyssal", // Flexible role
  ];

  /**
   * Initialize analytics
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  function init() {
    // Load draft state from localStorage if available
    const savedDraft = localStorage.getItem("rovDraftState");
    if (savedDraft) {
      currentDraft = JSON.parse(savedDraft);
    }

    return Promise.resolve();
  }

  /**
   * Get current draft state
   * @returns {Object} The current draft state
   */
  function getCurrentDraft() {
    return currentDraft;
  }

  /**
   * Set team selection
   * @param {number} teamId - The ID of the team to select (1 or 2)
   */
  function setSelectedTeam(teamId) {
    currentDraft.selectedTeam = teamId;
    saveDraftState();
  }

  /**
   * Set current position for recommendations
   * @param {string} position - The position to set
   */
  function setCurrentPosition(position) {
    currentDraft.currentPosition = position;
    saveDraftState();
  }

  /**
   * Add a ban for a team
   * @param {number} teamId - The ID of the team (1 or 2)
   * @param {string} heroName - The name of the hero to ban
   * @param {number} slot - The slot to place the ban in
   * @returns {boolean} Whether the ban was successful
   */
  function addBan(teamId, heroName, slot) {
    console.log("AddBan Called with Raw Slot:", {
      teamId,
      heroName,
      slot,
      slotType: typeof slot,
    });

    // Convert to number
    const normalizedSlot = Number(slot);

    console.log("Normalized Slot:", normalizedSlot);

    // Check if slot is valid based on format
    const maxBans = getMaxBans();
    if (normalizedSlot < 0 || normalizedSlot >= maxBans) {
      console.warn(`Invalid ban slot: ${normalizedSlot}. Max bans: ${maxBans}`);
      return false;
    }

    // Add the ban
    currentDraft[`team${teamId}`].bans[normalizedSlot] = heroName;
    saveDraftState();
    return true;
  }

  /**
   * Add a pick for a team
   * @param {number} teamId - The ID of the team (1 or 2)
   * @param {string} heroName - The name of the hero to pick
   * @param {number} slot - The slot to place the pick in
   * @returns {boolean} Whether the pick was successful
   */
  function addPick(teamId, heroName, slot) {
    console.log("AddPick Called with Raw Slot:", {
      teamId,
      heroName,
      slot,
      slotType: typeof slot,
    });

    // Convert to number
    const normalizedSlot = Number(slot);

    console.log("Normalized Slot:", normalizedSlot);

    // Check if slot is valid
    if (normalizedSlot < 0 || normalizedSlot > 4) {
      console.warn(`Invalid pick slot: ${normalizedSlot}`);
      return false;
    }

    // Check if hero is already picked or banned
    const isAlreadyPicked =
      currentDraft.team1.picks.includes(heroName) ||
      currentDraft.team2.picks.includes(heroName);

    const isHeroBanned =
      currentDraft.team1.bans.includes(heroName) ||
      currentDraft.team2.bans.includes(heroName);

    if (isAlreadyPicked || isHeroBanned) {
      console.warn("Hero already picked or banned");
      return false;
    }

    // Add the pick
    currentDraft[`team${teamId}`].picks[normalizedSlot] = heroName;

    // Update draft step
    updateDraftStep();

    // Save state
    saveDraftState();

    return true;
  }

  /**
   * Get recommended heroes for the current position
   * @returns {Array} Array of recommended heroes
   */
  function getRecommendedHeroes() {
    const position = currentDraft.currentPosition;
    const team = currentDraft.selectedTeam === 1 ? 2 : 1;

    console.log(position);

    // Get opponent heroes
    const opponentHeroes = currentDraft[`team${team}`].picks.filter(
      (hero) => hero !== null
    );

    // If no heroes selected yet, use general recommendations
    if (opponentHeroes.length === 0) {
      return DataManager.getRecommendationsForPosition(position);
    }

    // Get recommendations based on opponent heroes
    return DataManager.getRecommendedHeroesAgainstOpponent(
      opponentHeroes,
      position
    );
  }

  /**
   * Calculate win rate for current draft
   * @returns {number} The calculated win rate percentage
   */
  function calculateWinRate() {
    const team1Picks = currentDraft.team1.picks.filter((pick) => pick !== null);
    const team2Picks = currentDraft.team2.picks.filter((pick) => pick !== null);

    // If no picks, return 50%
    if (team1Picks.length === 0 && team2Picks.length === 0) {
      return 50;
    }

    // Get win rate from DataManager
    return DataManager.getWinRateForComposition(team1Picks, team2Picks);
  }

  /**
   * Get next pick suggestion
   * @returns {Object|null} The recommended hero or null if no suggestion
   */
  function getNextPickSuggestion() {
    // Get current draft step
    const { team, pickIndex } = getCurrentPickTurn();

    // If no current turn (draft complete), return null
    if (team === null) return null;

    // Get recommended position based on pick order
    const suggestedPosition = POSITION_ORDER[pickIndex];

    // Get top hero for that position
    const recommendations =
      DataManager.getRecommendationsForPosition(suggestedPosition);

    // Filter out heroes that are already picked or banned
    const availableHeroes = recommendations.filter((hero) => {
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

  /**
   * Get current pick turn
   * @returns {Object} Object containing team and pickIndex
   */
  function getCurrentPickTurn() {
    // Count how many picks each team has
    const team1PickCount = currentDraft.team1.picks.filter(
      (pick) => pick !== null
    ).length;
    const team2PickCount = currentDraft.team2.picks.filter(
      (pick) => pick !== null
    ).length;

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

  /**
   * Update draft step
   */
  function updateDraftStep() {
    // Count total picks
    const team1PickCount = currentDraft.team1.picks.filter(
      (pick) => pick !== null
    ).length;
    const team2PickCount = currentDraft.team2.picks.filter(
      (pick) => pick !== null
    ).length;
    const totalPicks = team1PickCount + team2PickCount;

    // Update draft step
    currentDraft.draftStep = totalPicks;

    // Update phase
    if (totalPicks > 0) {
      currentDraft.draftPhase = "pick";
    }

    saveDraftState();
  }

  /**
   * Save draft state to localStorage
   */
  function saveDraftState() {
    localStorage.setItem("rovDraftState", JSON.stringify(currentDraft));
  }

  /**
   * Set format
   * @param {string} format - The format to set ('ranking' or 'global')
   */
  function setFormat(format) {
    currentDraft.format = format;
    saveDraftState();
  }

  /**
   * Get max bans based on format
   * @returns {number} Maximum number of bans
   */
  function getMaxBans() {
    return currentDraft.format === "global" ? 4 : 3;
  }

  /**
   * Reset draft
   */
  function resetDraft() {
    currentDraft = {
      team1: {
        bans: [null, null, null, null],
        picks: [null, null, null, null, null],
      },
      team2: {
        bans: [null, null, null, null],
        picks: [null, null, null, null, null],
      },
      selectedTeam: 1,
      currentPosition: "Slayer",
      draftPhase: "ban",
      draftStep: 0,
      format: localStorage.getItem("rovDefaultFormat") || "ranking",
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
    resetDraft,
  };
})();

export default AnalyticsManager;