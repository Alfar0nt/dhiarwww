/* ============================================
   JavaScript - Dhiar Harianto Portfolio
   Handles: mobile menu, scroll animations,
   back-to-top, typing animation, sticky CTA
   ============================================ */

// --- DOM Elements ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');
const backToTopBtn = document.getElementById('back-to-top');
const stickyCta = document.getElementById('sticky-cta');
const navLinks = document.querySelectorAll('.nav-link');
const scrollAnimElements = document.querySelectorAll('.scroll-animate');
const typingTextElement = document.getElementById('typing-text');

// --- Mobile Menu Toggle ---
// Hamburger menu open/close with icon swap
mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenu.classList.toggle('hidden');
    
    // Swap hamburger/close icon
    if (isOpen) {
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
});

// --- Scroll-Triggered Animations ---
// Uses IntersectionObserver for performant scroll detection
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to save resources
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with scroll-animate class
scrollAnimElements.forEach(el => scrollObserver.observe(el));

// --- Scroll Event Handler ---
// Handles navbar shadow, back-to-top visibility, sticky CTA, and active nav link
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar shadow on scroll
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
        stickyCta.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
        stickyCta.classList.remove('visible');
    }
    
    // Active nav link highlight based on scroll position
    updateActiveNavLink();
}

// --- Active Navigation Link ---
// Highlights the nav link corresponding to the current section in view
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// --- Back to Top ---
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Typing Animation ---
// Loops through a list of phrases with typing and deleting effect
const phrases = [
    '// Welcome to my terminal',
    '// DevOps Enthusiast',
    '// Automation Lover',
    '// Cloud Native Builder'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Delete characters
        typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Faster when deleting
    } else {
        // Type characters
        typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal speed when typing
    }
    
    // Check if phrase is complete or deleted
    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing next phrase
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing animation
typeEffect();

// --- Smooth Scroll for All Anchor Links ---
// Ensures smooth scrolling behavior for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- Initialize ---
// Run initial scroll check on page load
handleScroll();
