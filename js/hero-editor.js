/**
 * Hero Management System - Enhanced with editing capabilities
 */

// Function to edit hero details
function editHero(heroName) {
  try {
    // Get hero data
    let heroes = {};
    try {
      heroes = JSON.parse(localStorage.getItem("rovHeroData")) || {};
    } catch (error) {
      console.error("Error parsing hero data:", error);
      heroes = {};
    }

    // Get hero images
    let heroImages = {};
    try {
      heroImages = JSON.parse(localStorage.getItem("rovHeroImages")) || {};
    } catch (error) {
      console.error("Error parsing hero images:", error);
      heroImages = {};
    }

    // Find hero classes
    const heroClasses = [];
    Object.entries(heroes).forEach(([className, heroList]) => {
      if (heroList.includes(heroName)) {
        heroClasses.push(className);
      }
    });

    // Get hero image
    const heroImage = heroImages[heroName] || "";

    // Create modal for editing
    const modalDiv = document.createElement("div");
    modalDiv.className = "hero-edit-modal";

    // Set the modal content
    modalDiv.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>แก้ไขข้อมูลฮีโร่</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <form id="edit-hero-form">
              <div class="form-group">
                <label for="hero-name">ชื่อฮีโร่:</label>
                <input type="text" id="hero-name" value="${heroName}" placeholder="ชื่อฮีโร่">
              </div>
              
              <div class="form-group">
                <label>คลาส:</label>
                <div class="checkbox-group">
                  <label><input type="checkbox" name="hero-class" value="Assassin" ${
                    heroClasses.includes("Assassin") ? "checked" : ""
                  }> Assassin</label>
                  <label><input type="checkbox" name="hero-class" value="Fighter" ${
                    heroClasses.includes("Fighter") ? "checked" : ""
                  }> Fighter</label>
                  <label><input type="checkbox" name="hero-class" value="Mage" ${
                    heroClasses.includes("Mage") ? "checked" : ""
                  }> Mage</label>
                  <label><input type="checkbox" name="hero-class" value="Carry" ${
                    heroClasses.includes("Carry") ? "checked" : ""
                  }> Carry</label>
                  <label><input type="checkbox" name="hero-class" value="Support" ${
                    heroClasses.includes("Support") ? "checked" : ""
                  }> Support</label>
                  <label><input type="checkbox" name="hero-class" value="Tank" ${
                    heroClasses.includes("Tank") ? "checked" : ""
                  }> Tank</label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="hero-image-link">ลิงก์รูปภาพ:</label>
                <input type="text" id="hero-image-link" value="${
                  heroImage.startsWith("data:") ? "" : heroImage
                }" placeholder="URL ของรูปภาพ">
                <p class="small-help">ใส่ URL ของรูปภาพ หรืออัปโหลดไฟล์ใหม่ด้านล่าง</p>
              </div>
              
              <div class="form-group">
                <label for="hero-image-upload">อัปโหลดรูปภาพ:</label>
                <input type="file" id="hero-image-upload" accept="image/*">
                <div class="image-preview">
                  <img src="${
                    heroImage ||
                    `https://via.placeholder.com/100?text=${encodeURIComponent(
                      heroName
                    )}`
                  }" alt="${heroName}" id="image-preview-img">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button id="save-hero-btn" class="save-btn">บันทึก</button>
            <button class="cancel-btn">ยกเลิก</button>
          </div>
        </div>
      `;

    // Add modal to body
    document.body.appendChild(modalDiv);

    // Add custom styles
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        .hero-edit-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .hero-edit-modal .modal-content {
          background-color: #1f2a40;
          border-radius: 8px;
          width: 80%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .hero-edit-modal .modal-header {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .hero-edit-modal .modal-header h3 {
          margin: 0;
          color: #1baeea;
        }
        
        .hero-edit-modal .close-modal {
          font-size: 24px;
          cursor: pointer;
          color: #aaa;
        }
        
        .hero-edit-modal .modal-body {
          padding: 20px;
        }
        
        .hero-edit-modal .form-group {
          margin-bottom: 15px;
        }
        
        .hero-edit-modal label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-color);
        }
        
        .hero-edit-modal input[type="text"],
        .hero-edit-modal select {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-family: "Kanit", sans-serif;
        }
        
        .hero-edit-modal .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          background-color: rgba(0, 0, 0, 0.2);
          padding: 10px;
          border-radius: 6px;
        }
        
        .hero-edit-modal .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 0;
        }
        
        .hero-edit-modal .image-preview {
          width: 100px;
          height: 100px;
          margin-top: 10px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .hero-edit-modal .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hero-edit-modal .small-help {
          font-size: 0.8rem;
          color: #aaa;
          margin-top: 5px;
        }
        
        .hero-edit-modal .modal-footer {
          padding: 15px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .hero-edit-modal .save-btn {
          padding: 8px 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .hero-edit-modal .cancel-btn {
          padding: 8px 16px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `;

    document.head.appendChild(styleElement);

    // Set up image preview for file upload
    const imageUpload = document.getElementById("hero-image-upload");
    const imagePreview = document.getElementById("image-preview-img");

    if (imageUpload && imagePreview) {
      imageUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            imagePreview.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Set up image preview for URL input
    const imageUrlInput = document.getElementById("hero-image-link");
    if (imageUrlInput && imagePreview) {
      imageUrlInput.addEventListener("input", function (e) {
        const url = e.target.value.trim();
        if (url) {
          imagePreview.src = url;
        } else {
          // If URL is empty, show placeholder or existing image
          imagePreview.src =
            heroImage ||
            `https://via.placeholder.com/100?text=${encodeURIComponent(
              heroName
            )}`;
        }
      });
    }

    // Save button functionality
    const saveButton = document.getElementById("save-hero-btn");
    if (saveButton) {
      saveButton.addEventListener("click", function () {
        const newHeroName = document.getElementById("hero-name").value.trim();
        const imageUrl = document
          .getElementById("hero-image-link")
          .value.trim();
        const imageUpload = document.getElementById("hero-image-upload");

        // Get selected classes
        const selectedClasses = [];
        document
          .querySelectorAll('input[name="hero-class"]:checked')
          .forEach((checkbox) => {
            selectedClasses.push(checkbox.value);
          });

        // Validate input
        if (!newHeroName) {
          alert("กรุณาใส่ชื่อฮีโร่");
          return;
        }

        if (selectedClasses.length === 0) {
          alert("กรุณาเลือกอย่างน้อยหนึ่งคลาส");
          return;
        }

        // Function to save hero data
        function saveHeroData(imageData) {
          try {
            // For name change, remove old hero and add new hero
            const isNameChanged = newHeroName !== heroName;

            // Remove old hero from all classes
            if (isNameChanged) {
              Object.keys(heroes).forEach((className) => {
                heroes[className] = heroes[className].filter(
                  (name) => name !== heroName
                );

                // Remove empty classes
                if (heroes[className].length === 0) {
                  delete heroes[className];
                }
              });
            } else {
              // Only for same name, remove from classes that are not selected anymore
              Object.keys(heroes).forEach((className) => {
                if (!selectedClasses.includes(className)) {
                  heroes[className] = heroes[className].filter(
                    (name) => name !== heroName
                  );

                  // Remove empty classes
                  if (heroes[className].length === 0) {
                    delete heroes[className];
                  }
                }
              });
            }

            // Add hero to selected classes
            selectedClasses.forEach((className) => {
              if (!heroes[className]) {
                heroes[className] = [];
              }

              // Avoid duplicates
              if (!heroes[className].includes(newHeroName)) {
                heroes[className].push(newHeroName);
              }
            });

            // Update hero image
            if (isNameChanged) {
              // Remove old image
              delete heroImages[heroName];
            }

            // Add new image
            if (imageData) {
              heroImages[newHeroName] = imageData;
            }

            // Save data to localStorage
            localStorage.setItem("rovHeroData", JSON.stringify(heroes));
            localStorage.setItem("rovHeroImages", JSON.stringify(heroImages));

            // Close modal
            document.body.removeChild(modalDiv);
            document.head.removeChild(styleElement);

            // Refresh heroes table if function exists
            if (typeof renderHeroesTable === "function") {
              renderHeroesTable();
            }

            alert(`บันทึกข้อมูลฮีโร่ ${newHeroName} เรียบร้อยแล้ว`);
          } catch (error) {
            console.error("Error saving hero data:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลฮีโร่");
          }
        }

        // Handle image upload or URL
        if (imageUpload && imageUpload.files && imageUpload.files[0]) {
          // User uploaded a file
          const file = imageUpload.files[0];
          const reader = new FileReader();

          reader.onload = function (e) {
            const imageData = e.target.result; // Base64 encoded image
            saveHeroData(imageData);
          };

          reader.onerror = function () {
            alert("เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ");
          };

          reader.readAsDataURL(file);
        } else if (imageUrl) {
          // User provided a URL
          saveHeroData(imageUrl);
        } else {
          // Keep existing image
          saveHeroData(heroImage);
        }
      });
    }

    // Cancel button and close functionality
    const closeButtons = modalDiv.querySelectorAll(".close-modal, .cancel-btn");
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        document.body.removeChild(modalDiv);
        document.head.removeChild(styleElement);
      });
    });

    // Close when clicking outside
    modalDiv.addEventListener("click", function (e) {
      if (e.target === modalDiv) {
        document.body.removeChild(modalDiv);
        document.head.removeChild(styleElement);
      }
    });
  } catch (error) {
    console.error("Error editing hero:", error);
    alert("เกิดข้อผิดพลาดในการแก้ไขฮีโร่");
  }
}

