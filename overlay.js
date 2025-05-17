document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML content from another file
    async function loadOverlayContent() {
        try {
            const response = await fetch('about-overlay.html');
            const html = await response.text();
            
            // Create a container div for the overlay
            const overlayContainer = document.createElement('div');
            overlayContainer.innerHTML = html;
            
            // Append the overlay to the body
            document.body.appendChild(overlayContainer.firstChild);
            
            // Setup event listeners after content is loaded
            setupOverlayListeners();
            
            // Initialize the About button functionality
            setupAboutButton();
            
            // Only show overlay on initial site visit, not page changes
            const hasVisitedBefore = localStorage.getItem('hasVisitedSite');
            if (!hasVisitedBefore) {
                // First time visitor - show overlay and set flag
                showOverlay();
                localStorage.setItem('hasVisitedSite', 'true');
            }
        } catch (error) {
            console.error('Error loading overlay content:', error);
        }
    }
    
    // Rest of the functions remain the same
    function setupOverlayListeners() {
        const overlay = document.getElementById('about-overlay');
        const closeButton = document.getElementById('close-overlay');
        const continueButton = document.getElementById('continue-to-site');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                hideOverlay();
            });
        }
        
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                hideOverlay();
            });
        }
        
        // Add click event listener to close when clicking outside the content
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                // Check if the click was directly on the overlay background
                // and not on any of its children
                if (e.target === overlay) {
                    hideOverlay();
                }
            });
        }
    }
    
    // Function to setup the About button in the navigation
    function setupAboutButton() {
        const aboutButton = document.getElementById('about-button');
        
        if (aboutButton) {
            aboutButton.addEventListener('click', (e) => {
                e.preventDefault();
                showOverlay();
            });
        }
    }
    
    // Function to show the overlay
    function showOverlay() {
        const overlay = document.getElementById('about-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }
    
    // Function to hide the overlay
    function hideOverlay() {
        const overlay = document.getElementById('about-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
    
    // Make these functions available globally
    window.showAboutOverlay = showOverlay;
    window.hideAboutOverlay = hideOverlay;
    
    // Load the overlay content
    loadOverlayContent();
});