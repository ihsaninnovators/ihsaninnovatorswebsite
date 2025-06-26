document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    const links = nav ? nav.querySelectorAll('li a') : []; 

    // Flag to ensure initial positioning is instant
    let isInitialPageLoad = true; // KEEP THIS FLAG

    // --- Dynamic Header Padding Fix Function ---
    let resizeTimeout;
    function setMainPadding() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight; 
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Position Highlighter on Active Link or Hovered Link ---
    // Now uses the isInitialPageLoad flag to control instant appearance.
    function moveHighlighter(targetLink) {
        if (!highlighter || !nav) return; 

        if (isInitialPageLoad) { // Only on the very first call after page load
            highlighter.classList.add('no-transition'); // Temporarily disable transition
        }

        if (targetLink) {
            const linkRect = targetLink.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();

            highlighter.style.width = `${linkRect.width}px`;
            highlighter.style.height = `${linkRect.height}px`;

            const offsetLeft = linkRect.left - navRect.left;
            const offsetTop = linkRect.top - navRect.top;

            highlighter.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            highlighter.style.opacity = '1'; // Ensure highlighter is visible
        } else {
            // If no target (e.g., hiding when no active link and mouse leaves nav)
            highlighter.style.opacity = '0';
        }

        if (isInitialPageLoad) {
            // Re-enable transition after the layout has settled (double rAF for robustness)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { 
                    highlighter.classList.remove('no-transition');
                    isInitialPageLoad = false; // Mark initial load as done
                });
            });
        }
    }

    // --- Event Listeners ---
    // Call setMainPadding and positionHighlighterOnActive on load and resize
    window.addEventListener('load', () => {
        setMainPadding(); 
        if (activeLink) {
            moveHighlighter(activeLink); // Position highlighter on active link on full load
        } else if (highlighter) {
            highlighter.style.opacity = '0'; // Hide if no active link
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
        setMainPadding(); 
        if (activeLink) {
            moveHighlighter(activeLink); // Position highlighter on active link on DOM ready
        } else if (highlighter) {
            highlighter.style.opacity = '0'; // Hide if no active link
        }
    });
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setMainPadding();
            // On resize, if there's an active link, move highlighter smoothly (transition re-enabled after initial load)
            if (activeLink) { 
                moveHighlighter(activeLink); 
            } else if (highlighter) {
                highlighter.style.opacity = '0';
            }
        }, 50); 
    });

    // Initial calls when the script runs (for immediate setup before DOMContentLoaded/Load)
    setMainPadding();
    if (activeLink) {
        moveHighlighter(activeLink);
    } else if (highlighter) {
        highlighter.style.opacity = '0';
    }


    // --- Original Auto-Hiding Header Effect ---
    let lastScrollTop = 0;
    if (header) {
        window.addEventListener('scroll', () => {
            let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            if (currentScrollTop > lastScrollTop && currentScrollTop > header.offsetHeight) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        });
    }

    // --- Hover for Navigation Links (Highlighter moves on hover) ---
    if (nav && highlighter) { 
        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveHighlighter(link));
        });

        // When mouse leaves the entire nav, move highlighter back to active link or hide
        nav.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveHighlighter(activeLink); // Move back to active link
            } else {
                // If no active link, hide the highlighter completely
                highlighter.style.opacity = '0';
            }
        });
    }


    // --- Original Typewriter Effect (still disabled for now) ---
    /*
    function typewriterEffect(element, speed = 50) {
        if (element.dataset.typed) {
            return;
        }
        const text = element.dataset.text;
        element.textContent = ''; 
        element.style.opacity = 1;
        element.classList.add('typing-effect');
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i); 
                i++;
            } else {
                clearInterval(timer);
                element.classList.remove('typing-effect');
                element.dataset.typed = "true";
            }
        }, speed);
    }
    */

    // --- Original Scroll-Reveal and Typewriter Animation Trigger ---
    const observerOptions = {
        root: null,
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-on-scroll')) {
                    entry.target.classList.add('is-visible');
                }
                // Typewriter effect remains disabled:
                /*
                if (entry.target.classList.contains('typewriter')) {
                    if (!entry.target.dataset.text) {
                       entry.target.dataset.text = entry.target.textContent;
                    }
                    typewriterEffect(entry.target, 30);
                }
                */
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll'); // Exclude .typewriter for now
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});
