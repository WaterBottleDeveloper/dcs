// script.js
const STATUS_EL = document.getElementById('status');
const LAST_UPDATED_EL = document.getElementById('last-updated');

// *** THE FIXED RENDER PROXY URL IS BELOW ***
const PROXY_URL = 'https://delaware-status-proxy.onrender.com/status'; 

/**
 * Updates the text content and CSS class of the status display element.
 * @param {string} status - The status text (e.g., 'OPEN', 'CLOSED', 'NO REPORT / UNKNOWN').
 */
function updateStatusDisplay(status) {
    STATUS_EL.textContent = status;
    // Converts status to a valid CSS class name (e.g., 'closed', 'delayed', 'unknown')
    const cssClass = status.toLowerCase().replace(/[^a-z]/g, '').replace('noreportunknown', 'unknown'); 
    STATUS_EL.className = cssClass;
}

/**
 * Fetches the school status from the external proxy server.
 */
async function fetchStatus() {
    updateStatusDisplay('Checking...');

    try {
        // Fetch data from the live Render proxy server.
        const response = await fetch(PROXY_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.status) {
            updateStatusDisplay(data.status);
        } else {
            // Handle case where proxy is up but returns bad data
            updateStatusDisplay('NO REPORT / UNKNOWN');
        }
        
    } catch (error) {
        console.error('Fetch Error:', error);
        // Handle network errors or proxy downtime gracefully
        updateStatusDisplay('NO REPORT / UNKNOWN');
    }
    
    // Update timestamp after every attempt
    const now = new Date();
    LAST_UPDATED_EL.textContent = now.toLocaleTimeString();
}

// Initial fetch to display status immediately when the page loads
fetchStatus();

// Auto-refresh status every 30 seconds
setInterval(fetchStatus, 30000);
