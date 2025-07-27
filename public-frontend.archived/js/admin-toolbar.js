// Admin toolbar functionality
function createAdminToolbar() {
    if (!isAdminLoggedIn()) return;
    
    const toolbar = document.createElement('div');
    toolbar.className = 'admin-toolbar';
    toolbar.innerHTML = `
        <div class="admin-toolbar-content">
            <span class="admin-indicator">👁️ Admin Mode Active</span>
            <a href="http://localhost:5173/admin"
               target="_blank"
               class="admin-panel-link">
                Go to Admin Panel
            </a>
            <button onclick="toggleAdminMode()" class="admin-toggle-btn">
                Disable Admin Mode
            </button>
        </div>
    `;
    
    document.body.insertBefore(toolbar, document.body.firstChild);
}

window.toggleAdminMode = function() {
    const isActive = localStorage.getItem('adminPreviewMode') === 'true';
    
    if (isActive) {
        localStorage.removeItem('adminPreviewMode');
        window.location.href = window.location.pathname + '?adminMode=false';
    } else {
        localStorage.setItem('adminPreviewMode', 'true');
        window.location.href = window.location.pathname + '?adminMode=true';
    }
}

// Add toolbar on page load
document.addEventListener('DOMContentLoaded', createAdminToolbar);