/**
 * data.js - Handles data loading, parsing, and storage with improved organization and error handling
 */

const DataManager = (() => {
  // Private state variables
  let heroes = {};
  let matches = [];
  let heroStats = {};
  let heroWinRates = {};
  let positionRecommendations = {};
  let heroImages = {};
  
  // Default hero position assignments
  const HERO_POSITIONS = {
    Slayer: [
      "Airi", "Allain", "Arthur", "Astrid", "Butterfly", "Florentino", 
      "Lu Bu", "Murad", "Nakroth", "Omen", "Qi", "Quillen", "Riktor", 
      "Wukong", "Yena", "Zuka"
    ],
    Farm: [
      "Capheny", "Elsu", "Laville", "Lindis", "Slimz", "Tel'Annas", 
      "Thorne", "Valhein", "Violet", "Wisp", "Yorn"
    ],
    Mid: [
      "Azzen'Ka", "Dirak", "Ignis", "Ilumia", "Kahlii", "Krixi", 
      "Lauriel", "Liliana", "Natalya", "Tulen", "Zata"
    ],
    Abyssal: [
      "Keera", "Roxie", "Skud", "Y'bneth", "Zephys", "Zill", "Zuka"
    ],
    Support: [
      "Alice", "Annette", "Arum", "Baldum", "Chaugnar", "Enzo", "Grakk", 
      "Ishar", "Krizzix", "Lumburr", "Mina", "Omega", "Ormarr", "Rouie", 
      "Thane", "Zip"
    ],
  };

  // Default hero data - will be used if no data is stored or API fetch fails
  const DEFAULT_HERO_DATA = {
    Assassin: ["Airi", "Butterfly", "Keera", "Murad", "Nakroth", "Quillen", "Wukong", "Zuka"],
    Fighter: ["Allain", "Arthur", "Astrid", "Florentino", "Lu Bu", "Omen", "Qi", "Riktor", "Valhein", "Yena"],
    Mage: ["Azzen'Ka", "Dirak", "Ignis", "Ilumia", "Kahlii", "Krixi", "Lauriel", "Liliana", "Natalya", "Tulen", "Zata"],
    Carry: ["Capheny", "Elsu", "Laville", "Lindis", "Slimz", "Tel'Annas", "Thorne", "Violet", "Wisp", "Yorn"],
    Support: ["Alice", "Annette", "Chaugnar", "Enzo", "Ishar", "Krizzix", "Lumburr", "Rouie", "Zip"],
    Tank: ["Arum", "Baldum", "Grakk", "Moren", "Omega", "Ormarr", "Roxie", "Skud", "Thane", "Y'bneth"]
  };

  // Default match data
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
      winner: "Team Flash",
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
    },
    // Additional default matches preserved but removed here for brevity
  ];

  /**
   * Initialize data from localStorage or defaults
   * @returns {Promise} Promise that resolves when initialization is complete
   */
  async function init() {
    try {
      await loadStoredData();
      await loadHeroImages();
      processData();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing data:", error);
      return Promise.reject(error);
    }
  }

  /**
   * Load data from localStorage or use defaults
   * @returns {Promise} Promise that resolves when data is loaded
   */
  async function loadStoredData() {
    try {
      // Load hero data
      if (localStorage.getItem("rovHeroData")) {
        heroes = JSON.parse(localStorage.getItem("rovHeroData"));
      } else {
        heroes = DEFAULT_HERO_DATA;
        localStorage.setItem("rovHeroData", JSON.stringify(heroes));
      }

      // Load match data
      if (localStorage.getItem("rovMatchData")) {
        matches = JSON.parse(localStorage.getItem("rovMatchData"));
      } else {
        matches = DEFAULT_MATCH_DATA;
        localStorage.setItem("rovMatchData", JSON.stringify(matches));
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Error loading stored data:", error);
      // Fallback to defaults
      heroes = DEFAULT_HERO_DATA;
      matches = DEFAULT_MATCH_DATA;
      
      // Save defaults to localStorage
      localStorage.setItem("rovHeroData", JSON.stringify(heroes));
      localStorage.setItem("rovMatchData", JSON.stringify(matches));
      
      return Promise.resolve();
    }
  }

  /**
   * Load hero images from localStorage or generate placeholders
   * @returns {Promise} Promise that resolves when images are loaded
   */
  async function loadHeroImages() {
    try {
      // Try to load hero images from localStorage
      const savedImages = localStorage.getItem("rovHeroImages");
      const savedHeroImages = savedImages ? JSON.parse(savedImages) : {};
      
      // Create hero images map
      heroImages = {};
      
      // Get all hero names
      const allHeroNames = Object.values(heroes).flat();
      
      // For each hero, use saved image or placeholder
      allHeroNames.forEach(hero => {
        if (savedHeroImages[hero]) {
          heroImages[hero] = savedHeroImages[hero];
        } else {
          heroImages[hero] = `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`;
        }
      });
      
      return Promise.resolve(heroImages);
    } catch (error) {
      console.error("Error loading hero images:", error);
      
      // Create placeholder images as fallback
      const allHeroNames = Object.values(heroes).flat();
      heroImages = {};
      
      allHeroNames.forEach(hero => {
        heroImages[hero] = `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`;
      });
      
      return Promise.resolve(heroImages);
    }
  }

  /**
   * Process match data to calculate statistics
   */
  function processData() {
    // Reset stats
    heroStats = {};
    heroWinRates = {};
    positionRecommendations = {
      Slayer: [],
      Farm: [],
      Mid: [],
      Abyssal: [],
      Support: [],
    };

    // Get all unique hero names
    const allHeroes = [...new Set(Object.values(heroes).flat())];
    
    // Initialize hero stats
    allHeroes.forEach(hero => {
      heroStats[hero] = {
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        banRate: 0,
        pickRate: 0,
        positions: {},
      };
    });

    const totalGames = matches.length;
    if (totalGames === 0) return;

    // Process each match
    matches.forEach(match => {
      const winningTeam = match.winner === match.team1 ? 1 : 2;

      // Process team 1 picks
      (match.picks1 || []).forEach(hero => {
        if (!heroStats[hero]) return;

        heroStats[hero].totalGames++;
        if (winningTeam === 1) {
          heroStats[hero].wins++;
        } else {
          heroStats[hero].losses++;
        }

        // Determine position based on roles
        determinePosition(hero);
      });

      // Process team 2 picks
      (match.picks2 || []).forEach(hero => {
        if (!heroStats[hero]) return;

        heroStats[hero].totalGames++;
        if (winningTeam === 2) {
          heroStats[hero].wins++;
        } else {
          heroStats[hero].losses++;
        }

        // Determine position based on roles
        determinePosition(hero);
      });

      // Process bans
      [...(match.bans1 || []), ...(match.bans2 || [])].forEach(hero => {
        if (!heroStats[hero]) return;
        heroStats[hero].banRate++;
      });
    });

    // Calculate rates
    allHeroes.forEach(hero => {
      const stats = heroStats[hero];
      if (stats.totalGames > 0) {
        stats.winRate = (stats.wins / stats.totalGames) * 100;
      }
      stats.pickRate = (stats.totalGames / totalGames) * 100;
      stats.banRate = (stats.banRate / totalGames) * 100;

      heroWinRates[hero] = stats.winRate;
    });

    // Generate position recommendations
    generatePositionRecommendations();
  }

  /**
   * Determine hero position based on HERO_POSITIONS mapping
   * @param {string} hero - Hero name
   */
  function determinePosition(hero) {
    // Find possible positions for this hero
    const possiblePositions = Object.keys(HERO_POSITIONS)
      .filter(pos => HERO_POSITIONS[pos].includes(hero));

    // If hero is not in our position database, skip
    if (possiblePositions.length === 0) return;

    // Update the hero's position stats
    possiblePositions.forEach(position => {
      if (!heroStats[hero].positions[position]) {
        heroStats[hero].positions[position] = 0;
      }
      heroStats[hero].positions[position]++;
    });
  }

  /**
   * Generate position recommendations based on win rates
   */
  function generatePositionRecommendations() {
    // For each position, find heroes that can play it and sort by win rate
    Object.keys(HERO_POSITIONS).forEach(position => {
      const heroesForPosition = HERO_POSITIONS[position];

      // Filter heroes with game data and sort by win rate
      const sortedHeroes = heroesForPosition
        .filter(hero => heroStats[hero] && heroStats[hero].totalGames > 0)
        .sort((a, b) => heroStats[b].winRate - heroStats[a].winRate);

      // Store top 5 heroes for this position
      positionRecommendations[position] = sortedHeroes
        .slice(0, 5)
        .map(hero => ({
          name: hero,
          winRate: heroStats[hero].winRate.toFixed(1),
          image: heroImages[hero] || `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`
        }));
    });
  }

  /**
   * Calculate win rate between two hero compositions
   * @param {Array} team1Picks - Array of team 1 hero names
   * @param {Array} team2Picks - Array of team 2 hero names
   * @returns {number} - Win rate percentage for team 1
   */
  function getWinRateForComposition(team1Picks, team2Picks) {
    // Handle empty arrays
    if (!team1Picks.length && !team2Picks.length) return 50;
    
    let team1Score = 0;
    let team2Score = 0;

    // Calculate team 1 score
    team1Picks.forEach(hero => {
      if (heroWinRates[hero]) {
        team1Score += heroWinRates[hero];
      }
    });

    // Calculate team 2 score
    team2Picks.forEach(hero => {
      if (heroWinRates[hero]) {
        team2Score += heroWinRates[hero];
      }
    });

    // Normalize scores
    team1Score = team1Score / (team1Picks.length || 1);
    team2Score = team2Score / (team2Picks.length || 1);

    // Calculate win probability for team 1
    const totalScore = team1Score + team2Score;
    const winRate = totalScore > 0 ? (team1Score / totalScore) * 100 : 50;

    return Math.min(Math.max(winRate, 0), 100);
  }

  /**
   * Calculate matchup statistics between two heroes
   * @param {string} hero1 - First hero name
   * @param {string} hero2 - Second hero name
   * @returns {number} - Win rate percentage for hero1 against hero2
   */
  function calculateHeroMatchup(hero1, hero2) {
    // Filter matches containing both heroes
    const matchups = matches.filter(match => 
      (match.picks1.includes(hero1) && match.picks2.includes(hero2)) ||
      (match.picks1.includes(hero2) && match.picks2.includes(hero1))
    );

    if (matchups.length === 0) return 50; // Default to 50% if no data

    // Count hero1 wins against hero2
    const heroWins = matchups.filter(match => 
      (match.picks1.includes(hero1) && match.winner === match.team1) ||
      (match.picks2.includes(hero1) && match.winner === match.team2)
    ).length;

    return (heroWins / matchups.length) * 100;
  }

  /**
   * Get recommended heroes against specific opponents
   * @param {Array} opponentHeroes - Array of opponent hero names
   * @param {string} position - Position to get recommendations for
   * @returns {Array} - Array of recommended heroes with matchup scores
   */
  function getRecommendedHeroesAgainstOpponent(opponentHeroes, position) {
    // If no opponent heroes, return standard recommendations
    if (!opponentHeroes || !opponentHeroes.length) {
      return getRecommendationsForPosition(position);
    }
    
    // Get heroes for the specified position
    const heroesInPosition = HERO_POSITIONS[position] || [];
    
    // Calculate performance scores against the opponents
    const heroPerformances = heroesInPosition.map(hero => {
      // Calculate average matchup score against all opponents
      const matchupScores = opponentHeroes.map(oppHero => 
        calculateHeroMatchup(hero, oppHero)
      );
      
      const averageMatchupScore = matchupScores.length > 0 
        ? matchupScores.reduce((a, b) => a + b, 0) / matchupScores.length 
        : 50;
      
      return {
        name: hero,
        matchupScore: averageMatchupScore,
        image: heroImages[hero] || `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`,
        winRate: (heroStats[hero]?.winRate || 0).toFixed(1)
      };
    });
    
    // Sort by matchup score (highest first) and return top 5
    return heroPerformances
      .sort((a, b) => b.matchupScore - a.matchupScore)
      .slice(0, 5);
  }

  /**
   * Get heroes filtered by role
   * @param {string|null} role - Role to filter by, or null for all heroes
   * @returns {Array} - Array of hero objects
   */
  function getHeroesByRole(role = null) {
    // If role specified and exists, return heroes of that role
    if (role && role !== "all" && heroes[role]) {
      return heroes[role].map(hero => ({
        name: hero,
        image: heroImages[hero] || `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`,
        classes: [role]
      }));
    }

    // Return all heroes with their classes
    const allHeroes = [];
    const processedNames = new Set();
    
    Object.entries(heroes).forEach(([heroClass, heroList]) => {
      heroList.forEach(hero => {
        // Check if we've already processed this hero
        if (!processedNames.has(hero)) {
          processedNames.add(hero);
          
          // Find all classes this hero belongs to
          const heroClasses = [];
          Object.entries(heroes).forEach(([cls, list]) => {
            if (list.includes(hero)) {
              heroClasses.push(cls);
            }
          });
          
          // Add hero to result list
          allHeroes.push({
            name: hero,
            image: heroImages[hero] || `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`,
            classes: heroClasses
          });
        }
      });
    });
    
    // Sort alphabetically by name
    return allHeroes.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get hero details by name
   * @param {string} name - Hero name
   * @returns {Object|null} - Hero object or null if not found
   */
  function getHeroByName(name) {
    const allHeroes = getHeroesByRole();
    return allHeroes.find(hero => hero.name === name) || null;
  }

  /**
   * Get recommendations for a specific position
   * @param {string} position - Position to get recommendations for
   * @returns {Array} - Array of recommended heroes
   */
  function getRecommendationsForPosition(position) {
    return positionRecommendations[position] || [];
  }

  /**
   * Reset all data to defaults
   */
  function resetData() {
    heroes = DEFAULT_HERO_DATA;
    matches = DEFAULT_MATCH_DATA;

    // Save to localStorage
    localStorage.setItem("rovHeroData", JSON.stringify(heroes));
    localStorage.setItem("rovMatchData", JSON.stringify(matches));

    // Reprocess data
    processData();
  }

  /**
   * Add new match to database
   * @param {Object} match - Match data object
   * @returns {boolean} - Success status
   */
  function addMatch(match) {
    try {
      // Validate match object
      if (!match.team1 || !match.team2 || !match.winner) {
        console.error("Invalid match data");
        return false;
      }
      
      // Add match to database
      matches.push(match);
      
      // Save to localStorage
      localStorage.setItem("rovMatchData", JSON.stringify(matches));
      
      // Reprocess data
      processData();
      
      return true;
    } catch (error) {
      console.error("Error adding match:", error);
      return false;
    }
  }

  /**
   * Delete match from database
   * @param {number} index - Index of match to delete
   * @returns {boolean} - Success status
   */
  function deleteMatch(index) {
    try {
      // Validate index
      if (index < 0 || index >= matches.length) {
        console.error("Invalid match index");
        return false;
      }
      
      // Remove match
      matches.splice(index, 1);
      
      // Save to localStorage
      localStorage.setItem("rovMatchData", JSON.stringify(matches));
      
      // Reprocess data
      processData();
      
      return true;
    } catch (error) {
      console.error("Error deleting match:", error);
      return false;
    }
  }

  // Public API
  return {
    init,
    getHeroesByRole,
    getHeroByName,
    getRecommendationsForPosition,
    getWinRateForComposition,
    getRecommendedHeroesAgainstOpponent,
    resetData,
    addMatch,
    deleteMatch
  };
})();