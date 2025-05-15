document.addEventListener('DOMContentLoaded', () => {
    // Get all text sections and images
    const sections = document.querySelectorAll('.text-section');
    const images = document.querySelectorAll('.image');
    
    // Set up Intersection Observer to detect which section is in view
    const observerOptions = {
        root: null, // Use the viewport as root
        rootMargin: '-10% 0px -60% 0px', // Adjust these values to control when images change
        threshold: 0 // Trigger when any part of the element is visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If a section is in view
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const imageId = 'image-' + sectionId;
                
                // Hide all images
                images.forEach(img => {
                    img.classList.remove('active');
                });
                
                // Show the corresponding image
                const activeImage = document.getElementById(imageId);
                if (activeImage) {
                    activeImage.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Handle mobile screens - adjust layout on resize
    function handleResize() {
        if (window.innerWidth <= 768) {
            // Mobile layout adjustments
            document.getElementById('text-panel').style.height = 'auto';
            document.getElementById('image-container').style.height = '50vh';
            document.getElementById('text-panel').style.top = '0';
            document.getElementById('image-container').style.top = '0';
        } else {
            // Desktop layout
            const headerHeight = document.getElementById('site-header').offsetHeight;
            document.getElementById('text-panel').style.height = `calc(100% - ${headerHeight}px)`;
            document.getElementById('image-container').style.height = `calc(100% - ${headerHeight}px)`;
            document.getElementById('text-panel').style.top = `${headerHeight}px`;
            document.getElementById('image-container').style.top = `${headerHeight}px`;
        }
    }
    
    // Initial call and event listener for resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Debug function to help with scrolling trigger points
    function debugIntersectionObserver() {
        // Add this if you need to debug the observer trigger points
        const debugElement = document.createElement('div');
        debugElement.style.position = 'fixed';
        debugElement.style.top = '10%';
        debugElement.style.left = '50%';
        debugElement.style.width = '100%';
        debugElement.style.borderTop = '2px dotted red';
        debugElement.style.zIndex = '9999';
        document.body.appendChild(debugElement);
        
        const debugElement2 = document.createElement('div');
        debugElement2.style.position = 'fixed';
        debugElement2.style.bottom = '60%';
        debugElement2.style.left = '50%';
        debugElement2.style.width = '100%';
        debugElement2.style.borderBottom = '2px dotted red';
        debugElement2.style.zIndex = '9999';
        document.body.appendChild(debugElement2);
    }
    
    // Uncomment the next line to debug intersection observer trigger points
    // debugIntersectionObserver();
});