// 1. SELECTORS & STATE
const pages = {
    home: document.getElementById('home-page'),
    features: document.getElementById('features-page'),
    workflow: document.getElementById('workflow-page'),
    support: document.getElementById('support-page'),
    privacy: document.getElementById('privacy-page')
};

const appRoot = document.getElementById('app-root');
const pageOrder = ['home', 'features', 'workflow', 'support', 'privacy'];
let currentPageId = 'home';
let pageTransitionAnimation = null;

const nav = document.querySelector('nav');
const menuToggle = document.getElementById('menuToggle');
const navLinksShellFrame = document.getElementById('navLinksShellFrame');
const navLinksShell = document.getElementById('navLinksShell');
const mobileNavBreakpoint = 768;

const rootStyle = document.documentElement.style;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

// 2. ROUTING & PAGE TRANSITIONS
function applyPageState(pageId) {
    Object.keys(pages).forEach(id => {
        if (pages[id]) pages[id].style.display = 'none';
    });
    if (pages[pageId]) pages[pageId].style.display = 'block';

    const brandLink = document.querySelector('.brand-link[data-page="home"]');
    brandLink?.classList.toggle('active', pageId === 'home');

    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        link.classList.toggle('active', linkPage === pageId);
    });

    currentPageId = pageId;
}

function resetPageTransitionStyles() {
    if (!appRoot) return;
    appRoot.style.opacity = '1';
    appRoot.style.transform = 'none';
    appRoot.style.filter = 'none';
}

function showPage(pageId, { animate = true } = {}) {
    if (!pages[pageId]) return;
    if (pageId === currentPageId && pages[pageId].style.display === 'block') return;

    if (!animate || !appRoot || typeof appRoot.animate !== 'function') {
        applyPageState(pageId);
        resetPageTransitionStyles();
        return;
    }

    if (pageTransitionAnimation) {
        pageTransitionAnimation.cancel();
        pageTransitionAnimation = null;
        resetPageTransitionStyles();
    }

    const currentIndex = pageOrder.indexOf(currentPageId);
    const nextIndex = pageOrder.indexOf(pageId);
    const movingForward = nextIndex >= currentIndex;
    const exitOffset = movingForward ? -28 : 28;
    const enterOffset = movingForward ? 28 : -28;

    const exitAnimation = appRoot.animate([
        { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' },
        { opacity: 0, transform: `translateX(${exitOffset}px) scale(0.985)`, filter: 'blur(10px)' }
    ], {
        duration: 220,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
    });

    pageTransitionAnimation = exitAnimation;

    exitAnimation.onfinish = () => {
        applyPageState(pageId);

        const enterAnimation = appRoot.animate([
            { opacity: 0, transform: `translateX(${enterOffset}px) scale(0.985)`, filter: 'blur(10px)' },
            { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' }
        ], {
            duration: 360,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        });

        pageTransitionAnimation = enterAnimation;

        enterAnimation.onfinish = () => {
            pageTransitionAnimation = null;
            resetPageTransitionStyles();
        };
    };
}

// 3. NAVIGATION LISTENERS
document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
        const targetPage = el.getAttribute('data-page');
        if (targetPage && pages[targetPage]) {
            e.preventDefault();
            showPage(targetPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.innerWidth <= mobileNavBreakpoint) {
                setMobileMenuState(false);
            }
        }
    });
});

function updateNavScrollState() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12);
}
window.addEventListener('scroll', updateNavScrollState, { passive: true });

// 4. MOBILE MENU
function setMobileMenuState(isOpen) {
    if (!navLinksShell || !navLinksShellFrame) return;

    navLinksShell.classList.toggle('show', isOpen);
    navLinksShell.classList.toggle('hidden', !isOpen);

    const isMobileViewport = window.innerWidth <= mobileNavBreakpoint;
    const isExpanded = isMobileViewport && isOpen;

    navLinksShellFrame.classList.toggle('show', isExpanded);

    if (menuToggle) {
        menuToggle.classList.toggle('active', isExpanded);
        menuToggle.setAttribute('aria-expanded', String(isExpanded));
        menuToggle.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    }

    navLinksShell.setAttribute('aria-hidden', isMobileViewport ? String(!isOpen) : 'false');
    navLinksShellFrame.setAttribute('aria-hidden', isMobileViewport ? String(!isOpen) : 'false');
    if (nav) nav.classList.toggle('menu-open', isExpanded);
}

