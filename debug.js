// ─── DIAGNOSTIC LOGGER (remove before production) ───────────────────────────
(function () {
    const logs = [];
    const startTime = Date.now();

    function ts() { return `+${Date.now() - startTime}ms`; }

    function log(label, value) {
        const line = `[${ts()}] ${label}: ${JSON.stringify(value)}`;
        logs.push(line);
        console.log(line);
    }

    function downloadLog() {
        const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `audipella-debug-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ── 1. Environment ──────────────────────────────────────────────────────
    log('userAgent', navigator.userAgent);
    log('platform', navigator.platform);
    log('vendor', navigator.vendor);
    log('innerWidth', window.innerWidth);
    log('innerHeight', window.innerHeight);
    log('devicePixelRatio', window.devicePixelRatio);
    log('prefersReducedMotion', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    log('hoverCapable', window.matchMedia('(hover: hover)').matches);
    log('finePointer', window.matchMedia('(pointer: fine)').matches);
    log('coarsePointer', window.matchMedia('(pointer: coarse)').matches);
    log('touchPoints', navigator.maxTouchPoints);

    // ── 2. API support ──────────────────────────────────────────────────────
    log('Element.animate supported', typeof document.createElement('div').animate === 'function');
    log('requestAnimationFrame supported', typeof window.requestAnimationFrame === 'function');
    log('CSS.supports radial-gradient', CSS.supports('background', 'radial-gradient(circle, red, blue)'));
    log('CSS custom properties supported', CSS.supports('color', 'var(--test)'));
    log('document.hidden', document.hidden);
    log('visibilityState', document.visibilityState);

    // ── 3. DOM readiness ────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        log('DOMContentLoaded fired', true);
        log('app-root found', !!document.getElementById('app-root'));
        log('home-page found', !!document.getElementById('home-page'));
        log('wave-container found', !!document.getElementById('wave-container'));
        log('waveBars count', document.querySelectorAll('#wave-container .bar').length);
        log('phone-frame found', !!document.querySelector('.phone-frame'));
        log('ambient-orb-primary found', !!document.querySelector('.ambient-orb-primary'));

        // Check CSS variables are being set
        setTimeout(() => {
            const style = getComputedStyle(document.documentElement);
            log('--cursor-x after 2s', style.getPropertyValue('--cursor-x'));
            log('--cursor-y after 2s', style.getPropertyValue('--cursor-y'));
            log('--cursor-x-soft after 2s', style.getPropertyValue('--cursor-x-soft'));
        }, 2000);
    });

    window.addEventListener('load', () => {
        log('window.load fired', true);

        // ── 4. Test rAF actually ticks ──────────────────────────────────────
        let rafCount = 0;
        const rafStart = performance.now();
        function countRaf(ts) {
            rafCount++;
            if (rafCount < 10) {
                window.requestAnimationFrame(countRaf);
            } else {
                log('rAF ticked 10 times in ms', Math.round(performance.now() - rafStart));
            }
        }
        window.requestAnimationFrame(countRaf);

        // ── 5. Test Element.animate ─────────────────────────────────────────
        const testEl = document.createElement('div');
        testEl.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;';
        document.body.appendChild(testEl);
        try {
            const anim = testEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: 'forwards' });
            anim.onfinish = () => {
                log('Element.animate onfinish fired', true);
                document.body.removeChild(testEl);
            };
            anim.oncancel = () => log('Element.animate cancelled', true);
        } catch (err) {
            log('Element.animate threw', err.message);
        }

        // ── 6. CSS variable update test ─────────────────────────────────────
        document.documentElement.style.setProperty('--debug-test', '1px');
        const readBack = getComputedStyle(document.documentElement).getPropertyValue('--debug-test');
        log('CSS variable write/read works', readBack.trim() === '1px');

        // ── 7. phone-frame computed transform ──────────────────────────────
        setTimeout(() => {
            const frame = document.querySelector('.phone-frame');
            if (frame) {
                const cs = getComputedStyle(frame);
                log('phone-frame computed transform', cs.transform);
                log('phone-frame computed animation', cs.animation);
                log('phone-frame computed animationName', cs.animationName);
            }
        }, 1000);

        // ── 8. ambient orb computed style ──────────────────────────────────
        setTimeout(() => {
            const orb = document.querySelector('.ambient-orb-primary');
            if (orb) {
                const cs = getComputedStyle(orb);
                log('orb computed background', cs.background.slice(0, 120));
                log('orb computed filter', cs.filter);
                log('orb computed opacity', cs.opacity);
            }
        }, 1500);

        // ── 9. visibilitychange test ────────────────────────────────────────
        document.addEventListener('visibilitychange', () => {
            log('visibilitychange fired, hidden', document.hidden);
        });

        // ── 10. Download button ─────────────────────────────────────────────
        const btn = document.createElement('button');
        btn.textContent = '⬇ Download Debug Log';
        btn.style.cssText = [
            'position:fixed', 'bottom:20px', 'right:20px', 'z-index:99999',
            'background:#1a1a2e', 'color:#fff', 'border:2px solid #28a745',
            'border-radius:10px', 'padding:12px 18px', 'font-size:14px',
            'font-family:monospace', 'cursor:pointer', 'box-shadow:0 4px 20px rgba(0,0,0,0.5)'
        ].join(';');
        btn.addEventListener('click', downloadLog);
        document.body.appendChild(btn);

        log('debug.js setup complete', true);
    });

    // expose globally so main.js errors also get caught
    window.__debugLog = log;
    window.addEventListener('error', (e) => log('UNCAUGHT ERROR', `${e.message} @ ${e.filename}:${e.lineno}`));
    window.addEventListener('unhandledrejection', (e) => log('UNHANDLED REJECTION', String(e.reason)));
})();
