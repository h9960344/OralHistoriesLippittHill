// New overlay implementation to replace the current overlay system
document.addEventListener('DOMContentLoaded', function() {
    // Set up the about-button click event to navigate to the about page
    const setupAboutButton = function() {
        const aboutButton = document.getElementById('about-button');
        
        if (aboutButton) {
            aboutButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Navigate to the about page instead of showing an overlay
                window.location.href = 'about.html';
            });
        }
    };
    
    // Initialize the about button functionality
    setupAboutButton();
});