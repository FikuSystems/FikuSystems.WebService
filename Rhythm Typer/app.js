// Animation configuration
const defaultAnimDuration = 300;


const routes = {
    './': 'home.html',
    './socials': 'socials.html'
};

// Load HTML into #content
function loadContent(page) {
    fetch(page)
        .then(res => {
            if (!res.ok) throw new Error('Page not found');
            return res.text();
        })
        .then(html => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = html;
            contentDiv.style.display = 'block';
            contentDiv.style.minHeight = 'auto';
        })
        .catch(err => {
            console.error(err);
            document.getElementById('content').innerHTML =
                '<p>Error loading page.</p>';
        });
}

function showOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.getElementById('options-container');
    
    if (!modal || !container) return;
    
    fetch('options.html')
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
        history.pushState(null, '', path);
    }
}

// Load page based on URL or query parameter
function loadFromPath() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const path = window.location.pathname;

    // If coming from a folder redirect with ?page= parameter
    if (pageParam) {
        const routePath = '/' + pageParam;
        if (routes[routePath]) {
            loadContent(routes[routePath]);
            // Clean up the URL by removing the query parameter
            history.replaceState(null, '', routePath);
        }
    } else if (routes[path]) {
        loadContent(routes[path]);
    } else {
        // fallback to V2 home
        history.replaceState(null, '', '/');
        loadContent(routes['/']);
    }
}

// Initial load
window.addEventListener('load', loadFromPath);

// Back/forward buttons
window.addEventListener('popstate', loadFromPath);
