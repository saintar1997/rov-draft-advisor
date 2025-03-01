/**
 * Hero Selection Controller
 * Initializes and manages the hero selection process
 */

// Hero Selection Controller
const HeroSelectionController = {
  // Initialize the selection controller
  init: function () {
    console.log("Initializing Hero Selection Controller...");

    // Make sure the modal exists
    const modal = document.getElementById("heroSelectionModal");
    if (!modal) {
      console.error("Hero selection modal not found");
      return;
    }

    // Update the modal with the enhanced version
    this.updateModalStructure();

    // Set up event listeners
    this.setupEventListeners();

    // Enhanced UI elements
    this.enhanceUI();

    console.log("Hero Selection Controller initialized");
  },

  // Update the modal structure with our enhanced version
  updateModalStructure: function () {
    const modal = document.getElementById("heroSelectionModal");
    if (!modal) return;

    // Replace the modal content with the updated version
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
            <h3>เลือกฮีโร่</h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <!-- Current selection information -->
            <div class="selection-info" id="selectionInfo">
                <span>กำลังเลือกฮีโร่สำหรับ: <strong id="selectionTeam">ทีม 1</strong> - <strong id="selectionType">แบน</strong> ตำแหน่งที่ <strong id="selectionSlot">1</strong></span>
            </div>
            
            <div class="search-filter">
                <div class="search-wrapper">
                    <input type="text" placeholder="ค้นหาฮีโร่..." id="heroSearch">
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">ทั้งหมด</button>
                    <button class="filter-btn" data-filter="Assassin">Assassin</button>
                    <button class="filter-btn" data-filter="Fighter">Fighter</button>
                    <button class="filter-btn" data-filter="Mage">Mage</button>
                    <button class="filter-btn" data-filter="Carry">Carry</button>
                    <button class="filter-btn" data-filter="Support">Support</button>
                    <button class="filter-btn" data-filter="Tank">Tank</button>
                </div>
            </div>
            
            <!-- Heroes grid -->
            <div class="heroes-grid">
                <!-- Heroes will be dynamically populated here -->
            </div>
            
            <!-- Empty state when no heroes found -->
            <div class="empty-state" id="emptyState">
                <i class="fas fa-search"></i>
                <p>ไม่พบฮีโร่ที่ตรงกับการค้นหา</p>
            </div>
        </div>
      </div>
    `;
  },

  // Set up event listeners for the hero selection interface
  setupEventListeners: function () {
    // Close button
    const closeBtn = document.querySelector(".hero-selection-modal .close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", this.closeModal.bind(this));
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll(
      ".hero-selection-modal .filter-btn"
    );
    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to the clicked button
        button.classList.add("active");

        // Apply the filter
        const filter = button.getAttribute("data-filter");
        this.filterHeroesByClass(filter);
      });
    });

    // Hero search input
    const searchInput = document.getElementById("heroSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filterHeroesBySearch(e.target.value);
      });
    }

    // Click outside to close
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }
  },

  // Enhance UI with additional visual elements
  enhanceUI: function () {
    // Add additional styles to the document head
    const style = document.createElement("style");
    style.textContent = `
      /* Enhanced Hero Selection Modal Styles */
      .hero-selection-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        overflow-y: auto;
        backdrop-filter: blur(5px);
        animation: modalFadeIn 0.3s ease;
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .modal-content {
        background-color: #1f2a40;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        margin: 40px auto;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(27, 174, 234, 0.2);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from { transform: translateY(-20px); }
        to { transform: translateY(0); }
      }
      
      .selection-info {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 10px 15px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        border-left: 4px solid #1baeea;
      }
      
      .selection-info strong {
        color: #fff;
      }
      
      .empty-state {
        text-align: center;
        padding: 40px 0;
        color: rgba(255, 255, 255, 0.5);
        font-style: italic;
        display: none;
      }
      
      .empty-state i {
        font-size: 2rem;
        margin-bottom: 10px;
        display: block;
      }
      
      /* Class indicator colors */
      .class-indicator-assassin { background-color: #ff5252; }
      .class-indicator-fighter { background-color: #ff9800; }
      .class-indicator-mage { background-color: #2196f3; }
      .class-indicator-carry { background-color: #9c27b0; }
      .class-indicator-support { background-color: #4caf50; }
      .class-indicator-tank { background-color: #607d8b; }
    `;

    document.head.appendChild(style);
  },

  // Open the hero selection modal
  openModal: function (team, type, slotIndex) {
    console.log("Opening Modal - Detailed:", {
      team: team,
      type: type,
      slot: slotIndex,
    });

    // Update the selection info (add more detailed logging)
    this.updateSelectionInfo(team, type, slotIndex);

    // Populate the heroes grid
    this.populateHeroesGrid();

    // Show the modal
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.style.display = "block";

      // Focus on the search input
      setTimeout(() => {
        const searchInput = document.getElementById("heroSearch");
        if (searchInput) {
          searchInput.focus();
          // Clear any previous search
          searchInput.value = "";
        }

        // Reset filter to "all"
        const filterButtons = document.querySelectorAll(
          ".hero-selection-modal .filter-btn"
        );
        filterButtons.forEach((btn) => {
          btn.classList.toggle(
            "active",
            btn.getAttribute("data-filter") === "all"
          );
        });

        // Reset the grid to show all heroes
        this.filterHeroesByClass("all");
      }, 100);
    }
  },

  updateSelectionInfo: function (team, type, slotIndex) {
    console.log("Updating selection info:", {
      team,
      type,
      slotIndex,
    });

    const selectionTeam = document.getElementById("selectionTeam");
    const selectionType = document.getElementById("selectionType");
    const selectionSlot = document.getElementById("selectionSlot");

    if (selectionTeam) selectionTeam.textContent = `ทีม ${team}`;
    if (selectionType)
      selectionType.textContent = type === "ban" ? "แบน" : "เลือก";
    if (selectionSlot) selectionSlot.textContent = slotIndex + 1; // Display 1-based index

    // Detailed debug logging
    console.log("Modal Elements:", {
      teamElement: selectionTeam ? selectionTeam.textContent : "Not Found",
      typeElement: selectionType ? selectionType.textContent : "Not Found",
      slotElement: selectionSlot ? selectionSlot.textContent : "Not Found",
    });

    // Save the current selection state
    this.currentSelection = {
      team,
      type,
      slot: slotIndex,
    };

    console.log("Current selection saved:", this.currentSelection);
  },

  selectHero: function (heroName) {
    console.log("Select Hero Called:", {
      heroName,
      currentSelection: this.currentSelection,
    });

    if (!this.currentSelection) {
      console.error("No active selection");
      return false;
    }

    // Destructure the current selection
    const { team, type, slot } = this.currentSelection;

    console.log("Hero Selection Details:", {
      team,
      type,
      slot,
      heroName,
    });

    let success = false;

    try {
      if (type === "ban") {
        success = AnalyticsManager.addBan(team, heroName, slot);
      } else {
        success = AnalyticsManager.addPick(team, heroName, slot);
      }

      if (success) {
        console.log("Hero successfully added");
        this.closeModal();

        if (
          typeof UIManager !== "undefined" &&
          typeof UIManager.render === "function"
        ) {
          UIManager.render();
        }
      } else {
        console.warn("Failed to add hero");
        alert("ไม่สามารถเลือกฮีโร่นี้ได้ อาจเพราะถูกเลือกหรือแบนไปแล้ว");
      }

      return success;
    } catch (error) {
      console.error("Error selecting hero:", error);
      alert("เกิดข้อผิดพลาดในการเลือกฮีโร่");
      return false;
    }
  },

  // Close the hero selection modal
  closeModal: function () {
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.style.display = "none";
    }
  },

  // Populate the heroes grid with available heroes
  populateHeroesGrid: function () {
    try {
      console.log("Starting hero grid population...");

      // Get the hero grid element
      const heroesGrid = document.querySelector(".heroes-grid");
      if (!heroesGrid) {
        console.error("Hero grid element not found");
        return;
      }

      // Clear the grid
      heroesGrid.innerHTML = "";

      // Helper function to get current draft
      const getCurrentDraft = () => {
        if (
          typeof AnalyticsManager !== "undefined" &&
          typeof AnalyticsManager.getCurrentDraft === "function"
        ) {
          return AnalyticsManager.getCurrentDraft();
        }

        // Default empty draft state
        return {
          team1: {
            bans: [],
            picks: [],
          },
          team2: {
            bans: [],
            picks: [],
          },
        };
      };

      // Get heroes - first try DataManager
      let heroes = [];
      if (
        typeof DataManager !== "undefined" &&
        typeof DataManager.getHeroesByRole === "function"
      ) {
        console.log("Getting heroes from DataManager");
        heroes = DataManager.getHeroesByRole("all"); // Ensure getting ALL heroes
      }
      // Fallback to HeroManager if available
      else if (typeof HeroManager !== "undefined" && HeroManager.allHeroes) {
        console.log("Getting heroes from HeroManager");
        heroes = HeroManager.allHeroes;
      }
      // Fallback to default heroes if needed
      else {
        console.warn("No hero source available, using defaults");
        heroes = [
          { name: "Airi", image: "default-image-url", classes: ["Assassin"] },
          {
            name: "Butterfly",
            image: "default-image-url",
            classes: ["Assassin"],
          },
          // Add more default heroes
        ];
      }

      console.log(`Retrieved ${heroes.length} heroes`);

      // Get current draft state to filter heroes
      const currentDraft = getCurrentDraft();

      // Filter out heroes that are already picked or banned
      const availableHeroes = heroes.filter((hero) => {
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

      console.log(
        `After filtering, ${availableHeroes.length} heroes are available`
      );

      // Add heroes to the grid
      availableHeroes.forEach((hero) => {
        const heroCard = document.createElement("div");
        heroCard.className = "hero-card";
        heroCard.dataset.hero = hero.name;

        const heroImage = document.createElement("img");
        heroImage.src =
          hero.image ||
          `https://via.placeholder.com/80?text=${encodeURIComponent(
            hero.name
          )}`;
        heroImage.alt = hero.name;

        const heroName = document.createElement("div");
        heroName.className = "hero-name";
        heroName.textContent = hero.name;

        // Add class indicators
        const classIndicators = document.createElement("div");
        classIndicators.className = "class-indicators";

        hero.classes.forEach((heroClass) => {
          const indicator = document.createElement("span");
          indicator.className = `class-indicator class-indicator-${heroClass.toLowerCase()}`;
          indicator.title = heroClass;
          classIndicators.appendChild(indicator);
        });

        heroCard.appendChild(heroImage);
        heroCard.appendChild(classIndicators);
        heroCard.appendChild(heroName);

        // Add click handler
        heroCard.addEventListener("click", () => {
          console.log(`Hero selected: ${hero.name}`);
          this.selectHero(hero.name);
        });

        heroesGrid.appendChild(heroCard);
      });

      // Show/hide empty state
      const emptyState = document.getElementById("emptyState");
      if (emptyState) {
        emptyState.style.display =
          availableHeroes.length === 0 ? "block" : "none";
      }

      // Trigger search/filter
      this.filterHeroesByClass("all");
    } catch (error) {
      console.error("Error populating hero grid:", error);
    }
  },

  // Filter heroes by class
  filterHeroesByClass: function (classFilter) {
    try {
      console.log("Filtering heroes by class:", classFilter);

      // Find all hero cards and filter buttons
      const heroCards = document.querySelectorAll(
        ".hero-selection-modal .hero-card"
      );
      const filterButtons = document.querySelectorAll(
        ".hero-selection-modal .filter-btn"
      );

      console.log("Hero Cards:", heroCards.length);
      console.log("Filter Buttons:", filterButtons.length);

      // Validate inputs
      if (!heroCards.length || !filterButtons.length) {
        console.warn("No hero cards or filter buttons found");
        return;
      }

      // Find the active filter button if not specified
      if (!classFilter) {
        const activeButton = Array.from(filterButtons).find(
          (btn) => btn && btn.classList.contains("active")
        );
        classFilter = activeButton
          ? activeButton.getAttribute("data-filter") || "all"
          : "all";
      }

      console.log("Active Class Filter:", classFilter);

      // Get search input
      const searchInput = document.getElementById("heroSearch");
      const searchFilter = searchInput ? searchInput.value.toLowerCase() : "";

      let visibleCount = 0;

      heroCards.forEach((card) => {
        // Safely get hero name and classes
        const heroNameElement = card.querySelector(".hero-name");
        const classIndicators = card.querySelectorAll(".class-indicator");

        if (!heroNameElement) {
          console.warn("Hero name element not found for card:", card);
          card.style.display = "none";
          return;
        }

        const heroName = heroNameElement.textContent.toLowerCase();

        // Extract hero classes safely
        const heroClasses = Array.from(classIndicators)
          .map((indicator) =>
            indicator.className
              .replace("class-indicator", "")
              .replace("class-indicator-", "")
              .trim()
          )
          .filter((cls) => cls);

        console.log("Hero Classes:", heroClasses);

        // Check class and search filters
        const matchesClass =
          classFilter === "all" ||
          heroClasses.some(
            (cls) => cls.toLowerCase() === classFilter.toLowerCase()
          );
        const matchesSearch = !searchFilter || heroName.includes(searchFilter);

        // Apply visibility
        const shouldDisplay = matchesClass && matchesSearch;
        card.style.display = shouldDisplay ? "block" : "none";

        if (shouldDisplay) {
          visibleCount++;
        }
      });

      // Handle empty state
      const emptyState = document.getElementById("emptyState");
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? "block" : "none";
      }
    } catch (error) {
      console.error("Error filtering heroes:", error);
    }
  },
};

// Helper function to get current draft state
function getCurrentDraft() {
  if (
    typeof AnalyticsManager !== "undefined" &&
    typeof AnalyticsManager.getCurrentDraft === "function"
  ) {
    return AnalyticsManager.getCurrentDraft();
  }

  // Default empty draft state
  return {
    team1: {
      bans: [],
      picks: [],
    },
    team2: {
      bans: [],
      picks: [],
    },
  };
}

// Helper function to get default heroes if needed
function getDefaultHeroes() {
  const DEFAULT_HEROES = {
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

  const heroes = [];

  // Process heroes from class-based object to flat array
  Object.entries(DEFAULT_HEROES).forEach(([className, heroList]) => {
    heroList.forEach((heroName) => {
      // Check if hero already exists
      const existingHero = heroes.find((h) => h.name === heroName);

      if (existingHero) {
        existingHero.roles.push(className);
      } else {
        heroes.push({
          name: heroName,
          roles: [className],
          image: `https://via.placeholder.com/80?text=${encodeURIComponent(
            heroName
          )}`,
        });
      }
    });
  });

  return heroes;
}

// Initialize HeroSelectionController when the page loads
document.addEventListener("DOMContentLoaded", function () {
  HeroSelectionController.init();

  // Override UIManager's openHeroSelection method to use our enhanced version
  if (typeof UIManager !== "undefined") {
    UIManager.openHeroSelection = function (type, teamId, slotIndex) {
      HeroSelectionController.openModal(teamId, type, slotIndex);
    };
  }
});
