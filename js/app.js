/**
 * app.js - Main application entry point with enhanced initialization and error handling
 * Fixed to handle component loading order and availability
 */

// Application namespace
const RoVDraftHelper = {
  // Configuration
  config: {
    defaultFormat: "ranking",
    components: [
      { name: "DataManager", required: true },
      { name: "AnalyticsManager", required: true },
      { name: "UIManager", required: true },
      { name: "HeroManager", required: false },
      { name: "HeroSelectionController", required: false },
    ],
  },

  // Initialization state
  initialized: false,

  /**
   * Initialize the application
   * @returns {Promise} Promise that resolves when initialization is complete
   */
  async init() {
    console.log("Initializing RoV Draft Helper...");

    try {
      // Show loading overlay
      this.showLoadingOverlay();

      // Check if it's the first time running the app
      const isFirstRun = !localStorage.getItem("rovHeroData");
      console.log("Is first run?", isFirstRun);

      // If first run, initialize default data
      if (isFirstRun) {
        await this.initializeDefaultData();
      }

      // Check if all required components are available before proceeding
      this.validateComponents();

      // Initialize components in sequence
      await this.initializeComponents();

      // Hide loading overlay
      this.hideLoadingOverlay();

      // Set initialization flag
      this.initialized = true;

      console.log("RoV Draft Helper initialized successfully!");
      return true;
    } catch (error) {
      console.error("Critical Error initializing application:", error);
      this.hideLoadingOverlay();
      this.showErrorMessage(
        "เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน กรุณาลองใหม่อีกครั้ง"
      );

      // Try to fall back to basic functionality
      this.attemptFallbackMode();

      return false;
    }
  },

  /**
   * Validate that required components exist before attempting initialization
   */
  validateComponents() {
    const missingComponents = [];

    this.config.components.forEach((component) => {
      if (
        component.required &&
        (typeof window[component.name] === "undefined" ||
          typeof window[component.name].init !== "function")
      ) {
        missingComponents.push(component.name);
      }
    });

    if (missingComponents.length > 0) {
      console.error(
        `Missing required components: ${missingComponents.join(", ")}`
      );

      // Check the script loading order in the HTML
      console.warn(
        "Please check that all required JavaScript files are loaded properly before app.js:"
      );
      console.warn("1. Make sure data.js is loaded before app.js");
      console.warn("2. Make sure analytics.js is loaded before app.js");
      console.warn("3. Make sure ui.js is loaded before app.js");

      throw new Error(
        `Missing required components: ${missingComponents.join(", ")}`
      );
    }
  },

  /**
   * Initialize default data for first-time users
   */
  async initializeDefaultData() {
    console.log("First run - setting default settings");

    // Set default format
    localStorage.setItem("rovDefaultFormat", this.config.defaultFormat);

    // Default hero data
    if (!localStorage.getItem("rovHeroData")) {
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

      localStorage.setItem("rovHeroData", JSON.stringify(DEFAULT_HERO_DATA));
      console.log("Initialized default hero data");

      // Create empty hero images object
      localStorage.setItem("rovHeroImages", JSON.stringify({}));
      console.log("Initialized empty hero images");
    }

    // Default match data
    if (!localStorage.getItem("rovMatchData")) {
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
      ];

      localStorage.setItem("rovMatchData", JSON.stringify(DEFAULT_MATCH_DATA));
      console.log("Initialized default match data");
    }
  },

  /**
   * Initialize all components in the correct sequence
   */
  async initializeComponents() {
    // Process components in order
    for (const component of this.config.components) {
      try {
        // Skip if component doesn't exist or is optional
        if (
          !window[component.name] ||
          typeof window[component.name].init !== "function"
        ) {
          if (component.required) {
            throw new Error(
              `Required component ${component.name} not found or missing init method`
            );
          }
          console.warn(`Optional component ${component.name} not available`);
          continue;
        }

        console.log(`Initializing ${component.name}...`);
        await window[component.name].init();
        console.log(`${component.name} initialized successfully`);
      } catch (error) {
        console.error(`Error initializing ${component.name}:`, error);
        if (component.required) {
          throw new Error(
            `Failed to initialize required component ${component.name}`
          );
        }
      }
    }
  },

  /**
   * Try to run the app in fallback mode with minimal functionality
   */
  attemptFallbackMode() {
    console.log(
      "Attempting to run in fallback mode with minimal functionality"
    );

    // Create minimal fallback implementations if needed
    if (typeof window.DataManager === "undefined") {
      this.createFallbackDataManager();
    }

    if (typeof window.AnalyticsManager === "undefined") {
      this.createFallbackAnalyticsManager();
    }

    if (typeof window.UIManager === "undefined") {
      this.createFallbackUIManager();
    }

    // Hide loading overlay
    this.hideLoadingOverlay();

    alert("แอปพลิเคชันกำลังทำงานในโหมดข้อมูลจำกัด บางฟังก์ชันอาจไม่ทำงาน");
  },

  /**
   * Create minimal fallback DataManager implementation
   */
  createFallbackDataManager() {
    window.DataManager = {
      init: function () {
        console.log("Using fallback DataManager");
        return Promise.resolve();
      },

      getHeroesByRole: function () {
        // Basic implementation
        try {
          const heroData =
            JSON.parse(localStorage.getItem("rovHeroData")) || {};
          const heroImages =
            JSON.parse(localStorage.getItem("rovHeroImages")) || {};

          const heroes = [];
          const processedNames = new Set();

          Object.entries(heroData).forEach(([className, heroList]) => {
            heroList.forEach((heroName) => {
              if (!processedNames.has(heroName)) {
                processedNames.add(heroName);

                // Find all classes for this hero
                const heroClasses = [];
                Object.entries(heroData).forEach(([cls, list]) => {
                  if (list.includes(heroName)) {
                    heroClasses.push(cls);
                  }
                });

                heroes.push({
                  name: heroName,
                  image:
                    heroImages[heroName] ||
                    `https://via.placeholder.com/80?text=${encodeURIComponent(
                      heroName
                    )}`,
                  classes: heroClasses,
                });
              }
            });
          });

          return heroes;
        } catch (error) {
          console.error("Error in fallback getHeroesByRole:", error);
          return [];
        }
      },

      getHeroByName: function (name) {
        const heroes = this.getHeroesByRole();
        return heroes.find((hero) => hero.name === name) || null;
      },

      getRecommendationsForPosition: function () {
        return []; // Empty recommendations in fallback mode
      },

      getWinRateForComposition: function () {
        return 50; // Always return 50% in fallback mode
      },
    };

    console.log("Created fallback DataManager");
  },

  /**
   * Create minimal fallback AnalyticsManager implementation
   */
  createFallbackAnalyticsManager() {
    window.AnalyticsManager = {
      currentDraft: {
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
        format: "ranking",
      },

      init: function () {
        console.log("Using fallback AnalyticsManager");
        return Promise.resolve();
      },

      getCurrentDraft: function () {
        return this.currentDraft;
      },

      setSelectedTeam: function (teamId) {
        this.currentDraft.selectedTeam = teamId;
      },

      setCurrentPosition: function (position) {
        this.currentDraft.currentPosition = position;
      },

      setFormat: function (format) {
        this.currentDraft.format = format;
      },

      addBan: function (teamId, heroName, slot) {
        this.currentDraft[`team${teamId}`].bans[slot] = heroName;
        return true;
      },

      addPick: function (teamId, heroName, slot) {
        this.currentDraft[`team${teamId}`].picks[slot] = heroName;
        return true;
      },

      getRecommendedHeroes: function () {
        return []; // Empty recommendations in fallback mode
      },

      calculateWinRate: function () {
        return 50; // Always return 50% in fallback mode
      },

      resetDraft: function () {
        this.currentDraft = {
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
          format: "ranking",
        };
      },
    };

    console.log("Created fallback AnalyticsManager");
  },

  /**
   * Create minimal fallback UIManager implementation
   */
  createFallbackUIManager() {
    window.UIManager = {
      init: function () {
        console.log("Using fallback UIManager");
        return Promise.resolve();
      },

      render: function () {
        console.log("Fallback UIManager render - no operation");
      },

      showLoading: function () {
        const loadingOverlay = document.querySelector(".loading-overlay");
        if (loadingOverlay) {
          loadingOverlay.style.display = "flex";
        }
      },

      hideLoading: function () {
        const loadingOverlay = document.querySelector(".loading-overlay");
        if (loadingOverlay) {
          loadingOverlay.style.display = "none";
        }
      },

      openHeroSelection: function () {
        alert("ฟังก์ชันการเลือกฮีโร่ไม่พร้อมใช้งานในโหมดนี้");
      },
    };

    console.log("Created fallback UIManager");
  },

  /**
   * Show loading overlay
   */
  showLoadingOverlay() {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }
  },

  /**
   * Hide loading overlay
   */
  hideLoadingOverlay() {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = "none";
    }
  },

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   */
  showErrorMessage(message) {
    alert(message);
  },
};

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  // First check if all required scripts are loaded
  // This is a better approach than just throwing an error
  const requiredScripts = ["data.js", "analytics.js", "ui.js"];
  const missingScripts = [];

  // Check if scripts are loaded by looking for their exported objects
  if (typeof DataManager === "undefined") missingScripts.push("data.js");
  if (typeof AnalyticsManager === "undefined")
    missingScripts.push("analytics.js");
  if (typeof UIManager === "undefined") missingScripts.push("ui.js");

  if (missingScripts.length > 0) {
    console.error(`Missing required scripts: ${missingScripts.join(", ")}`);
    alert(
      `แอปพลิเคชันไม่สามารถโหลดไฟล์ที่จำเป็นได้: ${missingScripts.join(
        ", "
      )}\nโปรดตรวจสอบว่าไฟล์ JavaScript ทั้งหมดถูกโหลดก่อน app.js`
    );

    // Try to load missing scripts dynamically
    missingScripts.forEach((script) => {
      const scriptElement = document.createElement("script");
      scriptElement.src = `js/${script}`;
      document.head.appendChild(scriptElement);
      console.log(`Attempting to load missing script: ${script}`);
    });

    // Give some time for scripts to load
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await RoVDraftHelper.init();

  // Set up additional event listeners once initialized
  if (RoVDraftHelper.initialized) {
    // Render the UI if the component is available
    if (window.UIManager && typeof window.UIManager.render === "function") {
      window.UIManager.render();
    }
  }
});
