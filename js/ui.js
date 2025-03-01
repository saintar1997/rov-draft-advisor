// เพิ่ม event listener สำหรับปุ่มในตาราง
function addButtonEventListeners(tbody) {
  tbody.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      viewMatch(index);
    });
  });

  tbody.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      editMatch(index);
    });
  });

  tbody.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      deleteMatch(index);
    });
  });
}

// นำทางหน้าแมตช์
function navigateMatchesPage(direction) {
  // ในตัวอย่างนี้เรายังไม่ได้ทำระบบแบ่งหน้า
  // ฟังก์ชันนี้จะเพิ่มในเวอร์ชันถัดไป
  alert("ระบบแบ่งหน้าจะเพิ่มในเวอร์ชันถัดไป");
} // ฟังก์ชันดึงข้อมูลแมตช์จาก URL

// ฟังก์ชันนำเข้าแมตช์จากไฟล์
function importMatchesFromFile(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  // แสดงสถานะกำลังโหลด
  showLoading();

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      let newMatches = [];

      // ตรวจสอบประเภทของไฟล์
      if (file.name.endsWith(".json")) {
        // ถ้าเป็นไฟล์ JSON
        newMatches = JSON.parse(e.target.result);
      } else if (file.name.endsWith(".csv")) {
        // ถ้าเป็นไฟล์ CSV
        // ในสถานการณ์จริง ควรใช้ไลบรารีเช่น PapaParse
        alert("ยังไม่รองรับไฟล์ CSV ในตัวอย่างนี้");
        hideLoading();
        return;
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // ถ้าเป็นไฟล์ Excel
        // ในสถานการณ์จริง ควรใช้ไลบรารีเช่น SheetJS
        alert("ยังไม่รองรับไฟล์ Excel ในตัวอย่างนี้");
        hideLoading();
        return;
      } else {
        alert("ไฟล์ไม่รองรับ กรุณาใช้ไฟล์ JSON, CSV หรือ Excel");
        hideLoading();
        return;
      }

      // ตรวจสอบความถูกต้องของข้อมูล
      if (!Array.isArray(newMatches)) {
        alert("รูปแบบข้อมูลไม่ถูกต้อง ควรเป็นอาร์เรย์ของแมตช์");
        hideLoading();
        return;
      }

      // เพิ่มแมตช์ใหม่ลงใน localStorage
      let matches = [];
      try {
        matches = JSON.parse(localStorage.getItem("rovMatchData")) || [];
      } catch (error) {
        matches = [];
      }

      // รวมแมตช์ใหม่กับแมตช์เดิม
      matches = [...matches, ...newMatches];

      // บันทึกลงใน localStorage
      localStorage.setItem("rovMatchData", JSON.stringify(matches));

      // รีเฟรชหน้าแมตช์
      renderMatchesTable();

      // อัปเดตข้อมูล
      DataManager.init().then(() => {
        render();
      });

      alert(`นำเข้าแมตช์สำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
    } catch (error) {
      console.error("Error importing matches from file:", error);
      alert("เกิดข้อผิดพลาดในการนำเข้าแมตช์");
    } finally {
      hideLoading();
    }
  };

  reader.onerror = function () {
    hideLoading();
    alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
  };

  // อ่านไฟล์เป็นข้อความ
  reader.readAsText(file);
}

// ฟังก์ชันเพิ่มแมตช์ใหม่
function addNewMatch() {
  alert("ฟังก์ชันเพิ่มแมตช์ใหม่จะเพิ่มในเวอร์ชันถัดไป");
}


// เพิ่ม event listener สำหรับการกรองข้อมูลแมตช์
function setupMatchFilters() {
  const matchSearch = document.getElementById("match-search");
  const tournamentFilter = document.getElementById("tournament-filter");
  const teamFilter = document.getElementById("team-filter");

  if (matchSearch) {
    matchSearch.addEventListener("input", filterMatches);
  }

  if (tournamentFilter) {
    tournamentFilter.addEventListener("change", filterMatches);
  }

  if (teamFilter) {
    teamFilter.addEventListener("change", filterMatches);
  }
}

// เพิ่มฟังก์ชันเตรียมข้อมูลเริ่มต้น
function initializeMatchData() {
  // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
  if (!localStorage.getItem("rovMatchData")) {
    // สร้างข้อมูลตัวอย่าง
    const sampleMatches = [
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
        isImported: true,
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
        isImported: true,
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
        isImported: true,
      },
    ];

    // บันทึกลงใน localStorage
    localStorage.setItem("rovMatchData", JSON.stringify(sampleMatches));
  }
}

// เพิ่ม styles และติดตั้ง event listeners เมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing match table...");

  // ติดตั้ง event listeners สำหรับการกรองข้อมูล
  setupMatchFilters();

  // เตรียมข้อมูลเริ่มต้น (ถ้าไม่มี)
  initializeMatchData();

  // แสดงตารางแมตช์เมื่อคลิกที่ tab จัดการข้อมูลแมตช์
  const historyBtn = document.getElementById("history-btn");
  if (historyBtn) {
    historyBtn.addEventListener("click", function () {
      // ทำงานหลังจากการเปลี่ยนหน้าเสร็จสิ้น
      setTimeout(() => {
        renderMatchesTable();
      }, 100);
    });
  }

  // หากกำลังอยู่ที่หน้าจัดการข้อมูลแมตช์ ให้แสดงข้อมูลทันที
  if (document.getElementById("history-page")?.classList.contains("active")) {
    renderMatchesTable();
  }
});

/**
 * ui.js - Handles UI interactions and rendering
 */

const UIManager = (() => {
  // DOM elements
  let elements = {};

  // Hero selection state
  let selectionState = {
    targetTeam: 1,
    targetSlot: 0,
    targetType: "ban", // 'ban' or 'pick'
  };

  // Initialize UI
  async function init() {
    try {
      // Cache DOM elements
      cacheElements();

      // Set up event listeners
      setupEventListeners();

      // โหลดการตั้งค่าเริ่มต้น
      const defaultFormat =
        localStorage.getItem("rovDefaultFormat") || "ranking";

      // ตั้งค่ารูปแบบการแข่งขัน
      if (elements.formatSelect) {
        elements.formatSelect.value = defaultFormat;
        setFormat(defaultFormat);
      }

      // เริ่มต้นที่หน้าดราฟ
      setActivePage("draft");

      // Render initial state
      render();

      return Promise.resolve();
    } catch (error) {
      console.error("Error during UIManager initialization:", error);
      return Promise.reject(error);
    }
  }

  // Cache DOM elements for better performance
  function cacheElements() {
    try {
      elements = {
        // เมนูหลัก
        menuButtons: {
          draft: document.getElementById("draft-btn"),
          history: document.getElementById("history-btn"),
          heroes: document.getElementById("heroes-btn"),
          settings: document.getElementById("settings-btn"),
        },
        pages: {
          draft: document.getElementById("draft-page"),
          history: document.getElementById("history-page"),
          heroes: document.getElementById("heroes-page"),
          settings: document.getElementById("settings-page"),
        },

        // หน้าดราฟ
        teamButtons: {
          team1: document.getElementById("team1-btn"),
          team2: document.getElementById("team2-btn"),
        },
        formatSelect: document.getElementById("format-select"),
        banSlots: {
          team1: Array.from(
            document.querySelectorAll('.ban-slot[data-team="1"]') || []
          ),
          team2: Array.from(
            document.querySelectorAll('.ban-slot[data-team="2"]') || []
          ),
        },
        pickSlots: {
          team1: Array.from(
            document.querySelectorAll('.pick-slot[data-team="1"]') || []
          ),
          team2: Array.from(
            document.querySelectorAll('.pick-slot[data-team="2"]') || []
          ),
        },
        positionButtons: Array.from(
          document.querySelectorAll(".position-btn") || []
        ),
        recommendedHeroes: document.querySelector(".recommended-heroes"),
        winRateDisplay: {
          progress: document.querySelector(".progress"),
          percentage: document.querySelector(".percentage"),
        },

        // หน้าจัดการแมตช์
        matchControls: {
          importUrl: document.getElementById("import-url"),
          fetchBtn: document.getElementById("fetch-btn"),
          importFile: document.getElementById("import-file"),
          importFileBtn: document.getElementById("import-file-btn"),
          addMatchBtn: document.getElementById("add-match-btn"),
          matchSearch: document.getElementById("match-search"),
          tournamentFilter: document.getElementById("tournament-filter"),
          teamFilter: document.getElementById("team-filter"),
          matchesTbody: document.getElementById("matches-tbody"),
          prevPageBtn: document.getElementById("prev-page"),
          nextPageBtn: document.getElementById("next-page"),
          pageInfo: document.getElementById("page-info"),
          deleteAllMatchesBtn: document.getElementById(
            "delete-all-matches-btn"
          ),
        },

        // หน้าจัดการฮีโร่
        heroControls: {
          importHeroesFile: document.getElementById("import-heroes-file"),
          importHeroesBtn: document.getElementById("import-heroes-btn"),
          heroName: document.getElementById("hero-name"),
          heroClass: document.getElementById("hero-class"),
          heroImage: document.getElementById("hero-image"),
          imagePreview: document.getElementById("image-preview"),
          addHeroBtn: document.getElementById("add-hero-btn"),
          heroSearch: document.getElementById("hero-search"),
          classFilter: document.getElementById("class-filter"),
          heroesTbody: document.getElementById("heroes-tbody"),
          deleteAllHeroesBtn: document.getElementById("delete-all-heroes-btn"),
        },

        // หน้าตั้งค่า
        settingsControls: {
          defaultFormat: document.getElementById("default-format"),
          exportDataBtn: document.getElementById("export-data-btn"),
          importDataBtn: document.getElementById("import-data-btn"),
          clearDataBtn: document.getElementById("clear-data-btn"),
        },

        // อื่นๆ
        modal: {
          container: document.getElementById("heroSelectionModal"),
          closeButton: document.querySelector(".close-btn"),
          searchInput: document.getElementById("heroSearch"),
          filterButtons: document.querySelectorAll(".filter-btn"),
          heroesGrid: document.querySelector(".heroes-grid"),
        },
        resetButton: document.getElementById("reset-btn"),
        loadingOverlay: document.querySelector(".loading-overlay"),
      };

      // Log missing elements for debugging
      logMissingElements();
    } catch (error) {
      console.error("Error caching elements:", error);
    }
  }

  // Log missing elements to help with debugging
  function logMissingElements() {
    // Check main navigation elements (critical)
    ["draft", "history", "heroes", "settings"].forEach((id) => {
      if (!elements.menuButtons[id]) {
        console.warn(`Missing critical navigation button: ${id}-btn`);
      }
      if (!elements.pages[id]) {
        console.warn(`Missing critical page: ${id}-page`);
      }
    });
  }

  // Helper function to safely add event listeners
  function addEventListenerSafely(element, event, handler) {
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  // Set up event listeners with null checks
  function setupEventListeners() {
    try {
      // เมนูหลัก - critical functionality
      addEventListenerSafely(elements.menuButtons.draft, "click", () => {
        setActivePage("draft");
      });

      addEventListenerSafely(elements.menuButtons.history, "click", () => {
        setActivePage("history");
        if (typeof renderMatchesTable === "function") {
          renderMatchesTable();
        }
      });

      addEventListenerSafely(elements.menuButtons.heroes, "click", () => {
        setActivePage("heroes");
        if (typeof renderHeroesTable === "function") {
          renderHeroesTable();
        }
      });

      addEventListenerSafely(elements.menuButtons.settings, "click", () => {
        setActivePage("settings");
      });

      // รูปแบบการแข่งขัน
      addEventListenerSafely(elements.formatSelect, "change", () => {
        if (elements.formatSelect) {
          setFormat(elements.formatSelect.value);
        }
      });

      // Team selection
      addEventListenerSafely(elements.teamButtons.team1, "click", () => {
        setActiveTeam(1);
      });

      addEventListenerSafely(elements.teamButtons.team2, "click", () => {
        setActiveTeam(2);
      });

      // Ban slots
      if (elements.banSlots.team1) {
        elements.banSlots.team1.forEach((slot) => {
          if (slot) {
            slot.addEventListener("click", () => {
              const actualSlot = parseInt(slot.getAttribute("data-slot"));
              console.log("Team 1 Ban Slot Clicked:", {
                slot: actualSlot,
                team: 1,
                type: "ban",
                originalAttribute: slot.getAttribute("data-slot"),
              });
              openHeroSelection("ban", 1, actualSlot);
            });
          }
        });
      }

      if (elements.banSlots.team2) {
        elements.banSlots.team2.forEach((slot) => {
          if (slot) {
            slot.addEventListener("click", () => {
              const actualSlot = parseInt(slot.getAttribute("data-slot"));
              console.log("Team 2 Ban Slot Clicked:", {
                slot: actualSlot,
                team: 2,
                type: "ban",
              });
              openHeroSelection("ban", 2, actualSlot);
            });
          }
        });
      }

      // Pick slots - เพิ่มการอ่าน data-slot
      if (elements.pickSlots.team1) {
        elements.pickSlots.team1.forEach((slot) => {
          if (slot) {
            slot.addEventListener("click", () => {
              const actualSlot = parseInt(slot.getAttribute("data-slot"));
              console.log("Team 1 Pick Slot Clicked:", {
                slot: actualSlot,
                team: 1,
                type: "pick",
              });
              openHeroSelection("pick", 1, actualSlot);
            });
          }
        });
      }

      if (elements.pickSlots.team2) {
        elements.pickSlots.team2.forEach((slot) => {
          if (slot) {
            slot.addEventListener("click", () => {
              const actualSlot = parseInt(slot.getAttribute("data-slot"));
              console.log("Team 2 Pick Slot Clicked:", {
                slot: actualSlot,
                team: 2,
                type: "pick",
              });
              openHeroSelection("pick", 2, actualSlot);
            });
          }
        });
      }

      // Position buttons
      if (elements.positionButtons) {
        elements.positionButtons.forEach((button) => {
          if (button) {
            button.addEventListener("click", () => {
              const position = button.getAttribute("data-position");
              setActivePosition(position);
            });
          }
        });
      }

      // Modal close button
      addEventListenerSafely(
        elements.modal.closeButton,
        "click",
        closeHeroSelection
      );

      // Modal search input
      addEventListenerSafely(elements.modal.searchInput, "input", filterHeroes);

      // Modal filter buttons
      if (elements.modal.filterButtons) {
        elements.modal.filterButtons.forEach((button) => {
          if (button) {
            button.addEventListener("click", () => {
              const filter = button.getAttribute("data-filter");
              setActiveFilter(filter);
              filterHeroes();
            });
          }
        });
      }

      // Reset button
      addEventListenerSafely(elements.resetButton, "click", resetDraft);

      // หน้าจัดการแมตช์
      if (elements.matchControls) {
        addEventListenerSafely(
          elements.matchControls.fetchBtn,
          "click",
          fetchMatchDataFromUrl
        );
        addEventListenerSafely(
          elements.matchControls.importFile,
          "change",
          importMatchesFromFile
        );
        addEventListenerSafely(
          elements.matchControls.addMatchBtn,
          "click",
          addNewMatch
        );
        addEventListenerSafely(
          elements.matchControls.matchSearch,
          "input",
          filterMatches
        );
        addEventListenerSafely(
          elements.matchControls.tournamentFilter,
          "change",
          filterMatches
        );
        addEventListenerSafely(
          elements.matchControls.teamFilter,
          "change",
          filterMatches
        );
        addEventListenerSafely(
          elements.matchControls.prevPageBtn,
          "click",
          () => navigateMatchesPage("prev")
        );
        addEventListenerSafely(
          elements.matchControls.nextPageBtn,
          "click",
          () => navigateMatchesPage("next")
        );
        addEventListenerSafely(
          elements.matchControls.deleteAllMatchesBtn,
          "click",
          deleteAllMatches
        );
      }

      // หน้าตั้งค่า
      if (elements.settingsControls) {
        addEventListenerSafely(
          elements.settingsControls.defaultFormat,
          "change",
          () => {
            if (elements.settingsControls.defaultFormat) {
              setDefaultFormat(elements.settingsControls.defaultFormat.value);
            }
          }
        );

        addEventListenerSafely(
          elements.settingsControls.exportDataBtn,
          "click",
          exportData
        );
        addEventListenerSafely(
          elements.settingsControls.importDataBtn,
          "click",
          importData
        );
        addEventListenerSafely(
          elements.settingsControls.clearDataBtn,
          "click",
          clearData
        );
      }
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }
  }

  // Set active team
  function setActiveTeam(teamId) {
    try {
      // Update UI
      if (elements.teamButtons.team1) {
        elements.teamButtons.team1.classList.toggle("active", teamId === 1);
      }
      if (elements.teamButtons.team2) {
        elements.teamButtons.team2.classList.toggle("active", teamId === 2);
      }

      // Update analytics
      if (
        typeof AnalyticsManager !== "undefined" &&
        AnalyticsManager.setSelectedTeam
      ) {
        AnalyticsManager.setSelectedTeam(teamId);
      }

      // Update UI
      renderRecommendations();
      renderWinRate();
    } catch (error) {
      console.error("Error setting active team:", error);
    }
  }

  // Set active position
  function setActivePosition(position) {
    try {
      // Update UI
      if (elements.positionButtons) {
        elements.positionButtons.forEach((button) => {
          if (button) {
            button.classList.toggle(
              "active",
              button.getAttribute("data-position") === position
            );
          }
        });
      }

      // Update analytics
      if (
        typeof AnalyticsManager !== "undefined" &&
        AnalyticsManager.setCurrentPosition
      ) {
        AnalyticsManager.setCurrentPosition(position);
      }

      // Update UI
      renderRecommendations();
    } catch (error) {
      console.error("Error setting active position:", error);
    }
  }

  // Open hero selection modal
  function openHeroSelection(type, teamId, slotIndex) {
    console.log("Opening Hero Selection - Detailed:", {
      type: type,
      team: teamId,
      slot: slotIndex,
      slotElement: document.querySelector(
        `.${type}-slot[data-team="${teamId}"][data-slot="${slotIndex}"]`
      ),
    });

    // ใช้ HeroSelectionController
    if (
      typeof HeroSelectionController !== "undefined" &&
      typeof HeroSelectionController.openModal === "function"
    ) {
      HeroSelectionController.openModal(teamId, type, slotIndex);
      return;
    }

    // Fallback method
    const modal = document.getElementById("heroSelectionModal");
    if (modal) {
      // อัปเดตข้อมูลการเลือกด้วยตนเอง
      const selectionTeam = document.getElementById("selectionTeam");
      const selectionType = document.getElementById("selectionType");
      const selectionSlot = document.getElementById("selectionSlot");

      if (selectionTeam) selectionTeam.textContent = `ทีม ${teamId}`;
      if (selectionType)
        selectionType.textContent = type === "ban" ? "แบน" : "เลือก";
      if (selectionSlot) selectionSlot.textContent = slotIndex + 1;

      modal.style.display = "block";
    }
  }

  // Close hero selection modal
  function closeHeroSelection() {
    try {
      if (elements.modal.container) {
        elements.modal.container.style.display = "none";
      }
    } catch (error) {
      console.error("Error closing hero selection:", error);
    }
  }

  // Modified populateHeroGrid function for ui.js
  function populateHeroGrid() {
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
          selectHeroFromModal(hero.name);
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
      filterHeroes();
    } catch (error) {
      console.error("Error populating hero grid:", error);
    }
  }

  // Add this helper function to handle hero selection from modal
  function selectHeroFromModal(heroName) {
    try {
      const modalElement = document.getElementById("heroSelectionModal");
      if (!modalElement) return;

      // Log the raw selection information for debugging
      console.log("Raw Selection Modal Info:", {
        teamContent: document.getElementById("selectionTeam")?.textContent,
        typeContent: document.getElementById("selectionType")?.textContent,
        slotContent: document.getElementById("selectionSlot")?.textContent,
      });

      // Retrieve current selection state from HeroSelectionController
      const currentSelection = HeroSelectionController.currentSelection;

      if (!currentSelection) {
        console.error("No current selection found");
        return;
      }

      console.log("Current Selection:", currentSelection);

      const team = currentSelection.team;
      const type = currentSelection.type;
      const slot = currentSelection.slot;

      console.log("Parsed Selection:", { team, type, slot, heroName });

      let success = false;

      if (type === "ban") {
        success = AnalyticsManager.addBan(team, heroName, slot);
      } else {
        success = AnalyticsManager.addPick(team, heroName, slot);
      }

      if (success) {
        // Close modal
        modalElement.style.display = "none";

        // Update UI
        if (
          typeof UIManager !== "undefined" &&
          typeof UIManager.render === "function"
        ) {
          UIManager.render();
        }
      } else {
        alert("ไม่สามารถเลือกฮีโร่นี้ได้ อาจถูกเลือกหรือแบนไปแล้ว");
      }
    } catch (error) {
      console.error("Error selecting hero from modal:", error);
    }
  }

  // Helper function to get current draft state
  function getCurrentDraft() {
    if (
      typeof AnalyticsManager !== "undefined" &&
      typeof AnalyticsManager.getCurrentDraft === "function"
    ) {
      return AnalyticsManager.getCurrentDraft();
    }

    // Default empty draft
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

  // Filter heroes in grid
  function filterHeroes() {
    try {
      const searchText = elements.modal.searchInput
        ? elements.modal.searchInput.value.toLowerCase()
        : "";
      const activeFilter = getActiveFilter();

      // Get all hero cards
      const heroCards = elements.modal.heroesGrid
        ? elements.modal.heroesGrid.querySelectorAll(".hero-card")
        : [];

      // Filter by search text and role
      heroCards.forEach((card) => {
        const heroNameElement = card.querySelector(".hero-name");
        if (!heroNameElement) return;

        const heroName = heroNameElement.textContent.toLowerCase();

        // Check if DataManager exists
        if (typeof DataManager === "undefined" || !DataManager.getHeroByName) {
          console.error("DataManager not available");
          return;
        }

        const heroData = DataManager.getHeroByName(heroName);
        if (!heroData) return;

        // Check if hero matches filter
        const matchesFilter =
          activeFilter === "all" || heroData.roles.includes(activeFilter);

        // Check if hero matches search
        const matchesSearch = heroName.includes(searchText);

        // Show/hide card
        card.style.display = matchesFilter && matchesSearch ? "block" : "none";
      });
    } catch (error) {
      console.error("Error filtering heroes:", error);
    }
  }

  // Get active filter
  function getActiveFilter() {
    try {
      if (!elements.modal.filterButtons) return "all";

      const activeFilterButton = Array.from(elements.modal.filterButtons).find(
        (btn) => btn && btn.classList.contains("active")
      );

      return activeFilterButton
        ? activeFilterButton.getAttribute("data-filter")
        : "all";
    } catch (error) {
      console.error("Error getting active filter:", error);
      return "all";
    }
  }

  // Set active filter
  function setActiveFilter(filter) {
    try {
      if (elements.modal.filterButtons) {
        elements.modal.filterButtons.forEach((button) => {
          if (button) {
            button.classList.toggle(
              "active",
              button.getAttribute("data-filter") === filter
            );
          }
        });
      }
    } catch (error) {
      console.error("Error setting active filter:", error);
    }
  }

  // Select hero from modal
  function selectHero(heroName) {
    try {
      // Check if AnalyticsManager exists
      if (typeof AnalyticsManager === "undefined") {
        console.error("AnalyticsManager not available");
        return;
      }

      // Add hero to draft
      let success = false;

      if (selectionState.targetType === "ban") {
        if (AnalyticsManager.addBan) {
          success = AnalyticsManager.addBan(
            selectionState.targetTeam,
            heroName,
            selectionState.targetSlot
          );
        }
      } else {
        if (AnalyticsManager.addPick) {
          success = AnalyticsManager.addPick(
            selectionState.targetTeam,
            heroName,
            selectionState.targetSlot
          );
        }
      }

      // If successful, close modal and update UI
      if (success) {
        closeHeroSelection();
        render();
      } else {
        // Show error message
        alert("ไม่สามารถเลือกฮีโร่นี้ได้ เนื่องจากถูกเลือกหรือแบนไปแล้ว");
      }
    } catch (error) {
      console.error("Error selecting hero:", error);
    }
  }

  // Render the entire UI
  function render() {
    try {
      // Check if AnalyticsManager exists
      if (
        typeof AnalyticsManager === "undefined" ||
        !AnalyticsManager.getCurrentDraft
      ) {
        console.error("AnalyticsManager not available");
        return;
      }

      // Get current draft
      const draft = AnalyticsManager.getCurrentDraft();

      // Render team selection
      if (elements.teamButtons.team1) {
        elements.teamButtons.team1.classList.toggle(
          "active",
          draft.selectedTeam === 1
        );
      }
      if (elements.teamButtons.team2) {
        elements.teamButtons.team2.classList.toggle(
          "active",
          draft.selectedTeam === 2
        );
      }

      // Render format selection
      if (elements.formatSelect) {
        elements.formatSelect.value = draft.format;
      }

      // Update ban slots based on format
      updateBanSlots(draft.format);

      // Render bans
      renderBans(draft);

      // Render picks
      renderPicks(draft);

      // Render active position
      if (elements.positionButtons) {
        elements.positionButtons.forEach((button) => {
          if (button) {
            button.classList.toggle(
              "active",
              button.getAttribute("data-position") === draft.currentPosition
            );
          }
        });
      }

      // Render recommendations
      renderRecommendations();

      // Render win rate
      renderWinRate();
    } catch (error) {
      console.error("Error rendering UI:", error);
    }
  }

  // Render bans
  function renderBans(draft) {
    try {
      if (!draft || !draft.team1 || !draft.team2) return;

      // Check if DataManager exists
      if (typeof DataManager === "undefined" || !DataManager.getHeroByName) {
        console.error("DataManager not available");
        return;
      }

      // Team 1 bans
      if (elements.banSlots.team1) {
        elements.banSlots.team1.forEach((slot, index) => {
          if (!slot) return;

          const heroName = draft.team1.bans[index];
          const heroPortrait = slot.querySelector(".hero-portrait");

          if (!heroPortrait) return;

          if (heroName) {
            heroPortrait.classList.remove("empty");
            heroPortrait.innerHTML = "";

            const hero = DataManager.getHeroByName(heroName);
            if (hero) {
              const img = document.createElement("img");
              img.src = hero.image;
              img.alt = heroName;
              heroPortrait.appendChild(img);
            }
          } else {
            heroPortrait.classList.add("empty");
            heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
          }
        });
      }

      // Team 2 bans
      if (elements.banSlots.team2) {
        elements.banSlots.team2.forEach((slot, index) => {
          if (!slot) return;

          const heroName = draft.team2.bans[index];
          const heroPortrait = slot.querySelector(".hero-portrait");

          if (!heroPortrait) return;

          if (heroName) {
            heroPortrait.classList.remove("empty");
            heroPortrait.innerHTML = "";

            const hero = DataManager.getHeroByName(heroName);
            if (hero) {
              const img = document.createElement("img");
              img.src = hero.image;
              img.alt = heroName;
              heroPortrait.appendChild(img);
            }
          } else {
            heroPortrait.classList.add("empty");
            heroPortrait.innerHTML = '<i class="fas fa-ban"></i>';
          }
        });
      }
    } catch (error) {
      console.error("Error rendering bans:", error);
    }
  }

  // Render picks
  function renderPicks(draft) {
    try {
      if (!draft || !draft.team1 || !draft.team2) return;

      // Check if DataManager exists
      if (typeof DataManager === "undefined" || !DataManager.getHeroByName) {
        console.error("DataManager not available");
        return;
      }

      // Team 1 picks
      if (elements.pickSlots.team1) {
        elements.pickSlots.team1.forEach((slot, index) => {
          if (!slot) return;

          const heroName = draft.team1.picks[index];
          const heroPortrait = slot.querySelector(".hero-portrait");

          if (!heroPortrait) return;

          if (heroName) {
            heroPortrait.classList.remove("empty");
            heroPortrait.innerHTML = "";

            const hero = DataManager.getHeroByName(heroName);
            if (hero) {
              const img = document.createElement("img");
              img.src = hero.image;
              img.alt = heroName;
              heroPortrait.appendChild(img);
            }
          } else {
            heroPortrait.classList.add("empty");
            heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
          }
        });
      }

      // Team 2 picks
      if (elements.pickSlots.team2) {
        elements.pickSlots.team2.forEach((slot, index) => {
          if (!slot) return;

          const heroName = draft.team2.picks[index];
          const heroPortrait = slot.querySelector(".hero-portrait");

          if (!heroPortrait) return;

          if (heroName) {
            heroPortrait.classList.remove("empty");
            heroPortrait.innerHTML = "";

            const hero = DataManager.getHeroByName(heroName);
            if (hero) {
              const img = document.createElement("img");
              img.src = hero.image;
              img.alt = heroName;
              heroPortrait.appendChild(img);
            }
          } else {
            heroPortrait.classList.add("empty");
            heroPortrait.innerHTML = '<i class="fas fa-plus"></i>';
          }
        });
      }
    } catch (error) {
      console.error("Error rendering picks:", error);
    }
  }

  // Render recommendations
  function renderRecommendations() {
    try {
      // Check if AnalyticsManager exists
      if (
        typeof AnalyticsManager === "undefined" ||
        !AnalyticsManager.getRecommendedHeroes
      ) {
        console.error("AnalyticsManager not available");
        return;
      }

      // Get recommendations
      const recommendations = AnalyticsManager.getRecommendedHeroes();

      // Clear recommendations
      if (elements.recommendedHeroes) {
        elements.recommendedHeroes.innerHTML = "";
      } else {
        return;
      }

      // Render recommendations
      recommendations.forEach((hero) => {
        const heroCard = document.createElement("div");
        heroCard.className = "hero-card";

        const heroImage = document.createElement("img");
        heroImage.src = hero.image;
        heroImage.alt = hero.name;

        const heroName = document.createElement("div");
        heroName.className = "hero-name";
        heroName.textContent = hero.name;

        const winRate = document.createElement("div");
        winRate.className = "win-rate";
        winRate.textContent = `${hero.winRate}%`;

        heroCard.appendChild(heroImage);
        heroCard.appendChild(heroName);
        heroCard.appendChild(winRate);

        elements.recommendedHeroes.appendChild(heroCard);
      });

      // If no recommendations
      if (recommendations.length === 0) {
        const noRecommendations = document.createElement("p");
        noRecommendations.textContent = "ไม่มีคำแนะนำสำหรับตำแหน่งนี้";
        elements.recommendedHeroes.appendChild(noRecommendations);
      }
    } catch (error) {
      console.error("Error rendering recommendations:", error);
    }
  }

  // Render win rate
  function renderWinRate() {
    try {
      // Check if AnalyticsManager exists
      if (
        typeof AnalyticsManager === "undefined" ||
        !AnalyticsManager.calculateWinRate
      ) {
        console.error("AnalyticsManager not available");
        return;
      }

      // Get win rate
      const winRate = AnalyticsManager.calculateWinRate();

      // Update UI
      if (elements.winRateDisplay.progress) {
        elements.winRateDisplay.progress.style.width = `${winRate}%`;
      }
      if (elements.winRateDisplay.percentage) {
        elements.winRateDisplay.percentage.textContent = `${Math.round(
          winRate
        )}%`;
      }
    } catch (error) {
      console.error("Error rendering win rate:", error);
    }
  }

  // Reset draft
  function resetDraft() {
    try {
      if (confirm("แน่ใจหรือไม่ว่าต้องการรีเซ็ตการดราฟ?")) {
        // Check if AnalyticsManager exists
        if (
          typeof AnalyticsManager === "undefined" ||
          !AnalyticsManager.resetDraft
        ) {
          console.error("AnalyticsManager not available");
          return;
        }

        AnalyticsManager.resetDraft();
        render();
      }
    } catch (error) {
      console.error("Error resetting draft:", error);
    }
  }

  // Show loading overlay
  function showLoading() {
    try {
      if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = "flex";
      }
    } catch (error) {
      console.error("Error showing loading overlay:", error);
    }
  }

  // Hide loading overlay
  function hideLoading() {
    try {
      if (elements.loadingOverlay) {
        elements.loadingOverlay.style.display = "none";
      }
    } catch (error) {
      console.error("Error hiding loading overlay:", error);
    }
  }

  // เปลี่ยนหน้า
  function setActivePage(pageId) {
    try {
      console.log("Switching to page:", pageId);

      // อัปเดต UI ของปุ่มเมนู
      Object.keys(elements.menuButtons).forEach((key) => {
        const button = elements.menuButtons[key];
        if (button) {
          button.classList.toggle("active", key === pageId);
        }
      });

      // อัปเดต UI ของหน้า
      Object.keys(elements.pages).forEach((key) => {
        const page = elements.pages[key];
        if (page) {
          page.classList.toggle("active", key === pageId);
        }
      });

      // ถ้าเป็นหน้าจัดการแมตช์ ให้โหลดข้อมูลแมตช์
      if (pageId === "history" && typeof renderMatchesTable === "function") {
        renderMatchesTable();
      }

      // ถ้าเป็นหน้าจัดการฮีโร่ ให้โหลดข้อมูลฮีโร่
      if (pageId === "heroes" && typeof renderHeroesTable === "function") {
        renderHeroesTable();
      }

      // ถ้าเป็นหน้าตั้งค่า ให้โหลดการตั้งค่า
      if (pageId === "settings") {
        loadSettings();
      }
    } catch (error) {
      console.error("Error setting active page:", error);
    }
  }

  // ตั้งค่ารูปแบบการแข่งขัน
  function setFormat(format) {
    try {
      // Check if AnalyticsManager exists
      if (
        typeof AnalyticsManager === "undefined" ||
        !AnalyticsManager.setFormat
      ) {
        console.error("AnalyticsManager not available");
        return;
      }

      AnalyticsManager.setFormat(format);

      // อัปเดต UI
      updateBanSlots(format);
      render();
    } catch (error) {
      console.error("Error setting format:", error);
    }
  }

  // อัปเดตสล็อตแบนตามรูปแบบการแข่งขัน
  function updateBanSlots(format) {
    try {
      const maxBans = format === "global" ? 4 : 3;

      // อัปเดตการแสดงผลสล็อตแบน
      if (elements.banSlots.team1) {
        elements.banSlots.team1.forEach((slot, index) => {
          if (slot) {
            slot.style.display = index < maxBans ? "block" : "none";
          }
        });
      }

      if (elements.banSlots.team2) {
        elements.banSlots.team2.forEach((slot, index) => {
          if (slot) {
            slot.style.display = index < maxBans ? "block" : "none";
          }
        });
      }
    } catch (error) {
      console.error("Error updating ban slots:", error);
    }
  }

  // โหลดการตั้งค่า
  function loadSettings() {
    try {
      // โหลดรูปแบบเริ่มต้น
      const defaultFormat =
        localStorage.getItem("rovDefaultFormat") || "ranking";
      if (elements.settingsControls.defaultFormat) {
        elements.settingsControls.defaultFormat.value = defaultFormat;
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  // ตั้งค่ารูปแบบเริ่มต้น
  function setDefaultFormat(format) {
    try {
      localStorage.setItem("rovDefaultFormat", format);
    } catch (error) {
      console.error("Error setting default format:", error);
    }
  }

  // ส่งออกข้อมูล
  function exportData() {
    try {
      const data = {
        heroes: JSON.parse(localStorage.getItem("rovHeroData") || "{}"),
        matches: JSON.parse(localStorage.getItem("rovMatchData") || "[]"),
        settings: {
          defaultFormat: localStorage.getItem("rovDefaultFormat") || "ranking",
        },
      };

      const dataStr = JSON.stringify(data);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = "rov_draft_helper_data.json";

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    }
  }

  // นำเข้าข้อมูล
  function importData() {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";

      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);

            // บันทึกข้อมูล
            if (data.heroes) {
              localStorage.setItem("rovHeroData", JSON.stringify(data.heroes));
            }

            if (data.matches) {
              localStorage.setItem(
                "rovMatchData",
                JSON.stringify(data.matches)
              );
            }

            if (data.settings && data.settings.defaultFormat) {
              localStorage.setItem(
                "rovDefaultFormat",
                data.settings.defaultFormat
              );
            }

            alert(
              "นำเข้าข้อมูลเรียบร้อย กรุณารีเฟรชหน้าเว็บเพื่อใช้ข้อมูลใหม่"
            );
            location.reload();
          } catch (error) {
            console.error("Error parsing imported data:", error);
            alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
          }
        };

        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      console.error("Error importing data:", error);
      alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
    }
  }

  // ล้างข้อมูลทั้งหมด
  function clearData() {
    try {
      if (
        confirm(
          "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้"
        )
      ) {
        localStorage.removeItem("rovHeroData");
        localStorage.removeItem("rovMatchData");
        localStorage.removeItem("rovDraftState");

        // เก็บการตั้งค่าไว้
        const defaultFormat = localStorage.getItem("rovDefaultFormat");

        // ล้าง localStorage
        localStorage.clear();

        // คืนค่าการตั้งค่า
        if (defaultFormat) {
          localStorage.setItem("rovDefaultFormat", defaultFormat);
        }

        alert("ล้างข้อมูลเรียบร้อย กรุณารีเฟรชหน้าเว็บ");
        location.reload();
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("เกิดข้อผิดพลาดในการล้างข้อมูล");
    }
  }

  // ฟังก์ชันดึงข้อมูลแมตช์จาก URL (แก้ไขปรับปรุง)
  function fetchMatchDataFromUrl() {
    const url = document.getElementById("import-url").value.trim();

    if (!url) {
      alert("กรุณาใส่ URL");
      return;
    }

    // แสดงสถานะกำลังโหลด
    document.querySelector(".loading-overlay").style.display = "flex";

    // ในการเชื่อมต่อจริง เราจะใช้ fetch API หรือ AJAX แต่เนื่องจากข้อจำกัดของ CORS
    // เราจะจำลองการดึงข้อมูล
    setTimeout(() => {
      try {
        // ในสถานการณ์จริง ควรส่งคำขอไปยังเซิร์ฟเวอร์ของเรา
        // เพื่อให้เซิร์ฟเวอร์ดึงข้อมูลจาก Liquipedia แทน (proxy)

        // จำลองการดึงข้อมูล
        const newMatches = [];

        // ตรวจสอบว่า URL คล้ายกับ URL ที่ส่งมาหรือไม่
        if (url.includes("liquipedia.net") && url.includes("Game_history")) {
          // ถ้าเป็น URL ของ Liquipedia และมีคำว่า Game_history
          // จำลองว่าดึงข้อมูลสำเร็จ

          // จำลองข้อมูลแมตช์ใหม่ 3 แมตช์
          for (let i = 0; i < 3; i++) {
            newMatches.push({
              date: `2025-03-${10 + i}`,
              tournament: "RoV Pro League 2025 Summer Playoffs",
              team1: "Team Flash",
              team2: "Buriram United Esports",
              picks1: ["Keera", "Valhein", "Tulen", "Alice", "Thane"],
              picks2: ["Riktor", "Violet", "Zata", "Zip", "Ormarr"],
              bans1: ["Airi", "Florentino"],
              bans2: ["Laville", "Capheny"],
              winner: i % 2 === 0 ? "Team Flash" : "Buriram United Esports",
            });
          }

          // เพิ่มแมตช์ใหม่ลงใน localStorage
          let matches = [];
          try {
            matches = JSON.parse(localStorage.getItem("rovMatchData")) || [];
          } catch (error) {
            matches = [];
          }

          // รวมแมตช์ใหม่กับแมตช์เดิม
          matches = [...matches, ...newMatches];

          // บันทึกลงใน localStorage
          localStorage.setItem("rovMatchData", JSON.stringify(matches));

          // รีเฟรชหน้าแมตช์
          renderMatchesTable();

          // อัปเดตข้อมูล
          DataManager.init().then(() => {
            if (typeof render === "function") {
              render();
            }
          });

          alert(`ดึงข้อมูลสำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
        } else {
          alert("URL ไม่ถูกต้อง กรุณาใช้ URL ของ Liquipedia Game History");
        }
      } catch (error) {
        console.error("Error fetching match data from URL:", error);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        document.querySelector(".loading-overlay").style.display = "none";
      }
    }, 1500); // จำลองการดึงข้อมูล 1.5 วินาที
  }

  // Updated importMatchesFromFile function with Excel support
  function importMatchesFromFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Show loading overlay
    showLoading();

    try {
      if (file.name.endsWith(".json")) {
        // Handle JSON files
        const reader = new FileReader();
        
        reader.onload = function (e) {
          try {
            const newMatches = JSON.parse(e.target.result);
            processImportedMatches(newMatches);
          } catch (error) {
            console.error("Error parsing JSON file:", error);
            alert("เกิดข้อผิดพลาดในการแปลงไฟล์ JSON กรุณาตรวจสอบรูปแบบข้อมูล");
          } finally {
            hideLoading();
          }
        };
        
        reader.onerror = function () {
          hideLoading();
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
        };
        
        reader.readAsText(file);
      } 
      else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Handle Excel files
        const reader = new FileReader();
        
        reader.onload = function (e) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Assume the first sheet contains match data
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON with headers
            const excelData = XLSX.utils.sheet_to_json(worksheet);
            
            // Process the Excel data
            const newMatches = processExcelData(excelData);
            processImportedMatches(newMatches);
          } catch (error) {
            console.error("Error processing Excel file:", error);
            alert("เกิดข้อผิดพลาดในการประมวลผลไฟล์ Excel กรุณาตรวจสอบรูปแบบข้อมูล");
          } finally {
            hideLoading();
          }
        };
        
        reader.onerror = function () {
          hideLoading();
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
        };
        
        reader.readAsArrayBuffer(file);
      } 
      else if (file.name.endsWith(".csv")) {
        // For CSV files (you can implement this similarly to Excel in the future)
        alert("ยังไม่รองรับไฟล์ CSV ในตัวอย่างนี้");
        hideLoading();
      } 
      else {
        alert("ไฟล์ไม่รองรับ กรุณาใช้ไฟล์ JSON, CSV หรือ Excel");
        hideLoading();
      }
    } catch (error) {
      console.error("Error importing matches from file:", error);
      alert("เกิดข้อผิดพลาดในการนำเข้าแมตช์");
      hideLoading();
    }
  }

  // Helper function to process the imported matches
  function processImportedMatches(newMatches) {
    if (!Array.isArray(newMatches)) {
      alert("รูปแบบข้อมูลไม่ถูกต้อง ควรเป็นอาร์เรย์ของแมตช์");
      return;
    }
    
    // Get existing matches
    let matches = [];
    try {
      matches = JSON.parse(localStorage.getItem("rovMatchData")) || [];
    } catch (error) {
      matches = [];
    }
    
    // Combine existing and new matches
    matches = [...matches, ...newMatches];
    
    // Save to localStorage
    localStorage.setItem("rovMatchData", JSON.stringify(matches));
    
    // Refresh matches table
    if (typeof renderMatchesTable === "function") {
      renderMatchesTable();
    }
    
    // Update data if DataManager is available
    if (typeof DataManager !== "undefined" && typeof DataManager.init === "function") {
      DataManager.init().then(() => {
        if (typeof UIManager !== "undefined" && typeof UIManager.render === "function") {
          UIManager.render();
        }
      });
    }
    
    alert(`นำเข้าแมตช์สำเร็จ เพิ่มแมตช์ใหม่ ${newMatches.length} แมตช์`);
  }

  // Helper function to process Excel data into matches format
  function processExcelData(excelData) {
    console.log("Processing Excel data:", excelData);
    
    // Expected columns in the Excel file:
    // date, tournament, team1, team2, picks1, picks2, bans1, bans2, winner
    
    return excelData.map(row => {
      // Ensure picks and bans are converted to arrays if they're provided as strings
      const processList = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',').map(p => p.trim());
        return [];
      };
      
      return {
        date: row.date || new Date().toISOString().split('T')[0],
        tournament: row.tournament || 'Unknown Tournament',
        team1: row.team1 || 'Team 1',
        team2: row.team2 || 'Team 2',
        picks1: processList(row.picks1),
        picks2: processList(row.picks2),
        bans1: processList(row.bans1),
        bans2: processList(row.bans2),
        winner: row.winner || row.team1,
        isImported: true
      };
    });
  }

  // ฟังก์ชันเพิ่มแมตช์ใหม่
  function addNewMatch() {
    try {
      alert("ฟังก์ชันเพิ่มแมตช์ใหม่จะเพิ่มในเวอร์ชันถัดไป");
    } catch (error) {
      console.error("Error in addNewMatch:", error);
    }
  }

  // ฟังก์ชันกรองแมตช์
  function filterMatches() {
    try {
      const matchSearchElement = document.getElementById("match-search");
      const tournamentFilterElement =
        document.getElementById("tournament-filter");
      const teamFilterElement = document.getElementById("team-filter");
      const matchesTbodyElement = document.getElementById("matches-tbody");

      if (
        !matchSearchElement ||
        !tournamentFilterElement ||
        !teamFilterElement ||
        !matchesTbodyElement
      ) {
        console.warn("ไม่พบอิลิเมนต์สำหรับการกรองข้อมูล");
        return;
      }

      const searchText = matchSearchElement.value.toLowerCase();
      const tournamentFilter = tournamentFilterElement.value;
      const teamFilter = teamFilterElement.value;

      try {
        const matches = JSON.parse(localStorage.getItem("rovMatchData")) || [];

        // ล้างตาราง
        matchesTbodyElement.innerHTML = "";

        // กรองแมตช์
        const filteredMatches = matches.filter((match) => {
          // กรองตามข้อความค้นหา
          const matchText =
            `${match.date} ${match.tournament} ${match.team1} ${match.team2} ${match.winner}`.toLowerCase();
          const matchesSearch =
            searchText === "" || matchText.includes(searchText);

          // กรองตามทัวร์นาเมนต์
          const matchesTournament =
            tournamentFilter === "" || match.tournament === tournamentFilter;

          // กรองตามทีม
          const matchesTeam =
            teamFilter === "" ||
            match.team1 === teamFilter ||
            match.team2 === teamFilter;

          return matchesSearch && matchesTournament && matchesTeam;
        });

        // แสดงแมตช์ที่กรองแล้ว
        filteredMatches.forEach((match, index) => {
          const row = document.createElement("tr");

          // กำหนดปุ่มจัดการตามประเภทของข้อมูล
          let managementButtons = "";

          if (match.isImported) {
            // ถ้าเป็นข้อมูลที่นำเข้ามา จะไม่มีปุ่มแก้ไข
            managementButtons = `
                            <button class="view-btn" data-index="${matches.indexOf(
                              match
                            )}">ดู</button>
                            <button class="delete-btn" data-index="${matches.indexOf(
                              match
                            )}">ลบ</button>
                        `;
          } else {
            // ถ้าเป็นข้อมูลที่เพิ่มเอง จะมีปุ่มแก้ไข
            managementButtons = `
                            <button class="view-btn" data-index="${matches.indexOf(
                              match
                            )}">ดู</button>
                            <button class="edit-btn" data-index="${matches.indexOf(
                              match
                            )}">แก้ไข</button>
                            <button class="delete-btn" data-index="${matches.indexOf(
                              match
                            )}">ลบ</button>
                        `;
          }

          row.innerHTML = `
                        <td>${match.date}</td>
                        <td>${match.tournament}</td>
                        <td>${match.team1}</td>
                        <td>${match.team2}</td>
                        <td>${match.winner}</td>
                        <td>${managementButtons}</td>
                    `;

          matchesTbodyElement.appendChild(row);
        });

        // เพิ่ม event listener สำหรับปุ่มในตาราง
        matchesTbodyElement.querySelectorAll(".view-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            viewMatch(index);
          });
        });

        matchesTbodyElement.querySelectorAll(".edit-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            editMatch(index);
          });
        });

        matchesTbodyElement.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            deleteMatch(index);
          });
        });
      } catch (error) {
        console.error("Error filtering matches:", error);
      }
    } catch (error) {
      console.error("Error in filterMatches:", error);
    }
  }

  // นำทางหน้าแมตช์
  function navigateMatchesPage(direction) {
    try {
      // ในตัวอย่างนี้เรายังไม่ได้ทำระบบแบ่งหน้า
      // ฟังก์ชันนี้จะเพิ่มในเวอร์ชันถัดไป
      alert("ระบบแบ่งหน้าจะเพิ่มในเวอร์ชันถัดไป");
    } catch (error) {
      console.error("Error navigating matches page:", error);
    }
  }

  // Public API
  return {
    init,
    render,
    showLoading,
    hideLoading,
  };
})();
