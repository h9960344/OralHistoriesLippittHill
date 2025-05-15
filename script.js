// Initialize the map centered on your specific point in Lippitt Hill area
const map = L.map('map', {
    closePopupOnClick: true
}).setView([41.8375, -71.40587257113057], 16);

// Function to set zoom based on screen size
function setMobileZoom() {
    // Check if the screen width is below the mobile breakpoint (768px)
    if (window.innerWidth <= 768) {
        // Set a lower zoom level for mobile (adjust this number as needed)
        map.setZoom(15); // Lower number = wider view
    } else {
        // For desktop, keep your original zoom
        map.setZoom(16);
    }
}

// Add these event listeners after your map initialization
// This ensures the zoom gets set correctly when the page loads or when the user resizes
window.addEventListener('load', setMobileZoom);
window.addEventListener('resize', setMobileZoom);

// Store the landing page content
const landingPageContent = document.getElementById('info-content').innerHTML;

// Use Carto Positron (light, minimal style)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 17
}).addTo(map);

// Create the street image overlay
function createStreetImageOverlay() {
    // Define the 4 corners of the image overlay (clockwise from top-left)
    const topLeft = L.latLng(41.83842654429215, -71.40910168146698);      // Northwest
    const topRight = L.latLng(41.83880222790378, -71.3994);     // Northeast
    const bottomRight = L.latLng(41.83578071001552, -71.40158076739334);  // Southeast
    const bottomLeft = L.latLng(41.83500997101404, -71.409830698701);     // Southwest

    // Create a rectangle with the 4 corners
    const bounds = L.latLngBounds([
        [topLeft.lat, topLeft.lng],
        [topRight.lat, topRight.lng],
        [bottomRight.lat, bottomRight.lng],
        [bottomLeft.lat, bottomLeft.lng]
    ]);

    // Create the image overlay using your SVG
    return L.imageOverlay('overlay-image.svg', bounds, {
        opacity: 1,
        interactive: false,
        zIndex: 10
    });
}

// Create the area image overlay
function createAreaImageOverlay() {
    // Define the 4 corners of the area image overlay
    // Using the same bounds for this example - adjust as needed for your area overlay
    const topLeft = L.latLng(41.83842654429215, -71.40910168146698);      // Northwest
    const topRight = L.latLng(41.83880222790378, -71.40010018801793);     // Northeast
    const bottomRight = L.latLng(41.83578071001552, -71.40158076739334);  // Southeast
    const bottomLeft = L.latLng(41.83502997101404, -71.409830698701);     // Southwest

    // Create a rectangle with the 4 corners
    const bounds = L.latLngBounds([
        [topLeft.lat, topLeft.lng],
        [topRight.lat, topRight.lng],
        [bottomRight.lat, bottomRight.lng],
        [bottomLeft.lat, bottomLeft.lng]
    ]);

    // Create the image overlay using your area SVG
    return L.imageOverlay('area-overlay-image.svg', bounds, {
        opacity: 1,
        interactive: false,
        zIndex: 9  // Lower zIndex to appear below the street overlay
    });
}

// Store our markers array
const markers = [];

// Track the currently active marker
let activeMarker = null;

// Function to reset to landing page
function resetToLandingPage() {
    // Reset all markers to black
    markers.forEach(m => {
        m.setIcon(createMarkerIcon(false));
    });
    
    // Reset info panel to landing page content
    document.getElementById('info-content').innerHTML = landingPageContent;
    
    // Reset active marker tracking
    activeMarker = null;
}

// Add map click event to reset to landing page when clicking off a marker
map.on('click', function(e) {
    resetToLandingPage();
});

// Function to format dialogue text into a two-column table format
function formatDialogueAsTable(dialogueText) {
    if (!dialogueText) return '';
    
    // Create a table for the dialogue
    let tableHTML = '<table class="dialogue-table">';
    
    // More robust regex that can handle various formats
    // This will match patterns like "Name:" or "Name:" at start of lines or after periods/line breaks
    const dialogueRegex = /(?:^|\n|\.\s+)([A-Za-z\s]+):\s*([^]*?)(?=(?:\n[A-Za-z\s]+:|$|\.[A-Za-z\s]+:))/g;
    
    let match;
    let matches = [];
    
    // Find all dialogue segments
    while ((match = dialogueRegex.exec(dialogueText)) !== null) {
        const speaker = match[1].trim();
        const content = match[2].trim();
        
        // Only add if we have both a speaker and content
        if (speaker && content) {
            matches.push({ speaker, content });
        }
    }
    
    // If no valid dialogue matches were found, try a simpler approach
    if (matches.length === 0) {
        // Try a simpler pattern that just looks for "Name:" anywhere
        const simpleRegex = /([A-Za-z\s]+):\s*([^]*?)(?=(?:[A-Za-z\s]+:|$))/g;
        
        while ((match = simpleRegex.exec(dialogueText)) !== null) {
            const speaker = match[1].trim();
            const content = match[2].trim();
            
            if (speaker && content) {
                matches.push({ speaker, content });
            }
        }
    }
    
    // If we still have no matches, just return the original text in a paragraph
    if (matches.length === 0) {
        return `<p style="white-space: pre-wrap; padding-left: 20px;">${dialogueText}</p>`;
    }
    
    // Create table rows for each dialogue segment
    matches.forEach(item => {
        tableHTML += `
            <tr class="dialogue-row">
                <td class="dialogue-speaker">${item.speaker}</td>
                <td class="dialogue-content">${item.content}</td>
            </tr>
        `;
    });
    
    tableHTML += '</table>';
    return tableHTML;
}

