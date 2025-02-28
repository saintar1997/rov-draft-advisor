/**
 * hero-selection.js
 * Controls the hero selection modal and process
 */

import DataManager from '../data/data-manager.js';
import AnalyticsManager from '../analytics/analytics-manager.js';
import HeroManager from './hero-manager.js';

const HeroSelectionController = {
  /**
   * Current selection state
   * @type {Object|null}
   */
  currentSelection: null,

  /**
   * Initialize the selection controller
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async init() {
    console.log("Initializing Hero Selection Controller...");

    try {
      // Make sure the modal exists
      const modal = document.getElementById("heroSelectionModal");
      if (!modal) {
        console.error("Hero selection modal not found");
        return Promise.reject(new Error("Hero selection modal not found"));
      }

      // Set up event listeners
      this.setupEventListeners();

      console.log("Hero Selection Controller initialized");
      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing Hero Selection Controller:", error);
      return Promise.reject(error);
    }
  },

  /**
   * Set up event listeners for the hero selection interface
   */
  setupEventListeners() {
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
      button.addEventListener("click", () => {
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

  /**
   * Open the hero selection modal
   * @param {number} team - Team ID (1 or 2)
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} slotIndex - Slot index
   */
  openModal(team, type, slotIndex) {
    console.log("Opening Modal - Detailed:", {
      team: team,
      type: type,
      slot: slotIndex,
    });

    // Update the selection info
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

  /**
   * Update the selection information in the modal
   * @param {number} team - Team ID (1 or 2)
   * @param {string} type - Selection type ('ban' or 'pick')
   * @param {number} slotIndex - Slot index
   */
  updateSelectionInfo(team, type, slotIndex) {
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

  /**
   * Select a hero after user clicks on a hero card
   * @param {string} heroName - The name of the selected hero
   * @returns {boolean} - Whether the selection was successful
   */
  selectHero(heroName) {
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

        // Refresh UI using the provided UIManager
        if (typeof window.UIManager !== "undefined" &&
            typeof window.UIManager.render === "function") {
          window.UIManager.render();
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

  /**
   * Close the hero selection modal
   */
  closeModal() {
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      modal.style.display = "none";
    }
  },

  /**
   * Populate the heroes grid with available heroes
   */
  populateHeroesGrid() {
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

      // Get current draft state
      const currentDraft = this.getCurrentDraft();

      // Get heroes from HeroManager or DataManager
      let heroes = [];
      if (typeof HeroManager !== "undefined") {
        heroes = HeroManager.allHeroes;
      } else if (typeof DataManager !== "undefined") {
        heroes = DataManager.getHeroesByRole();
      } else {
        console.warn("No hero data source available");
        return;
      }

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

      // Trigger initial filtering
      this.filterHeroesByClass("all");
    } catch (error) {
      console.error("Error populating hero grid:", error);
    }
  },

  /**
   * Filter heroes by class
   * @param {string} classFilter - The class to filter by
   */
  filterHeroesByClass(classFilter) {
    try {
      console.log("Filtering heroes by class:", classFilter);

      // Find all hero cards and filter buttons
      const heroCards = document.querySelectorAll(
        ".hero-selection-modal .hero-card"
      );
      const filterButtons = document.querySelectorAll(
        ".hero-selection-modal .filter-btn"
      );

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
          .map((indicator) => {
            // Extract class from class name
            const classList = Array.from(indicator.classList);
            for (const cls of classList) {
              if (cls.startsWith('class-indicator-')) {
                return cls.replace('class-indicator-', '');
              }
            }
            return '';
          })
          .filter(Boolean);

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

  /**
   * Filter heroes by search text
   * @param {string} searchText - The text to search for
   */
  filterHeroesBySearch(searchText) {
    // Just reuse filterHeroesByClass which already handles search
    this.filterHeroesByClass(null);
  },

  /**
   * Get the current draft state
   * @returns {Object} The current draft state
   */
  getCurrentDraft() {
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
};

// Initialize HeroSelectionController when the page loads
document.addEventListener("DOMContentLoaded", function () {
  HeroSelectionController.init();
});

export default HeroSelectionController;