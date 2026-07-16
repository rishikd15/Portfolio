const form = document.getElementById('achievementForm');
const container = document.getElementById('achievementsContainer');
const formCard = document.getElementById('formCard');
const categoryNotice = document.getElementById('categoryNotice');
const categorySelect = document.getElementById('category');
const subcategoryGroup = document.getElementById('subcategoryGroup');
const subcategorySelect = document.getElementById('subcategory');
const adminPortalBtn = document.getElementById('adminPortalBtn');

let currentTab = 'all';
let currentTheme = 'light';
const MASTER_ADMIN_KEY = 'carrotie';

let achievements = JSON.parse(localStorage.getItem('myRenamedAchievements')) || [
    {
        id: 1,
        title: "FLL Innovation Project Award",
        category: "robotics",
        subcategory: "fll",
        date: "Jan 2026",
        description: "Engineered high-torque custom gear assemblies and written responsive sensors algorithms in SPIKE Prime to streamline autonomous cargo movement during field runs."
    }
];

function verifyDeviceIdentity() {
    const isVerifiedAdmin = localStorage.getItem('portfolio_admin_active');
    if (isVerifiedAdmin === 'true') {
        document.body.className = 'admin-user';
        if (adminPortalBtn) adminPortalBtn.textContent = '🔓 Log Out Admin';
    } else {
        document.body.className = 'public-user';
        if (adminPortalBtn) adminPortalBtn.textContent = '🔒 Admin Login';
    }
}

if (adminPortalBtn) {
    adminPortalBtn.addEventListener('click', () => {
        const isVerifiedAdmin = localStorage.getItem('portfolio_admin_active') === 'true';
        if (isVerifiedAdmin) {
            localStorage.removeItem('portfolio_admin_active');
            alert("Logged out. Returning to secure public view.");
            verifyDeviceIdentity();
            renderAchievements();
        } else {
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

// Click trigger toggle to keep dropdown interactive on touch devices
window.toggleDropdownMenu = function(e) {
    e.stopPropagation();
    document.querySelector('.dropdown-wrapper').classList.toggle('open');
};

// Close dropdown if user clicks anywhere else on the blank layout page
document.addEventListener('click', () => {
    const wrapper = document.querySelector('.dropdown-wrapper');
    if (wrapper) wrapper.classList.remove('open');
});

window.handleCategoryChange = function(value) {
    if (value === 'robotics') {
        subcategoryGroup.style.display = 'block';
        subcategorySelect.required = true;
    } else {
        subcategoryGroup.style.display = 'none';
        subcategorySelect.required = false;
    }
};

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
    const filtered = currentTab === 'all' 
        ? achievements 
        : achievements.filter(item => item.category === currentTab || item.subcategory === currentTab);

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

        const subTagHtml = achievement.subcategory 
            ? `<span class="achievement-subcategory">${achievement.subcategory}</span>` 
            : '';

        card.innerHTML = `
            <div class="achievement-header">
                <div>
                    <span class="achievement-category">${achievement.category}</span>
                    ${subTagHtml}
                </div>
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
        categorySelect.value = 'school';
        handleCategoryChange('school');
        categoryNotice.style.display = 'none';
    } 
    else if (['robotics', 'fll', 'arduino', 'raspberry pi'].includes(currentTab)) {
        formCard.classList.add('auto-category');
        document.getElementById('categoryGroup').style.display = 'none';
        categoryNotice.style.display = 'block';
        categorySelect.required = false;
        subcategoryGroup.style.display = 'block';
        subcategorySelect.required = true;
        
        if (['fll', 'arduino', 'raspberry pi'].includes(currentTab)) {
            categoryNotice.textContent = `Targeting robotics context pipeline: ${currentTab.toUpperCase()}`;
            subcategorySelect.value = currentTab;
            subcategoryGroup.style.display = 'none';
        } else {
            categoryNotice.textContent = `Targeting pipeline stack auto-fill: robotics`;
            subcategorySelect.value = 'fll';
        }
    } 
    else {
        formCard.classList.add('auto-category');
        document.getElementById('categoryGroup').style.display = 'none';
        subcategoryGroup.style.display = 'none';
        subcategorySelect.required = false;
        categoryNotice.style.display = 'block';
        categoryNotice.textContent = `Targeting pipeline stack auto-fill: ${currentTab.toLowerCase()}`;
        categorySelect.required = false;
    }
}

function switchTab(tabName) {
    currentTab = tabName;
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const dropdownWrapper = document.querySelector('.dropdown-wrapper');
    if (dropdownWrapper) dropdownWrapper.classList.remove('active');

    buttons.forEach(btn => {
        if(btn.textContent.toLowerCase().replace(' ▾', '') === tabName) {
            btn.classList.add('active');
        }
    });

    if (['fll', 'arduino', 'raspberry pi', 'robotics'].includes(tabName) && dropdownWrapper) {
        dropdownWrapper.classList.add('active');
    }

    updateFormContext();
    renderAchievements();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    let category = categorySelect.value;
    if (['robotics', 'fll', 'arduino', 'raspberry pi'].includes(currentTab)) {
        category = 'robotics';
    } else if (currentTab !== 'all') {
        category = currentTab;
    }

    let subcategory = '';
    if (category === 'robotics') {
        subcategory = ['fll', 'arduino', 'raspberry pi'].includes(currentTab) ? currentTab : subcategorySelect.value;
    }

    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    
    const newAchievement = {
        id: Date.now(),
        title: title,
        category: category,
        subcategory: subcategory,
        date: date,
        description: description
    };
    
    achievements.push(newAchievement);
    localStorage.setItem('myRenamedAchievements', JSON.stringify(achievements));
    renderAchievements();
    form.reset();
    if(category === 'robotics') handleCategoryChange('robotics');
});

function deleteAchievement(id) {
    achievements = achievements.filter(item => item.id !== id);
    localStorage.setItem('myRenamedAchievements', JSON.stringify(achievements));
    renderAchievements();
}

renderAchievements();