// Function to update the info panel with the point's data
function updateInfoPanel(point) {
    // Check if there's dialogue content
    if (!point.Dialogue) {
        document.getElementById('info-content').innerHTML = `
            <div class="person-info">
                <h2>${point.Name}</h2>
                <div class="person-address">${point.Address}</div>
            </div>
            <div class="dialogue-container">
                <p>No dialogue available for this location.</p>
            </div>
        `;
        return;
    }
    
    // Format the dialogue content as a table
    const formattedDialogue = formatDialogueAsTable(point.Dialogue);
    
    // Update the info panel content with a container for the dialogue
    document.getElementById('info-content').innerHTML = `
        <div class="person-info">
            <h2>${point.Name}</h2>
            <div class="person-address">${point.Address}</div>
        </div>
        <div class="dialogue-container">
            ${formattedDialogue}
        </div>
    `;
    
    // Scroll to the top of the info panel
    document.getElementById('info-panel').scrollTop = 0;
}

// Function to create black marker icons that turn bright red when clicked
function createMarkerIcon(isActive) {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${isActive ? '#303030' : '#ffff'}; width:15px; height:15px; border-radius:50%; border:1px solid black;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}

// Function to load and process map data
async function loadMapData() {
    try {
        // Fetch the JSON data
        const response = await fetch('Lippit Hill Oral History Map - Sheet1.json');
        const data = await response.json();
        
        // Process the data
        processMapData(data);
    } catch (error) {
        console.error('Error loading map data:', error);
        console.warn('Falling back to embedded data');
    }
}

// Process map data and create markers
function processMapData(data) {
    // Create markers for each point
    data.forEach(point => {
        // Skip points without necessary data
        if (!point.Coordinates || !point.Name) {
            console.warn('Skipping incomplete data point:', point);
            return;
        }
        
        // Parse coordinates
        const [lat, lng] = point.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
        
        if (isNaN(lat) || isNaN(lng)) {
            console.error('Invalid coordinates:', point.Coordinates);
            return;
        }
        
        // Create marker with black icon - NO POPUP
        const icon = createMarkerIcon(false);
        const marker = L.marker([lat, lng], { icon: icon });
        
        // Add click event to update info panel and change marker color
        marker.on('click', (e) => {
            // Stop event propagation to prevent the map click event
            L.DomEvent.stopPropagation(e);
            
            // If this is the active marker, reset to landing page
            if (activeMarker === marker) {
                resetToLandingPage();
                return;
            }
            
            // Reset all markers to black
            markers.forEach(m => {
                m.setIcon(createMarkerIcon(false));
            });
            
            // Set this marker to bright red
            marker.setIcon(createMarkerIcon(true));
            
            // Update the active marker reference
            activeMarker = marker;
            
            // Update info panel
            updateInfoPanel(point);
        });
        
        // Add to map and markers array
        marker.addTo(map);
        markers.push(marker);
    });
    
    // Removed fitBounds call to maintain the initial center point
}

// Function to create a toggle control with improved toggle switch
function createToggleControl(position, label, id, overlay) {
    const control = L.control({ position: position });
    
    control.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'overlay-control');
        div.innerHTML = `
            <div class="overlay-toggle-container">
                <span class="toggle-label">${label}</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="${id}" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
        return div;
    };
    
    control.addTo(map);
    
    // Add event listener for the toggle switch
    setTimeout(() => {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.addEventListener('change', function() {
                if (this.checked) {
                    overlay.setOpacity(1);
                } else {
                    overlay.setOpacity(0);
                }
            });
            console.log(`Toggle event listener added successfully for ${id}`);
        } else {
            console.error(`Toggle element not found for ${id}`);
        }
    }, 200);
}

// Load everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create the street and area overlays
    const streetOverlay = createStreetImageOverlay();
    const areaOverlay = createAreaImageOverlay();
    
    // Add both overlays to the map
    streetOverlay.addTo(map);
    areaOverlay.addTo(map);
    
    // Create toggle controls for both overlays - positioned at the bottom right
    createToggleControl('bottomright', 'Demolished Streets', 'street-toggle', streetOverlay);
    createToggleControl('bottomright', 'Lippitt Hill Boundaries', 'area-toggle', areaOverlay);
    
    // Load the map data
    loadMapData();

    
});