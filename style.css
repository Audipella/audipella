// 1. SELECTORS & STATE
const pages = {
    home: document.getElementById('home-page'),
    features: document.getElementById('features-page'),
    workflow: document.getElementById('workflow-page'),
    'detailed-features': document.getElementById('detailed-features-page'),
    'yt-download': document.getElementById('yt-download-page'),
    support: document.getElementById('support-page'),
    privacy: document.getElementById('privacy-page')
};

const appRoot = document.getElementById('app-root');
const pageOrder = ['home', 'features', 'detailed-features', 'workflow', 'yt-download', 'support', 'privacy'];
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
const hoverCapable = window.matchMedia('(hover: hover)');

// 2. ROUTING & PAGE TRANSITIONS
function applyPageState(pageId) {
    window.location.hash = pageId === 'home' ? '' : pageId;

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


document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncWaveAnimation();
});

// Mode Tabs for Workflow Page and Detailed Features Page
function initModeTabs() {
    // Handle workflow page tabs
    const workflowTabs = document.querySelector('#workflow-page .mode-tab');
    const playerSteps = document.querySelector('.mode-steps-player');
    const studioSteps = document.querySelector('.mode-steps-studio');

    if (workflowTabs && playerSteps && studioSteps) {
        const workflowPageTabs = document.querySelectorAll('#workflow-page .mode-tab');
        workflowPageTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.mode;

                // Update tab states within this page only
                workflowPageTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show/hide appropriate steps
                if (mode === 'player') {
                    playerSteps.style.display = 'flex';
                    studioSteps.style.display = 'none';
                } else {
                    playerSteps.style.display = 'none';
                    studioSteps.style.display = 'flex';
                }
            });
        });
    }

    // Handle detailed features page tabs
    const detailedFeaturesTabs = document.querySelector('#detailed-features-page .mode-tab');
    const featureContents = document.querySelectorAll('.feature-mode-content');

    if (detailedFeaturesTabs && featureContents.length) {
        const detailsPageTabs = document.querySelectorAll('#detailed-features-page .mode-tab');
        detailsPageTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.mode;

                // Update tab states within this page only
                detailsPageTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show/hide appropriate feature sections
                featureContents.forEach(content => {
                    const contentMode = content.dataset.content;
                    content.style.display = contentMode === mode ? 'block' : 'none';
                });
            });
        });
    }
}

// Initialize mode tabs on load
initModeTabs();

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
    const backgroundVolume = 0.008;
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

