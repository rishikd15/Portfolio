const form = document.getElementById('achievementForm');
const container = document.getElementById('achievementsContainer');
const formCard = document.getElementById('formCard');
const categoryNotice = document.getElementById('categoryNotice');
const categorySelect = document.getElementById('category');

let currentTab = 'all';
let currentTheme = 'light';

let achievements = JSON.parse(localStorage.getItem('myRenamedAchievements')) || [
    {
        id: 1,
        title: "FLL Innovation Project Award",
        category: "fll",
        date: "Jan 2026",
        description: "Engineered high-torque custom gear assemblies and written responsive sensors algorithms in SPIKE Prime to streamline autonomous cargo movement during field runs."
    }
];

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

// Automatically syncs to user's standard Mac System Settings (Light/Dark) safely
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
    filtered.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.category}`;
        card.innerHTML = `
            <div class="achievement-header">
                <span class="achievement-category">${achievement.category}</span>
                <div class="achievement-date">${achievement.date}</div>
            </div>
            <h3 class="achievement-title">${achievement.title}</h3>
            <p class="achievement-desc">${achievement.description}</p>
            <button class="delete-btn" onclick="deleteAchievement(${achievement.id})">Decommission</button>
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