if (menuToggle && navLinksShell && navLinksShellFrame) {
    menuToggle.addEventListener('click', () => {
        setMobileMenuState(!navLinksShell.classList.contains('show'));
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > mobileNavBreakpoint) return;
        if (!navLinksShell.classList.contains('show')) return;
        if (nav?.contains(event.target)) return;
        setMobileMenuState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (!navLinksShell.classList.contains('show')) return;
        setMobileMenuState(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > mobileNavBreakpoint) {
            setMobileMenuState(false);
        }
    });
}

// 5. STORE LINKS
const STORE_URLS = {
    play: 'https://play.google.com/store/apps/details?id=com.audipella',
    app: 'https://apps.apple.com/gh/app/audipella/id6759680938'
};

function getPreferredStoreUrl() {
    const userAgent = (navigator.userAgent || '').toLowerCase();
    const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
    return /android|windows/.test(userAgent) || /android|windows/.test(platform) ? STORE_URLS.play : STORE_URLS.app;
}

const downloadStoreLink = document.getElementById('downloadStoreLink');
if (downloadStoreLink) {
    const preferredStoreUrl = getPreferredStoreUrl();
    const preferredStoreName = preferredStoreUrl === STORE_URLS.play ? 'Google Play' : 'the App Store';
    downloadStoreLink.href = preferredStoreUrl;
    downloadStoreLink.target = '_blank';
    downloadStoreLink.rel = 'noopener noreferrer';
    downloadStoreLink.setAttribute('aria-label', `Download Audipella on ${preferredStoreName}`);
    downloadStoreLink.title = `Open ${preferredStoreName} in a new tab`;
}

// 6. AUDIO & WAVE ANIMATION
const backgroundAudio = document.getElementById('backgroundAudio');
const waveContainer = document.getElementById('wave-container');
const waveBars = waveContainer ? Array.from(waveContainer.querySelectorAll('.bar')) : [];
const waveDurations = [400, 550, 480, 620, 500];
const waveMultipliers = [1.2, 1.0, 1.0, 0.5, 1.4];
const waveMinHeight = 12;
const waveBaseHeight = 35;
let waveAnimations = [];

if (backgroundAudio) {
    const backgroundVolume = 0.02;
    let audioStarted = false;
    const unlockAudioEvents = ['pointerdown', 'touchstart', 'keydown'];

    function tryStartBackgroundAudio() {
        if (audioStarted) return;
        backgroundAudio.volume = backgroundVolume;
        backgroundAudio.muted = false;
        backgroundAudio.play().then(() => {
            audioStarted = true;
            unlockAudioEvents.forEach(ev => window.removeEventListener(ev, tryStartBackgroundAudio));
        }).catch(() => { });
    }

    window.addEventListener('load', () => window.requestAnimationFrame(tryStartBackgroundAudio), { once: true });
    unlockAudioEvents.forEach(ev => window.addEventListener(ev, tryStartBackgroundAudio, { once: true }));
}

function easeInOutSin(t) { return (1 - Math.cos(Math.PI * t)) / 2; }

