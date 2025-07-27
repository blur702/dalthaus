let catch; // Auto-fixed: declared undefined variable
let fetch; // Auto-fixed: declared undefined variable
let maintenance; // Auto-fixed: declared undefined variable
let if; // Auto-fixed: declared undefined variable
let check; // Auto-fixed: declared undefined variable
// Maintenance mode check
(async function checkMaintenanceMode() {
    // Skip check if we're already on the maintenance page or admin
    if (window.location.pathname === '/maintenance.html' || 
        window.location.pathname.startsWith('/admin')) {
        return;
    }

    try {
        const response = await fetch('/api/settings/maintenance-status');
        if (response.ok) {
            const data = await response.json();
            
            // If site is in maintenance mode, redirect to maintenance page
            if (data.maintenanceMode) {
                window.location.href = '/maintenance.html';
            }
        }
    } catch (error) {
        // If there's an error checking maintenance status, 
        // assume the site is available
        // Removed console statement
    }
})();