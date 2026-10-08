/**
 * LOVE GALLERY - Multi-Section Romantic Gallery with Automatic GitHub Sync
 * Repository: Vibhathcross/the-gift-Digest-
 */

const GITHUB_OWNER = "Vibhathcross";
const GITHUB_REPO = "the-gift-Digest-";

// Section definitions with display names and mapped GitHub folder names
const SECTIONS = {
    colophon: {
        title: "Colophon",
        folder: "colophon",
        // Local fallback list in case GitHub API is offline or rate-limited
        fallbackImages: [
            "colophon/mnvnfg.jpeg",
            "colophon/scary2.jpeg",
            "colophon/scary3.jpeg",
            "colophon/scary4.jpeg",
            "colophon/scary6.jpeg",
            "colophon/scary7.jpeg",
            "colophon/WhatsApp Image 2026-10-08 at 19.28.06.jpeg",
            "colophon/WhatsApp Image 2026-10-08 at 19.28.07.jpeg"
        ]
    },
    important_memories: {
        title: "Important Memories",
        folder: "important_memories",
        fallbackImages: []
    }
};

// Global state
let currentSectionKey = null;
let currentImages = [];
let currentIndex = 0;
let isTransitioning = false;

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const sectionsScreen = document.getElementById('sections-screen');
const galleryScreen = document.getElementById('gallery-screen');
const navControls = document.getElementById('nav-controls');

const btnStart = document.getElementById('btn-start');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const tapZoneNext = document.getElementById('tap-zone-next');
const tapZonePrev = document.getElementById('tap-zone-prev');

const imgActive = document.getElementById('img-active');
const imgNext = document.getElementById('img-next');
const loadingSpinner = document.getElementById('loading-spinner');
const iconArrow = document.getElementById('icon-arrow');
const iconReplay = document.getElementById('icon-replay');
const categoryTitleEl = document.getElementById('gallery-category-title');
const currentIndexEl = document.getElementById('current-index');
const totalCountEl = document.getElementById('total-count');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAmbientParticles();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Intro screen button -> Switch to Fullscreen & Open Sections screen
    btnStart.addEventListener('click', () => {
        requestFullScreen();
        switchScreen(introScreen, sectionsScreen);
    });

    // Back to sections button
    btnBack.addEventListener('click', () => {
        switchScreen(galleryScreen, sectionsScreen);
        navControls.classList.add('hidden');
        currentSectionKey = null;
    });

    // Section cards clicks
    document.querySelectorAll('.section-card').forEach(card => {
        card.addEventListener('click', () => {
            const sectionKey = card.getAttribute('data-section');
            if (sectionKey && SECTIONS[sectionKey]) {
                openSection(sectionKey);
            }
        });
    });

    // Gallery navigation
    btnNext.addEventListener('click', handleNext);
    btnPrev.addEventListener('click', handlePrev);
    if (tapZoneNext) tapZoneNext.addEventListener('click', handleNext);
    if (tapZonePrev) tapZonePrev.addEventListener('click', handlePrev);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!galleryScreen.classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            handleNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'Escape') {
            btnBack.click();
        }
    });

    // Mobile touch gestures
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!galleryScreen.classList.contains('active')) return;
        const deltaX = e.changedTouches[0].screenX - touchStartX;
        const deltaY = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                handleNext();
            } else if (deltaX > 0) {
                handlePrev();
            }
        }
    }, { passive: true });
}

// Request Browser Fullscreen Mode
function requestFullScreen() {
    const docEl = document.documentElement;
    try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(() => {});
            } else if (docEl.webkitRequestFullscreen) {
                docEl.webkitRequestFullscreen();
            } else if (docEl.msRequestFullscreen) {
                docEl.msRequestFullscreen();
            }
        }
    } catch (err) {
        console.log('Fullscreen request bypassed:', err);
    }
}

