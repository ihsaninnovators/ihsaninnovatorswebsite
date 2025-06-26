document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    const links = nav ? nav.querySelectorAll('li a') : []; 

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

    // --- Position Highlighter on Active Link or Hovered Link ---
    function moveHighlighter(targetLink) {
        if (!highlighter || !nav) return; 

        if (isInitialPageLoad) { 
            highlighter.classList.add('no-transition'); 
        }

        if (targetLink) {
            const linkRect = targetLink.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();

            highlighter.style.width = `${linkRect.width}px`;
            highlighter.style.height = `${linkRect.height}px`;

            const offsetLeft = linkRect.left - navRect.left;
            const offsetTop = linkRect.top - navRect.top;

            highlighter.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            highlighter.style.opacity = '1'; 
        } else {
            highlighter.style.opacity = '0';
        }

        if (isInitialPageLoad) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { 
                    highlighter.classList.remove('no-transition');
                    isInitialPageLoad = false; 
                });
            });
        }
    }

    // --- Event Listeners for Dynamic Padding and Initial Highlighter Position ---
    window.addEventListener('load', () => {
        setMainPadding(); 
        if (activeLink) {
            moveHighlighter(activeLink); 
        } else if (highlighter) {
            highlighter.style.opacity = '0'; 
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
        setMainPadding(); 
        if (activeLink) {
            moveHighlighter(activeLink); 
        } else if (highlighter) {
            highlighter.style.opacity = '0'; 
        }
    });
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setMainPadding();
            if (activeLink) { 
                moveHighlighter(activeLink); 
            } else if (highlighter) {
                highlighter.style.opacity = '0';
            }
        }, 50); 
    });

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

    // --- RE-ENABLED: Hover for Navigation Links (Highlighter now moves on hover) ---
    if (nav && highlighter) { 
        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveHighlighter(link));
        });

        nav.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveHighlighter(activeLink); 
            } else {
                highlighter.style.opacity = '0';
            }
        });
    }

    // --- Typewriter Effect (PERMANENTLY DISABLED) ---
    /* (function remains commented out) */
    
    // --- Scroll-Reveal Animation Trigger ---
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll'); 
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // --- NEW: Team Card "More" Button Expand/Collapse Logic ---
    const moreButtons = document.querySelectorAll('.team-card .more-button');

    moreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const teamCard = button.closest('.team-card'); // Get the parent team-card
            const aboutMeSection = teamCard.querySelector('.about-me-section');
            
            if (aboutMeSection) {
                // Toggle the 'expanded' class
                aboutMeSection.classList.toggle('expanded');

                // Change button text
                if (aboutMeSection.classList.contains('expanded')) {
                    button.textContent = 'Less';
                } else {
                    button.textContent = 'More';
                }
            }
        });
    });

});
