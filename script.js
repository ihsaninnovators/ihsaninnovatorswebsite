document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); // Ensure this selects your <main> element

    // --- NEW: Dynamic Header Padding Fix Function ---
    let resizeTimeout;
    function setMainPadding() {
        if (header && mainContent) {
            // Get the computed height of the fixed header
            const headerHeight = header.offsetHeight; 
            // Apply this height as padding-top to the main content area
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Event Listeners for Dynamic Padding ---
    // 1. On initial load (ensures images/fonts in header are rendered)
    window.addEventListener('load', setMainPadding); 
    // 2. On DOMContentLoaded (as a fallback, ensures basic DOM is ready)
    document.addEventListener('DOMContentLoaded', setMainPadding);
    // 3. On window resize (with debounce for performance)
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setMainPadding, 50); // Debounce to prevent rapid recalculations
    });
    // 4. Also call it initially, in case 'load' fires after browser's internal rendering is complete
    setMainPadding();

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

    // --- Original Sliding Nav Highlighter ---
    const nav = document.querySelector('.main-nav');
    if (nav) {
        const highlighter = nav.querySelector('.highlighter');
        const activeLink = nav.querySelector('a.active');
        const links = nav.querySelectorAll('li a');

        function moveHighlighter(targetLink) {
            if (!targetLink || !highlighter) return;

            const linkRect = targetLink.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();

            highlighter.style.width = `${linkRect.width}px`;
            highlighter.style.height = `${linkRect.height}px`;

            const offsetLeft = linkRect.left - navRect.left;
            const offsetTop = linkRect.top - navRect.top;

            highlighter.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        }

        if (activeLink) {
           setTimeout(() => {
                moveHighlighter(activeLink);
           }, 100);
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveHighlighter(link));
        });

        nav.addEventListener('mouseleave', () => moveHighlighter(activeLink));
    }


    // --- Original Typewriter Effect Function ---
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
