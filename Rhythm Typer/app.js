const routes = {
    'Rhythm Typer/': 'home.html',
    'Rhythm Typer/#play': 'home-play.html',
    'Rhythm Typer/Song Select': 'songselect.html',
    'Rhythm Typer/Editor': 'editor.html'
};

// Load HTML into #content
function loadContent(page) {
    // Use a path relative to the site root if possible, or adjust based on folder
    fetch(page)
        .then(res => {
            if (!res.ok) throw new Error(`Could not find ${page}`);
            return res.text();
        })
        .then(html => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = html;
            // ... rest of your logic
        })
        .catch(err => {
            console.error(err);
            document.getElementById('content').innerHTML = '<h1>Error loading page.</h1>';
        });
}

// Load sidebar on page initialization
function loadSidebar() {
    fetch('settingssidebar.html')
        .then(res => {
            if (!res.ok) throw new Error(`Could not find settingssidebar.html`);
            return res.text();
        })
        .then(html => {
            const body = document.body;
            const overlay = document.createElement('div');
            overlay.id = 'settings-overlay';
            overlay.className = 'Settings-Overlay';
            
            const sidebar = document.createElement('div');
            sidebar.id = 'settings-sidebar';
            sidebar.className = 'Settings-Sidebar';
            sidebar.innerHTML = html;
            
            body.insertBefore(overlay, body.firstChild);
            body.insertBefore(sidebar, body.firstChild);
        })
        .catch(err => console.error('Error loading sidebar:', err));
}

// Settings Sidebar Management
function openSettingsSidebar() {
    const sidebar = document.getElementById('settings-sidebar');
    const overlay = document.getElementById('settings-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
}

function closeSettingsSidebar() {
    const sidebar = document.getElementById('settings-sidebar');
    const overlay = document.getElementById('settings-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

// Close sidebar when clicking overlay
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('settings-overlay');
    if (e.target === overlay) {
        closeSettingsSidebar();
    }
});

// Settings button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.Header-Settings') || e.target.closest('.Settings-Button')) {
        openSettingsSidebar();
    }
});

// Home button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.Header-Home')) {
        goToHome();
    }
});

function goToHome() {
    navigateTo('Rhythm Typer/');
}

// Play button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.Play-Button')) {
        goToPlayMenu();
    }
});

function goToPlayMenu() {
    navigateTo('Rhythm Typer/#play');
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.Single-Player-Button')) {
        goToSongSelect();
    }
});

function goToSongSelect() {
    // This matches the key in the 'routes' object
    navigateTo('Rhythm Typer/Song Select');
}

// Editor button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.Editor-Button')) {
        goToEditor();
    }
});

function goToEditor() {
    // This matches the key in the 'routes' object
    navigateTo('Rhythm Typer/Editor');
}


// Navigate programmatically
function navigateTo(path) {
    const page = routes[path];
    if (page) {
        loadContent(page);
        history.pushState(null, '', '/' + path);
    }
}

// Load page based on URL or query parameter
function loadFromPath() {
    // This converts "%20" back to a space so it matches your keys
    const rawPath = window.location.pathname;
    const path = decodeURIComponent(rawPath);
    
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');

    if (pageParam) {
        const routePath = 'Rhythm Typer/' + pageParam;
        if (routes[routePath]) {
            loadContent(routes[routePath]);
            history.replaceState(null, '', '/' + routePath);
            return;
        }
    }

    // Clean up path: remove leading slash for matching
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    if (routes[cleanPath]) {
        loadContent(routes[cleanPath]);
    } else if (routes[path]) {
        loadContent(routes[path]);
    } else {
        // Fallback: If nothing matches, just load home.html
        loadContent('home.html');
    }
}

// Initial load
window.addEventListener('load', () => {
    loadSidebar();
    loadFromPath();
});

// Back/forward buttons
window.addEventListener('popstate', loadFromPath);
