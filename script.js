// This function runs only after the entire HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // --- Header and Navigation Elements ---
    const header = document.getElementById('main-header');
    const mainContent = document.querySelector('main'); 
    const nav = document.querySelector('.main-nav'); 
    const highlighter = nav ? nav.querySelector('.highlighter') : null; 
    const activeLink = nav ? nav.querySelector('a.active') : null; 
    const links = nav ? nav.querySelectorAll('li a') : []; 

    let isInitialPageLoad = true; 

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

    // Initialize layout and highlighter on page load and resize
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
    initializeLayout(); // Initial call

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
    
    // --- Scroll-Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll'); 
    elementsToAnimate.forEach(el => revealObserver.observe(el));

    // --- Expand/Collapse for Team Cards ---
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach(card => {
        const moreButton = card.querySelector('.more-button');
        const aboutSection = card.querySelector('.about-me-section');

        if (moreButton && aboutSection) {
            moreButton.addEventListener('click', () => {
                aboutSection.classList.toggle('expanded');
                
                if (aboutSection.classList.contains('expanded')) {
                    moreButton.textContent = 'Less';
                } else {
                    moreButton.textContent = 'More';
                }
            });
        }
    });

    // --- NEW: Typewriter Effect ---
    const typewriterElement = document.querySelector('.typewriter');

    if (typewriterElement) {
        const textToType = typewriterElement.textContent.trim();
        typewriterElement.textContent = ''; // Clear the text initially

        const typewriterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    let i = 0;
                    const cursor = document.createElement('span');
                    cursor.className = 'typewriter-cursor';
                    entry.target.appendChild(cursor);

                    function type() {
                        if (i < textToType.length) {
                            cursor.before(textToType.charAt(i));
                            i++;
                            setTimeout(type, 40); // Typing speed in milliseconds
                        } else {
                            cursor.remove(); // Remove cursor when typing is done
                        }
                    }
                    type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 }); // Start when 60% of the element is visible

        typewriterObserver.observe(typewriterElement);
    }
});
