document.addEventListener('DOMContentLoaded', () => {
    // Handle mobile screens - adjust layout on resize
    function handleResize() {
        const bottomMenu = document.getElementById('bottom-menu');
        
        if (window.innerWidth <= 768) {
            // Mobile layout adjustments
            // Position menu at the top for mobile view
            if (bottomMenu) {
                // Clear any existing positioning
                bottomMenu.style.inset = null;
                
                // Set explicit positioning properties for top placement
                bottomMenu.style.position = 'fixed';
                bottomMenu.style.top = '30px';
                bottomMenu.style.left = '50%';
                bottomMenu.style.transform = 'translateX(-50%)';
                bottomMenu.style.bottom = 'auto';
                bottomMenu.style.right = 'auto';
                bottomMenu.style.width = 'auto';
                bottomMenu.style.padding = '0';
                bottomMenu.style.zIndex = '1000';
                bottomMenu.style.display = 'flex';
                bottomMenu.style.gap = '10px';
                bottomMenu.style.backgroundColor = 'transparent';
            }
            
            // Add padding to the top of text-panel to avoid menu overlap
            document.getElementById('text-panel').style.paddingTop = '0px';
        } else {
            // Desktop layout
            const headerHeight = document.getElementById('site-header')?.offsetHeight || 0;
            document.getElementById('text-panel').style.paddingTop = '20px'; // Reset to original padding
            
            // Position for desktop view
            if (bottomMenu) {
                bottomMenu.style.position = 'fixed';
                bottomMenu.style.top = '20px';
                bottomMenu.style.right = '20px';
                bottomMenu.style.left = 'auto';
                bottomMenu.style.transform = 'none';
                bottomMenu.style.zIndex = '100';
            }
        }
    }
    
    // Initial call and event listener for resize
    handleResize();
    window.addEventListener('resize', handleResize);
});