// ข้อมูลฮีโร่และสถิติตามตำแหน่ง
const heroData = {
    "DarkSlayer": [
        { name: "Florentino", winRate: 0.62, banRate: 0.43, image: "images/placeholder.png" },
        { name: "Lu Bu", winRate: 0.58, banRate: 0.25, image: "images/placeholder.png" },
        { name: "Qi", winRate: 0.54, banRate: 0.15, image: "images/placeholder.png" },
        { name: "Airi", winRate: 0.53, banRate: 0.18, image: "images/placeholder.png" },
        { name: "Veres", winRate: 0.52, banRate: 0.12, image: "images/placeholder.png" },
        { name: "Riktor", winRate: 0.51, banRate: 0.1, image: "images/placeholder.png" },
        { name: "Omen", winRate: 0.5, banRate: 0.05, image: "images/placeholder.png" },
        { name: "Yena", winRate: 0.49, banRate: 0.08, image: "images/placeholder.png" },
        { name: "Sikong Zhen", winRate: 0.52, banRate: 0.11, image: "images/placeholder.png" },
        { name: "Enzo", winRate: 0.51, banRate: 0.09, image: "images/placeholder.png" }
    ],
    "Farm": [
        { name: "Violet", winRate: 0.59, banRate: 0.32, image: "images/placeholder.png" },
        { name: "Elsu", winRate: 0.57, banRate: 0.27, image: "images/placeholder.png" },
        { name: "Hayate", winRate: 0.55, banRate: 0.33, image: "images/placeholder.png" },
        { name: "Tel'Annas", winRate: 0.53, banRate: 0.12, image: "images/placeholder.png" },
        { name: "Thorne", winRate: 0.52, banRate: 0.15, image: "images/placeholder.png" },
        { name: "Laville", winRate: 0.51, banRate: 0.08, image: "images/placeholder.png" },
        { name: "Capheny", winRate: 0.5, banRate: 0.1, image: "images/placeholder.png" },
        { name: "Valhein", winRate: 0.48, banRate: 0.05, image: "images/placeholder.png" },
        { name: "Yorn", winRate: 0.49, banRate: 0.07, image: "images/placeholder.png" },
        { name: "Slimz", winRate: 0.47, banRate: 0.04, image: "images/placeholder.png" }
    ],
    "Mid": [
        { name: "Tulen", winRate: 0.61, banRate: 0.35, image: "images/placeholder.png" },
        { name: "Lorion", winRate: 0.58, banRate: 0.38, image: "images/placeholder.png" },
        { name: "Zata", winRate: 0.56, banRate: 0.28, image: "images/placeholder.png" },
        { name: "Liliana", winRate: 0.54, banRate: 0.15, image: "images/placeholder.png" },
        { name: "Raz", winRate: 0.53, banRate: 0.12, image: "images/placeholder.png" },
        { name: "Lauriel", winRate: 0.52, banRate: 0.1, image: "images/placeholder.png" },
        { name: "Krixi", winRate: 0.51, banRate: 0.05, image: "images/placeholder.png" },
        { name: "Ignis", winRate: 0.48, banRate: 0.03, image: "images/placeholder.png" }
    ],
    "AbyssalDragon": [
        { name: "Paine", winRate: 0.6, banRate: 0.45, image: "images/placeholder.png" },
        { name: "Elandorr", winRate: 0.58, banRate: 0.35, image: "images/placeholder.png" },
        { name: "Kriknak", winRate: 0.55, banRate: 0.25, image: "images/placeholder.png" },
        { name: "Zephys", winRate: 0.54, banRate: 0.15, image: "images/placeholder.png" },
        { name: "Keera", winRate: 0.53, banRate: 0.28, image: "images/placeholder.png" },
        { name: "Nakroth", winRate: 0.52, banRate: 0.12, image: "images/placeholder.png" },
        { name: "Lindis", winRate: 0.5, banRate: 0.08, image: "images/placeholder.png" },
        { name: "Murad", winRate: 0.48, banRate: 0.1, image: "images/placeholder.png" },
        { name: "Moren", winRate: 0.48, banRate: 0.05, image: "images/placeholder.png" }
    ],
    "Support": [
        { name: "Zip", winRate: 0.63, banRate: 0.58, image: "images/placeholder.png" },
        { name: "Krizzix", winRate: 0.58, banRate: 0.32, image: "images/placeholder.png" },
        { name: "Baldum", winRate: 0.55, banRate: 0.15, image: "images/placeholder.png" },
        { name: "Teemee", winRate: 0.54, banRate: 0.18, image: "images/placeholder.png" },
        { name: "Alice", winRate: 0.52, banRate: 0.1, image: "images/placeholder.png" },
        { name: "Thane", winRate: 0.51, banRate: 0.05, image: "images/placeholder.png" },
        { name: "Annette", winRate: 0.5, banRate: 0.08, image: "images/placeholder.png" },
        { name: "Chaugnar", winRate: 0.48, banRate: 0.03, image: "images/placeholder.png" },
        { name: "Stuart", winRate: 0.49, banRate: 0.07, image: "images/placeholder.png" },
        { name: "Natalya", winRate: 0.46, banRate: 0.04, image: "images/placeholder.png" }
    ]
};

