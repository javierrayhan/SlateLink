/* ==================== UTILS ==================== */

function copyToClipboardFallback(text) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; 
        textArea.style.opacity = "0";
        document.body.appendChild(textArea); 
        textArea.select();
        document.execCommand("copy"); 
        document.body.removeChild(textArea);
        return true;
    } catch (err) {
        return false;
    }
}

/* ==================== BOOTSTRAP CONFIGS ==================== */

// 1. Accessibility Override
if (config.features.accessibility?.reducedMotion) {
    document.body.classList.add('reduced-motion');
}

// 2. SECURITY ENGINE (Zero-Trust Domain Lock)
if (config.features.security?.domainLock) {
    const currentDomain = window.location.hostname;
    // Check if the current domain exists in the allowed array
    const isAllowedDomain = config.features.security.allowedDomains.includes(currentDomain);
    
    if (!isAllowedDomain) {
        console.warn(`SECURITY ALERT: Unauthorized hosting detected on domain: ${currentDomain}`);
        // 1. Forcefully revoke the verified badge
        config.features.verified = false; 
        
        // 2. Inject sleek Apple-style spoof warning pill
        if (config.features.security.spoofWarning) {
            const bannerAnchor = document.getElementById('securityBannerAnchor');
            const realUrl = config.features.security.officialUrl || '#';
            
            bannerAnchor.innerHTML = `
                <a href="${realUrl}" class="apple-spoof-pill">
                    <i class="ph-fill ph-warning-circle warning-icon"></i>
                    <span>Unofficial link. Tap to verify.</span>
                    <i class="ph-bold ph-caret-right arrow-icon"></i>
                </a>
            `;
        }
    }
}

// 3. Theme Engine (Light/Dark Mode via Switch/Button)
const themeToggleWrapper = document.getElementById('themeToggleWrapper');

// Dynamically generate the button or switch based on config
if (config.features.theme?.toggleEnabled) {
    const style = config.features.theme.toggleStyle || 'button';
    const pos = config.features.theme.togglePosition || 'top-left';
    
    themeToggleWrapper.style.display = 'flex';
    
    if (style === 'switch') {
        themeToggleWrapper.className = `fab-switch pos-${pos}`;
        themeToggleWrapper.innerHTML = `
            <div class="fab-switch-track">
                <!-- FIXED: Swapped the track icons so it perfectly matches the sliding state -->
                <i class="ph-bold ph-moon"></i>
                <i class="ph-bold ph-sun"></i>
            </div>
            <div class="fab-switch-thumb" id="themeToggleThumb">
                <i class="ph-bold ph-moon" id="themeToggleIcon"></i>
            </div>
        `;
    } else {
        themeToggleWrapper.className = `fab-btn pos-${pos}`;
        themeToggleWrapper.innerHTML = `<i class="ph-bold ph-moon" id="themeToggleIcon"></i>`;
    }
}

function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    
    const themeToggleIcon = document.getElementById('themeToggleIcon');
    if (themeToggleIcon) {
        if (themeName === 'light') {
            themeToggleIcon.className = 'ph-bold ph-sun';
        } else {
            themeToggleIcon.className = 'ph-bold ph-moon';
        }
    }
}

let currentTheme = config.features.theme?.defaultTheme || 'dark';
const savedTheme = localStorage.getItem('biolink-theme');
if (savedTheme) {
    currentTheme = savedTheme;
}
applyTheme(currentTheme);

if (config.features.theme?.toggleEnabled) {
    themeToggleWrapper.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('biolink-theme', currentTheme); 
    });
}

// 4. Share Button Initialization
const shareBtn = document.getElementById('shareBtn');
if (config.features.share?.enabled) {
    shareBtn.style.display = 'flex';
    const pos = config.features.share.position || 'top-right';
    shareBtn.classList.add(`pos-${pos}`);
}

/* ==================== UI LOGIC ==================== */

// Render Profile
document.getElementById('profileName').textContent = config.profile.name;
document.getElementById('profileRole').textContent = config.profile.role;
document.getElementById('statusText').textContent = config.profile.status;
const img = document.getElementById('profileImage');
img.src = config.profile.image;
img.onerror = () => {
    img.src = 'https://ui-avatars.com/api/?name=Javier+Rayhan&background=101011&color=EABE7C';
};

// Render Verified Badge (Checks the config AFTER the security engine runs)
if (config.features.verified) {
    document.getElementById('verifiedBadge').style.display = 'inline-block';
}

// Render Socials
const socialRow = document.getElementById('socialRow');
config.socials.forEach(s => {
    const el = document.createElement(s.type === 'link' ? 'a' : 'div');
    el.className = 'social-link';
    el.innerHTML = `<i class="ph-fill ph-${s.icon}"></i>`;
    
    if (s.type === 'link') {
        el.href = s.url; 
        el.target = "_blank";
    } else {
        el.style.cursor = "pointer";
        el.onclick = () => { 
            copyToClipboardFallback(s.url); 
            showToast('Copied to clipboard'); 
        };
    }
    socialRow.appendChild(el);
});

// Render Tabs
function initTabs() {
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = ''; 
    
    config.tabs.forEach((tab, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = tab.label;
        btn.onclick = function() { switchTab(tab.id, this); };
        tabsContainer.appendChild(btn);
    });
}

// Render Content Area
const contentArea = document.getElementById('contentArea');

function createCard(item, delay) {
    const card = document.createElement('a');
    card.href = item.url;
    card.className = 'list-card' + (item.highlighted ? ' highlighted' : '');
    card.style.animationDelay = delay + 's';
    
    card.innerHTML = `
        <div class="card-content">
            <div class="card-icon"><i class="ph-fill ph-${item.icon}"></i></div>
            <div class="card-text">
                <div class="card-title-row"><div class="card-title">${item.title}</div></div>
                ${item.desc ? `<div class="card-desc">${item.desc}</div>` : ''}
            </div>
        </div>
        <div class="card-arrow"><i class="ph-bold ph-arrow-right"></i></div>
    `;
    return card;
}

function createHeader(text, delay) {
    const div = document.createElement('div');
    div.className = 'section-label'; div.innerText = text; div.style.animationDelay = delay + 's';
    return div;
}

function render(type) {
    contentArea.innerHTML = '';
    if (!config[type]) return;
    
    const data = config[type];
    if (data.length > 0 && data[0].category) {
        let delay = 0.1;
        data.forEach(group => {
            contentArea.appendChild(createHeader(group.category, delay)); delay += 0.05;
            group.items.forEach(item => { contentArea.appendChild(createCard(item, delay)); delay += 0.05; });
        });
    } else {
        const sortedData = [...data].sort((a, b) => (b.highlighted === true ? 1 : 0) - (a.highlighted === true ? 1 : 0));
        sortedData.forEach((item, index) => { contentArea.appendChild(createCard(item, (index * 0.05) + 0.1)); });
    }
}

// Tab Switching
window.switchTab = function(type, btnElement) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    render(type);
}

// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); }, 2500);
}

// Web Share API
async function shareProfile() {
    const shareData = { title: config.features.share?.title, text: config.features.share?.text, url: window.location.href };
    try {
        if (navigator.share) await navigator.share(shareData);
        else throw new Error('Web Share API not supported');
    } catch (err) {
        copyToClipboardFallback(window.location.href); showToast('Link copied to clipboard!');
    }
}

// Bootstrap App
initTabs(); 
if (config.tabs && config.tabs.length > 0) render(config.tabs[0].id); 
