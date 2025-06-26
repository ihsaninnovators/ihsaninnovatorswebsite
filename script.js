document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 

    // Flag to ensure initial positioning is instant
    let isInitialPageLoad = true;

    // --- Dynamic Header Padding Fix Function ---
    let resizeTimeout;
    function setMainPadding() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight; 
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Position Highlighter ONLY on Active Link ---
    // This function now handles making the initial positioning instant.
    function positionHighlighterOnActive() {
        if (!highlighter) return; // Ensure highlighter exists

        if (isInitialPageLoad) {
            highlighter.classList.add('no-transition'); // Temporarily disable transition
        }

        if (activeLink) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();

            highlighter.style.width = `${linkRect.width}px`;
            highlighter.style.height = `${linkRect.height}px`;

            const offsetLeft = linkRect.left - navRect.left;
            const offsetTop = linkRect.top - navRect.top;

            highlighter.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            highlighter.style.opacity = '1'; // Ensure highlighter is visible when active
        } else {
            // If no active link, hide the highlighter
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
        positionHighlighterOnActive(); 
    });
    document.addEventListener('DOMContentLoaded', () => {
        setMainPadding(); 
        positionHighlighterOnActive(); // Initial position set here immediately on DOM ready
    });
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setMainPadding();
            // On resize, we want it to animate smoothly to the new position if it moves.
            // isInitialPageLoad remains false after first load, so no-transition won't be added here.
            positionHighlighterOnActive(); 
        }, 50); 
    });

    // Initial calls when the script runs
    setMainPadding();
    // positionHighlighterOnActive will be called on DOMContentLoaded, managing initialLoad.


    // --- Original Auto-Hiding Header Effect (keep as is) ---
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

    // --- No JavaScript for Highlighter Hover Movement ---
    // Hover text glow is handled purely by CSS.


    // --- Original Typewriter Effect (keep as is) ---
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

    // --- Original Scroll-Reveal and Typewriter Animation Trigger (keep as is) ---
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
                if (entry.target.classList.contains('typewriter')) {
                    if (!entry.target.dataset.text) {
                       entry.target.dataset.text = entry.target.textContent;
                    }
                    typewriterEffect(entry.target, 30);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll, .typewriter');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});