// Smooth transition between screens
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    setTimeout(() => {
        toScreen.classList.add('active');
    }, 350);
}

// Open and load a specific section
async function openSection(sectionKey) {
    currentSectionKey = sectionKey;
    const section = SECTIONS[sectionKey];
    categoryTitleEl.textContent = section.title;

    switchScreen(sectionsScreen, galleryScreen);
    navControls.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    imgActive.classList.remove('active');
    imgNext.classList.remove('active');

    // Automatically fetch images from corresponding GitHub folder
    currentImages = await fetchImagesFromGitHub(section.folder, section.fallbackImages);
    loadingSpinner.classList.add('hidden');

    totalCountEl.textContent = currentImages.length;
    currentIndex = 0;

    if (currentImages.length > 0) {
        showImage(0);
    } else {
        currentIndexEl.textContent = "0";
        updateControls();
    }
}

// Automatically fetch list of files from GitHub API
async function fetchImagesFromGitHub(folderName, fallbackList) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folderName}`;
    const imageExtensions = /\.(jpe?g|png|webp|gif|svg)$/i;

    try {
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`GitHub API returned status ${response.status}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
            const imageUrls = data
                .filter(item => item.type === "file" && imageExtensions.test(item.name))
                .map(item => item.download_url || encodeURI(`${folderName}/${item.name}`));
            
            if (imageUrls.length > 0) {
                return imageUrls;
            }
        }
    } catch (err) {
        console.warn(`Could not load images dynamically from GitHub for ${folderName}:`, err);
    }

    return fallbackList || [];
}

// Display image at specific index with smooth fade
function showImage(newIndex) {
    if (newIndex < 0 || newIndex >= currentImages.length) return;

    isTransitioning = true;
    currentIndex = newIndex;

    const incomingImg = imgActive.classList.contains('active') ? imgNext : imgActive;
    const outgoingImg = incomingImg === imgActive ? imgNext : imgActive;

    incomingImg.src = currentImages[currentIndex];

    const onImageReady = () => {
        incomingImg.classList.add('active');
        outgoingImg.classList.remove('active');
        updateControls();

        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    };

    incomingImg.onload = onImageReady;
    incomingImg.onerror = () => {
        isTransitioning = false;
        updateControls();
    };

    if (incomingImg.complete && incomingImg.naturalWidth > 0) {
        onImageReady();
    }
}

// Next photo handler
function handleNext() {
    if (isTransitioning || currentImages.length === 0) return;

    if (currentIndex < currentImages.length - 1) {
        showImage(currentIndex + 1);
    } else {
        // Replay from first image of this collection
        showImage(0);
    }
}

// Previous photo handler
function handlePrev() {
    if (isTransitioning || currentIndex <= 0 || currentImages.length === 0) return;
    showImage(currentIndex - 1);
}

// Update UI Controls & Counter
function updateControls() {
    if (currentImages.length === 0) {
        currentIndexEl.textContent = "0";
        totalCountEl.textContent = "0";
        btnPrev.classList.add('hidden');
        iconArrow.classList.remove('hidden');
        iconReplay.classList.add('hidden');
        return;
    }

    currentIndexEl.textContent = currentIndex + 1;
    totalCountEl.textContent = currentImages.length;

    // Previous button visibility
    if (currentIndex > 0) {
        btnPrev.classList.remove('hidden');
    } else {
        btnPrev.classList.add('hidden');
    }

    // Next / Replay icon toggle
    if (currentIndex === currentImages.length - 1) {
        iconArrow.classList.add('hidden');
        iconReplay.classList.remove('hidden');
        btnNext.setAttribute('title', 'Replay Collection');
    } else {
        iconArrow.classList.remove('hidden');
        iconReplay.classList.add('hidden');
        btnNext.setAttribute('title', 'Next Memory');
    }
}

// Soft Ambient Heart Particle Animation
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
    const particleCount = window.innerWidth < 600 ? 16 : 24;

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
