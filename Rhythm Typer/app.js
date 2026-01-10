const routes = {
    'Rhythm Typer/': 'home.html',
    'Rhythm Typer/#play': 'home-play.html',
    'Rhythm Typer/Song Select': 'songselect.html',
    'Rhythm Typer/Editor': 'editor.html'
};

// Load HTML into #content
function loadContent(page) {
    fetch(page)
        .then(res => {
            if (!res.ok) throw new Error(`Could not find ${page}`);
            return res.text();
        })
        .then(html => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            document.getElementById('content').innerHTML = '<h1>Error loading page.</h1>';
        });
}

// Load Settings Modal (Popup) on page initialization
function loadSettingsModal() {
    // UPDATED: Loading v2 file
    fetch('settingssidebarv2.html')
        .then(res => {
            if (!res.ok) throw new Error(`Could not find settingssidebarv2.html`);
            return res.text();
        })
        .then(html => {
            const body = document.body;
            
            // Create Overlay
            const overlay = document.createElement('div');
            overlay.id = 'settings-overlay';
            overlay.className = 'Settings-Overlay';
            
            // Create Modal Container (Renamed from Sidebar)
            const modal = document.createElement('div');
            modal.id = 'settings-modal'; 
            // CHANGE THIS LINE:
            modal.className = 'SettingsPopup'; // Matches your new CSS
            modal.innerHTML = html;
            
            // Insert into DOM
            body.insertBefore(overlay, body.firstChild);
            body.insertBefore(modal, body.firstChild);
        })
        .catch(err => console.error('Error loading settings modal:', err));
}

// Settings Modal Management
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const overlay = document.getElementById('settings-overlay');
    
    // Add 'open' class to make them visible
    if (modal) modal.classList.add('open');
    if (overlay) overlay.classList.add('open');
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const overlay = document.getElementById('settings-overlay');
    
    if (modal) {
        modal.classList.remove('open');
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.classList.remove('closing');
        }, 300); 
    }

    if (overlay) overlay.classList.remove('open');
}

// Close modal when clicking overlay
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('settings-overlay');
    if (e.target === overlay) {
        closeSettingsModal();
    }
});

// Settings button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.Header-Settings') || e.target.closest('.Settings-Button')) {
        openSettingsModal();
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
    navigateTo('Rhythm Typer/Song Select');
}

// Editor button click handler
document.addEventListener('click', function(e) {
    if (e.target.closest('.Editor-Button')) {
        goToEditor();
    }
});

function goToEditor() {
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

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    if (routes[cleanPath]) {
        loadContent(routes[cleanPath]);
    } else if (routes[path]) {
        loadContent(routes[path]);
    } else {
        loadContent('home.html');
    }
}

// Initial load
window.addEventListener('load', () => {
    loadSettingsModal(); // Renamed function call
    loadFromPath();
});

// Back/forward buttons
window.addEventListener('popstate', loadFromPath);