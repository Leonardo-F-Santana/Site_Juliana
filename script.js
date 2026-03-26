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
        end: "+=100%",
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
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
                { opacity: 0, y: 30, filter: 'blur(6px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }
            );
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.05,
    rootMargin: "0px 0px 0px 0px"
});

fadeElements.forEach(el => {
    fadeObserver.observe(el);
});

// Base Section fade for the entire section boundary
const sections = document.querySelectorAll('.section-fade-up');
sections.forEach(sec => {
    gsap.fromTo(sec, 
        { opacity: 0, y: 30 },
        { 
            scrollTrigger: {
                trigger: sec,
                start: "top 95%",
                end: "top 80%",
                scrub: 0.5
            },
            opacity: 1, 
            y: 0 
        }
    );
});

// 4.5 Stagger Animation for Books Showcase
gsap.from(".stagger-card", {
    scrollTrigger: {
        trigger: ".livros-section",
        start: "top 90%",
        toggleActions: "play none none none"
    },
    y: 80,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 1.2,
    stagger: 0.25,
    ease: "power3.out",
    clearProps: "all"
});


// 5. Global Particles System with Interaction
let globalParticles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function createParticles() {
    const container = document.getElementById('global-particles');
    if (!container) return;

    // Increased count for global coverage
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 1; // 1px to 5px
        // Distribute physically across the viewable area initially
        let currentX = Math.random() * window.innerWidth;
        let currentY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.1;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(212, 175, 55, ${opacity});
            border-radius: 50%;
            top: 0;
            left: 0;
            transform: translate(${currentX}px, ${currentY}px);
            box-shadow: 0 0 ${size * 2}px rgba(212, 175, 55, 0.8);
            transition: transform 0.1s ease-out;
        `;

        container.appendChild(particle);

        // Store particle data for interaction
        globalParticles.push({
            el: particle,
            baseX: currentX,
            baseY: currentY,
            size: size,
            speed: Math.random() * 0.5 + 0.1
        });

        // Drift animation (independent of mouse)
        gsap.to(particle, {
            y: `-=${Math.random() * 150 + 50}`, // float up slowly across screen
            x: `+=${Math.random() * 100 - 50}`,  // drift left/right
            opacity: 0,
            duration: duration,
            delay: delay,
            repeat: -1,
            yoyo: false,
            ease: "none",
            onRepeat: () => {
                // Reset positions occasionally if needed
            }
        });
    }
}

// Track mouse
let fogFadeTimeout = null;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Interactive Fog: update position & intensify
    const fog = document.getElementById('interactive-fog');
    if (fog) {
        fog.style.setProperty('--fog-x', `${e.clientX}px`);
        fog.style.setProperty('--fog-y', `${e.clientY}px`);
        fog.style.opacity = '0.7';

        // Fade fog out after mouse stops
        clearTimeout(fogFadeTimeout);
        fogFadeTimeout = setTimeout(() => {
            fog.style.opacity = '0';
        }, 1500);
    }
});

// Interactive Loop
function updateParticlesInteraction() {
    globalParticles.forEach(p => {
        // Calculate distance from mouse
        const rect = p.el.getBoundingClientRect();
        const pX = rect.left + p.size / 2;
        const pY = rect.top + p.size / 2;
        
        const dx = mouseX - pX;
        const dy = mouseY - pY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Interaction radius
        const maxDist = 150;
        
        if (distance < maxDist) {
            // Gentle repulsion
            const force = (maxDist - distance) / maxDist;
            const moveX = (dx / distance) * force * -30 * p.speed;
            const moveY = (dy / distance) * force * -30 * p.speed;
            
            gsap.to(p.el, {
                x: `+=${moveX}`,
                y: `+=${moveY}`,
                duration: 0.5,
                ease: "power1.out",
                overwrite: "auto"
            });
        }
    });
    
    requestAnimationFrame(updateParticlesInteraction);
}

// 5.5 Fog Parallax effect
gsap.to("#fog-overlay", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    },
    y: "10%", // Slow movement backwards
    scale: 1.1,
    ease: "none"
});

// Call particles after load to not block main thread
window.addEventListener('load', () => {
    createParticles();
    requestAnimationFrame(updateParticlesInteraction);
});

// 6. Vanilla Tilt 3D effect initialization
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".modern-card"), {
        max: 12,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        "glare-prerender": false
    });
}

// 7. Smooth Scrolling for Navigation Links
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

// 8. Book Modal & Slider Logic
const bookData = {
    'entre-reinos': {
        title: "Entre Reinos",
        price: 49.90,
        synopsis: "Uma jornada épica de magia e fé onde acompanhamos a heroína descobrindo um mundo oculto paralelo ao nosso. Um chamado ancestral desperta poderes inexplorados, e a coragem nasce exatamente onde a esperança parece morrer. Mergulhe em um cenário rico repleto de mistérios sagrados e escolhas que mudarão destinos.",
        images: ['img/CapaEntreReinos.jpeg', 'img/EntreReinos_1.jpeg', 'img/EntreReinos_2.jpeg'],
        link: "#"
    },
    'te-dei-meu-coracao': {
        title: "Te Dei Meu Coração",
        price: 45.00,
        synopsis: "Um romance profundo e emocionante sobre superação, propósitos e redenção. Acompanhe a trajetória de personagens imperfeitos buscando a cura da própria alma enquanto enfrentam fantasmas do passado. O amor verdadeiro transcende o tempo e prova ser o maior dos milagres.",
        images: ['img/CapaTeDeiMeuCoracao.jpeg', 'img/personagem_1.jpeg'],
        link: "#"
    },
    'o-portal': {
        title: "O Portal",
        price: 39.90,
        synopsis: "Uma entrada fascinante para realidades sobrenaturais. Quando um segredo esquecido é revelado, as fronteiras entre o mundo físico e o espiritual se rompem. Com a ajuda da lendária raposa espiritual, os viajantes descobrem que há verdades que só os olhos astrais conseguem ler.",
        images: ['img/CapaOPortal.jpeg', 'img/RaposaOPortal.jpeg', 'img/RaposaOPortal1.jpeg'],
        link: "#"
    }
};

let currentSliderImages = [];
let currentSlideIndex = 0;
let currentModalBookId = null;

function openModal(bookId) {
    const data = bookData[bookId];
    if (!data) return;
    currentModalBookId = bookId;

    // Popula Title / Synopsis / Links
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-synopsis').innerText = data.synopsis;

    // Generate Slider Images
    const sliderContainer = document.getElementById('modal-slider');
    sliderContainer.innerHTML = ''; // Limpa
    currentSliderImages = data.images;
    currentSlideIndex = 0;

    currentSliderImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'slide';
        if (index === 0) img.classList.add('active');
        sliderContainer.appendChild(img);
    });

    // Toggle Navigation Buttons visibility based on array length
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (currentSliderImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }

    // Show Modal
    document.getElementById('book-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevents background scrolling
}

function closeModal(event) {
    // If event is passed, check if we clicked exactly on the overlay or the close button
    if (event && event.target.closest('.modal-content') && !event.target.closest('.close-modal-btn')) {
        return; // Clicked inside the content area, do nothing
    }

    document.getElementById('book-modal').classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scroll
}

function updateSlider() {
    const slides = document.querySelectorAll('#modal-slider .slide');
    slides.forEach((slide, index) => {
        if (index === currentSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function nextSlide() {
    if (currentSliderImages.length <= 1) return;
    currentSlideIndex = (currentSlideIndex + 1) % currentSliderImages.length;
    updateSlider();
}

function prevSlide() {
    if (currentSliderImages.length <= 1) return;
    currentSlideIndex = (currentSlideIndex - 1 + currentSliderImages.length) % currentSliderImages.length;
    updateSlider();
}

// 9. Spotlight Effect for Store Cards
document.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// =========================================
// 10. Carrinho de Compras (Shopping Cart)
// =========================================
let cart = JSON.parse(localStorage.getItem('ju_cart')) || [];

function saveCart() {
    localStorage.setItem('ju_cart', JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
    renderCartItems();
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

function updateCartIcon() {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    });
}

function addModalBookToCart() {
    if (!currentModalBookId) return;
    const data = bookData[currentModalBookId];
    addToCart(currentModalBookId, data.title, data.price, data.images[0]);
    closeModal(null);
}

function addToCart(id, title, price, imageSrc) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, imageSrc, quantity: 1 });
    }
    saveCart();
    openCart();
    
    // GSAP visual confirmation bounce on all icon badges
    const cartIcons = document.querySelectorAll('.cart-btn i');
    if (window.gsap && cartIcons.length > 0) {
        gsap.fromTo(cartIcons, 
            { scale: 1.5, color: "var(--gold-light)" },
            { scale: 1, color: "var(--text-main)", duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateQuantity(id, mod) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += mod;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
        }
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    if (!container || !totalEl) return;

    container.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Seu carrinho está vazio.</p>';
        totalEl.innerText = 'R$ 0,00';
        return;
    }

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remover">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        container.appendChild(itemEl);
    });

    totalEl.innerText = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

// Initial hydration securely on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});

// =========================================
// 11. Menu Mobile Drawer
// =========================================
function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}
