// Abruzzo DiVino - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = (navMenu && navMenu.contains(event.target)) || 
                                (navToggle && navToggle.contains(event.target));
        if (!isClickInsideNav && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Improved smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            // Add/remove scrolled class based on scroll position
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        lastScrollTop = scrollTop;
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.cantina-card, .vino-card, .news-card, .intro-content');
    
    // Add fade-in class and observe elements
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Wine card hover effects
    const wineCards = document.querySelectorAll('.vino-card');
    wineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Fixed Cantina card button interactions
    const cantineButtons = document.querySelectorAll('.cantina-card .btn--secondary');
    cantineButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the cantina name from the card
            const cantineName = this.closest('.cantina-card').querySelector('h4').textContent;
            
            // Show cantina modal
            showCantineModal(cantineName);
        });
    });

    // Enhanced modal functionality for cantina details
    function showCantineModal(cantineName) {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 20px;
            box-sizing: border-box;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-sizing: border-box;
            max-height: 90vh;
            overflow-y: auto;
        `;

        modalContent.innerHTML = `
            <h3 style="color: var(--color-primary); margin-bottom: 1rem; font-family: var(--font-family-serif);">${cantineName}</h3>
            <p style="margin-bottom: 1.5rem; color: var(--color-text-secondary); line-height: 1.6;">
                Grazie per il tuo interesse! Presto sarà disponibile una pagina dedicata con tutte le informazioni su questa cantina, 
                inclusi dettagli sui vini, orari di visita e contatti per degustazioni.
            </p>
            <p style="margin-bottom: 1.5rem; color: var(--color-text-secondary); line-height: 1.6;">
                Nel frattempo, puoi contattarci per maggiori informazioni sui nostri vini e per organizzare 
                una visita guidata alla cantina.
            </p>
            <button class="btn btn--primary close-modal" style="margin-right: 10px;">Chiudi</button>
            <button class="btn btn--secondary contact-cantina">Contattaci</button>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Animate modal in
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Close modal functionality
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            document.body.style.overflow = '';
            setTimeout(() => {
                if (document.body.contains(modalOverlay)) {
                    document.body.removeChild(modalOverlay);
                }
            }, 300);
        };

        // Event listeners for closing
        const closeButton = modalContent.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // Contact button functionality
        const contactButton = modalContent.querySelector('.contact-cantina');
        if (contactButton) {
            contactButton.addEventListener('click', function() {
                closeModal();
                // Scroll to footer/contact section
                const footerSection = document.querySelector('#contatti');
                if (footerSection) {
                    footerSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-bg');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < hero.offsetHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Add subtle animation to wine tags
    const wineTags = document.querySelectorAll('.wine-tag');
    wineTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Enhanced News cards click functionality
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Prevent triggering if clicked on a link inside the card
            if (e.target.tagName.toLowerCase() === 'a') {
                return;
            }
            
            const title = this.querySelector('h4').textContent;
            const date = this.querySelector('.news-date').textContent;
            showNewsModal(title, date);
        });
    });

    function showNewsModal(title, date) {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Create modal for news
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 20px;
            box-sizing: border-box;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-sizing: border-box;
        `;

        modalContent.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <span style="background: var(--color-primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${date}</span>
            </div>
            <h3 style="color: var(--color-primary); margin-bottom: 1rem; line-height: 1.3; font-family: var(--font-family-serif);">${title}</h3>
            <p style="margin-bottom: 1.5rem; color: var(--color-text-secondary); line-height: 1.6;">
                Questo articolo contiene informazioni dettagliate sull'argomento selezionato. 
                In una versione completa del sito, qui troveresti il contenuto completo dell'articolo, 
                con immagini, approfondimenti e link correlati per esplorare ulteriormente 
                il mondo dell'enogastronomia abruzzese.
            </p>
            <p style="margin-bottom: 1.5rem; color: var(--color-text-secondary); line-height: 1.6;">
                Resta aggiornato sulle ultime novità delle nostre cantine, eventi speciali, 
                nuove produzioni e tutto quello che riguarda il territorio della Costa dei Trabocchi 
                e dell'entroterra abruzzese.
            </p>
            <div style="text-align: center;">
                <button class="btn btn--primary close-modal">Chiudi</button>
            </div>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            document.body.style.overflow = '';
            setTimeout(() => {
                if (document.body.contains(modalOverlay)) {
                    document.body.removeChild(modalOverlay);
                }
            }, 300);
        };

        const closeButton = modalContent.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 500);
        }
    });

    // Add click effects to social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simple feedback for social link clicks
            const originalText = this.textContent;
            this.textContent = 'Presto disponibile!';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 1500);
        });
    });

    // Hero CTA button functionality
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cantineSection = document.querySelector('#cantine');
            if (cantineSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = cantineSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    }

    // Add CSS for enhanced styling
    const style = document.createElement('style');
    style.textContent = `
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .modal-overlay * {
            box-sizing: border-box;
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .btn:active {
            transform: scale(0.95);
        }
        
        .cantina-card:hover,
        .vino-card:hover,
        .news-card:hover {
            box-shadow: 0 20px 60px rgba(107, 122, 63, 0.15);
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 1.5rem !important;
                margin: 20px !important;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('Abruzzo DiVino - Website loaded successfully! 🍷');
});