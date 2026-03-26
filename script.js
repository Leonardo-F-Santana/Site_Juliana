// script.js

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Initial Load Animations
window.addEventListener('load', () => {
    // Video scale down to normal
    gsap.to('.video-container', {
        scale: 1,
        duration: 2.5,
        ease: 'power3.out'
    });

    // Content fade in and float up for Title
    gsap.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    // Content fade in and blur removal for Subtitle
    gsap.to('.hero-subtitle', {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        delay: 0.5,
        ease: 'power3.out'
    });
});

// 2. Header Scroll Effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.remove('nav-transparent');
        header.classList.add('nav-scrolled');
    } else {
        header.classList.add('nav-transparent');
        header.classList.remove('nav-scrolled');
    }
});

// 3. Cinematic Video Scroll Parallax
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top", // Ends when hero leaves viewport
        scrub: 1, // Smooth interaction
        pin: ".hero-section", // Pin the section while we do the effect
        pinSpacing: false // Prevent extra space, allow next section to overlap smoothly
    }
});

// Video scales up slightly and moves up on scroll
heroTl.to(".video-container", {
    scale: 1.15,
    yPercent: -20, // Move up slowly
    ease: "none"
}, 0);

// Overlay darkens considerably as we scroll down
heroTl.to(".video-overlay", {
    background: "linear-gradient(to bottom, rgba(5,5,26,0.6) 0%, rgba(5,5,26,1) 100%)",
    ease: "none"
}, 0);

// Content fades out and moves up faster
heroTl.to(".hero-content", {
    opacity: 0,
    y: -100,
    scale: 0.9,
    ease: "power1.in"
}, 0);

heroTl.to(".scroll-indicator", {
    opacity: 0,
    y: 50,
    ease: "power1.in"
}, 0);

// 4. Smooth Section Reveals (Fade-up with blur)
const fadeElements = document.querySelectorAll('.fade-element');

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add slight blur drop effect before finalizing
            gsap.fromTo(entry.target, 
                { opacity: 0, y: 50, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
            );
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

fadeElements.forEach(el => {
    fadeObserver.observe(el);
});

// Base Section fade for the entire section boundary
const sections = document.querySelectorAll('.section-fade-up');
sections.forEach(sec => {
    gsap.fromTo(sec, 
        { opacity: 0.8, y: 50 },
        { 
            scrollTrigger: {
                trigger: sec,
                start: "top 95%",
                end: "top 70%",
                scrub: 1
            },
            opacity: 1, 
            y: 0 
        }
    );
});


// 5. Minimalist Particles for Inspiração Section
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 1; // 1px to 5px
        const x = Math.random() * 100; // 0% to 100%
        const y = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 20 + 10; // 10s to 30s
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.1;

        // Apply styles natively to keep js clean
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(212, 175, 55, ${opacity});
            border-radius: 50%;
            top: ${y}%;
            left: ${x}%;
            box-shadow: 0 0 ${size * 2}px rgba(212, 175, 55, 0.8);
        `;

        container.appendChild(particle);

        // Animate floating
        gsap.to(particle, {
            y: `-=${Math.random() * 100 + 50}`, // float up
            x: `+=${Math.random() * 50 - 25}`,  // drift left/right
            opacity: 0,
            duration: duration,
            delay: delay,
            repeat: -1,
            yoyo: false,
            ease: "none"
        });
    }
}

// Call particles after load to not block main thread
window.addEventListener('load', createParticles);

// 6. Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // 80px for header
                behavior: 'smooth'
            });
        }
    });
});
