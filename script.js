document.addEventListener('DOMContentLoaded', () => {

    // --- Header and Navigation Elements ---
    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    const links = nav ? nav.querySelectorAll('li a') : []; 

    let isInitialPageLoad = true; 

    // --- Mobile Navigation Toggle ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const body = document.body;

    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            hamburgerMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburgerMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', (event) => {
            if (body.classList.contains('menu-open') && 
                !navMenu.contains(event.target) && 
                !hamburgerMenu.contains(event.target)) {

                navMenu.classList.remove('open');
                hamburgerMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // --- Dynamic Header Padding ---
    function setMainPadding() {
        if (header && mainContent) {
            const headerHeight = header.offsetHeight; 
            mainContent.style.paddingTop = `${headerHeight}px`;
        }
    }

    // --- Navigation Highlighter Logic ---
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
                highlighter.classList.remove('no-transition');
                isInitialPageLoad = false; 
            });
        }
    }

    const initializeLayout = () => {
        setMainPadding();
        if (activeLink) {
            moveHighlighter(activeLink);
        } else if (highlighter) {
            highlighter.style.opacity = '0';
        }
    };

    window.addEventListener('load', initializeLayout);
    window.addEventListener('resize', initializeLayout);
    initializeLayout();

    // --- Auto-Hiding Header Effect ---
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

    // --- Navigation Highlighter Hover Effect ---
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

    // --- Scroll-Reveal Animation Trigger ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll'); 
    elementsToReveal.forEach(el => revealObserver.observe(el));

    // --- Expand/Collapse for Team Cards ---
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        const moreButton = card.querySelector('.more-button');
        const aboutSection = card.querySelector('.about-me-section');

        if (moreButton && aboutSection) {
            moreButton.addEventListener('click', () => {
                const isExpanded = aboutSection.classList.toggle('expanded');
                moreButton.textContent = isExpanded ? 'Less' : 'More';
            });
        }
    });

    // --- Animated & Color-Changing Year Percentage Meter ---
    const animateMeter = (element, finalValue, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            const currentNumber = Math.floor(progress * finalValue);
            element.textContent = `${currentNumber}% Done`;

            element.style.backgroundPosition = `${currentNumber}% 0%`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = `${finalValue}% Done`;
                element.style.backgroundPosition = `${finalValue}% 0%`;
            }
        };
        window.requestAnimationFrame(step);
    };

    // --- Function to start all meter animations on page load ---
    function startMeterAnimations() {
        document.querySelectorAll('.timeline-item').forEach(item => {
            const meter = item.querySelector('.percentage-meter');
            const year = parseInt(item.dataset.year, 10);

            if (!year || !meter) return;

            let finalPercentage = 0;
            const now = new Date();
            // In case you want to test future dates, you can uncomment the line below:
            // const now = new Date('2025-08-01T12:00:00'); 

            if (now.getFullYear() > year) {
                finalPercentage = 100;
            } else if (now.getFullYear() === year) {
                const startOfYear = new Date(year, 0, 1);
                const endOfYear = new Date(year + 1, 0, 1);
                const totalMilliseconds = endOfYear - startOfYear;
                const elapsedMilliseconds = now - startOfYear;
                finalPercentage = Math.floor((elapsedMilliseconds / totalMilliseconds) * 100);
            }

            animateMeter(meter, finalPercentage, 2000);
        });
    }

    // Start the meter animations automatically
    startMeterAnimations();

});