// สร้างคลาส ROV Draft Program
class ROVDraftProgram {
    constructor() {
        // ตัวแปรสำหรับเก็บสถานะการดราฟ
        this.selectedTeam = "";
        this.draftStep = "team"; // team, ban, pick, complete
        this.currentPickingTeam = "";
        this.selectedPosition = "";
        this.selectedHeroes = {
            "Team 1": {
                "DarkSlayer": null,
                "Farm": null,
                "Mid": null,
                "AbyssalDragon": null,
                "Support": null,
            },
            "Team 2": {
                "DarkSlayer": null,
                "Farm": null,
                "Mid": null,
                "AbyssalDragon": null,
                "Support": null,
            }
        };
        this.bannedHeroes = {
            "Team 1": [],
            "Team 2": []
        };
        this.pickOrder = [];
        this.currentPickIndex = 0;
        this.showRecommendations = false;
    }

    // เริ่มการดราฟด้วยการเลือกทีม
    startDraft(team) {
        this.selectedTeam = team;
        this.draftStep = "ban";
        this.currentPickingTeam = "Team 1"; // เริ่มด้วย Team 1 แบนก่อนเสมอ
        
        // กำหนดลำดับการเลือก
        this.pickOrder = [
            { team: "Team 1", count: 1 },
            { team: "Team 2", count: 2 },
            { team: "Team 1", count: 2 },
            { team: "Team 2", count: 2 },
            { team: "Team 1", count: 2 },
            { team: "Team 2", count: 1 }
        ];
        
        this.currentPickIndex = 0;
        
        // อัพเดท UI
        this.updateUI();
    }

    // แบนฮีโร่
    banHero(heroName) {
        if (this.bannedHeroes[this.currentPickingTeam].length >= 3) {
            // ทีมได้แบนครบ 3 ตัวแล้ว
            return false;
        }
        
        // ตรวจสอบว่าฮีโร่นี้ถูกแบนไปแล้วหรือไม่
        const allBannedHeroes = [...this.bannedHeroes["Team 1"], ...this.bannedHeroes["Team 2"]];
        if (allBannedHeroes.includes(heroName)) {
            return false;
        }
        
        // เพิ่มฮีโร่ในรายการแบน
        this.bannedHeroes[this.currentPickingTeam].push(heroName);

// สลับทีมสำหรับการแบน
        if (this.currentPickingTeam === "Team 1" && this.bannedHeroes["Team 1"].length < 3) {
            this.currentPickingTeam = "Team 2";
        } else if (this.currentPickingTeam === "Team 2" && this.bannedHeroes["Team 2"].length < 3) {
            this.currentPickingTeam = "Team 1";
        }
        
        // ตรวจสอบว่าการแบนเสร็จสิ้นหรือยัง
        if (this.bannedHeroes["Team 1"].length === 3 && this.bannedHeroes["Team 2"].length === 3) {
            this.draftStep = "pick";
            this.currentPickingTeam = "Team 1"; // เริ่ม Team 1 เลือกก่อน
        }
        
        // อัพเดท UI
        this.updateUI();
        return true;
    }

