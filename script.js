// script.js
const STATUS_EL = document.getElementById('status');
const LAST_UPDATED_EL = document.getElementById('last-updated');

// *** IMPORTANT: REPLACE WITH YOUR ACTUAL RENDER PROXY URL + /status ***
// Example: https://delaware-status-proxy.onrender.com/status
const PROXY_URL = 'YOUR_RENDER_PROXY_URL_HERE/status'; 

function updateStatusDisplay(status) {
    STATUS_EL.textContent = status;
    // Convert status like "NO REPORT / UNKNOWN" to "unknown" for CSS class
    const cssClass = status.toLowerCase().replace(/[^a-z]/g, '').replace('noreportunknown', 'unknown'); 
    STATUS_EL.className = cssClass;
}

async function fetchStatus() {
    updateStatusDisplay('Checking...');

    try {
        const response = await fetch(PROXY_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.status) {
            updateStatusDisplay(data.status);
        } else {
            updateStatusDisplay('NO REPORT / UNKNOWN');
        }
        
    } catch (error) {
        console.error('Fetch Error:', error);
        updateStatusDisplay('NO REPORT / UNKNOWN');
    }
    
    // Update timestamp after every attempt
    LAST_UPDATED_EL.textContent = new Date().toLocaleTimeString();
}

// Initial fetch
fetchStatus();

// Auto-refresh status every 30 seconds
setInterval(fetchStatus, 30000); 
