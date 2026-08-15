const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch');
const fs = require('fs');
const path = require('path');
const { app, ipcMain } = require('electron');

const adblockCosmeticCSS = `
  /* YouTube ad and ad-block detection overlay hiding */
  // .video-ads,
  .ytp-ad-module,
  .ytp-ad-player-overlay,
  .ytp-ad-overlay-slot,
  .ytp-ad-text-overlay,
  .ytp-ad-preview,
  .ytp-ad-player-overlay-instream-info,
  .ytp-ad-button,
  .ytp-ad-overlay-close-button,
  .ytp-ad-overlay-container,
  .ytp-ad-progress-list,
  .ytp-paid-content-badge,
  .ytp-ce-element,
  #player-ads,
  .ytp-ad-top-banner-slot,
  .ytp-ad-endcap,
  .adblock-message,
  .adblock-overlay,
  .adblocker-detection,
  .ytp-adblock-message,
  .ytp-adblock-overlay,
  tp-yt-paper-dialog.ytd-popup-container>:last-child,
  tp-yt-iron-overlay-backdrop[opened],
  tp-yt-iron-overlay-backdrop.opened,
  tp-yt-iron-overlay-backdrop,
  [id*='adblock'],
  [class*='adblock'],
  [class*='AdBlock'],
  [class*='abp'] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`;

async function setupAdblocker(session) {
  // Inicializa o bloqueador com listas de anúncios e rastreamento pré-construídas
  const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);

  // // Habilita o bloqueio na sessão do Electron
  await blocker.enableBlockingInSession(session);

  console.log("adblocking....")
}

function injectAdblockerCosmetics(webContents) {
  webContents.insertCSS(adblockCosmeticCSS).catch(() => {
    // Ignora falha de injeção de CSS em páginas não compatíveis
  });

  webContents.executeJavaScript(`
    (function() {
      function hideAdElements() {
        const selectors = [
          '.video-ads',
          '.ytp-ad-module',
          '.ytp-ad-player-overlay',
          '.ytp-ad-overlay-slot',
          '.ytp-ad-text-overlay',
          '.ytp-ad-preview',
          '.ytp-ad-player-overlay-instream-info',
          '.ytp-ad-button',
          '.ytp-ad-overlay-close-button',
          '.ytp-ad-overlay-container',
          '.ytp-ad-progress-list',
          '.ytp-paid-content-badge',
          '.ytp-ce-element',
          '#player-ads',
          '.ytp-ad-top-banner-slot',
          '.ytp-ad-endcap',
          '.adblock-message',
          '.adblock-overlay',
          '.adblocker-detection',
         // '.ytp-error-content',
          '.ytp-adblock-message',
          '.ytp-adblock-overlay',
          'tp-yt-paper-dialog.ytd-popup-container>:last-child',
          'tp-yt-iron-overlay-backdrop[opened]',
          'tp-yt-iron-overlay-backdrop.opened',
          'tp-yt-iron-overlay-backdrop',
          // 'tp-yt-paper-dialog.ytd-popup-container>:last-child',
          '[id*="adblock"]',
          '[class*="adblock"]',
          '[class*="AdBlock"]',
          '[class*="abp"]'
        ];

        selectors.forEach((selector) => {
          try {
            document.querySelectorAll(selector).forEach((node) => {
              node.style.display = 'none';
              node.style.visibility = 'hidden';
              node.style.opacity = '0';
              node.style.pointerEvents = 'none';
            });
          } catch (e) {
            // Ignora seletores inválidos
          }
        });
      }

      // Bypass YouTube adblock detection
      function bypassYouTubeAdblock() {
        // Override ytInitialPlayerResponse to fake ad availability
        if (window.ytInitialPlayerResponse) {
          if (window.ytInitialPlayerResponse.adPlacements) {
            window.ytInitialPlayerResponse.adPlacements = [];
          }
          if (window.ytInitialPlayerResponse.playerAds) {
            window.ytInitialPlayerResponse.playerAds = [];
          }
        }

        // Fake ad-related functions
        if (!window.google) window.google = {};
        if (!window.google.ima) window.google.ima = {};
        if (!window.google.ima.Ad) {
          window.google.ima.Ad = function() {};
        }
        if (!window.google.ima.AdDisplayContainer) {
          window.google.ima.AdDisplayContainer = function() {};
        }

        // Override ad detection variables
        // Object.defineProperty(window, 'ytplayer', {
        //   get: function() {
        //     return {
        //       config: {
        //         args: {
        //           ads: '0',
        //           ad_preroll: '0',
        //           ad_postroll: '0'
        //         }
        //       }
        //     };
        //   },
        //   set: function() {}
        // });

        // Hide adblock detection messages
        const style = document.createElement('style');
        style.textContent = \`
          .ytp-error-content,
          .ytp-adblock-message,
          .ytp-adblock-overlay,
          tp-yt-paper-dialog.ytd-popup-container>:last-child,
          tp-yt-iron-overlay-backdrop[opened],
          [class*="adblock"],
          [id*="adblock"] {
            display: none !important;
          }
        \`;
        if (!document.head.querySelector('.adblock-bypass-style')) {
          style.className = 'adblock-bypass-style';
          document.head.appendChild(style);
        }
      }

      // Run bypass immediately
      bypassYouTubeAdblock();

      function removeBlockingBackdrops() {
        document.querySelectorAll('tp-yt-iron-overlay-backdrop[opened], tp-yt-iron-overlay-backdrop.opened, tp-yt-iron-overlay-backdrop, tp-yt-paper-dialog.ytd-popup-container>:last-child').forEach((node) => {
          node.style.display = 'none';
          node.style.visibility = 'hidden';
          node.style.pointerEvents = 'none';
          node.removeAttribute('opened');
        });
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      }

      // Run overlay cleanup immediately
      removeBlockingBackdrops();

      // Force autoplay only on normal YouTube watch pages, not shorts
      function isShortsPage() {
        return window.location.pathname.startsWith('/shorts/') || window.location.pathname.includes('/shorts');
      }
let ispause = false
      function forceAutoplay() {
        if (isShortsPage() || ispause) {
          return;
        }

        const video = document.querySelector('.video-stream.html5-main-video');
        if (video && video.paused) {
          video.play().catch(() => {
            // Ignore play errors (user interaction required, etc.)
          });
        }
      }

      // // Watch for video changes and force autoplay on non-shorts pages
      // const videoObserver = new MutationObserver(() => {
      //   forceAutoplay();
      //   removeBlockingBackdrops();
      // });
      // videoObserver.observe(document.body, { childList: true, subtree: true });


document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'k') {
    console.log('Tecla K pressionada');
    ispause =!ispause
  }
      if (event.key.toLowerCase() === ' ') {
    console.log('Tecla K pressionada');
    ispause =!ispause
  }
});

      // Also check periodically, but skip shorts
      setInterval(() => {
        forceAutoplay();
        removeBlockingBackdrops();
      }, 3000);
    })();
    console.log("adblock g4b3r injected java")
  `).catch(() => {
    // Ignora páginas fechadas ou contextos onde JS não pode ser executado
  });
}

module.exports = { setupAdblocker, injectAdblockerCosmetics };