    // เลือกตำแหน่ง
    selectPosition(position) {
        if (this.selectedHeroes[this.currentPickingTeam][position] !== null) {
            // ตำแหน่งนี้ถูกเลือกไปแล้ว
            return false;
        }
        
        this.selectedPosition = position;
        this.updateUI();
        return true;
    }

    // เลือกฮีโร่
    selectHero(heroName) {
        if (!this.selectedPosition) {
            return false;
        }
        
        // ตรวจสอบว่าฮีโร่นี้ถูกเลือกหรือแบนไปแล้วหรือไม่
        const allBannedHeroes = [...this.bannedHeroes["Team 1"], ...this.bannedHeroes["Team 2"]];
        
        // ตรวจสอบฮีโร่ที่ถูกเลือกไปแล้ว
        let allSelectedHeroes = [];
        for (const team in this.selectedHeroes) {
            for (const pos in this.selectedHeroes[team]) {
                if (this.selectedHeroes[team][pos]) {
                    allSelectedHeroes.push(this.selectedHeroes[team][pos]);
                }
            }
        }
        
        if (allBannedHeroes.includes(heroName) || allSelectedHeroes.includes(heroName)) {
            return false;
        }
        
        // เลือกฮีโร่
        this.selectedHeroes[this.currentPickingTeam][this.selectedPosition] = heroName;
        this.selectedPosition = ""; // รีเซ็ตการเลือกตำแหน่ง
        
        // ตรวจสอบว่าทีมเลือกครบตามจำนวนที่กำหนดหรือยัง
        const currentPhase = this.pickOrder[this.currentPickIndex];
        let heroesPickedInCurrentPhase = 0;
        
        for (const pos in this.selectedHeroes[this.currentPickingTeam]) {
            if (this.selectedHeroes[this.currentPickingTeam][pos] !== null) {
                heroesPickedInCurrentPhase++;
            }
        }
        
        // ถ้าเลือกครบตามเฟสปัจจุบัน ให้เลื่อนไปเฟสถัดไป
        const previousHeroesPicked = currentPhase.count - (
            currentPhase.team === "Team 1" ? 
            5 - heroesPickedInCurrentPhase : 
            5 - heroesPickedInCurrentPhase
        );
        
        if (heroesPickedInCurrentPhase - previousHeroesPicked >= currentPhase.count) {
            this.currentPickIndex++;
            
            // ตรวจสอบว่าการดราฟเสร็จสิ้นหรือยัง
            if (this.currentPickIndex >= this.pickOrder.length) {
                this.draftStep = "complete";
            } else {
                this.currentPickingTeam = this.pickOrder[this.currentPickIndex].team;
            }
        }
        
        // อัพเดท UI
        this.updateUI();
        return true;
    }

    // คำนวณอัตราชนะของทีม
    calculateTeamWinRate(team) {
        let totalWinRate = 0;
        let heroCount = 0;
        
        for (const position in this.selectedHeroes[team]) {
            const heroName = this.selectedHeroes[team][position];
            if (heroName) {
                // หา win rate ของฮีโร่
                for (const pos in heroData) {
                    const hero = heroData[pos].find(h => h.name === heroName);
                    if (hero) {
                        totalWinRate += hero.winRate;
                        heroCount++;
                        break;
                    }
                }
            }
        }
        
        return heroCount > 0 ? (totalWinRate / heroCount) * 100 : 0;
    }

