// Routes mapping URL path → HTML file (relative to /V2/)
const routes = {
    '/V2/': 'home.html',
    '/V2/about': 'about.html',
    '/V2/projects': 'projects.html',
    '/V2/socials': 'socials.html'
};

// Load HTML into #content
function loadContent(page) {
    fetch(page)
        .then(res => {
            if (!res.ok) throw new Error('Page not found');
            return res.text();
        })
        .then(html => {
            document.getElementById('content').innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            document.getElementById('content').innerHTML =
                '<p>Error loading page.</p>';
        });
}

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
        const routePath = '/V2/' + pageParam;
        if (routes[routePath]) {
            loadContent(routes[routePath]);
            // Clean up the URL by removing the query parameter
            history.replaceState(null, '', routePath);
        }
    } else if (routes[path]) {
        loadContent(routes[path]);
    } else {
        // fallback to V2 home
        history.replaceState(null, '', '/V2/');
        loadContent(routes['/V2/']);
    }
}

// Initial load
window.addEventListener('load', loadFromPath);

// Back/forward buttons
window.addEventListener('popstate', loadFromPath);
