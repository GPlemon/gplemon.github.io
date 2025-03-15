
let boot = gsap.timeline({ defaults: { ease: "power1.out" } });
boot.set('div', { autoAlpha: 0, })
    /* setTimeout(() => { */
boot.to('div', { y: 0, autoAlpha: 1, duration: 3 })
    /* }, 0) */


let tl = gsap.timeline({ defaults: { ease: "power1.out" } });


tl.to('.item', { autoAlpha: 0, y: 100 })

tl.to('.item', { autoAlpha: 0.5, y: -15, stagger: 0.059, duration: 0.8 }, "+=4")

tl.to('.item', { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1 }, "-=1")






//Something new from a branch
//From a branch

//Highlight Follows Mouse Effect


document.addEventListener("DOMContentLoaded", function() {
    const articles = document.querySelectorAll("article:not(section)");
    
    articles.forEach(function(article) {
        // Store original classes
        const originalClasses = article.className;
        
        // Create a gradient overlay div that will be positioned on hover
        const gradientOverlay = document.createElement("div");
        gradientOverlay.className = "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none";
        // Initial state - no gradient visible and opacity 0
        gradientOverlay.style.opacity = "0";
        gradientOverlay.style.mixBlendMode = "soft-light"; // Changed from overlay for a softer effect
        gradientOverlay.style.zIndex = "1";
        

        
        article.appendChild(gradientOverlay);
        
        article.addEventListener("mouseenter", function(e) {
            // Set initial gradient position based on where mouse entered
            const rect = article.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            // Modern gradient with bright neon colors and multiple color stops
            gradientOverlay.style.background = 
                `radial-gradient(circle at ${xPercent}% ${yPercent}%, 
                rgba(56, 189, 248, 0.9) 0%, 
                rgba(167, 139, 250, 0.8) 30%, 
                rgba(236, 72, 153, 0.7) 60%,
                rgba(249, 168, 212, 0.6) 80%)`;
                
            // Make gradient visible after setting its position
            gradientOverlay.style.opacity = "0.85";
        });
        
        article.addEventListener("mousemove", function(e) {
            const rect = article.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage positions
            const xPercent = (x / rect.width) * 1000;
            const yPercent = (y / rect.height) * 1000;
            
            // Dynamic gradient size based on mouse speed
            const size = Math.min(100, Math.max(50, Math.abs(this.lastX - x) + Math.abs(this.lastY - y) * 2 + 50));
            this.lastX = x;
            this.lastY = y;
            
            // Modern gradient with bright neon colors
            gradientOverlay.style.background = 
                `radial-gradient(circle ${size}% at ${xPercent}% ${yPercent}%, 
                rgba(56, 189, 248, 0.9) 0%, 
                rgba(167, 139, 250, 0.8) 30%, 
                rgba(236, 72, 153, 0.7) 60%,
                rgba(249, 168, 212, 0.6) 80%)`;
        });
        
        article.addEventListener("mouseleave", function() {
            // Hide gradient on mouse leave
            gradientOverlay.style.opacity = "0";
            
            // Remove the background property after transition completes
            setTimeout(() => {
                if (!article.matches(':hover')) {
                    gradientOverlay.style.background = "";
                }
            }, 300); // Match duration to the transition time
        });
    });
});