// Add edit functionality to the heroes table
function enhanceHeroTable() {
  // Add edit buttons to hero table rows
  const heroRows = document.querySelectorAll("#heroes-tbody tr");

  heroRows.forEach((row) => {
    const nameCell = row.querySelector("td:nth-child(2)");
    const actionCell = row.querySelector("td:last-child");

    if (nameCell && actionCell) {
      const heroName = nameCell.textContent;

      // Check if edit button already exists
      const existingEditBtn = actionCell.querySelector(".edit-btn");
      if (!existingEditBtn) {
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "แก้ไข";
        editBtn.addEventListener("click", () => {
          editHero(heroName);
        });

        // Insert edit button before the delete button
        const deleteBtn = actionCell.querySelector(".delete-btn");
        if (deleteBtn) {
          actionCell.insertBefore(editBtn, deleteBtn);
        } else {
          actionCell.appendChild(editBtn);
        }

        // Add styles for the edit button
        editBtn.style.backgroundColor = "#ff9800";
        editBtn.style.color = "white";
        editBtn.style.border = "none";
        editBtn.style.padding = "5px 10px";
        editBtn.style.borderRadius = "4px";
        editBtn.style.cursor = "pointer";
        editBtn.style.marginRight = "5px";

        // Add hover effect
        editBtn.addEventListener("mouseover", () => {
          editBtn.style.backgroundColor = "#f57c00";
        });
        editBtn.addEventListener("mouseout", () => {
          editBtn.style.backgroundColor = "#ff9800";
        });
      }
    }
  });
}

// Override the renderHeroesTable function to add edit functionality
const originalRenderHeroesTable = window.renderHeroesTable || function () {};

window.renderHeroesTable = function () {
  // Call the original function
  originalRenderHeroesTable.apply(this, arguments);

  // Add edit buttons after the table is rendered
  setTimeout(enhanceHeroTable, 100);
};

// Initialize the enhanced hero table when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Override the renderHeroesTable function
  if (typeof window.renderHeroesTable === "function") {
    const originalFunction = window.renderHeroesTable;
    window.renderHeroesTable = function () {
      originalFunction.apply(this, arguments);
      enhanceHeroTable();
    };
  }

  // Add edit buttons to the initial table
  setTimeout(enhanceHeroTable, 500);
});
