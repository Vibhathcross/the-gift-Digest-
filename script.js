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
    },
    cosmic_love: {
        title: "The Cosmic Love Edition",
        isBook: true
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
const bookScreen = document.getElementById('book-screen');
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

// Cosmic Book Elements
const btnBookBack = document.getElementById('btn-book-back');
const bookBtnPrev = document.getElementById('book-btn-prev');
const bookBtnNext = document.getElementById('book-btn-next');
const bookCurrentPageEl = document.getElementById('book-current-page');
const bookTotalPagesEl = document.getElementById('book-total-pages');
const bookTapPrev = document.getElementById('book-tap-prev');
const bookTapNext = document.getElementById('book-tap-next');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const bookPagesStack = document.getElementById('book-pages-stack');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAmbientParticles();
    setupEventListeners();
    checkDirectRoute();
});

// Window hash change support (allows back/forward browser navigation)
window.addEventListener('hashchange', () => {
    checkDirectRoute();
});

// Check if URL has a direct link to a section (e.g. #cosmic or ?section=cosmic)
function checkDirectRoute() {
    const hash = (window.location.hash || '').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const sectionParam = (params.get('section') || '').toLowerCase();

    if (hash === '#cosmic' || hash === '#cosmic_love' || sectionParam === 'cosmic' || sectionParam === 'cosmic_love') {
        if (introScreen) introScreen.classList.remove('active');
        if (sectionsScreen) sectionsScreen.classList.remove('active');
        if (galleryScreen) galleryScreen.classList.remove('active');
        openCosmicBook();
    } else if (hash === '#colophon' || sectionParam === 'colophon') {
        if (introScreen) introScreen.classList.remove('active');
        openSection('colophon');
    } else if (hash === '#memories' || hash === '#important_memories' || sectionParam === 'important_memories' || sectionParam === 'memories') {
        if (introScreen) introScreen.classList.remove('active');
        openSection('important_memories');
    }
}

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

    // Cosmic Book Back button
    if (btnBookBack) {
        btnBookBack.addEventListener('click', () => {
            switchScreen(bookScreen, sectionsScreen);
            currentSectionKey = null;
            try {
                if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname);
                }
            } catch (e) {}
        });
    }

    // Cosmic Book Navigation
    if (bookBtnNext) bookBtnNext.addEventListener('click', handleBookNext);
    if (bookBtnPrev) bookBtnPrev.addEventListener('click', handleBookPrev);
    if (bookTapNext) bookTapNext.addEventListener('click', handleBookNext);
    if (bookTapPrev) bookTapPrev.addEventListener('click', handleBookPrev);

    if (btnSoundToggle) {
        btnSoundToggle.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            btnSoundToggle.classList.toggle('muted', isSoundMuted);
        });
    }

    // Section cards clicks
    document.querySelectorAll('.section-card').forEach(card => {
        card.addEventListener('click', () => {
            const sectionKey = card.getAttribute('data-section');
            if (sectionKey && SECTIONS[sectionKey]) {
                openSection(sectionKey);
            }
        });
    });

    // Direct event listener for Cosmic Card and Open Book button
    const cardCosmic = document.getElementById('card-cosmic');
    if (cardCosmic) {
        cardCosmic.addEventListener('click', (e) => {
            openSection('cosmic_love');
        });
    }
    const btnOpenCosmic = document.getElementById('btn-open-cosmic');
    if (btnOpenCosmic) {
        btnOpenCosmic.addEventListener('click', (e) => {
            e.stopPropagation();
            openSection('cosmic_love');
        });
    }

    // Gallery navigation
    btnNext.addEventListener('click', handleNext);
    btnPrev.addEventListener('click', handlePrev);
    if (tapZoneNext) tapZoneNext.addEventListener('click', handleNext);
    if (tapZonePrev) tapZonePrev.addEventListener('click', handlePrev);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (galleryScreen.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'Escape') {
                btnBack.click();
            }
        } else if (bookScreen && bookScreen.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                handleBookNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleBookPrev();
            } else if (e.key === 'Escape') {
                btnBookBack.click();
            }
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
        const deltaX = e.changedTouches[0].screenX - touchStartX;
        const deltaY = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (galleryScreen.classList.contains('active')) {
                if (deltaX < 0) {
                    handleNext();
                } else if (deltaX > 0) {
                    handlePrev();
                }
            } else if (bookScreen && bookScreen.classList.contains('active')) {
                if (deltaX < 0) {
                    handleBookNext();
                } else if (deltaX > 0) {
                    handleBookPrev();
                }
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
    if (!section) return;

    if (section.isBook) {
        openCosmicBook();
        return;
    }

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

// ==========================================
// THE COSMIC LOVE EDITION - FANTASY BOOK SYSTEM
// ==========================================

const COSMIC_PAGES = [
    {
        chapterNum: "I",
        chapterTitle: "Two Different Worlds",
        seal: "1",
        caption: "Our story began across separate stars, where two different worlds found their way to one another.",
        paragraphs: [
            "Remember how two people from entirely different worlds, with different backgrounds, lifestyles, and ways of seeing life, somehow found their way to each other.",
            "How the very differences that could have kept us apart became the reasons we learned, grew, and came closer."
        ],
        accentQuote: "And even now, despite all that makes us different, we continue to choose each other. Perhaps our love was never about belonging to the same world, but about creating a beautiful little world of our own."
    },
    {
        chapterNum: "II",
        chapterTitle: "Sanctuary & Cosmic Energy",
        seal: "2",
        caption: "Where fingers intertwine and time pauses... Your hands speak the feelings that words cannot.",
        paragraphs: [
            "Remember how holding your hand always felt like coming home—a place where my heart could be completely at peace.",
            "Your hands speak the feelings words cannot, as if an unseen cosmic energy connects our souls and makes our bond deeper than ordinary love."
        ],
        accentQuote: "In the quiet warmth of your hand, I found an entire sanctuary where the universe makes sense."
    },
    {
        chapterNum: "III",
        chapterTitle: "When Nature Kept Us Close",
        seal: "3",
        caption: "Raindrops, laughter & delayed goodbyes... As if nature itself was trying to keep us together.",
        paragraphs: [
            "Remember those two beautiful moments when I felt like nature itself was trying to keep us together. That day at Microwave Viewpoint, when the unexpected rain turned our little walk into a carefree adventure filled with laughter and childish joy.",
            "And those other moments when rain delayed our goodbyes, giving us a little more time together even when disagreements stood between us."
        ],
        accentQuote: "Perhaps they were just coincidences, but my heart loved believing that the rain and nature had their own little ways of keeping us close."
    },
    {
        chapterNum: "IV",
        chapterTitle: "Moonlight, Fireflies & You",
        seal: "4",
        caption: "Moonlight, fireflies, and a gentle breeze... Yet nothing shone brighter than the blush on your face.",
        paragraphs: [
            "Remember how the night embraced us with moonlight, fireflies, and a gentle breeze, as if the universe had woven a little world just for us.",
            "Yet, nothing shone brighter than the blush on your face—a fleeting magic I wished time would never take away."
        ],
        accentQuote: "Holding the sun, walking beneath fireflies, and choosing you across every lifetime."
    }
];

let currentBookPage = 0;
let isBookFlipping = false;
let textAnimationTimer = null;
let isSoundMuted = false;
let isCosmicStarsInitialized = false;

function openCosmicBook() {
    if (navControls) navControls.classList.add('hidden');
    switchScreen(sectionsScreen, bookScreen);
    try {
        if (!isCosmicStarsInitialized) {
            initCosmicStars();
            isCosmicStarsInitialized = true;
        }
    } catch (err) {
        console.warn('Canvas init bypassed:', err);
    }
    currentBookPage = 0;
    renderBookFolio(0, false);
    try {
        if (window.location.hash !== '#cosmic') {
            history.replaceState(null, '', '#cosmic');
        }
    } catch (e) {}
}

function renderBookFolio(pageIndex, isFlippingForward = true) {
    const stack = bookPagesStack || document.getElementById('book-pages-stack');
    if (!stack) return;
    const page = COSMIC_PAGES[pageIndex];
    if (!page) return;

    isBookFlipping = true;

    // Play celestial chime
    playPageChime();

    // Prepare new folio HTML
    const folioEl = document.createElement('div');
    folioEl.className = 'book-folio';

    // Format paragraphs with dynamic word spans
    const paragraphsHtml = page.paragraphs.map((p, pIdx) => {
        const words = p.split(' ');
        let wordsHtml = '';
        if (pIdx === 0 && words.length > 0) {
            const firstWord = words[0];
            const firstLetter = firstWord.charAt(0);
            const restOfFirstWord = firstWord.slice(1);
            wordsHtml += `<span class="drop-cap">${firstLetter}</span><span class="magic-word">${restOfFirstWord} </span>`;
            for (let i = 1; i < words.length; i++) {
                wordsHtml += `<span class="magic-word">${words[i]} </span>`;
            }
        } else {
            wordsHtml = words.map(w => `<span class="magic-word">${w} </span>`).join('');
        }
        return `<p>${wordsHtml}</p>`;
    }).join('');

    folioEl.innerHTML = `
        <div class="page-ornate-border"></div>
        <div class="book-spine-divider"></div>
        
        <!-- Left Folio Wing (Illuminated Manuscript Sentence) -->
        <div class="folio-wing wing-left">
            <div class="left-manuscript-wrap">
                <div class="manuscript-seal-wrap">
                    <div class="manuscript-seal">${page.seal}</div>
                    <div class="seal-rays">✧ ✦ ✧</div>
                </div>
                <div class="left-poetic-sentence">${page.caption}</div>
                <div class="left-ornament-line">✦ ··· ✧ ··· ✦</div>
                <div class="left-whisper-text">A celestial chapter of our love</div>
            </div>
        </div>

        <!-- Right Folio Wing (Illuminated Story & Prominent Headings) -->
        <div class="folio-wing wing-right">
            <div class="right-page-content">
                <div class="chapter-badge">✦ CHAPTER ${page.chapterNum} ✦</div>
                <h2 class="chapter-title">${page.chapterTitle}</h2>
                <div class="parchment-divider">✧ ✦ ✧</div>
                <div class="narrative-body" id="current-narrative">
                    ${paragraphsHtml}
                    <div class="cosmic-quote-accent">
                        "${page.accentQuote}"
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingFolios = bookPagesStack.querySelectorAll('.book-folio');
    if (existingFolios.length > 0) {
        const oldFolio = existingFolios[existingFolios.length - 1];
        oldFolio.classList.remove('active');
        oldFolio.classList.add(isFlippingForward ? 'flipping-next' : 'flipping-prev');
        
        bookPagesStack.appendChild(folioEl);
        
        setTimeout(() => {
            folioEl.classList.add('active');
            oldFolio.remove();
            isBookFlipping = false;
            triggerNarrativeAnimation(folioEl.querySelector('.narrative-body'));
        }, 550);
    } else {
        bookPagesStack.appendChild(folioEl);
        setTimeout(() => {
            folioEl.classList.add('active');
            isBookFlipping = false;
            triggerNarrativeAnimation(folioEl.querySelector('.narrative-body'));
        }, 50);
    }

    // Update folio indicators & navigation buttons
    updateBookControls();
}

function updateBookControls() {
    if (bookCurrentPageEl) bookCurrentPageEl.textContent = COSMIC_PAGES[currentBookPage].chapterNum;
    if (bookTotalPagesEl) bookTotalPagesEl.textContent = "IV";

    if (bookBtnPrev) {
        bookBtnPrev.disabled = (currentBookPage === 0);
    }

    if (bookBtnNext) {
        if (currentBookPage === COSMIC_PAGES.length - 1) {
            bookBtnNext.innerHTML = `<span>Re-read Chapter I</span> <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.5 2v6h-6"></path><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>`;
        } else {
            bookBtnNext.innerHTML = `<span>Turn Page</span> <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
        }
    }
}

function handleBookNext() {
    if (isBookFlipping) return;
    if (currentBookPage < COSMIC_PAGES.length - 1) {
        currentBookPage++;
        renderBookFolio(currentBookPage, true);
    } else {
        // Replay from Chapter I
        currentBookPage = 0;
        renderBookFolio(0, true);
    }
}

function handleBookPrev() {
    if (isBookFlipping || currentBookPage <= 0) return;
    currentBookPage--;
    renderBookFolio(currentBookPage, false);
}

function triggerNarrativeAnimation(narrativeEl) {
    if (!narrativeEl) return;
    if (textAnimationTimer) {
        clearInterval(textAnimationTimer);
        textAnimationTimer = null;
    }

    const words = narrativeEl.querySelectorAll('.magic-word');
    if (!words.length) return;

    let index = 0;
    textAnimationTimer = setInterval(() => {
        if (index < words.length) {
            const w = words[index];
            w.classList.add('revealed', 'sparkle');
            setTimeout(() => w.classList.remove('sparkle'), 450);
            index++;
        } else {
            clearInterval(textAnimationTimer);
            textAnimationTimer = null;
        }
    }, 38);

    // Instant reveal on tap
    narrativeEl.onclick = () => {
        clearInterval(textAnimationTimer);
        textAnimationTimer = null;
        words.forEach(w => w.classList.add('revealed'));
    };
}

// Celestial audio synthesizer chime
let audioCtx = null;
function playPageChime() {
    if (isSoundMuted) return;
    try {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        if (!audioCtx) {
            audioCtx = new AudioCtor();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.35);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, now);
        osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.45);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.55);
        osc2.stop(now + 0.55);
    } catch (e) {
        // Audio might be waiting for user gesture
    }
}

// Cosmic Starlight & Shooting Star Animation
function initCosmicStars() {
    const canvas = document.getElementById('cosmic-book-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const stars = [];
    const starCount = window.innerWidth < 600 ? 55 : 95;

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.6 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.02 + 0.005,
            color: Math.random() > 0.4 ? 'rgba(255, 235, 190,' : (Math.random() > 0.5 ? 'rgba(220, 190, 255,' : 'rgba(255, 190, 210,')
        });
    }

    let shootingStar = null;

    function triggerShootingStar() {
        shootingStar = {
            x: Math.random() * width * 0.7,
            y: Math.random() * (height * 0.4),
            length: Math.random() * 80 + 50,
            speed: Math.random() * 7 + 9,
            alpha: 1.0,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2
        };
    }

    setInterval(() => {
        if (!shootingStar && Math.random() > 0.35) {
            triggerShootingStar();
        }
    }, 4500);

    function animateCosmic() {
        if (!bookScreen || !bookScreen.classList.contains('active')) {
            requestAnimationFrame(animateCosmic);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Draw stars
        stars.forEach(s => {
            s.alpha += Math.sin(Date.now() * s.speed) * 0.015;
            const clampedAlpha = Math.max(0.1, Math.min(0.95, s.alpha));
            ctx.fillStyle = `${s.color} ${clampedAlpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw shooting star
        if (shootingStar) {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 230, 180, ${shootingStar.alpha})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(shootingStar.x, shootingStar.y);
            const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
            const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
            ctx.restore();

            shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
            shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
            shootingStar.alpha -= 0.025;

            if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
                shootingStar = null;
            }
        }

        requestAnimationFrame(animateCosmic);
    }

    animateCosmic();
}