    // หาฮีโร่ที่แนะนำสำหรับตำแหน่งที่กำหนด
    getRecommendedHeroes(position) {
        // กรองฮีโร่ที่ไม่ถูกแบนหรือเลือก
        const allBannedHeroes = [...this.bannedHeroes["Team 1"], ...this.bannedHeroes["Team 2"]];
        
        let allSelectedHeroes = [];
        for (const team in this.selectedHeroes) {
            for (const pos in this.selectedHeroes[team]) {
                if (this.selectedHeroes[team][pos]) {
                    allSelectedHeroes.push(this.selectedHeroes[team][pos]);
                }
            }
        }
        
        const availableHeroes = heroData[position].filter(hero => {
            return !allBannedHeroes.includes(hero.name) && !allSelectedHeroes.includes(hero.name);
        });
        
        // เรียงตาม win rate
        availableHeroes.sort((a, b) => b.winRate - a.winRate);
        
        // ส่งคืน 3 อันดับแรก
        return availableHeroes.slice(0, 3);
    }

    // รีสตาร์ทการดราฟ
    restartDraft() {
        this.selectedTeam = "";
        this.draftStep = "team";
        this.currentPickingTeam = "";
        this.selectedPosition = "";
        this.selectedHeroes = {
            "Team 1": {
                "DarkSlayer": null,
                "Farm": null,
                "Mid": null,
                "AbyssalDragon": null,
                "Support": null,
            },
            "Team 2": {
                "DarkSlayer": null,
                "Farm": null,
                "Mid": null,
                "AbyssalDragon": null,
                "Support": null,
            }
        };
        this.bannedHeroes = {
            "Team 1": [],
            "Team 2": []
        };
        this.pickOrder = [];
        this.currentPickIndex = 0;
        
        // อัพเดท UI
        this.updateUI();
    }

    // ฟังก์ชันอัพเดท UI
    updateUI() {
        // อัพเดทตามสถานะปัจจุบัน - จะถูกโอเวอร์ไรด์ด้วยฟังก์ชันที่แยกต่างหาก
    }

    // ตรวจสอบว่าฮีโร่ถูกแนะนำหรือไม่
    isRecommendedHero(position, heroName) {
        if (!position) return false;
        
        const recommendedHeroes = this.getRecommendedHeroes(position);
        return recommendedHeroes.some(hero => hero.name === heroName);
    }

    // สลับการแสดงคำแนะนำ
    toggleRecommendations() {
        this.showRecommendations = !this.showRecommendations;
        this.updateUI();
    }
}

