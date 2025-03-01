/**
 * data.js - Handles data loading, parsing, and storage
 */

const DataManager = (() => {
  // Default hero data structure (จะถูกแทนที่ด้วยข้อมูลจริงจาก API)
  const DEFAULT_HERO_DATA = {
    Assassin: [
      "Airi",
      "Butterfly",
      "Keera",
      "Murad",
      "Nakroth",
      "Quillen",
      "Wukong",
      "Zuka",
    ],
    Fighter: [
      "Allain",
      "Arthur",
      "Astrid",
      "Florentino",
      "Lu Bu",
      "Omen",
      "Qi",
      "Riktor",
      "Valhein",
      "Yena",
    ],
    Mage: [
      "Azzen'Ka",
      "Dirak",
      "Ignis",
      "Ilumia",
      "Kahlii",
      "Krixi",
      "Lauriel",
      "Liliana",
      "Natalya",
      "Tulen",
      "Zata",
    ],
    Carry: [
      "Capheny",
      "Elsu",
      "Laville",
      "Lindis",
      "Slimz",
      "Tel'Annas",
      "Thorne",
      "Violet",
      "Wisp",
      "Yorn",
    ],
    Support: [
      "Alice",
      "Annette",
      "Chaugnar",
      "Enzo",
      "Ishar",
      "Krizzix",
      "Lumburr",
      "Rouie",
      "Zip",
    ],
    Tank: [
      "Arum",
      "Baldum",
      "Grakk",
      "Moren",
      "Omega",
      "Ormarr",
      "Roxie",
      "Skud",
      "Thane",
      "Y'bneth",
    ],
  };

  // ฟังก์ชันสำหรับดึงข้อมูลฮีโร่จาก API
  async function fetchHeroesFromAPI(url) {
    try {
      // ในสภาพแวดล้อมจริงควรใช้ fetch API ดึงข้อมูลจาก URL
      // แต่เนื่องจากข้อจำกัดของ GitHub Pages อาจจะต้องใช้ข้อมูลจำลอง

      // จำลองการใช้โค้ดจาก hero_api.txt
      const heroCategories = {};

      // สมมติว่านี่คือข้อมูลที่ได้จาก API
      const heroClasses = [
        "Assassin",
        "Fighter",
        "Mage",
        "Carry",
        "Support",
        "Tank",
      ];
      heroClasses.forEach((heroClass, index) => {
        // จากตัวอย่างในไฟล์ hero_api.txt
        const heroes = DEFAULT_HERO_DATA[heroClass] || [];
        heroCategories[heroClass] = heroes;
      });

      return heroCategories;
    } catch (error) {
      console.error("Error fetching heroes from API:", error);
      // ถ้าเกิดข้อผิดพลาด ให้ใช้ข้อมูลเริ่มต้น
      return DEFAULT_HERO_DATA;
    }
  }

  // Default match data structure
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
    },
    {
      date: "2025-02-01",
      tournament: "RoV Pro League 2025 Summer Group Stage",
      team1: "Buriram United Esports",
      team2: "Bacon Time",
      picks1: ["Qi", "Violet", "Liliana", "Zip", "Ormarr"],
      picks2: ["Omen", "Capheny", "Dirak", "Ishar", "Grakk"],
      bans1: ["Airi", "Laville"],
      bans2: ["Keera", "Florentino"],
      winner: "Buriram United Esports",
    },
    {
      date: "2025-02-05",
      tournament: "RoV Pro League 2025 Summer Group Stage",
      team1: "King of Gamers Club",
      team2: "EVOS Esports",
      picks1: ["Florentino", "Elsu", "Natalya", "Krizzix", "Y'bneth"],
      picks2: ["Riktor", "Laville", "Ilumia", "Annette", "Arum"],
      bans1: ["Airi", "Violet"],
      bans2: ["Keera", "Capheny"],
      winner: "King of Gamers Club",
    },
    {
      date: "2025-02-10",
      tournament: "RoV Pro League 2025 Summer Playoffs",
      team1: "Team Flash",
      team2: "King of Gamers Club",
      picks1: ["Yena", "Tel'Annas", "Lauriel", "Alice", "Thane"],
      picks2: ["Florentino", "Violet", "Tulen", "Krizzix", "Roxie"],
      bans1: ["Airi", "Elsu"],
      bans2: ["Keera", "Laville"],
      winner: "Team Flash",
    },
    {
      date: "2025-02-15",
      tournament: "RoV Pro League 2025 Summer Playoffs",
      team1: "Buriram United Esports",
      team2: "Team Flash",
      picks1: ["Riktor", "Capheny", "Dirak", "Zip", "Baldum"],
      picks2: ["Yena", "Tel'Annas", "Tulen", "Alice", "Thane"],
      bans1: ["Airi", "Laville"],
      bans2: ["Keera", "Florentino"],
      winner: "Team Flash",
    },
    {
      date: "2025-02-20",
      tournament: "RoV Pro League 2025 Summer Finals",
      team1: "Team Flash",
      team2: "King of Gamers Club",
      picks1: ["Allain", "Tel'Annas", "Tulen", "Alice", "Thane"],
      picks2: ["Florentino", "Violet", "Zata", "Krizzix", "Grakk"],
      bans1: ["Airi", "Elsu"],
      bans2: ["Keera", "Laville"],
      winner: "Team Flash",
    },
  ];

  // Hero position assignments (simplified for this example)
  const HERO_POSITIONS = {
    Slayer: [
      "Airi",
      "Allain",
      "Arthur",
      "Astrid",
      "Butterfly",
      "Florentino",
      "Lu Bu",
      "Murad",
      "Nakroth",
      "Omen",
      "Qi",
      "Quillen",
      "Riktor",
      "Wukong",
      "Yena",
      "Zuka",
    ],
    Farm: [
      "Capheny",
      "Elsu",
      "Laville",
      "Lindis",
      "Slimz",
      "Tel'Annas",
      "Thorne",
      "Valhein",
      "Violet",
      "Wisp",
      "Yorn",
    ],
    Mid: [
      "Azzen'Ka",
      "Dirak",
      "Ignis",
      "Ilumia",
      "Kahlii",
      "Krixi",
      "Lauriel",
      "Liliana",
      "Natalya",
      "Tulen",
      "Zata",
    ],
    Abyssal: ["Keera", "Roxie", "Skud", "Y'bneth", "Zephys", "Zill", "Zuka"],
    Support: [
      "Alice",
      "Annette",
      "Arum",
      "Baldum",
      "Chaugnar",
      "Enzo",
      "Grakk",
      "Ishar",
      "Krizzix",
      "Lumburr",
      "Mina",
      "Omega",
      "Ormarr",
      "Rouie",
      "Thane",
      "Zip",
    ],
  };

  // Hero images map
  let HERO_IMAGES = {};

  // ฟังก์ชันดึงรูปภาพฮีโร่
  // Modified fetchHeroImages function for data.js
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
      HERO_IMAGES = {};

      // Iterate through all heroes
      Object.values(heroes)
        .flat()
        .forEach((hero) => {
          // If there's a saved image for this hero, use it
          if (savedHeroImages[hero]) {
            HERO_IMAGES[hero] = savedHeroImages[hero];
            console.log(`Using saved image for ${hero}`);
          } else {
            // Otherwise use a placeholder
            HERO_IMAGES[
              hero
            ] = `https://via.placeholder.com/80?text=${encodeURIComponent(
              hero
            )}`;
            console.log(`Using placeholder image for ${hero}`);
          }
        });

      return HERO_IMAGES;
    } catch (error) {
      console.error("Error fetching hero images:", error);

      // Create placeholder images as fallback
      const placeholders = {};
      Object.values(heroes)
        .flat()
        .forEach((hero) => {
          placeholders[
            hero
          ] = `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`;
        });

      return placeholders;
    }
  }

  // Internal properties
  let heroes = {};
  let matches = [];
  let heroStats = {};
  let heroWinRates = {};
  let positionRecommendations = {};

  // Initialize data
  async function init() {
    try {
      // ตรวจสอบว่ามีข้อมูลใน localStorage ไหม
      if (
        localStorage.getItem("rovHeroData") &&
        localStorage.getItem("rovMatchData")
      ) {
        heroes = JSON.parse(localStorage.getItem("rovHeroData"));
        matches = JSON.parse(localStorage.getItem("rovMatchData"));
      } else {
        // ถ้าไม่มี ให้ดึงข้อมูลจาก API หรือใช้ข้อมูลเริ่มต้น
        try {
          // พยายามดึงจาก API ก่อน
          heroes = await fetchHeroesFromAPI(
            "https://liquipedia.net/honorofkings/Portal:Heroes"
          );
        } catch (apiError) {
          console.warn(
            "Could not fetch from API, using default data:",
            apiError
          );
          heroes = DEFAULT_HERO_DATA;
        }

        matches = DEFAULT_MATCH_DATA;

        // บันทึกลงใน localStorage
        localStorage.setItem("rovHeroData", JSON.stringify(heroes));
        localStorage.setItem("rovMatchData", JSON.stringify(matches));
      }

      // ดึงรูปภาพฮีโร่
      HERO_IMAGES = await fetchHeroImages();

      // ประมวลผลข้อมูล
      processData();

      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing data:", error);
      return Promise.reject(error);
    }
  }

  // Process match data to calculate statistics
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

        // Assign position based on pick order (simplified)
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

        // Assign position based on pick order (simplified)
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

  // Determine hero position based on pick order and role
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

  // Generate position recommendations based on win rates
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

  // เพิ่มฟังก์ชันคำนวณอัตราชนะระหว่างคู่ฮีโร่
  function calculateHeroMatchup(hero1, hero2) {
    // กรองข้อมูลแมตช์ที่มีทั้งสองฮีโร่
    const matchups = matches.filter(
      (match) =>
        (match.picks1.includes(hero1) && match.picks2.includes(hero2)) ||
        (match.picks1.includes(hero2) && match.picks2.includes(hero1))
    );

    if (matchups.length === 0) return 50; // ถ้าไม่มีข้อมูล

    // นับจำนวนครั้งที่ hero1 ชนะเมื่ออยู่กับคู่ต่อสู้ hero2
    const winCount = matchups.filter(
      (match) =>
        (match.picks1.includes(hero1) && match.winner === match.team1) ||
        (match.picks2.includes(hero1) && match.winner === match.team2)
    ).length;

    return (winCount / matchups.length) * 100;
  }

  // ฟังก์ชันแนะนำฮีโร่ที่เหมาะสมที่สุดต่อคู่ต่อสู้
  function getRecommendedHeroesAgainstOpponent(opponentHeroes, position) {
    // กรองฮีโร่ในตำแหน่งที่ต้องการ
    const heroesInPosition = HERO_POSITIONS[position];

    // คำนวณประสิทธิภาพของแต่ละฮีโร่
    const heroPerformances = heroesInPosition.map((hero) => {
      // คำนวณค่าเฉลี่ยอัตราชนะต่อฮีโร่ของคู่ต่อสู้
      const matchupScores = opponentHeroes.map((oppHero) =>
        calculateHeroMatchup(hero, oppHero)
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

    // เรียงลำดับตามคะแนนการแข่งขันและอัตราชนะ
    return heroPerformances
      .sort((a, b) => b.matchupScore - a.matchupScore)
      .slice(0, 5); // 5 อันดับแรก
  }

  // คำนวณอัตราชนะระหว่างคู่ฮีโร่จากแมตช์ที่เก็บไว้
  function calculateHeroMatchupFromMatches(hero1, hero2) {
    // กรองแมตช์ที่มีทั้งสองฮีโร่
    const matchups = matches.filter(
      (match) =>
        (match.picks1.includes(hero1) && match.picks2.includes(hero2)) ||
        (match.picks1.includes(hero2) && match.picks2.includes(hero1))
    );

    // ถ้าไม่มีข้อมูลแมตช์
    if (matchups.length === 0) return 50;

    // นับจำนวนครั้งที่ hero1 ชนะเมื่ออยู่กับคู่ต่อสู้ hero2
    const heroWins = matchups.filter((match) => {
      if (match.picks1.includes(hero1) && match.winner === match.team1)
        return true;
      if (match.picks2.includes(hero1) && match.winner === match.team2)
        return true;
      return false;
    }).length;

    // คำนวณอัตราชนะ
    return (heroWins / matchups.length) * 100;
  }

  // แนะนำฮีโร่ที่เหมาะสมที่สุดต่อคู่ต่อสู้
  function getRecommendedHeroesAgainstOpponent(opponentHeroes, position) {
    // กรองฮีโร่ในตำแหน่งที่ต้องการ
    const heroesInPosition = HERO_POSITIONS[position];

    // คำนวณประสิทธิภาพของแต่ละฮีโร่
    const heroPerformances = heroesInPosition.map((hero) => {
      // คำนวณค่าเฉลี่ยอัตราชนะต่อฮีโร่ของคู่ต่อสู้
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

    // เรียงลำดับตามคะแนนการแข่งขันและอัตราชนะ
    return heroPerformances
      .sort((a, b) => b.matchupScore - a.matchupScore)
      .slice(0, 5); // 5 อันดับแรก
  }

  // Get heroes by role
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

  // Get hero data by name
  function getHeroByName(name) {
    const allHeroes = getHeroesByRole();
    return allHeroes.find((hero) => hero.name === name);
  }

  // Get recommendation for position
  function getRecommendationsForPosition(position) {
    return positionRecommendations[position] || [];
  }

  // Get win rate for a specific team composition
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

  // Reset all data to default
  function resetData() {
    heroes = DEFAULT_HERO_DATA;
    matches = DEFAULT_MATCH_DATA;

    // Save to localStorage
    localStorage.setItem("rovHeroData", JSON.stringify(heroes));
    localStorage.setItem("rovMatchData", JSON.stringify(matches));

    // Reprocess data
    processData();
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
  };
})();
