/**
 * Integration Script for RoV Draft Helper
 * This script should be added to the end of the body tag
 */

// Load and initialize all components
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing RoV Draft Helper with enhanced hero selection...");

  // Step 1: Check if required functions exist and create if needed
  ensureRenderMatchesTableExists();

  // To this:
  if (typeof HeroSelectionController !== "undefined") {
    HeroSelectionController.init();
  } else {
    console.error("HeroSelectionController not found - please check that all script files are loaded correctly");
  }

  // Step 4: Override UIManager methods if needed
  overrideUIManagerMethods();

  console.log("RoV Draft Helper initialized successfully");
});

// Ensure renderMatchesTable function exists
function ensureRenderMatchesTableExists() {
  if (typeof renderMatchesTable !== "function") {
    window.renderMatchesTable = function () {
      console.log("Rendering matches table...");

      try {
        // Get matches from localStorage
        const matches = JSON.parse(localStorage.getItem("rovMatchData")) || [];

        // Get the tbody element
        const tbody = document.getElementById("matches-tbody");
        if (!tbody) {
          console.warn("matches-tbody element not found");
          return;
        }

        // Clear tbody
        tbody.innerHTML = "";

        // Populate the table with matches
        matches.forEach((match, index) => {
          const row = document.createElement("tr");

          // Create management buttons
          let managementButtons = "";
          if (match.isImported) {
            // If imported, no edit button
            managementButtons = `
              <button class="view-btn" data-index="${index}">ดู</button>
              <button class="delete-btn" data-index="${index}">ลบ</button>
            `;
          } else {
            // If not imported, include edit button
            managementButtons = `
              <button class="view-btn" data-index="${index}">ดู</button>
              <button class="edit-btn" data-index="${index}">แก้ไข</button>
              <button class="delete-btn" data-index="${index}">ลบ</button>
            `;
          }

          // Create row HTML
          row.innerHTML = `
            <td>${match.date || "N/A"}</td>
            <td>${match.tournament || "N/A"}</td>
            <td class="${match.winner === match.team1 ? "winner-team" : ""}">${
            match.team1 || "N/A"
          }</td>
            <td class="${match.winner === match.team2 ? "winner-team" : ""}">${
            match.team2 || "N/A"
          }</td>
            <td>${match.winner || "N/A"}</td>
            <td>${managementButtons}</td>
          `;

          tbody.appendChild(row);
        });

        // If no matches, show message
        if (matches.length === 0) {
          const emptyRow = document.createElement("tr");
          const emptyCell = document.createElement("td");
          emptyCell.colSpan = 6;
          emptyCell.textContent =
            "ไม่พบข้อมูลแมตช์ กรุณาเพิ่มหรือนำเข้าข้อมูลแมตช์";
          emptyCell.style.textAlign = "center";
          emptyCell.style.padding = "20px";
          emptyRow.appendChild(emptyCell);
          tbody.appendChild(emptyRow);
        }

        // Add event listeners to buttons
        const viewButtons = tbody.querySelectorAll(".view-btn");
        const editButtons = tbody.querySelectorAll(".edit-btn");
        const deleteButtons = tbody.querySelectorAll(".delete-btn");

        viewButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            if (typeof viewMatch === "function") {
              viewMatch(index);
            } else {
              console.warn("viewMatch function not defined");
              alert("ฟังก์ชันดูรายละเอียดแมตช์ยังไม่พร้อมใช้งาน");
            }
          });
        });

        editButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            if (typeof editMatch === "function") {
              editMatch(index);
            } else {
              console.warn("editMatch function not defined");
              alert("ฟังก์ชันแก้ไขแมตช์ยังไม่พร้อมใช้งาน");
            }
          });
        });

        deleteButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            if (typeof deleteMatch === "function") {
              deleteMatch(index);
            } else {
              console.warn("deleteMatch function not defined");
              alert("ฟังก์ชันลบแมตช์ยังไม่พร้อมใช้งาน");
            }
          });
        });
      } catch (error) {
        console.error("Error rendering matches table:", error);
      }
    };

    console.log("Created renderMatchesTable function");
  }
}

// Override UIManager methods to integrate with our enhanced hero selection
function overrideUIManagerMethods() {
  if (typeof UIManager !== "undefined") {
    // Original method
    const originalOpenHeroSelection = UIManager.openHeroSelection;

    // Override the openHeroSelection method
    UIManager.openHeroSelection = function (type, teamId, slotIndex) {
      // Try to use HeroSelectionController if available
      if (
        typeof HeroSelectionController !== "undefined" &&
        typeof HeroSelectionController.openModal === "function"
      ) {
        HeroSelectionController.openModal(teamId, type, slotIndex);
      } else {
        // Fall back to original method
        if (typeof originalOpenHeroSelection === "function") {
          originalOpenHeroSelection.call(UIManager, type, teamId, slotIndex);
        } else {
          console.error("Cannot open hero selection: no method available");
        }
      }
    };

    // Add getSelectionState method if not exists
    if (typeof UIManager.getSelectionState !== "function") {
      UIManager.getSelectionState = function () {
        return (
          this.selectionState || {
            targetTeam: 1,
            targetSlot: 0,
            targetType: "ban",
          }
        );
      };
    }
  }
}