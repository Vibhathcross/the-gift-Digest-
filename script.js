/**
 * LOVE GALLERY - Mobile Optimized Romantic Image Gallery
 * Fully static HTML/CSS/JS compatible with GitHub Pages.
 */

// =========================================================================
// 1. YOUR IMAGES LIST
// Add your photo filenames here after placing them in the 'images/' folder.
// Example: "images/image1.jpg", "images/image2.png", "images/my_photo.webp"
// =========================================================================
const images = [
    "images/image1.jpg",
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.jpg"
];

// Current State: -1 represents Intro screen, 0..N-1 represent image indices
let currentIndex = -1;
let isTransitioning = false;

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const galleryScreen = document.getElementById('gallery-screen');
const imgActive = document.getElementById('img-active');
const imgNext = document.getElementById('img-next');
const placeholderMsg = document.getElementById('placeholder-msg');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const tapZoneNext = document.getElementById('tap-zone-next');
const tapZonePrev = document.getElementById('tap-zone-prev');
const iconArrow = document.getElementById('icon-arrow');
const iconReplay = document.getElementById('icon-replay');
const currentIndexEl = document.getElementById('current-index');
const totalCountEl = document.getElementById('total-count');

// Initialize Gallery Application
document.addEventListener('DOMContentLoaded', () => {
    totalCountEl.textContent = images.length;
    preloadImages();
    initAmbientParticles();
    setupEventListeners();
});

// Preload images for instant lag-free switching
function preloadImages() {
    if (images.length === 0) return;
    images.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

// Setup Interaction Listeners (Button Clicks, Mobile Tap Zones, Swipes, Keyboard)
function setupEventListeners() {
    btnNext.addEventListener('click', handleNext);
    btnPrev.addEventListener('click', handlePrev);

    // Full-screen screen tap zones for effortless mobile navigation
    if (tapZoneNext) tapZoneNext.addEventListener('click', handleNext);
    if (tapZonePrev) tapZonePrev.addEventListener('click', handlePrev);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            handleNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        }
    });

    // Mobile Touch Swipe Navigation (Swipe Left = Next, Swipe Right = Prev)
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Ensure horizontal swipe is dominant over vertical scroll
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                handleNext();
            } else if (deltaX > 0 && currentIndex > 0) {
                handlePrev();
            }
        }
    }, { passive: true });
}

// Handle Next Action (Intro -> Image 1 -> ... -> Last Image -> Replay)
function handleNext() {
    if (isTransitioning) return;

    if (images.length === 0) {
        showPlaceholder();
        return;
    }

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

// Handle Previous Action
function handlePrev() {
    if (isTransitioning || currentIndex <= 0) return;
    showImage(currentIndex - 1);
}

// Transition from Intro Screen into Gallery
function startGallery() {
    isTransitioning = true;
    currentIndex = 0;

    introScreen.classList.remove('active');
    
    setTimeout(() => {
        galleryScreen.classList.add('active');
        showImage(0, true);
    }, 400);
}

// Display specific image index with smooth crossfade
function showImage(newIndex, isFirstLoad = false) {
    if (newIndex < 0 || newIndex >= images.length) return;

    isTransitioning = true;
    currentIndex = newIndex;

    const incomingImg = imgActive.classList.contains('active') ? imgNext : imgActive;
    const outgoingImg = incomingImg === imgActive ? imgNext : imgActive;

    const targetSrc = images[currentIndex];
    incomingImg.src = targetSrc;

    const handleLoadSuccess = () => {
        placeholderMsg.classList.add('hidden');
        incomingImg.classList.add('active');
        outgoingImg.classList.remove('active');
        updateControls();

        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    };

    const handleLoadError = () => {
        showPlaceholder();
        incomingImg.classList.remove('active');
        outgoingImg.classList.remove('active');
        updateControls();
        isTransitioning = false;
    };

    incomingImg.onload = handleLoadSuccess;
    incomingImg.onerror = handleLoadError;

    if (incomingImg.complete && incomingImg.naturalWidth !== 0) {
        handleLoadSuccess();
    }
}

// Show graceful fallback message if image path is not found
function showPlaceholder() {
    placeholderMsg.classList.remove('hidden');
    imgActive.classList.remove('active');
    imgNext.classList.remove('active');
}

// Reset gallery back to Intro screen
function resetToIntro() {
    isTransitioning = true;
    currentIndex = -1;

    galleryScreen.classList.remove('active');
    imgActive.classList.remove('active');
    imgNext.classList.remove('active');
    placeholderMsg.classList.add('hidden');

    setTimeout(() => {
        introScreen.classList.add('active');
        updateControls();
        isTransitioning = false;
    }, 600);
}

// Update UI Controls & Counter
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
        
        if (currentIndex > 0) {
            btnPrev.classList.remove('hidden');
        } else {
            btnPrev.classList.add('hidden');
        }

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

/* --- Soft Ambient Floating Hearts Particle Canvas --- */
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
    const particleCount = window.innerWidth < 600 ? 16 : 26;

    class HeartParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 10 + 6;
            this.speedY = Math.random() * 0.5 + 0.25;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.35 + 0.15;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.4 + this.speedX;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = `rgba(180, 110, 125, ${this.opacity})`;
            ctx.beginPath();
            
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
        p.y = Math.random() * height;
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
