/**
 * data-manager.js - Handles data loading, parsing, and storage
 * Manages hero data, match data, and provides data access methods
 */

import { DEFAULT_HERO_DATA, DEFAULT_MATCH_DATA, DEFAULT_HERO_POSITIONS } from './default-data.js';

const DataManager = (() => {
  // Internal properties
  let heroes = {};
  let matches = [];
  let heroStats = {};
  let heroWinRates = {};
  let positionRecommendations = {};
  let HERO_IMAGES = {};

  // Hero position assignments from default data
  const HERO_POSITIONS = DEFAULT_HERO_POSITIONS;

  /**
   * Initialize data from localStorage or use defaults
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async function init() {
    try {
      // Check if data exists in localStorage
      if (localStorage.getItem("rovHeroData") && localStorage.getItem("rovMatchData")) {
        heroes = JSON.parse(localStorage.getItem("rovHeroData"));
        matches = JSON.parse(localStorage.getItem("rovMatchData"));
      } else {
        // If not, use default data
        heroes = DEFAULT_HERO_DATA;
        matches = DEFAULT_MATCH_DATA;

        // Save to localStorage
        localStorage.setItem("rovHeroData", JSON.stringify(heroes));
        localStorage.setItem("rovMatchData", JSON.stringify(matches));
      }

      // Fetch hero images
      HERO_IMAGES = await fetchHeroImages();

      // Process data
      processData();

      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing data:", error);
      return Promise.reject(error);
    }
  }

  /**
   * Fetch hero images from localStorage or create placeholders
   * @returns {Object} A map of hero names to image URLs
   */
  async function fetchHeroImages() {
    try {
      // Check for existing hero images in localStorage first
      let savedHeroImages = {};
      try {
        const savedImages = localStorage.getItem("rovHeroImages");
        if (savedImages) {
          savedHeroImages = JSON.parse(savedImages);
          console.log(
            "Successfully loaded hero images from localStorage:",
            Object.keys(savedHeroImages).length
          );
        }
      } catch (error) {
        console.error("Error parsing hero images from localStorage:", error);
        savedHeroImages = {};
      }

      // Create HERO_IMAGES object
      const heroImages = {};

      // Iterate through all heroes
      Object.values(heroes)
        .flat()
        .forEach((hero) => {
          // If there's a saved image for this hero, use it
          if (savedHeroImages[hero]) {
            heroImages[hero] = savedHeroImages[hero];
          } else {
            // Otherwise use a placeholder
            heroImages[hero] = `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`;
          }
        });

      return heroImages;
    } catch (error) {
      console.error("Error fetching hero images:", error);

      // Create placeholder images as fallback
      const placeholders = {};
      Object.values(heroes)
        .flat()
        .forEach((hero) => {
          placeholders[hero] = `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`;
        });

      return placeholders;
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

    // Initialize hero stats
    const allHeroes = Object.values(heroes).flat();
    allHeroes.forEach((hero) => {
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

    // Calculate total games
    const totalGames = matches.length;

    // Process each match
    matches.forEach((match) => {
      const winningTeam = match.winner === match.team1 ? 1 : 2;

      // Process picks
      match.picks1.forEach((hero) => {
        if (!heroStats[hero]) return;

        heroStats[hero].totalGames++;
        if (winningTeam === 1) {
          heroStats[hero].wins++;
        } else {
          heroStats[hero].losses++;
        }

        // Assign position based on pick order
        determinePosition(hero, match.picks1);
      });

      match.picks2.forEach((hero) => {
        if (!heroStats[hero]) return;

        heroStats[hero].totalGames++;
        if (winningTeam === 2) {
          heroStats[hero].wins++;
        } else {
          heroStats[hero].losses++;
        }

        // Assign position based on pick order
        determinePosition(hero, match.picks2);
      });

      // Process bans
      [...(match.bans1 || []), ...(match.bans2 || [])].forEach((hero) => {
        if (!heroStats[hero]) return;
        heroStats[hero].banRate++;
      });
    });

    // Calculate rates
    allHeroes.forEach((hero) => {
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
   * Determine hero position based on pick order and role
   * @param {string} hero - The hero to determine position for
   * @param {Array} picks - The team's picks
   */
  function determinePosition(hero, picks) {
    // Find potential positions for this hero
    const possiblePositions = Object.keys(HERO_POSITIONS).filter((pos) =>
      HERO_POSITIONS[pos].includes(hero)
    );

    // If hero is not in our position database, skip
    if (possiblePositions.length === 0) return;

    // Update the hero's position stats
    possiblePositions.forEach((position) => {
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
    // For each position, find heroes that can play it
    Object.keys(HERO_POSITIONS).forEach((position) => {
      const heroesForPosition = HERO_POSITIONS[position];

      // Sort heroes by win rate
      const sortedHeroes = heroesForPosition
        .filter((hero) => heroStats[hero] && heroStats[hero].totalGames > 0)
        .sort((a, b) => heroStats[b].winRate - heroStats[a].winRate);

      // Store top 5 heroes for this position
      positionRecommendations[position] = sortedHeroes
        .slice(0, 5)
        .map((hero) => ({
          name: hero,
          winRate: heroStats[hero].winRate.toFixed(1),
          image: HERO_IMAGES[hero],
        }));
    });
  }

  /**
   * Calculate matchup winrate between two heroes
   * @param {string} hero1 - First hero name
   * @param {string} hero2 - Second hero name
   * @returns {number} Matchup win rate percentage
   */
  function calculateHeroMatchupFromMatches(hero1, hero2) {
    // Filter matches that have both heroes
    const matchups = matches.filter(
      (match) =>
        (match.picks1.includes(hero1) && match.picks2.includes(hero2)) ||
        (match.picks1.includes(hero2) && match.picks2.includes(hero1))
    );

    // If no matchup data
    if (matchups.length === 0) return 50;

    // Count how many times hero1 wins against hero2
    const heroWins = matchups.filter((match) => {
      if (match.picks1.includes(hero1) && match.winner === match.team1)
        return true;
      if (match.picks2.includes(hero1) && match.winner === match.team2)
        return true;
      return false;
    }).length;

    // Calculate win rate
    return (heroWins / matchups.length) * 100;
  }

  /**
   * Get recommended heroes against opponent's picks
   * @param {Array} opponentHeroes - Array of opponent hero names
   * @param {string} position - The position to get recommendations for
   * @returns {Array} Array of recommended heroes
   */
  function getRecommendedHeroesAgainstOpponent(opponentHeroes, position) {
    // Filter heroes for the desired position
    const heroesInPosition = HERO_POSITIONS[position];

    // Calculate performance for each hero
    const heroPerformances = heroesInPosition.map((hero) => {
      // Calculate average matchup score against opponent heroes
      const matchupScores = opponentHeroes.map((oppHero) =>
        calculateHeroMatchupFromMatches(hero, oppHero)
      );

      const averageMatchupScore =
        matchupScores.reduce((a, b) => a + b, 0) / matchupScores.length;

      return {
        name: hero,
        matchupScore: averageMatchupScore,
        image: HERO_IMAGES[hero],
        winRate: heroStats[hero]?.winRate || 0,
      };
    });

    // Sort by matchup score and return top 5
    return heroPerformances
      .sort((a, b) => b.matchupScore - a.matchupScore)
      .slice(0, 5);
  }

  /**
   * Get heroes by role
   * @param {string|null} role - Role to filter by, or null for all
   * @returns {Array} Array of hero objects
   */
  function getHeroesByRole(role = null) {
    if (role && role !== "all" && heroes[role]) {
      return heroes[role].map((hero) => ({
        name: hero,
        image: HERO_IMAGES[hero],
        classes: [role],
      }));
    }

    // Return all heroes if no role specified or 'all' is passed
    return Object.entries(heroes).reduce((allHeroes, [heroClass, heroList]) => {
      heroList.forEach((hero) => {
        const existingHero = allHeroes.find((h) => h.name === hero);
        if (existingHero) {
          if (!existingHero.classes.includes(heroClass)) {
            existingHero.classes.push(heroClass);
          }
        } else {
          allHeroes.push({
            name: hero,
            image: HERO_IMAGES[hero],
            classes: [heroClass],
          });
        }
      });
      return allHeroes;
    }, []);
  }

  /**
   * Get hero data by name
   * @param {string} name - Hero name to search for
   * @returns {Object|undefined} Hero object or undefined if not found
   */
  function getHeroByName(name) {
    const allHeroes = getHeroesByRole();
    return allHeroes.find((hero) => hero.name === name);
  }

  /**
   * Get recommendation for position
   * @param {string} position - Position to get recommendations for
   * @returns {Array} Array of recommended heroes
   */
  function getRecommendationsForPosition(position) {
    return positionRecommendations[position] || [];
  }

  /**
   * Get win rate for a specific team composition
   * @param {Array} team1Picks - Array of team 1 hero names
   * @param {Array} team2Picks - Array of team 2 hero names
   * @returns {number} Win rate percentage for team 1
   */
  function getWinRateForComposition(team1Picks, team2Picks) {
    // This is a simplified win rate prediction algorithm
    // In a real application, you would use machine learning or more sophisticated methods

    let team1Score = 0;
    let team2Score = 0;

    // Calculate team 1 score
    team1Picks.forEach((hero) => {
      if (heroWinRates[hero]) {
        team1Score += heroWinRates[hero];
      }
    });

    // Calculate team 2 score
    team2Picks.forEach((hero) => {
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
   * Reset all data to default
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
   * Add a custom hero
   * @param {string} name - Hero name
   * @param {string} heroClass - Hero class
   * @param {string} imageUrl - Hero image URL
   * @returns {boolean} Success indicator
   */
  function addHero(name, heroClass, imageUrl) {
    try {
      // Check if hero already exists
      const allHeroes = Object.values(heroes).flat();
      if (allHeroes.includes(name)) {
        return false;
      }

      // Add hero to class
      if (!heroes[heroClass]) {
        heroes[heroClass] = [];
      }
      heroes[heroClass].push(name);

      // Add image
      if (imageUrl) {
        let heroImages = {};
        try {
          heroImages = JSON.parse(localStorage.getItem("rovHeroImages")) || {};
        } catch (error) {
          heroImages = {};
        }
        heroImages[name] = imageUrl;
        localStorage.setItem("rovHeroImages", JSON.stringify(heroImages));
        HERO_IMAGES[name] = imageUrl;
      } else {
        HERO_IMAGES[name] = `https://via.placeholder.com/80?text=${encodeURIComponent(name)}`;
      }

      // Save to localStorage
      localStorage.setItem("rovHeroData", JSON.stringify(heroes));

      // Update stats
      heroStats[name] = {
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        banRate: 0,
        pickRate: 0,
        positions: {},
      };

      // Reprocess data
      processData();

      return true;
    } catch (error) {
      console.error("Error adding hero:", error);
      return false;
    }
  }

  /**
   * Delete a hero by name
   * @param {string} name - Hero name to delete
   * @returns {boolean} Success indicator
   */
  function deleteHero(name) {
    try {
      // Remove hero from each class
      Object.keys(heroes).forEach(heroClass => {
        heroes[heroClass] = heroes[heroClass].filter(hero => hero !== name);
        
        // Remove empty classes
        if (heroes[heroClass].length === 0) {
          delete heroes[heroClass];
        }
      });

      // Remove image
      let heroImages = {};
      try {
        heroImages = JSON.parse(localStorage.getItem("rovHeroImages")) || {};
        delete heroImages[name];
        localStorage.setItem("rovHeroImages", JSON.stringify(heroImages));
        delete HERO_IMAGES[name];
      } catch (error) {
        console.error("Error removing hero image:", error);
      }

      // Save to localStorage
      localStorage.setItem("rovHeroData", JSON.stringify(heroes));

      // Remove from stats
      delete heroStats[name];
      delete heroWinRates[name];

      // Reprocess data
      processData();

      return true;
    } catch (error) {
      console.error("Error deleting hero:", error);
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
    addHero,
    deleteHero
  };
})();

export default DataManager;