/**
 * KAI // ARCHETYPE - Interactive Scripting
 * Handles active navigation sliding pill, scroll spy, live clock, and premium hover effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. LIVE POSTER CLOCK
       ========================================================================== */
    const updateClock = () => {
        const clockEl = document.getElementById('poster-clock');
        if (!clockEl) return;
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    };
    
    // Initial call & intervals
    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       2. SLIDING ACTIVE NAV PILL & SCROLL SPY
       ========================================================================== */
    const nav = document.querySelector('.nav');
    const navPill = document.getElementById('nav-pill');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = [
        document.getElementById('home'),
        document.getElementById('links'),
        document.getElementById('about'),
        document.getElementById('contact')
    ];

    // Function to calculate and position the background active pill
    const positionPill = (activeItem) => {
        if (!activeItem || !navPill || !nav) return;
        
        const rect = activeItem.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        // Calculate horizontal offset relative to the nav container
        const leftOffset = rect.left - navRect.left;
        
        navPill.style.left = `${leftOffset}px`;
        navPill.style.width = `${rect.width}px`;
    };

    // Update nav active class
    const setActiveNavItem = (id) => {
        let matchedItem = null;
        navItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
                item.classList.add('active');
                matchedItem = item;
            } else {
                item.classList.remove('active');
            }
        });
        
        if (matchedItem) {
            positionPill(matchedItem);
        }
    };

    // Click handler for smooth navigation transitions
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll with offset for mobile stacking
                const yOffset = -20; 
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({ top: y, behavior: 'smooth' });
                setActiveNavItem(targetId);
            }
        });
    });

    // Intersection Observer to update active nav tab on scroll (Scroll Spy)
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveNavItem(entry.target.id);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        if (section) observer.observe(section);
    });

    // Handle resize window to adjust pill position correctly
    window.addEventListener('resize', () => {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            positionPill(activeItem);
        }
    });

    // Initial position on load
    setTimeout(() => {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) positionPill(activeItem);
    }, 150);

    /* ==========================================================================
       3. INTERACTIVE MOUSE PARALLAX EFFECT FOR GRAPHIC
       ========================================================================== */
    const graphicContainer = document.querySelector('.angled-crop-container');
    const graphicText = document.querySelector('.abstract-gfx-text');
    const slashLine = document.querySelector('.slash-line-decor');

    if (graphicContainer && graphicText) {
        graphicContainer.addEventListener('mousemove', (e) => {
            const rect = graphicContainer.getBoundingClientRect();
            
            // Mouse coordinates relative to center of the crop container
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Convert to a percentage factor between -1 and 1
            const factorX = x / (rect.width / 2);
            const factorY = y / (rect.height / 2);
            
            // Smoothly shift text position & scale (adjusting for absolute center transform)
            graphicText.style.transform = `translate(calc(-50% + ${factorX * 12}px), calc(-50% + ${factorY * 12}px)) scale(1.08)`;
            
            // Shift the decorative diagonal slash line in the opposite direction
            if (slashLine) {
                slashLine.style.transform = `rotate(25deg) translate(${-factorX * 15}px, ${-factorY * 15}px)`;
            }
        });

        // Reset positions on mouse leave
        graphicContainer.addEventListener('mouseleave', () => {
            graphicText.style.transform = 'translate(-50%, -50%) scale(1.0)';
            if (slashLine) {
                slashLine.style.transform = 'rotate(25deg) translate(0px, 0px)';
            }
        });
    }

    /* ==========================================================================
       4. ANIMATED REVEAL ON PAGE LOAD (STAGGERED ANIMATIONS)
       ========================================================================== */
    const heroTitle = document.querySelector('.main-title');
    const tag = document.querySelector('.poster-tag');
    const tagline = document.querySelector('.tagline');
    const bioText = document.querySelector('.bio-text');
    const linkBtns = document.querySelectorAll('.link-btn');
    const socialIcons = document.querySelector('.social-section');

    // Add simple initial fade CSS classes dynamically to layout elements
    const elementsToAnimate = [tag, heroTitle, tagline, bioText, socialIcons];
    
    elementsToAnimate.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
    });

    linkBtns.forEach(btn => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        btn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger reveal staggered animations after brief timeout
    setTimeout(() => {
        let delay = 100;
        
        elementsToAnimate.forEach(el => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
                delay += 150;
            }
        });

        linkBtns.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, delay + (index * 80));
        });
    }, 200);
});
