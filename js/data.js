/**
 * data.js - Handles data loading, parsing, and storage
 */

const DataManager = (() => {
    // Default hero data structure
    const DEFAULT_HERO_DATA = {
        Assassin: ['Airi', 'Butterfly', 'Keera', 'Murad', 'Nakroth', 'Quillen', 'Wukong', 'Zuka'],
        Fighter: ['Allain', 'Arthur', 'Astrid', 'Florentino', 'Lu Bu', 'Omen', 'Qi', 'Riktor', 'Valhein', 'Yena'],
        Mage: ['Azzen\'Ka', 'Dirak', 'Ignis', 'Ilumia', 'Kahlii', 'Krixi', 'Lauriel', 'Liliana', 'Natalya', 'Tulen', 'Zata'],
        Carry: ['Capheny', 'Elsu', 'Laville', 'Lindis', 'Slimz', 'Tel\'Annas', 'Thorne', 'Violet', 'Wisp', 'Yorn'],
        Support: ['Alice', 'Annette', 'Chaugnar', 'Enzo', 'Ishar', 'Krizzix', 'Lumburr', 'Rouie', 'Zip'],
        Tank: ['Arum', 'Baldum', 'Grakk', 'Moren', 'Omega', 'Ormarr', 'Roxie', 'Skud', 'Thane', 'Y\'bneth']
    };

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
            winner: "Team Flash"
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
            winner: "Buriram United Esports"
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
            winner: "King of Gamers Club"
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
            winner: "Team Flash"
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
            winner: "Team Flash"
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
            winner: "Team Flash"
        }
    ];
    
    // Hero position assignments (simplified for this example)
    const HERO_POSITIONS = {
        Slayer: [
            "Airi", "Allain", "Arthur", "Astrid", "Butterfly", "Florentino", "Lu Bu", 
            "Murad", "Nakroth", "Omen", "Qi", "Quillen", "Riktor", "Wukong", "Yena", "Zuka"
        ],
        Farm: [
            "Capheny", "Elsu", "Laville", "Lindis", "Slimz", "Tel'Annas", "Thorne", 
            "Valhein", "Violet", "Wisp", "Yorn"
        ],
        Mid: [
            "Azzen'Ka", "Dirak", "Ignis", "Ilumia", "Kahlii", "Krixi", "Lauriel", 
            "Liliana", "Natalya", "Tulen", "Zata"
        ],
        Abyssal: [
            "Keera", "Roxie", "Skud", "Y'bneth", "Zephys", "Zill", "Zuka"
        ],
        Support: [
            "Alice", "Annette", "Arum", "Baldum", "Chaugnar", "Enzo", "Grakk", 
            "Ishar", "Krizzix", "Lumburr", "Mina", "Omega", "Ormarr", "Rouie", 
            "Thane", "Zip"
        ]
    };

    // Hero images map (for illustration)
    const HERO_IMAGES = {};
    
    // Generate placeholder image URLs for all heroes
    Object.values(DEFAULT_HERO_DATA).flat().forEach(hero => {
        // Placeholder for hero images
        HERO_IMAGES[hero] = `https://via.placeholder.com/80?text=${encodeURIComponent(hero)}`;
    });

    // Internal properties
    let heroes = {};
    let matches = [];
    let heroStats = {};
    let heroWinRates = {};
    let positionRecommendations = {};

    // Initialize data
    function init() {
        return new Promise((resolve, reject) => {
            try {
                // Try to load from localStorage first
                if (localStorage.getItem('rovHeroData') && localStorage.getItem('rovMatchData')) {
                    heroes = JSON.parse(localStorage.getItem('rovHeroData'));
                    matches = JSON.parse(localStorage.getItem('rovMatchData'));
                } else {
                    // If not available, use default data
                    heroes = DEFAULT_HERO_DATA;
                    matches = DEFAULT_MATCH_DATA;
                    
                    // Save to localStorage
                    localStorage.setItem('rovHeroData', JSON.stringify(heroes));
                    localStorage.setItem('rovMatchData', JSON.stringify(matches));
                }
                
                // Process the data
                processData();
                
                resolve();
            } catch (error) {
                console.error('Error initializing data:', error);
                reject(error);
            }
        });
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
            Support: []
        };
        
        // Initialize hero stats
        const allHeroes = Object.values(heroes).flat();
        allHeroes.forEach(hero => {
            heroStats[hero] = {
                totalGames: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                banRate: 0,
                pickRate: 0,
                positions: {}
            };
        });
        
        // Calculate total games
        const totalGames = matches.length;
        
        // Process each match
        matches.forEach(match => {
            const winningTeam = match.winner === match.team1 ? 1 : 2;
            
            // Process picks
            match.picks1.forEach(hero => {
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
            
            match.picks2.forEach(hero => {
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

    // Determine hero position based on pick order and role
    function determinePosition(hero, picks) {
        // Find potential positions for this hero
        const possiblePositions = Object.keys(HERO_POSITIONS).filter(pos => 
            HERO_POSITIONS[pos].includes(hero)
        );
        
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

    // Generate position recommendations based on win rates
    function generatePositionRecommendations() {
        // For each position, find heroes that can play it
        Object.keys(HERO_POSITIONS).forEach(position => {
            const heroesForPosition = HERO_POSITIONS[position];
            
            // Sort heroes by win rate
            const sortedHeroes = heroesForPosition
                .filter(hero => heroStats[hero] && heroStats[hero].totalGames > 0)
                .sort((a, b) => heroStats[b].winRate - heroStats[a].winRate);
            
            // Store top 5 heroes for this position
            positionRecommendations[position] = sortedHeroes.slice(0, 5).map(hero => ({
                name: hero,
                winRate: heroStats[hero].winRate.toFixed(1),
                image: HERO_IMAGES[hero]
            }));
        });
    }

    // Get heroes by role
    function getHeroesByRole(role = null) {
        if (role && role !== 'all' && heroes[role]) {
            return heroes[role].map(hero => ({
                name: hero,
                image: HERO_IMAGES[hero],
                roles: [role]
            }));
        }
        
        // Return all heroes if no role specified
        return Object.entries(heroes).reduce((allHeroes, [role, heroList]) => {
            heroList.forEach(hero => {
                // Check if hero already exists in the list
                const existingHero = allHeroes.find(h => h.name === hero);
                if (existingHero) {
                    existingHero.roles.push(role);
                } else {
                    allHeroes.push({
                        name: hero,
                        image: HERO_IMAGES[hero],
                        roles: [role]
                    });
                }
            });
            return allHeroes;
        }, []);
    }

    // Get hero data by name
    function getHeroByName(name) {
        const allHeroes = getHeroesByRole();
        return allHeroes.find(hero => hero.name === name);
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

    // Reset all data to default
    function resetData() {
        heroes = DEFAULT_HERO_DATA;
        matches = DEFAULT_MATCH_DATA;
        
        // Save to localStorage
        localStorage.setItem('rovHeroData', JSON.stringify(heroes));
        localStorage.setItem('rovMatchData', JSON.stringify(matches));
        
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
        resetData
    };
})();