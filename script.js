document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    const links = nav ? nav.querySelectorAll('li a') : []; 

    // Flag to ensure initial positioning is instant (if applicable, in this older version, it's not used like that)
    let isInitialPageLoad = true; 

    // --- Dynamic Header Padding Fix Function ---
    let resizeTimeout;
    function setMainPadding() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight; 
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Position Highlighter on Active Link or Hovered Link (Unified) ---
    function moveHighlighter(targetLink) {
        if (!highlighter || !nav) return; 

        // In this older version, no special 'no-transition' handling for initial load is here.
        // The transition will always apply.

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


    // --- Typewriter Effect (ENABLED in this version) ---
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
                // Typewriter effect ENABLED:
                if (entry.target.classList.contains('typewriter')) {
                    if (!entry.target.dataset.text) {
                       entry.target.dataset.text = entry.target.textContent;
                    }
                    typewriterEffect(entry.target, 30); // Speed was 30ms initially
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe both .reveal-on-scroll and .typewriter elements
    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll, .typewriter'); 
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});
