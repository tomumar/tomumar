/* ================================================
   TOM UMAR - BOOK MARKETING SPECIALIST EXPERT
   Global JavaScript - Multi-Page Website
   2026 All Rights Reserved
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== INITIALIZE LUCIDE ICONS =====
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    const body = document.body;

    if (preloader) {
        const hidePreloader = () => {
            preloader.classList.add('hidden');
            if (body) body.classList.remove('no-scroll');
        };

        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 500);
        }, { once: true });

        setTimeout(hidePreloader, 1800);
    }

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        document.addEventListener('mousedown', () => cursorDot.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursorDot.classList.remove('clicking'));

        const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .card, .tag, .faq-item, [data-hover]');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll
    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Hamburger
    function toggleMobileMenu() {
        if (!hamburger || !navMenu) return;
        const isActive = hamburger.classList.contains('active');

        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');

        if (!isActive) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }

    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // ===== SCROLL ANIMATIONS =====
    const animElements = document.querySelectorAll('.anim-fade-up, .anim-fade-down, .anim-fade-right, .anim-fade-left, .anim-scale, .anim-rotate');

    if (animElements.length > 0) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        animElements.forEach(el => animObserver.observe(el));
    }

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (counter.dataset.animated === 'true') return;
                    counter.dataset.animated = 'true';

                    const target = parseFloat(counter.dataset.counter);
                    const decimals = counter.dataset.decimals ? parseInt(counter.dataset.decimals) : 0;
                    const prefix = counter.dataset.prefix || '';
                    const suffix = counter.dataset.suffix || '';
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const startTime = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = easeOut * target;

                        if (decimals > 0) {
                            counter.textContent = prefix + current.toFixed(decimals) + suffix;
                        } else {
                            const formatted = Math.floor(current);
                            if (formatted >= 1000000) {
                                counter.textContent = prefix + (formatted / 1000000).toFixed(0) + 'M' + suffix;
                            } else if (formatted >= 1000) {
                                counter.textContent = prefix + formatted.toLocaleString() + suffix;
                            } else {
                                counter.textContent = prefix + formatted + suffix;
                            }
                        }

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            if (decimals > 0) {
                                counter.textContent = prefix + target.toFixed(decimals) + suffix;
                            } else {
                                if (target >= 1000000) {
                                    counter.textContent = prefix + (target / 1000000).toFixed(0) + 'M' + suffix;
                                } else if (target >= 1000) {
                                    counter.textContent = prefix + target.toLocaleString() + suffix;
                                } else {
                                    counter.textContent = prefix + target + suffix;
                                }
                            }
                        }
                    }

                    requestAnimationFrame(update);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(c => counterObserver.observe(c));
    }
    animateCounters();

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ===== SMOOTH SCROLL (for same-page anchors) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navH = navbar ? navbar.offsetHeight : 80;
                const targetPos = target.offsetTop - navH - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== FORMSPREE CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            if (!submitBtn) return;

            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending your message...</span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.65';

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.innerHTML = '<span>Message Sent Successfully!</span>';
                    submitBtn.style.background = '#27ae60';
                    submitBtn.style.opacity = '1';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    }, 4500);
                } else {
                    throw new Error('Submission failed');
                }
            })
            .catch(() => {
                submitBtn.innerHTML = '<span>Error. Please try again.</span>';
                submitBtn.style.background = '#e74c3c';
                submitBtn.style.opacity = '1';

                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 3500);
            });
        });
    }

    // ===== PARALLAX SHAPES =====
    const heroShapes = document.querySelectorAll('.shape');
    if (heroShapes.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight * 1.5) {
                heroShapes.forEach((shape, index) => {
                    const speed = (index + 1) * 0.04;
                    shape.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        }, { passive: true });
    }

    // ===== STAGGER CHILDREN ANIMATION =====
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    if (staggerContainers.length > 0) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, i * 120);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        staggerContainers.forEach(c => staggerObserver.observe(c));
    }

    // ===== CURRENT YEAR =====
    const yearSpans = document.querySelectorAll('.current-year');
    yearSpans.forEach(span => {
        span.textContent = new Date().getFullYear();
    });

    // ===== ACTIVE NAV LINK BASED ON CURRENT PAGE =====
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Normalize paths
        let linkPath = href;
        if (linkPath.endsWith('index.html')) {
            linkPath = linkPath.replace('index.html', '');
        }

        if (currentPath === linkPath || currentPath.startsWith(linkPath) && linkPath !== '/' && linkPath !== '../') {
            link.classList.add('active');
        }

        // Handle home page
        if ((currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/tom-umar-website/') || currentPath.endsWith('/tom-umar-website/index.html')) && (href === '../' || href === '/' || href === 'index.html' || href === '../index.html')) {
            link.classList.add('active');
        }
    });

    // ===== TABS (used on services, etc.) =====
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabPanels = document.querySelectorAll('[data-tab-panel]');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                if (panel.dataset.tabPanel === target) {
                    panel.classList.add('active');
                    panel.style.display = 'block';
                } else {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                }
            });
        });
    });

    // ===== IMAGE LAZY LOADING FALLBACK =====
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
    } else {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imgObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imgObserver.observe(img));
    }

});