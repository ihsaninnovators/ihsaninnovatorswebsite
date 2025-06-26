document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    const links = nav ? nav.querySelectorAll('li a') : []; // Ensure links is defined

    // --- Dynamic Header Padding Fix Function ---
    let resizeTimeout;
    function setMainPadding() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight; 
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Position Highlighter on Active Link or Hovered Link ---
    function moveHighlighter(targetLink) {
        if (!targetLink || !highlighter) {
            // If no target link or highlighter, hide it
            highlighter.style.width = '0px';
            highlighter.style.height = '0px';
            highlighter.style.transform = 'translate(0px, 0px)';
            highlighter.style.opacity = '0';
            return;
        }

        const linkRect = targetLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();

        highlighter.style.width = `${linkRect.width}px`;
        highlighter.style.height = `${linkRect.height}px`;

        const offsetLeft = linkRect.left - navRect.left;
        const offsetTop = linkRect.top - navRect.top;

        highlighter.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        highlighter.style.opacity = '1'; // Make sure highlighter is visible
    }

    // --- Event Listeners for Dynamic Padding and Initial Highlighter Position ---
    window.addEventListener('load', () => {
        setMainPadding(); 
        if (activeLink) {
            // Position highlighter on active link after everything loads
            moveHighlighter(activeLink); 
        } else if (highlighter) {
            // Hide highlighter if no active link on load
            highlighter.style.opacity = '0';
        }
    });
    document.addEventListener('DOMContentLoaded', setMainPadding); // For faster initial padding
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setMainPadding();
            if (activeLink) { // Reposition highlighter on active link after resize
                moveHighlighter(activeLink); 
            }
        }, 50); 
    });

    // Initial calls (in case the script loads late, but 'load' will correct)
    setMainPadding();
    if (activeLink) {
        moveHighlighter(activeLink);
    } else if (highlighter) {
        highlighter.style.opacity = '0'; // Hide highlighter if no active link
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

    // --- Hover for Navigation Links (NOW Controls Highlighter Directly) ---
    if (nav && highlighter) { // Only if nav and highlighter exist
        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveHighlighter(link));
        });

        // When mouse leaves the entire nav, move highlighter back to active link or hide
        nav.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveHighlighter(activeLink); // Move back to active link
            } else {
                // If no active link, hide the highlighter completely
                highlighter.style.width = '0px';
                highlighter.style.height = '0px';
                highlighter.style.transform = 'translate(0px, 0px)';
                highlighter.style.opacity = '0';
            }
        });
    }


    // --- Original Typewriter Effect (keep as is) ---
    function typewriterEffect(element, speed = 50) { /* ... same as before ... */ }
    // --- Original Scroll-Reveal (keep as is) ---
    const observerOptions = { /* ... same as before ... */ };
    const observer = new IntersectionObserver((entries, observer) => { /* ... same as before ... */ });
    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll, .typewriter');
    elementsToAnimate.forEach(el => { observer.observe(el); });

});
