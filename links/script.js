/**
 * Link-in-Bio Configuration
 *
 * Supports two icon types per link:
 *   image    — path/URL to an image file (loaded lazily)
 *   svgIcon  — inline SVG string (zero network request, renders instantly)
 *
 * Local SVGs in ./images/ replace the previous Flaticon CDN PNGs, eliminating
 * 5 external HTTP requests. CV and Wiki use inline SVGs (no file needed).
 */

const links = [
    {
        title: "LinkedIn",
        description: "Connect with me professionally.",
        url: "https://www.linkedin.com/in/dhiaurrahman-rh/",
        image: "./images/linkedin.svg"
    },
    {
        title: "Curiculum Vitae",
        description: "My CV or personal Resume. (You need to request access first)",
        url: "https://drive.google.com/file/d/1NYIONo-DlEVeUiP2UW6Sch7AeS0siAjG/view?usp=drive_link",
        // Inline SVG — zero HTTP request
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
    },
    {
        title: "Personal Wiki and Blog",
        description: "Used to documenting my works, projects, thoughts, or something that i dont want to forget..",
        url: "https://wiki.dhiar.my.id",
        // Inline SVG — zero HTTP request
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
    },
    {
        title: "GitHub",
        description: "Check out my personal or open-source projects.",
        url: "https://github.com/Alfar0nt/",
        image: "./images/github.svg"
    },
    {
        title: "Instagram",
        description: "My Personal Dumps.",
        url: "https://instagram.com/dhiarharianto",
        image: "./images/instagram.svg"
    },
    {
        title: "YouTube Channel",
        description: "Mostly just a College Projects.",
        url: "https://www.youtube.com/@dhiarharianto/",
        image: "./images/youtube.svg"
    },
    {
        title: "Spotify",
        description: "My Fav Songs.",
        url: "https://open.spotify.com/user/8kdkeoxc1li5pzujpuy8n7ie6?si=5c04c94b6a704489",
        image: "./images/spotify.svg"
    }
];

/**
 * Lazy-load the background video with network and motion awareness.
 *
 * Strategy:
 *   - prefers-reduced-motion → skip video entirely (CPU/battery savings).
 *   - Slow/metered connection (2G, 3G, data-saver) → skip video (bandwidth savings).
 *   - Otherwise: set src only after the page's load event so the video download
 *     never competes with critical resources (fonts, profile image, JS).
 */
function initBackgroundVideo() {
    const video = document.getElementById('bg-video');
    if (!video) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Network Information API (supported in Chrome/Android WebView)
    const connection = navigator.connection
        || navigator.mozConnection
        || navigator.webkitConnection;
    const isSlowConnection = connection
        && ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
    const dataSaverOn = connection && connection.saveData;

    if (prefersReducedMotion || isSlowConnection || dataSaverOn) {
        // CSS already shows a dark background — nothing more to do.
        // Hiding the container prevents a transparent video element sitting on top.
        const container = video.closest('.video-container');
        if (container) container.style.visibility = 'hidden';
        return;
    }

    // Defer src assignment until after all critical resources have loaded.
    // This ensures the ~2 MB video file never delays the LCP image or fonts.
    const startVideo = () => {
        video.src = './letter-bg.mp4';
        video.load();
        // play() returns a Promise; catch the rejection silently in case
        // the browser blocks autoplay (rare since the video is muted).
        video.play().catch(() => { });
    };

    if (document.readyState === 'complete') {
        startVideo();
    } else {
        window.addEventListener('load', startVideo, { once: true });
    }
}

/**
 * Render all link cards into the DOM.
 *
 * Uses a DocumentFragment so every card is built off-screen first and the
 * browser only performs a single reflow when the fragment is appended.
 * (Without this, each appendChild() can trigger its own reflow cycle.)
 *
 * Note: No DOMContentLoaded wrapper is needed here because this script tag
 * carries the `defer` attribute, which guarantees execution after HTML parsing.
 */
function renderLinks() {
    const linksContainer = document.getElementById('links-container');
    if (!linksContainer) return;

    const fragment = document.createDocumentFragment();

    links.forEach((link, index) => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.className = 'link-card';
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';

        // Stagger animation delays — reduced from 0.1s to 0.06s per card.
        // Smaller gaps mean fewer frames where cards are in-flight simultaneously.
        linkEl.style.animationDelay = `${0.1 + (index * 0.06)}s`;

        // will-change: transform hints the browser to promote this element to
        // its own GPU compositor layer BEFORE the animation starts.
        // This prevents mid-animation layer promotion (which causes a stutter).
        // We remove it immediately after the animation ends to free GPU memory.
        linkEl.style.willChange = 'transform';
        linkEl.addEventListener('animationend', () => {
            linkEl.style.willChange = 'auto';
        }, { once: true });

        // Resolve icon: prefer local image → inline SVG → generic link icon
        let mediaContent;
        if (link.image) {
            // loading="lazy" — browser skips off-screen images until needed.
            // decoding="async" — decoding off the main thread.
            // Explicit width/height prevent layout shift (CLS).
            mediaContent = `<img src="${link.image}" alt="${link.title} icon" loading="lazy" decoding="async" width="48" height="48">`;
        } else if (link.svgIcon) {
            mediaContent = link.svgIcon;
        } else {
            // Generic external-link SVG fallback (no network request)
            mediaContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
        }

        linkEl.innerHTML = `
            <div class="link-icon-container">
                ${mediaContent}
            </div>
            <div class="link-content">
                <h3 class="link-title">${link.title}</h3>
                <p class="link-desc">${link.description}</p>
            </div>
            <svg class="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        `;

        fragment.appendChild(linkEl);
    });

    // Single DOM write — one reflow for all cards
    linksContainer.appendChild(fragment);
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
// `defer` on the script tag guarantees the DOM is ready at this point,
// so no DOMContentLoaded listener is needed.
initBackgroundVideo();
renderLinks();
