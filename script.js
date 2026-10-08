/**
 * LOVE GALLERY - Interactive Romantic Image Gallery
 * Compatible with GitHub Pages (Static HTML/CSS/JS)
 */

// 1. Array of images in the images/ folder
const images = [
    "images/image1.jpg",
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.jpg"
];

// Current state: -1 represents Intro screen, 0..N-1 represent image indices
let currentIndex = -1;
let isTransitioning = false;

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const galleryScreen = document.getElementById('gallery-screen');
const imgActive = document.getElementById('img-active');
const imgNext = document.getElementById('img-next');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const iconArrow = document.getElementById('icon-arrow');
const iconReplay = document.getElementById('icon-replay');
const currentIndexEl = document.getElementById('current-index');
const totalCountEl = document.getElementById('total-count');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalCountEl.textContent = images.length;
    preloadImages();
    initAmbientParticles();
    setupEventListeners();
});

// Preload all images to ensure lag-free, smooth fade transitions
function preloadImages() {
    images.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

// Setup Event Listeners (Clicks, Keyboard, Touch Swipes)
function setupEventListeners() {
    btnNext.addEventListener('click', handleNext);
    btnPrev.addEventListener('click', handlePrev);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            handleNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        }
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance < 0) {
                // Swiped Left -> Next
                handleNext();
            } else if (swipeDistance > 0 && currentIndex > 0) {
                // Swiped Right -> Previous
                handlePrev();
            }
        }
    }
}

// Next button handler (Intro -> Image 1 -> ... -> Last Image -> Replay)
function handleNext() {
    if (isTransitioning) return;

    if (currentIndex === -1) {
        // Transition from Intro Screen to First Image
        startGallery();
    } else if (currentIndex < images.length - 1) {
        // Show Next Image
        showImage(currentIndex + 1);
    } else {
        // Replay: Reset back to Intro screen
        resetToIntro();
    }
}

// Previous button handler
function handlePrev() {
    if (isTransitioning || currentIndex <= 0) return;
    showImage(currentIndex - 1);
}

// Start the gallery from Intro Screen
function startGallery() {
    isTransitioning = true;
    currentIndex = 0;

    // Load first image into active img slot
    imgActive.src = images[0];

    // Fade out intro screen, fade in gallery screen
    introScreen.classList.remove('active');
    
    setTimeout(() => {
        galleryScreen.classList.add('active');
        imgActive.classList.add('active');
        updateControls();
        isTransitioning = false;
    }, 400);
}

// Transition to a specific image index
function showImage(newIndex) {
    if (newIndex < 0 || newIndex >= images.length || newIndex === currentIndex) return;
    
    isTransitioning = true;
    const isGoingForward = newIndex > currentIndex;
    currentIndex = newIndex;

    // Smooth double-buffer crossfade
    const incomingImg = imgActive.classList.contains('active') ? imgNext : imgActive;
    const outgoingImg = incomingImg === imgActive ? imgNext : imgActive;

    incomingImg.src = images[currentIndex];

    // Wait until image is ready/cached then crossfade
    incomingImg.onload = () => {
        incomingImg.classList.add('active');
        outgoingImg.classList.remove('active');
        updateControls();

        setTimeout(() => {
            isTransitioning = false;
        }, 700);
    };

    // Fallback if cached immediately
    if (incomingImg.complete) {
        incomingImg.onload();
    }
}

// Reset gallery back to Intro screen
function resetToIntro() {
    isTransitioning = true;
    currentIndex = -1;

    galleryScreen.classList.remove('active');
    imgActive.classList.remove('active');
    imgNext.classList.remove('active');

    setTimeout(() => {
        introScreen.classList.add('active');
        updateControls();
        isTransitioning = false;
    }, 600);
}

// Update Navigation Controls & Counter
function updateControls() {
    if (currentIndex === -1) {
        // Intro state
        btnPrev.classList.add('hidden');
        iconArrow.classList.remove('hidden');
        iconReplay.classList.add('hidden');
        btnNext.setAttribute('title', 'Start Gallery');
    } else {
        // Gallery state
        currentIndexEl.textContent = currentIndex + 1;
        
        // Show/hide previous button
        if (currentIndex > 0) {
            btnPrev.classList.remove('hidden');
        } else {
            btnPrev.classList.add('hidden');
        }

        // Check if on last image
        if (currentIndex === images.length - 1) {
            iconArrow.classList.add('hidden');
            iconReplay.classList.remove('hidden');
            btnNext.setAttribute('title', 'Replay Gallery');
        } else {
            iconArrow.classList.remove('hidden');
            iconReplay.classList.add('hidden');
            btnNext.setAttribute('title', 'Next Memory');
        }
    }
}

/* --- Soft Ambient Heart Particle Animation --- */
function initAmbientParticles() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 24;

    class HeartParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 0.6 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = `rgba(180, 110, 125, ${this.opacity})`;
            ctx.beginPath();
            
            // Draw small romantic heart shape
            const s = this.size / 15;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-10 * s, -10 * s, -15 * s, 5 * s, 0, 15 * s);
            ctx.bezierCurveTo(15 * s, 5 * s, 10 * s, -10 * s, 0, 0);
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        const p = new HeartParticle();
        p.y = Math.random() * height; // distribute initially across screen
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}