// AFTER
function animateWaveBar(bar, duration, multiplier, phaseOffset) {
    let start = null, cancelled = false;
    function step(timestamp) {
        if (cancelled) return;
        if (document.hidden) {
            // pause loop while tab/app is backgrounded, resume on next visible frame
            window.requestAnimationFrame(step);
            return;
        }
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
    if (!waveBars.length) {
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
let ambientAnimationFrame = null;
let ambientTrackingEnabled = false;

function setAmbientFallbackPosition() {
    const primaryX = window.innerWidth * 0.52;
    const primaryY = window.innerHeight * 0.28;
    const secondaryX = window.innerWidth * 0.64;
    const secondaryY = window.innerHeight * 0.18;
    aTargetX = primaryX;
    aTargetY = primaryY;
    aCurrX = primaryX;
    aCurrY = primaryY;
    setAmbientPosition(primaryX, primaryY, secondaryX, secondaryY);
}

function resetAmbientTarget() {
    aTargetX = window.innerWidth * 0.5;
    aTargetY = window.innerHeight * 0.3;
}

function handleAmbientPointerMove(e) {
    aTargetX = e.clientX;
    aTargetY = e.clientY;
}

function shouldAnimateAmbient() {
    return hoverCapable.matches
        && finePointer.matches
        && window.innerWidth > mobileNavBreakpoint;
}

// NEW: gentle auto-pan for touch/iOS devices
let autoPanFrame = null;
let autoPanStart = null;

// AFTER
function startAmbientAutoPan() {
    if (autoPanFrame !== null) return; // already running, leave it alone

    function step(ts) {
        if (autoPanStart === null) autoPanStart = ts;
        const elapsed = ts - autoPanStart;
        const pX = window.innerWidth * (0.38 + 0.24 * Math.sin(elapsed / 7000));
        const pY = window.innerHeight * (0.22 + 0.18 * Math.sin(elapsed / 9000 + 1));
        const sX = window.innerWidth * (0.62 + 0.16 * Math.sin(elapsed / 6000 + 2));
        const sY = window.innerHeight * (0.14 + 0.12 * Math.sin(elapsed / 8000 + 3));
        setAmbientPosition(pX, pY, sX, sY);
        autoPanFrame = window.requestAnimationFrame(step);
    }
    autoPanFrame = window.requestAnimationFrame(step);
}

function stopAmbientAutoPan() {
    if (autoPanFrame !== null) {
        window.cancelAnimationFrame(autoPanFrame);
        autoPanFrame = null;
        autoPanStart = null;
    }
}

function animateAmbient() {
    if (!ambientTrackingEnabled) {
        ambientAnimationFrame = null;
        return;
    }
    aCurrX += (aTargetX - aCurrX) * 0.12;
    aCurrY += (aTargetY - aCurrY) * 0.12;
    setAmbientPosition(aCurrX, aCurrY, aCurrX + (window.innerWidth * 0.12), aCurrY - (window.innerHeight * 0.08));
    ambientAnimationFrame = window.requestAnimationFrame(animateAmbient);
}

// AFTER
function syncAmbientAnimation() {
    const shouldAnimate = shouldAnimateAmbient();

    if (shouldAnimate === ambientTrackingEnabled) {
        if (!shouldAnimate) {
            startAmbientAutoPan(); // slow auto-pan instead of frozen
        }
        return;
    }

    ambientTrackingEnabled = shouldAnimate;

    if (ambientTrackingEnabled) {
        stopAmbientAutoPan();
        resetAmbientTarget();
        aCurrX = aTargetX;
        aCurrY = aTargetY;
        window.addEventListener('pointermove', handleAmbientPointerMove);
        window.addEventListener('mouseleave', resetAmbientTarget);
        if (ambientAnimationFrame === null) {
            ambientAnimationFrame = window.requestAnimationFrame(animateAmbient);
        }
        return;
    }

    window.removeEventListener('pointermove', handleAmbientPointerMove);
    window.removeEventListener('mouseleave', resetAmbientTarget);
    if (ambientAnimationFrame !== null) {
        window.cancelAnimationFrame(ambientAnimationFrame);
        ambientAnimationFrame = null;
    }
    stopAmbientAutoPan();
    startAmbientAutoPan(); // gentle motion for touch/iOS
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
            if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
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

// 10. YOUTUBE DOWNLOAD
function initYouTubeDownload() {
    const STREAM_BASE_URL = 'https://audipella.greengraphicx.com/stream';
    const STREAM_API_KEY = 'audipella-secure-2026';

    const form = document.getElementById('ytDownloadForm');
    const urlInput = document.getElementById('youtubeUrl');
    const downloadButton = document.getElementById('ytDownloadButton');
    const cancelButton = document.getElementById('ytCancelButton');
    const feedback = document.getElementById('ytDownloadFeedback');
    const statusPanel = document.getElementById('ytDownloadStatus');
    const preview = document.getElementById('ytVideoPreview');
    const videoThumb = document.getElementById('ytVideoThumb');
    const videoTitle = document.getElementById('ytVideoTitle');
    const videoMeta = document.getElementById('ytVideoMeta');
    const progressBar = document.getElementById('ytProgressBar');
    const progressText = document.getElementById('ytProgressText');
    const progressPercent = document.getElementById('ytProgressPercent');

    if (!form || !urlInput || !downloadButton || !feedback) return;

    let activeJobId = null;
    let isBusy = false;
    let completionCleanupTimer = null;

    function isNetworkFetchError(error) {
        return error instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(error?.message || '');
    }

    function normalizeYouTubeUrl(value) {
        const trimmed = String(value || '').trim();
        if (!trimmed) return '';
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    }

    function getYouTubeId(value) {
        const normalized = normalizeYouTubeUrl(value);
        if (!normalized) return null;

        try {
            const url = new URL(normalized);
            const host = url.hostname.toLowerCase().replace(/^www\./, '');
            let videoId = null;

            if (host === 'youtu.be') {
                videoId = url.pathname.split('/').filter(Boolean)[0];
            } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (url.pathname === '/watch') {
                    videoId = url.searchParams.get('v');
                } else if ((pathParts[0] === 'shorts' || pathParts[0] === 'embed') && pathParts[1]) {
                    videoId = pathParts[1];
                }
            }

            return /^[a-zA-Z0-9_-]{11}$/.test(videoId || '') ? videoId : null;
        } catch (error) {
            return null;
        }
    }

    function authHeaders(extraHeaders = {}) {
        return {
            'X-Api-Key': STREAM_API_KEY,
            ...extraHeaders
        };
    }

    function withApiKey(url) {
        const nextUrl = new URL(url);
        nextUrl.searchParams.set('apiKey', STREAM_API_KEY);
        return nextUrl.toString();
    }

    function setFeedback(message, isError = false) {
        feedback.textContent = message;
        feedback.classList.toggle('is-error', isError);
    }

    function syncButtonState(showInvalid = false, updateFeedback = true) {
        const hasValidUrl = Boolean(getYouTubeId(urlInput.value));
        downloadButton.disabled = isBusy || !hasValidUrl;
        urlInput.classList.toggle('is-invalid', showInvalid && Boolean(urlInput.value.trim()) && !hasValidUrl);

        if (!isBusy && updateFeedback) {
            setFeedback(hasValidUrl ? 'Ready to download.' : 'Enter a valid YouTube link to enable download.', false);
        }
    }

    function setProgress(percent, detail, options = {}) {
        if (!progressBar || !progressPercent || !progressText) return;
        const { indeterminate = false, percentLabel = null } = options;
        const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
        progressBar.classList.toggle('is-indeterminate', indeterminate);
        progressBar.style.width = indeterminate ? '100%' : `${safePercent}%`;
        progressPercent.textContent = percentLabel || (indeterminate ? 'Working' : `${Math.round(safePercent)}%`);
        progressText.textContent = detail || 'Working...';
    }

    function setDownloadStage(percent, detail, feedbackMessage = detail, options = {}) {
        setProgress(percent, detail, options);
        setFeedback(feedbackMessage, Boolean(options.isError));
    }

    function clearCompletionCleanup() {
        if (completionCleanupTimer !== null) {
            window.clearTimeout(completionCleanupTimer);
            completionCleanupTimer = null;
        }
    }

    function resetDownloadStatus() {
        if (isBusy) return;
        clearCompletionCleanup();
        activeJobId = null;
        preview?.classList.remove('is-visible');
        statusPanel?.classList.remove('is-visible');
        setProgress(0, 'Waiting...');
    }

    function scheduleCompletionCleanup(delay = 2600) {
        clearCompletionCleanup();
        completionCleanupTimer = window.setTimeout(() => {
            completionCleanupTimer = null;
            if (isBusy) return;
            preview?.classList.remove('is-visible');
            statusPanel?.classList.remove('is-visible');
            setProgress(0, 'Waiting...');
            syncButtonState(false);
        }, delay);
    }

    function formatDuration(value) {
        const seconds = Number(value);
        if (!Number.isFinite(seconds) || seconds <= 0) return '';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
        return hours > 0
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds}`
            : `${minutes}:${remainingSeconds}`;
    }

    function showPreview(info) {
        if (!preview || !videoTitle || !videoMeta || !videoThumb) return;

        const title = info?.title || 'YouTube audio';
        const author = info?.author || info?.artist || info?.uploader || info?.channel || 'Unknown artist';
        const duration = formatDuration(info?.lengthSeconds || info?.duration || 0);

        videoTitle.textContent = title;
        videoMeta.textContent = duration ? `${author} - ${duration}` : author;

        if (info?.thumbnail) {
            videoThumb.src = info.thumbnail;
            videoThumb.alt = `${title} thumbnail`;
            videoThumb.hidden = false;
        } else {
            videoThumb.removeAttribute('src');
            videoThumb.alt = '';
            videoThumb.hidden = true;
        }

        preview.classList.add('is-visible');
    }

    function sleep(ms) {
        return new Promise(resolve => window.setTimeout(resolve, ms));
    }

    async function parseResponse(response) {
        const text = await response.text();
        if (!text) return {};

        try {
            return JSON.parse(text);
        } catch (error) {
            return { error: text };
        }
    }

    async function apiPost(path, body) {
        const response = await fetch(`${STREAM_BASE_URL}${path}`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body || {})
        });
        const payload = await parseResponse(response);

        if (!response.ok) {
            throw new Error(payload.error || payload.details || 'The audio server could not complete the request.');
        }

        return payload;
    }

    async function apiGet(path) {
        const response = await fetch(`${STREAM_BASE_URL}${path}`, {
            method: 'GET',
            headers: authHeaders()
        });
        const payload = await parseResponse(response);

        if (!response.ok) {
            throw new Error(payload.error || payload.details || 'The audio server could not complete the request.');
        }

        return payload;
    }

    function getServerProgress(data) {
        if (data?.status === 'ready') return 86;
        return Math.min(84, Math.max(0, Number(data?.progressPercent) || 0));
    }

    function getServerDetail(data) {
        const detail = typeof data?.detail === 'string' ? data.detail.trim() : '';
        if (detail) return detail;

        switch (data?.phase || data?.status) {
            case 'queued':
                return 'Queued on the audio server...';
            case 'preparing':
                return 'Preparing audio...';
            case 'downloading':
                return 'Downloading audio...';
            case 'converting':
                return 'Converting to MP3...';
            case 'tagging':
                return 'Embedding metadata...';
            case 'ready':
                return 'Audio is ready to save.';
            default:
                return 'Preparing audio...';
        }
    }

    function getServerFeedback(data) {
        switch (data?.phase || data?.status) {
            case 'queued':
                return 'Queued on the server.';
            case 'preparing':
                return 'Preparing the audio file.';
            case 'downloading':
                return 'Downloading audio from YouTube.';
            case 'converting':
                return 'Converting audio to MP3.';
            case 'tagging':
                return 'Adding title and artwork metadata.';
            case 'ready':
                return 'Audio is ready. Saving now.';
            default:
                return 'Processing audio...';
        }
    }

    async function pollUntilReady(jobId) {
        while (activeJobId === jobId) {
            const data = await apiGet(`/fetch-status/${encodeURIComponent(jobId)}`);
            setDownloadStage(getServerProgress(data), getServerDetail(data), getServerFeedback(data));

            if (data.videoInfo) {
                showPreview(data.videoInfo);
            }

            if (data.status === 'ready') {
                setDownloadStage(86, 'Audio is ready. Preparing browser save...', 'Audio is ready. Saving now.');
                return data;
            }

            if (data.status === 'error') {
                throw new Error(data.detail || 'Download failed.');
            }

            if (data.status === 'cancelled') {
                throw new Error(data.detail || 'Download was cancelled.');
            }

            await sleep(1250);
        }

        throw new Error('Download was cancelled.');
    }

    function getSafeFilename(info) {
        const title = info?.title || 'audipella-audio';
        const safeTitle = title.replace(/[^a-z0-9\s._-]/gi, '').trim().slice(0, 80) || 'audipella-audio';
        return `${safeTitle}.mp3`;
    }

    function clickDownloadUrl(url) {
        const link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function startDirectFetchDownload(url) {
        const directUrl = withApiKey(`${STREAM_BASE_URL}/fetch?url=${encodeURIComponent(url)}`);
        clickDownloadUrl(directUrl);
    }

    function startDirectResultDownload(jobId) {
        const resultUrl = withApiKey(`${STREAM_BASE_URL}/fetch-result/${encodeURIComponent(jobId)}?wait=1`);
        clickDownloadUrl(resultUrl);
    }

    async function readAudioBlobWithProgress(response) {
        const totalBytes = Number(response.headers.get('content-length')) || 0;
        const contentType = response.headers.get('content-type') || 'audio/mpeg';

        if (!response.body || !totalBytes) {
            setDownloadStage(92, 'Saving MP3 to your device...', 'Saving the MP3 file.');
            return response.blob();
        }

        const reader = response.body.getReader();
        const chunks = [];
        let loadedBytes = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            loadedBytes += value.byteLength;
            const fileProgress = loadedBytes / totalBytes;
            const displayProgress = 88 + (fileProgress * 11);
            setDownloadStage(
                displayProgress,
                'Saving MP3 to your device...',
                'Saving the MP3 file.',
                { percentLabel: `${Math.round(displayProgress)}%` }
            );
        }

        return new Blob(chunks, { type: contentType });
    }

    async function startBrowserDownload(jobId, info) {
        setDownloadStage(88, 'Receiving MP3 from the server...', 'Saving the MP3 file.');

        let response;
        try {
            response = await fetch(`${STREAM_BASE_URL}/fetch-result/${encodeURIComponent(jobId)}`, {
                method: 'GET',
                headers: authHeaders()
            });
        } catch (error) {
            if (isNetworkFetchError(error)) {
                startDirectResultDownload(jobId);
                setDownloadStage(
                    38,
                    'Browser is waiting for the finished MP3...',
                    'Your browser will save the MP3 when the server finishes.',
                    { indeterminate: true }
                );
                scheduleCompletionCleanup(12000);
                return;
            }

            throw error;
        }

        if (!response.ok) {
            const payload = await parseResponse(response);
            throw new Error(payload.error || payload.details || 'Unable to download the audio file.');
        }

        const blob = await readAudioBlobWithProgress(response);
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = getSafeFilename(info);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
        setDownloadStage(100, 'Saved to your device.', 'Saved to your device.');
        scheduleCompletionCleanup();
    }

    async function startDirectDownloadFallback(url) {
        setDownloadStage(8, 'Getting video info from the server...', 'Starting server download mode.');
        await sleep(500);
        setDownloadStage(16, 'Preparing audio on the server...', 'Preparing audio on the server.');
        await sleep(700);
        setDownloadStage(
            32,
            'Downloading, converting, and tagging audio...',
            'Your browser will save the MP3 when the server finishes.',
            { indeterminate: true }
        );
        startDirectFetchDownload(url);
        scheduleCompletionCleanup(12000);
    }

    async function startDownload() {
        const normalizedUrl = normalizeYouTubeUrl(urlInput.value);
        if (!getYouTubeId(normalizedUrl)) {
            syncButtonState(true);
            setFeedback('Use a YouTube video, Shorts, or youtu.be link.', true);
            return;
        }

        isBusy = true;
        clearCompletionCleanup();
        activeJobId = null;
        preview?.classList.remove('is-visible');
        statusPanel?.classList.add('is-visible');
        if (cancelButton) cancelButton.disabled = true;
        downloadButton.disabled = true;
        setDownloadStage(6, 'Getting video info...', 'Getting video info.');

        try {
            const info = await apiPost('/info', { url: normalizedUrl });
            showPreview(info);
            setDownloadStage(14, 'Video info found. Preparing download...', 'Preparing download.');

            const job = await apiPost('/fetch-prepare', {
                url: normalizedUrl,
                videoInfo: info
            });

            activeJobId = job.jobId || job.id;
            if (!activeJobId) {
                throw new Error('The audio server did not return a download job.');
            }

            if (cancelButton) cancelButton.disabled = false;
            setDownloadStage(getServerProgress(job), getServerDetail(job), getServerFeedback(job));

            const readyJob = await pollUntilReady(activeJobId);
            await startBrowserDownload(activeJobId, readyJob.videoInfo || info);
        } catch (error) {
            if (isNetworkFetchError(error)) {
                await startDirectDownloadFallback(normalizedUrl);
            } else {
                setDownloadStage(0, 'Stopped', error.message || 'Download failed.', { isError: true });
            }
        } finally {
            isBusy = false;
            activeJobId = null;
            if (cancelButton) cancelButton.disabled = true;
            syncButtonState(false, false);
        }
    }

    async function cancelDownload() {
        const jobId = activeJobId;
        if (!jobId) return;

        if (cancelButton) cancelButton.disabled = true;
        setProgress(0, 'Cancelling...');

        try {
            await apiPost(`/fetch-cancel/${encodeURIComponent(jobId)}`, {});
        } catch (error) {
        } finally {
            activeJobId = null;
            isBusy = false;
            setFeedback('Download cancelled.', true);
            syncButtonState(false, false);
        }
    }

    urlInput.addEventListener('input', () => {
        resetDownloadStatus();
        syncButtonState(false);
    });
    urlInput.addEventListener('blur', () => syncButtonState(true));
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        startDownload();
    });
    cancelButton?.addEventListener('click', cancelDownload);

    syncButtonState(false);
}

// 11. INITIALIZATION

initYouTubeDownload();
syncWaveAnimation();
syncAmbientAnimation();
updateNavScrollState();
setMobileMenuState(false);
const hashPage = window.location.hash.replace('#', '');
showPage(hashPage && pages[hashPage] ? hashPage : 'home', { animate: false });

if (finePointer.addEventListener) finePointer.addEventListener('change', syncAmbientAnimation);
if (hoverCapable.addEventListener) hoverCapable.addEventListener('change', syncAmbientAnimation);
window.addEventListener('resize', syncAmbientAnimation);
// A. Handle initial load (e.g., if someone visits site.com/#privacy)
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && pages[hash]) {
        showPage(hash);
    }
});

// B. Handle hash changes while the page is already open
window.onhashchange = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && pages[hash]) {
        showPage(hash);
    }
};
