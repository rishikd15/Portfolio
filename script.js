const form = document.getElementById('achievementForm');
const container = document.getElementById('achievementsContainer');
const formCard = document.getElementById('formCard');
const categoryNotice = document.getElementById('categoryNotice');
const categorySelect = document.getElementById('category');
const adminPortalBtn = document.getElementById('adminPortalBtn');

let currentTab = 'all';
let currentTheme = 'light';

// SECRET PASSWORD
const MASTER_ADMIN_KEY = 'robotics123';

let achievements = JSON.parse(localStorage.getItem('myRenamedAchievements')) || [
    {
        id: 1,
        title: "FLL Innovation Project Award",
        category: "fll",
        date: "Jan 2026",
        description: "Engineered high-torque custom gear assemblies and written responsive sensors algorithms in SPIKE Prime to streamline autonomous cargo movement during field runs."
    }
];

function verifyDeviceIdentity() {
    const isVerifiedAdmin = localStorage.getItem('portfolio_admin_active');
    if (isVerifiedAdmin === 'true') {
        document.body.className = 'admin-user';
        if (adminPortalBtn) adminPortalBtn.textContent = '¼ Log Out Admin';
    } else {
        document.body.className = 'public-user';
        if (adminPortalBtn) adminPortalBtn.textContent = '🔒 Admin Login';
    }
}

// FIXED: Bulletproof Event Listener attached cleanly inside the JS context
if (adminPortalBtn) {
    adminPortalBtn.addEventListener('click', () => {
        const isVerifiedAdmin = localStorage.getItem('portfolio_admin_active') === 'true';
        
        if (isVerifiedAdmin) {
            // Log Out Logic
            localStorage.removeItem('portfolio_admin_active');
            alert("Logged out. Returning to secure public view.");
            verifyDeviceIdentity();
            renderAchievements();
        } else {
            // Log In Logic
            const userInput = prompt("Enter Master Administrative Security Key:");
            if (userInput === MASTER_ADMIN_KEY) {
                localStorage.setItem('portfolio_admin_active', 'true');
                alert("Authenticated successfully! Admin dashboard unlocked.");
                verifyDeviceIdentity();
                renderAchievements();
            } else if (userInput !== null) {
                alert("Invalid security authentication key signature.");
            }
        }
    });
}

verifyDeviceIdentity();

function setTheme(mode) {
    currentTheme = mode;
    if (mode === 'dark') {
        document.documentElement.className = 'dark-theme-override';
    } else {
        document.documentElement.className = '';
    }
}

function toggleThemeManual() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function matchSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}
matchSystemTheme();

function renderAchievements() {
    container.innerHTML = '';
    const filtered = currentTab === 'all' ? achievements : achievements.filter(item => item.category === currentTab);
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">No technical entries deployed to this stack view.</div>';
        return;
    }
    
    const isVerifiedAdmin = localStorage.getItem('portfolio_admin_active') === 'true';

    filtered.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.category}`;
        
        const deleteButtonHtml = isVerifiedAdmin 
            ? `<button class="delete-btn" onclick="deleteAchievement(${achievement.id})">Decommission</button>` 
            : '';

        card.innerHTML = `
            <div class="achievement-header">
                <span class="achievement-category">${achievement.category}</span>
                <div class="achievement-date">${achievement.date}</div>
            </div>
            <h3 class="achievement-title">${achievement.title}</h3>
            <p class="achievement-desc">${achievement.description}</p>
            ${deleteButtonHtml}
        `;
        container.appendChild(card);
    });
}

function updateFormContext() {
    if (currentTab === 'all') {
        formCard.classList.remove('auto-category');
        document.getElementById('categoryGroup').style.display = 'block';
        categorySelect.required = true;
        categoryNotice.style.display = 'none';
    } else {
        formCard.classList.add('auto-category');
        document.getElementById('categoryGroup').style.display = 'none';
        categoryNotice.style.display = 'block';
        categoryNotice.textContent = `Targeting pipeline stack auto-fill: ${currentTab.toLowerCase()}`;
        categorySelect.required = false;
    }
}

function switchTab(tabName) {
    currentTab = tabName;
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.toLowerCase() === tabName) {
            btn.classList.add('active');
        }
    });
    updateFormContext();
    renderAchievements();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const category = currentTab === 'all' ? categorySelect.value : currentTab;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const newAchievement = {
        id: Date.now(),
        title: title,
        category: category,
        date: date,
        description: description
    };
    achievements.push(newAchievement);
    localStorage.setItem('myRenamedAchievements', JSON.stringify(achievements));
    renderAchievements();
    form.reset();
});

function deleteAchievement(id) {
    achievements = achievements.filter(item => item.id !== id);
    localStorage.setItem('myRenamedAchievements', JSON.stringify(achievements));
    renderAchievements();
}

renderAchievements();
