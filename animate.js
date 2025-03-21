document.addEventListener("DOMContentLoaded", function() {
    // Check if GSAP is available, if not, load it
    if (typeof gsap === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = initSpotlightEffect;
        document.head.appendChild(script);
    } else {
        initSpotlightEffect();
    }

    function initSpotlightEffect() {
        const articles = document.querySelectorAll("article:not(section)");
        
        articles.forEach(function(article) {
            // Create DOM elements
            const spotlightOverlay = document.createElement("div");
            spotlightOverlay.className = "absolute inset-0 pointer-events-none";
            spotlightOverlay.style.mixBlendMode = "soft-light";
            spotlightOverlay.style.zIndex = "9999";
            spotlightOverlay.style.opacity = "0";
            
            const borderGlow = document.createElement("div");
            borderGlow.className = "absolute inset-0 pointer-events-none";
            borderGlow.style.zIndex = "9998";
            borderGlow.style.opacity = "0";
            
            const innerHighlight = document.createElement("div");
            innerHighlight.className = "absolute inset-0 pointer-events-none";
            innerHighlight.style.zIndex = "9997";
            innerHighlight.style.opacity = "0";
            
            // Setup article
            article.style.position = "relative";
            article.style.willChange = "transform, box-shadow";
            article.appendChild(spotlightOverlay);
            article.appendChild(borderGlow);
            article.appendChild(innerHighlight);
            
            // Store state
            article.spotlight = {
                x: 0,
                y: 0,
                xPercent: 50,
                yPercent: 50,
                entrySide: null,
                active: false
            };
            
            // GSAP timeline for hover state
            const hoverTimeline = gsap.timeline({ paused: true });
            
            hoverTimeline
                .to(article, {
                    duration: 0.5,
                    scale: 1.008,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                    ease: "power3.out"
                }, 0)
                .to(spotlightOverlay, {
                    duration: 0.5,
                    opacity: 0.7,
                    ease: "power2.out"
                }, 0)
                .to(borderGlow, {
                    duration: 0.5,
                    opacity: 1,
                    ease: "power2.out"
                }, 0)
                .to(innerHighlight, {
                    duration: 0.5,
                    opacity: 0.7,
                    ease: "power2.out"
                }, 0);
            
            // Store timeline on article
            article.hoverTimeline = hoverTimeline;
            
            // Setup mouse tracking with GSAP
            article.spotlightTween = gsap.to(article.spotlight, {
                x: 0,
                y: 0,
                xPercent: 50,
                yPercent: 50,
                duration: 0.3,
                ease: "power2.out",
                paused: true,
                onUpdate: updateSpotlightEffect
            });
            
            function updateSpotlightEffect() {
                if (!article.spotlight.active) return;
                
                const xPercent = article.spotlight.xPercent;
                const yPercent = article.spotlight.yPercent;
                
                // Update spotlight gradient
                spotlightOverlay.style.background = 
                    `radial-gradient(circle 900px at ${xPercent}% ${yPercent}%, 
                    rgba(255, 255, 255, 0.8) 0%, 
                    rgba(255, 255, 255, 0.6) 20%, 
                    rgba(255, 255, 255, 0.4) 40%,
                    rgba(255, 255, 255, 0.2) 60%,
                    rgba(255, 255, 255, 0.1) 80%,
                    rgba(255, 255, 255, 0) 100%)`;
                
                // Update subtle tilt
                const tiltX = (yPercent - 50) / 20;
                const tiltY = (xPercent - 50) / -20;
                
                gsap.to(article, {
                    rotationX: tiltX,
                    rotationY: tiltY,
                    duration: 0.2,
                    ease: "power1.out",
                    transformPerspective: 1000,
                    transformOrigin: "center center"
                });
                
                // Update inner highlight based on position
                const angleDeg = Math.atan2(yPercent - 50, xPercent - 50) * (180 / Math.PI);
                innerHighlight.style.background = `linear-gradient(${angleDeg + 90}deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)`;
            }
            
            // Mouse enter handler with enhanced edge detection
            article.addEventListener("mouseenter", function(e) {
                article.spotlight.active = true;
                
                const rect = article.getBoundingClientRect();
                const edgeThreshold = Math.min(rect.width, rect.height) * 0.1;
                
                // Determine which side the mouse entered from
                if (e.clientX - rect.left < edgeThreshold) {
                    article.spotlight.entrySide = "left";
                } else if (rect.right - e.clientX < edgeThreshold) {
                    article.spotlight.entrySide = "right";
                } else if (e.clientY - rect.top < edgeThreshold) {
                    article.spotlight.entrySide = "top";
                } else if (rect.bottom - e.clientY < edgeThreshold) {
                    article.spotlight.entrySide = "bottom";
                }
                
                // Set initial spotlight position
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                
                // Update spotlight values
                article.spotlight.x = x;
                article.spotlight.y = y;
                article.spotlight.xPercent = xPercent;
                article.spotlight.yPercent = yPercent;
                
                // Set initial spotlight position
                spotlightOverlay.style.background = 
                    `radial-gradient(circle 900px at ${xPercent}% ${yPercent}%, 
                    rgba(255, 255, 255, 0.8) 0%, 
                    rgba(255, 255, 255, 0.6) 20%, 
                    rgba(255, 255, 255, 0.4) 40%,
                    rgba(255, 255, 255, 0.2) 60%,
                    rgba(255, 255, 255, 0.1) 80%,
                    rgba(255, 255, 255, 0) 100%)`;
                
                // Set border glow based on entry side
                switch (article.spotlight.entrySide) {
                    case "left":
                        borderGlow.style.boxShadow = "inset 12px 0 20px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)";
                        break;
                    case "right":
                        borderGlow.style.boxShadow = "inset -12px 0 20px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)";
                        break;
                    case "top":
                        borderGlow.style.boxShadow = "inset 0 12px 20px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)";
                        break;
                    case "bottom":
                        borderGlow.style.boxShadow = "inset 0 -12px 20px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)";
                        break;
                    default:
                        borderGlow.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.3)";
                }
                
                // Play hover animation
                article.hoverTimeline.play();
                
                // Transition border glow
                gsap.to(borderGlow, {
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
                    duration: 1.2,
                    delay: 0.4,
                    ease: "power2.out"
                });
                
                // Force update for initial position
                updateSpotlightEffect();
            });
            
            // Optimized mouse move handler
            let isThrottled = false;
            article.addEventListener("mousemove", function(e) {
                if (isThrottled) return;
                isThrottled = true;
                
                requestAnimationFrame(() => {
                    const rect = article.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const xPercent = (x / rect.width) * 100;
                    const yPercent = (y / rect.height) * 100;
                    
                    // Update the tween target values
                    article.spotlightTween.vars.x = x;
                    article.spotlightTween.vars.y = y;
                    article.spotlightTween.vars.xPercent = xPercent;
                    article.spotlightTween.vars.yPercent = yPercent;
                    
                    // Restart the tween to animate to new position
                    article.spotlightTween.restart();
                    
                    isThrottled = false;
                });
            });
            
            // Enhanced mouse leave with GSAP
            article.addEventListener("mouseleave", function() {
                article.spotlight.active = false;
                
                // Reverse hover animation
                article.hoverTimeline.reverse();
                
                // Reset transforms with smooth transition
                gsap.to(article, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    boxShadow: "none",
                    duration: 0.8,
                    ease: "power3.out",
                    onComplete: function() {
                        if (!article.spotlight.active) {
                            article.style.transform = "none";
                            spotlightOverlay.style.background = "";
                            borderGlow.style.boxShadow = "none";
                            innerHighlight.style.background = "";
                        }
                    }
                });
            });
        });
    }
});