function animateWaveBar(bar, duration, multiplier, phaseOffset) {
    let start = null, cancelled = false;
    function step(timestamp) {
        if (cancelled) return;
        if (start === null) start = timestamp - phaseOffset;
        const elapsed = timestamp - start;
        const cycleDuration = duration * 2 + 50;
        const t = (elapsed % cycleDuration) / cycleDuration;
        const halfPoint = duration / cycleDuration;
        const easedValue = t < halfPoint ? easeInOutSin(t / halfPoint) : easeInOutSin(1 - ((t - halfPoint) / (1 - halfPoint)));
        bar.style.height = `${waveMinHeight + ((waveBaseHeight * multiplier) - waveMinHeight) * easedValue}px`;
        bar.style.opacity = (0.6 + (0.4 * easedValue)).toFixed(3);
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
    return { stop() { cancelled = true; } };
}

function syncWaveAnimation() {
    waveAnimations.forEach(a => a.stop());
    if (prefersReducedMotion.matches || !waveBars.length) {
        waveBars.forEach((bar, i) => {
            bar.style.height = `${waveMinHeight + ((waveBaseHeight * waveMultipliers[i]) - waveMinHeight) * 0.45}px`;
            bar.style.opacity = '0.85';
        });
        return;
    }
    waveAnimations = waveBars.map((bar, i) => animateWaveBar(bar, waveDurations[i], waveMultipliers[i], i * (waveDurations[i] / 3)));
}

// 7. AMBIENT BACKGROUND
function setAmbientPosition(pX, pY, sX, sY) {
    rootStyle.setProperty('--cursor-x', `${pX}px`);
    rootStyle.setProperty('--cursor-y', `${pY}px`);
    rootStyle.setProperty('--cursor-x-soft', `${sX}px`);
    rootStyle.setProperty('--cursor-y-soft', `${sY}px`);
}

let aTargetX = window.innerWidth * 0.5, aTargetY = window.innerHeight * 0.3;
let aCurrX = aTargetX, aCurrY = aTargetY;

function animateAmbient() {
    aCurrX += (aTargetX - aCurrX) * 0.12;
    aCurrY += (aTargetY - aCurrY) * 0.12;
    setAmbientPosition(aCurrX, aCurrY, aCurrX + (window.innerWidth * 0.12), aCurrY - (window.innerHeight * 0.08));
    window.requestAnimationFrame(animateAmbient);
}

if (!prefersReducedMotion.matches && finePointer.matches) {
    window.addEventListener('pointermove', (e) => { aTargetX = e.clientX; aTargetY = e.clientY; });
    window.addEventListener('mouseleave', () => { aTargetX = window.innerWidth * 0.5; aTargetY = window.innerHeight * 0.3; });
    window.requestAnimationFrame(animateAmbient);
} else {
    setAmbientPosition(window.innerWidth * 0.52, window.innerHeight * 0.28, window.innerWidth * 0.64, window.innerHeight * 0.18);
}

// 8. FAQ ACCORDION
document.querySelectorAll('.faq-item').forEach(item => {
    const questionDiv = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = questionDiv?.querySelector('span');

    if (answer) answer.style.maxHeight = '0px';
    if (icon) icon.textContent = '+';

    questionDiv?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            const ans = i.querySelector('.faq-answer');
            if (ans) ans.style.maxHeight = '0px';
            const ic = i.querySelector('.faq-question span');
            if (ic) ic.textContent = '+';
        });

        if (!isOpen) {
            item.classList.add('open');
            if (answer) answer.style.maxHeight = prefersReducedMotion.matches ? 'none' : `${answer.scrollHeight}px`;
            if (icon) icon.textContent = '−';
        }
    });
});

// 9. 3D TILT
const card = document.querySelector('.phone-frame');
const container = document.querySelector('.phone-mockup-container');
let resetTimer;

if (card && container) {
    container.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        clearTimeout(resetTimer);
        card.style.transition = "none";
        const rect = container.getBoundingClientRect();
        const rotateX = (rect.height / 2 - (e.clientY - rect.top)) / 15;
        const rotateY = ((e.clientX - rect.left) - rect.width / 2) / 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-20px)`;
        resetTimer = setTimeout(() => {
            card.style.transition = "transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)";
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        }, 1500);
    });
}

// 10. INITIALIZATION

syncWaveAnimation();
updateNavScrollState();
setMobileMenuState(false);
showPage('home', { animate: false });
if (prefersReducedMotion.addEventListener) prefersReducedMotion.addEventListener('change', syncWaveAnimation);