// --------- สคริปต์หลักเริ่มทำงานที่นี่ ---------
document.addEventListener('DOMContentLoaded', function() {
    // สร้างอินสแตนซ์ของโปรแกรม
    const draftProgram = new ROVDraftProgram();
    
    // ปุ่มเลือกทีม
    const team1Btn = document.getElementById('team1-btn');
    const team2Btn = document.getElementById('team2-btn');
    
    // ปุ่มสลับการแสดงคำแนะนำ
    const toggleRecommendationsBtn = document.getElementById('toggle-recommendations');
    
    // ปุ่มรีสตาร์ท
    const restartBtn = document.getElementById('restart-btn');
    
    // Event listeners
    team1Btn.addEventListener('click', () => draftProgram.startDraft('Team 1'));
    team2Btn.addEventListener('click', () => draftProgram.startDraft('Team 2'));
    toggleRecommendationsBtn.addEventListener('click', () => draftProgram.toggleRecommendations());
    restartBtn.addEventListener('click', () => draftProgram.restartDraft());
    
    // โอเวอร์ไรด์ฟังก์ชันอัพเดท UI
    draftProgram.updateUI = function() {
        // อัพเดทสถานะดราฟ
        const draftStatus = document.getElementById('draft-status');
        const teamSelectionSection = document.getElementById('team-selection');
        const draftInterface = document.getElementById('draft-interface');
        const banPhase = document.getElementById('ban-phase');
        const pickPhase = document.getElementById('pick-phase');
        const completePhase = document.getElementById('complete-phase');
        
        // ซ่อนทุกเฟส
        teamSelectionSection.classList.add('hidden');
        draftInterface.classList.add('hidden');
        banPhase.classList.add('hidden');
        pickPhase.classList.add('hidden');
        completePhase.classList.add('hidden');
        
        // แสดงเฟสปัจจุบัน
        if (this.draftStep === 'team') {
            teamSelectionSection.classList.remove('hidden');
            draftStatus.textContent = 'เลือกทีมของคุณ';
        } else {
            draftInterface.classList.remove('hidden');
            
            if (this.draftStep === 'ban') {
                banPhase.classList.remove('hidden');
                draftStatus.textContent = `ขั้นตอนการแบนฮีโร่ (${this.currentPickingTeam})`;
                
                // อัพเดทชื่อทีมที่กำลังแบน
                const banningTeam = document.getElementById('banning-team');
                banningTeam.textContent = this.currentPickingTeam;
                banningTeam.className = this.currentPickingTeam === 'Team 1' ? 'team1-text' : 'team2-text';
                
                // แสดงฮีโร่สำหรับแบน
                this.renderBanHeroes();
            } else if (this.draftStep === 'pick') {
                pickPhase.classList.remove('hidden');
                draftStatus.textContent = `ขั้นตอนการเลือกฮีโร่ (${this.currentPickingTeam})`;
                
                // อัพเดทชื่อทีมที่กำลังเลือก
                const pickingTeam = document.getElementById('picking-team');
                pickingTeam.textContent = this.currentPickingTeam;
                pickingTeam.className = this.currentPickingTeam === 'Team 1' ? 'team1-text' : 'team2-text';
                
                // แสดงตำแหน่งสำหรับเลือก
                this.renderPositionButtons();
                
                // แสดงฮีโร่สำหรับเลือก
                if (this.selectedPosition) {
                    this.renderHeroSelection();
                }
                
                // แสดง/ซ่อนคำแนะนำ
                const recommendationsPanel = document.getElementById('recommendations');
                if (this.showRecommendations && this.selectedPosition) {
                    recommendationsPanel.classList.remove('hidden');
                    document.getElementById('recommended-position').textContent = this.selectedPosition;
                    this.renderRecommendedHeroes();
                } else {
                    recommendationsPanel.classList.add('hidden');
                }
                
                // อัพเดทข้อความปุ่มแสดงคำแนะนำ
                toggleRecommendationsBtn.textContent = this.showRecommendations ? 'Hide Recommendations' : 'Show Recommendations';
            } else if (this.draftStep === 'complete') {
                completePhase.classList.remove('hidden');
                draftStatus.textContent = 'การดราฟเสร็จสิ้น';
                
                // แสดงสรุปผลการดราฟ
                this.renderDraftSummary();
            }
            
            // อัพเดททีมที่เลือก
            const teamName = document.getElementById('team-name');
            teamName.textContent = this.selectedTeam;
            
            const selectedTeamPanel = document.getElementById('selected-team-panel');
            selectedTeamPanel.className = `panel ${this.selectedTeam === 'Team 1' ? 'team1-bg' : 'team2-bg'}`;
            
            // อัพเดทตำแหน่งในทีม
            this.renderTeamPositions();
            
            // อัพเดทสถานะการแบน
            this.renderBanStatus();
            
            // อัพเดทการทำนายอัตราชนะ
            const winRatePrediction = document.getElementById('win-rate-prediction');
            winRatePrediction.textContent = `${this.calculateTeamWinRate(this.selectedTeam).toFixed(1)}%`;
        }
    };
    
    // แสดงตำแหน่งในทีม
    draftProgram.renderTeamPositions = function() {
        const teamPositions = document.getElementById('team-positions');
        teamPositions.innerHTML = '';
        
        for (const position in this.selectedHeroes[this.selectedTeam]) {
            const heroName = this.selectedHeroes[this.selectedTeam][position];
            const positionItem = document.createElement('div');
            positionItem.className = 'position-item';
            
            const positionName = document.createElement('div');
            positionName.className = 'position-name';
            positionName.textContent = position;
            
            const heroNameElement = document.createElement('div');
            if (heroName) {
                heroNameElement.className = 'hero-name';
                heroNameElement.textContent = heroName;
            } else {
                heroNameElement.className = 'not-selected';
                heroNameElement.textContent = 'Not selected';
            }
            
            positionItem.appendChild(positionName);
            positionItem.appendChild(heroNameElement);
            teamPositions.appendChild(positionItem);
        }
    };
    
    // แสดงสถานะการแบน
    draftProgram.renderBanStatus = function() {
        const team1Bans = document.getElementById('team1-bans');
        const team2Bans = document.getElementById('team2-bans');
        
        team1Bans.innerHTML = '';
        team2Bans.innerHTML = '';
        
        // ตรวจสอบว่ามีการแบนกี่ตัว
        const maxBans = 3;
        
        // แสดงการแบนของ Team 1
        for (let i = 0; i < maxBans; i++) {
            const banSlot = document.createElement('div');
            banSlot.className = 'ban-slot';
            
            if (this.bannedHeroes['Team 1'][i]) {
                banSlot.textContent = this.bannedHeroes['Team 1'][i];
            } else {
                banSlot.textContent = 'Not banned';
                banSlot.className += ' not-selected';
            }
            
            team1Bans.appendChild(banSlot);
        }
        
        // แสดงการแบนของ Team 2
        for (let i = 0; i < maxBans; i++) {
            const banSlot = document.createElement('div');
            banSlot.className = 'ban-slot';
            
            if (this.bannedHeroes['Team 2'][i]) {
                banSlot.textContent = this.bannedHeroes['Team 2'][i];
            } else {
                banSlot.textContent = 'Not banned';
                banSlot.className += ' not-selected';
            }
            
            team2Bans.appendChild(banSlot);
        }
    };
    
    // แสดงฮีโร่สำหรับแบน
    draftProgram.renderBanHeroes = function() {
        const banHeroes = document.getElementById('ban-heroes');
        banHeroes.innerHTML = '';
        
        // รวมรายการฮีโร่ทั้งหมด
        const allHeroes = [];
        for (const position in heroData) {
            heroData[position].forEach(hero => {
                allHeroes.push({...hero, position});
            });
        }
        
        // เรียงตาม ban rate และ win rate
        allHeroes.sort((a, b) => {
            // คำนวณคะแนนจาก ban rate และ win rate
            const scoreA = a.banRate * 0.7 + a.winRate * 0.3;
            const scoreB = b.banRate * 0.7 + b.winRate * 0.3;
            return scoreB - scoreA;
        });
        
        // แสดงฮีโร่ที่ควรแบน
        allHeroes.forEach(hero => {
            const isBanned = [...this.bannedHeroes['Team 1'], ...this.bannedHeroes['Team 2']].includes(hero.name);
            
            const heroCard = document.createElement('div');
            heroCard.className = `hero-card ${isBanned ? 'disabled' : ''}`;
            if (!isBanned) {
                heroCard.addEventListener('click', () => this.banHero(hero.name));
            }
            
            const heroImage = document.createElement('div');
            heroImage.className = 'hero-image';
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = hero.name;
            heroImage.appendChild(img);
            
            const heroName = document.createElement('div');
            heroName.className = 'hero-name';
            heroName.textContent = hero.name;
            
            const heroStats = document.createElement('div');
            heroStats.className = 'hero-stats';
            
            const winRate = document.createElement('div');
            winRate.className = 'win-rate';
            winRate.textContent = `Win: ${(hero.winRate * 100).toFixed(1)}%`;
            
            const banRate = document.createElement('div');
            banRate.className = 'ban-rate';
            banRate.textContent = `Ban: ${(hero.banRate * 100).toFixed(1)}%`;
            
            heroStats.appendChild(winRate);
            heroStats.appendChild(banRate);
            
            heroCard.appendChild(heroImage);
            heroCard.appendChild(heroName);
            heroCard.appendChild(heroStats);
            
            banHeroes.appendChild(heroCard);
        });
    };
    
    // แสดงปุ่มตำแหน่ง
    draftProgram.renderPositionButtons = function() {
        const positionSelection = document.getElementById('position-selection');
        positionSelection.innerHTML = '';
        
        for (const position in this.selectedHeroes[this.currentPickingTeam]) {
            const isSelected = position === this.selectedPosition;
            const isFilled = this.selectedHeroes[this.currentPickingTeam][position] !== null;
            
            const positionBtn = document.createElement('div');
            positionBtn.className = `position-btn ${isSelected ? 'selected' : ''} ${isFilled ? 'filled' : ''}`;
            
            if (!isFilled) {
                positionBtn.addEventListener('click', () => this.selectPosition(position));
            }
            
            const positionName = document.createElement('div');
            positionName.textContent = position;
            positionBtn.appendChild(positionName);
            
            if (isFilled) {
                const selectedHero = document.createElement('div');
                selectedHero.className = 'selected-hero';
                selectedHero.textContent = this.selectedHeroes[this.currentPickingTeam][position];
                positionBtn.appendChild(selectedHero);
            }
            
            positionSelection.appendChild(positionBtn);
        }
    };
    
    // แสดงฮีโร่สำหรับเลือก
    draftProgram.renderHeroSelection = function() {
        const heroSelection = document.getElementById('hero-selection');
        heroSelection.innerHTML = '';
        
        if (!this.selectedPosition) return;
        
        // กรองฮีโร่ที่สามารถเลือกได้
        const allBannedHeroes = [...this.bannedHeroes['Team 1'], ...this.bannedHeroes['Team 2']];
        
        let allSelectedHeroes = [];
        for (const team in this.selectedHeroes) {
            for (const pos in this.selectedHeroes[team]) {
                if (this.selectedHeroes[team][pos]) {
                    allSelectedHeroes.push(this.selectedHeroes[team][pos]);
                }
            }
        }
        
        // แสดงฮีโร่ในตำแหน่งที่เลือก
        heroData[this.selectedPosition].forEach(hero => {
            const isBanned = allBannedHeroes.includes(hero.name);
            const isPicked = allSelectedHeroes.includes(hero.name);
            const isRecommended = this.isRecommendedHero(this.selectedPosition, hero.name);
            
            const heroCard = document.createElement('div');
            heroCard.className = `hero-card ${(isBanned || isPicked) ? 'disabled' : ''} ${isRecommended ? 'recommended' : ''}`;
            
            if (!isBanned && !isPicked) {
                heroCard.addEventListener('click', () => this.selectHero(hero.name));
            }
            
            const heroImage = document.createElement('div');
            heroImage.className = 'hero-image';
            const img = document.createElement('img');
            img.src = hero.image;
            img.alt = hero.name;
            heroImage.appendChild(img);
            
            const heroName = document.createElement('div');
            heroName.className = 'hero-name';
            heroName.textContent = hero.name;
            
            const heroStats = document.createElement('div');
            heroStats.className = 'hero-stats';
            
            const winRate = document.createElement('div');
            winRate.className = 'win-rate';
            winRate.textContent = `Win: ${(hero.winRate * 100).toFixed(1)}%`;
            
            heroStats.appendChild(winRate);
            
            heroCard.appendChild(heroImage);
            heroCard.appendChild(heroName);
            heroCard.appendChild(heroStats);
            
            if (isRecommended) {
                const recommendedTag = document.createElement('div');
                recommendedTag.className = 'recommended-tag';
                recommendedTag.textContent = '★ Recommended';
                heroCard.appendChild(recommendedTag);
            }
            
            heroSelection.appendChild(heroCard);
        });
    };
    
    // แสดงฮีโร่ที่แนะนำ
    draftProgram.renderRecommendedHeroes = function() {
        const recommendedHeroes = document.getElementById('recommended-heroes');
        recommendedHeroes.innerHTML = '';
        
        if (!this.selectedPosition) return;
        
        const recommendations = this.getRecommendedHeroes(this.selectedPosition);
        
        recommendations.forEach(hero => {
            const recommendation = document.createElement('div');
            recommendation.className = 'recommendation';
            
            const heroName = document.createElement('div');
            heroName.textContent = hero.name;
            
            const winRate = document.createElement('div');
            winRate.className = 'win-rate';
            winRate.textContent = `Win: ${(hero.winRate * 100).toFixed(1)}%`;
            
            recommendation.appendChild(heroName);
            recommendation.appendChild(winRate);
            
            recommendedHeroes.appendChild(recommendation);
        });
    };
    
    // แสดงสรุปผลการดราฟ
    draftProgram.renderDraftSummary = function() {
        // อัพเดทอัตราชนะของทั้งสองทีม
        const team1WinRate = document.getElementById('team1-win-rate');
        const team2WinRate = document.getElementById('team2-win-rate');
        
        team1WinRate.textContent = `${this.calculateTeamWinRate('Team 1').toFixed(1)}%`;
        team2WinRate.textContent = `${this.calculateTeamWinRate('Team 2').toFixed(1)}%`;
        
        // แสดงฮีโร่ที่เลือกของแต่ละทีม
        const team1Summary = document.getElementById('team1-summary');
        const team2Summary = document.getElementById('team2-summary');
        
        team1Summary.innerHTML = '';
        team2Summary.innerHTML = '';
        
        for (const position in this.selectedHeroes['Team 1']) {
            const heroName = this.selectedHeroes['Team 1'][position];
            const heroSummaryItem = document.createElement('div');
            heroSummaryItem.className = 'hero-summary-item';
            
            const positionName = document.createElement('div');
            positionName.textContent = position;
            
            const heroNameElement = document.createElement('div');
            heroNameElement.textContent = heroName;
            
            heroSummaryItem.appendChild(positionName);
            heroSummaryItem.appendChild(heroNameElement);
            
            team1Summary.appendChild(heroSummaryItem);
        }
        
        for (const position in this.selectedHeroes['Team 2']) {
            const heroName = this.selectedHeroes['Team 2'][position];
            const heroSummaryItem = document.createElement('div');
            heroSummaryItem.className = 'hero-summary-item';
            
            const positionName = document.createElement('div');
            positionName.textContent = position;
            
            const heroNameElement = document.createElement('div');
            heroNameElement.textContent = heroName;
            
            heroSummaryItem.appendChild(positionName);
            heroSummaryItem.appendChild(heroNameElement);
            
            team2Summary.appendChild(heroSummaryItem);
        }
        
        // แสดงฮีโร่ที่แบนของแต่ละทีม
        const team1SummaryBans = document.getElementById('team1-summary-bans');
        const team2SummaryBans = document.getElementById('team2-summary-bans');
        
        team1SummaryBans.innerHTML = '';
        team2SummaryBans.innerHTML = '';
        
        this.bannedHeroes['Team 1'].forEach(heroName => {
            const bannedHero = document.createElement('div');
            bannedHero.className = 'banned-hero';
            bannedHero.textContent = heroName;
            team1SummaryBans.appendChild(bannedHero);
        });
        
        this.bannedHeroes['Team 2'].forEach(heroName => {
            const bannedHero = document.createElement('div');
            bannedHero.className = 'banned-hero';
            bannedHero.textContent = heroName;
            team2SummaryBans.appendChild(bannedHero);
        });
        
        // แสดงทีมที่น่าจะชนะ
        const predictedWinner = document.getElementById('predicted-winner');
        const team1WinRateValue = this.calculateTeamWinRate('Team 1');
        const team2WinRateValue = this.calculateTeamWinRate('Team 2');
        
        if (team1WinRateValue > team2WinRateValue) {
            predictedWinner.textContent = 'Team 1';
            predictedWinner.className = 'team1-text';
        } else {
            predictedWinner.textContent = 'Team 2';
            predictedWinner.className = 'team2-text';
        }
    };
    
    // เริ่มแสดง UI
    draftProgram.updateUI();
});