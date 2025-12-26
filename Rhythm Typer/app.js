// Animation configuration
const defaultAnimDuration = 300;

const routes = {
    'Rhythm Typer/': 'home.html',           // Removed the prefix
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

function showOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.getElementById('options-container');
    
    if (!modal || !container) return;
    
    fetch('Rhythm Typer/options.html')
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
            modal.classList.remove('hidden');
            
            // Get the window element and animate it in
            const win = container.querySelector('.window');
            if (win) {
                // Opening animation
                win.style.opacity = '0';
                win.style.transition = 'none';
                win.style.transformOrigin = 'center';
                win.style.transform = 'scale(0.94) perspective(1000px) rotateX(-10deg)';
                win.getBoundingClientRect(); // force reflow
                win.style.transition = `transform ${defaultAnimDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${defaultAnimDuration}ms ease-in-out`;
                win.style.transform = 'none';
                win.style.opacity = '1';
            }
        })
        .catch(err => console.error('Error loading options:', err));
}

function closeOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.getElementById('options-container');
    const win = container.querySelector('.window');
    
    if (win) {
        // Closing animation
        win.style.transition = `
            transform ${defaultAnimDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity ${defaultAnimDuration}ms ease-out
        `;
        win.style.transformOrigin = 'center';
        win.style.transform = 'scale(0.94) perspective(1000px) rotateX(6deg)';
        win.style.opacity = '0';
        
        // Wait for animation to complete before hiding modal
        setTimeout(() => {
            modal.classList.add('hidden');
        }, defaultAnimDuration);
    } else if (modal) {
        modal.classList.add('hidden');
    }
}

// Close modal when clicking the overlay
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeOptionsModal();
    }
});

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
    if (e.target.closest('.Header-Settings')) {
        openSettingsSidebar();
    }
});

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
    // Ensure we decode the URI to handle the %20 (spaces) correctly
    const path = decodeURIComponent(window.location.pathname);
    
    // Check if path ends without a slash and add it if it's the base directory
    const normalizedPath = path.endsWith('/') ? path : path + '/';

    if (routes[path]) {
        loadContent(routes[path]);
    } else if (routes[normalizedPath]) {
        loadContent(routes[normalizedPath]);
    } else {
        // Fallback for the root of Rhythm Typer
        loadContent('/Rhythm Typer/home.html');
    }
}

// Initial load
window.addEventListener('load', loadFromPath);

// Back/forward buttons
window.addEventListener('popstate', loadFromPath);
