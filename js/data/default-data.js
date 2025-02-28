/**
 * default-data.js
 * Contains default hero and match data for the application
 * Extracted from data.js to separate static data from logic
 */

/**
 * Default hero data structure (categorized by class)
 */
export const DEFAULT_HERO_DATA = {
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

/**
 * Default match data for sample matches
 */
export const DEFAULT_MATCH_DATA = [
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

/**
 * Hero class color mapping
 * Used for visual indicators in the UI
 */
export const HERO_CLASS_COLORS = {
  'Assassin': '#ff5252', // Red
  'Fighter': '#ff9800',  // Orange
  'Mage': '#2196f3',     // Blue
  'Carry': '#9c27b0',    // Purple
  'Support': '#4caf50',  // Green
  'Tank': '#607d8b'      // Gray
};

/**
 * Default hero position mappings
 * Maps heroes to their recommended positions
 */
export const DEFAULT_HERO_POSITIONS = {
  Slayer: [
    "Airi", "Allain", "Arthur", "Astrid", "Butterfly", "Florentino", 
    "Lu Bu", "Murad", "Nakroth", "Omen", "Qi", "Quillen", 
    "Riktor", "Wukong", "Yena", "Zuka"
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
    "Alice", "Annette", "Arum", "Baldum", "Chaugnar", "Enzo", 
    "Grakk", "Ishar", "Krizzix", "Lumburr", "Mina", "Omega", 
    "Ormarr", "Rouie", "Thane", "Zip"
  ],
};

/**
 * Draft sequence for 1-2-2-2-2-1 format
 * This defines the order in which teams pick heroes
 */
export const PICK_SEQUENCE = [
  { team: 1, count: 1 }, // Team 1 picks 1
  { team: 2, count: 2 }, // Team 2 picks 2
  { team: 1, count: 2 }, // Team 1 picks 2
  { team: 2, count: 2 }, // Team 2 picks 2
  { team: 1, count: 2 }, // Team 1 picks 2
  { team: 2, count: 1 }, // Team 2 picks 1
];

/**
 * Position preference order based on pick sequence
 * This defines which positions are typically picked in which order
 */
export const POSITION_ORDER = [
  "Slayer", // Usually first pick
  "Mid",    // High impact role
  "Farm",   // Carry role
  "Support", // Support for team
  "Abyssal", // Flexible role
];