document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    // const links = nav ? nav.querySelectorAll('li a') : []; // 'links' variable is no longer needed for highlighter control

    // --- Dynamic Header Padding Fix Function ---
    let resizeTimeout;
    function setMainPadding() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight; 
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Position Highlighter ONLY on Active Link ---
    // This function is now responsible for placing the bubble (highlighter)
    // under the currently active navigation link, and only that link.
    function positionHighlighterOnActive() {
        if (activeLink && highlighter) {
            // Get dimensions and position relative to the navigation container
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();

            highlighter.style.width = `${linkRect.width}px`;
            highlighter.style.height = `${linkRect.height}px`;

            const offsetLeft = linkRect.left - navRect.left;
            const offsetTop = linkRect.top - navRect.top;

            highlighter.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            highlighter.style.opacity = '1'; // Ensure highlighter is visible when on an active link
        } else if (highlighter) {
            // If there's no active link (e.g., on a page without a nav item marked active), hide the highlighter
            highlighter.style.opacity = '0';
        }
    }

    // --- Event Listeners for Dynamic Padding and Initial Highlighter Position ---
    // Call setMainPadding and positionHighlighterOnActive on load and resize
    window.addEventListener('load', () => {
        setMainPadding(); 
        positionHighlighterOnActive(); 
    });
    document.addEventListener('DOMContentLoaded', setMainPadding); 
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setMainPadding();
            positionHighlighterOnActive(); 
        }, 50); 
    });

    // Initial calls when the script runs
    setMainPadding();
    positionHighlighterOnActive(); 


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

    // --- NO JAVASCRIPT FOR HIGHLIGHTER HOVER MOVEMENT ---
    // The previous mouseenter/mouseleave event listeners for the highlighter are intentionally removed here.
    // The highlighter will now only be controlled by the 'active' state through positionHighlighterOnActive().


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
