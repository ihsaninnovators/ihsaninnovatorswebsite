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

    // --- Typewriter Effect (PERMANENTLY REMOVED) ---
    // The typewriterEffect function definition is removed.
    // The observation for .typewriter elements is removed.
    
    // --- Original Scroll-Reveal Animation Trigger (Modified to exclude typewriter) ---
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
                // Removed condition and call for 'typewriter' elements
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe only .reveal-on-scroll elements (includes paragraphs previously with typewriter)
    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll'); 
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});
