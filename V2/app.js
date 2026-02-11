// --- Theme Management ---
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
    updateThemeButton();
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || getSystemTheme();
    applyTheme(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function updateThemeButton() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        const isDark = document.documentElement.classList.contains('dark-theme');
        btn.textContent = isDark ? '☀️' : '🌙';
    }
}

// --- Navigation Configuration ---
const routes = {
    '/V2/': 'pg-home.html',
    '/V2/about': 'pg-about.html',
    '/V2/projects': 'pg-projects.html',
    '/V2/socials': 'pg-socials.html'
};

const defaultAnimDuration = 300;

// --- Core Navigation Logic ---
function loadContent(pagePath) {
    const contentDiv = document.getElementById('content');
    
    fetch(pagePath)
        .then(res => {
            if (!res.ok) throw new Error('Page not found');
            return res.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
            window.scrollTo(0, 0); // Reset scroll to top
            updateThemeButton();   // Ensure icons match current theme
        })
        .catch(err => {
            console.error('Navigation Error:', err);
            contentDiv.innerHTML = '<div class="error-msg"><h2>404</h2><p>Page not found.</p></div>';
        });
}

function navigateTo(path) {
    const page = routes[path];
    if (page && window.location.pathname !== path) {
        history.pushState({ path }, '', path);
        loadContent(page);
    }
}

function loadFromPath() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const path = window.location.pathname;

    // 1. Handle the redirect parameter (e.g., ?page=socials)
    if (pageParam) {
        const routePath = '/V2/' + pageParam;
        if (routes[routePath]) {
            // Update URL to look clean (/V2/socials) without reloading
            history.replaceState({ path: routePath }, '', routePath);
            loadContent(routes[routePath]);
            return; // Exit early, we handled it
        }
    }

    // 2. Handle direct path or fallback
    const page = routes[path] || routes['/V2/'];
    
    // If we are on a weird path that isn't in routes, reset to home
    if (!routes[path]) {
        history.replaceState({ path: '/V2/' }, '', '/V2/');
    }
    
    loadContent(page);
}

// --- Modal Logic ---
function showOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.getElementById('options-container');
    
    fetch('options.html')
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
            modal.classList.remove('hidden');
            
            const win = container.querySelector('.window');
            if (win) {
                win.style.opacity = '0';
                win.style.transform = 'scale(0.94) perspective(1000px) rotateX(-10deg)';
                win.getBoundingClientRect(); // Force reflow
                win.style.transition = `transform ${defaultAnimDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${defaultAnimDuration}ms ease-in-out`;
                win.style.transform = 'none';
                win.style.opacity = '1';
            }
        });
}

function closeOptionsModal() {
    const modal = document.getElementById('options-modal');
    const win = modal.querySelector('.window');
    
    if (win) {
        win.style.transform = 'scale(0.94) perspective(1000px) rotateX(6deg)';
        win.style.opacity = '0';
        setTimeout(() => modal.classList.add('hidden'), defaultAnimDuration);
    } else {
        modal.classList.add('hidden');
    }
}

// --- Event Listeners ---

// 1. Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadFromPath();
});

// 2. Global Link Interceptor (Handles all <a> tags automatically)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        if (routes[href]) {
            e.preventDefault();
            navigateTo(href);
        }
    }
    
    // Handle modal overlay clicks
    if (e.target.classList.contains('modal-overlay')) {
        closeOptionsModal();
    }
});

// 3. Handle Browser Back/Forward
window.addEventListener('popstate', (e) => {
    loadFromPath();
});

// 4. Handle System Theme Changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});