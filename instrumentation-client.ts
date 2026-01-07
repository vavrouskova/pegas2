// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://bbb9f55feab0b26964a78e9ee9b1b41e@o4507700792459264.ingest.de.sentry.io/4510663361364048',

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.005,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  replaysSessionSampleRate: 0,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 0.5,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Ignore errors from browser extensions and non-application code
  ignoreErrors: [
    // Browser extension errors (autofill, password managers, etc.)
    /CollectAutofillContentService/i,
    /bootstrap-autofill-overlay-notifications/i,
    "Failed to execute 'querySelectorAll' on 'Element'",
    // Other common browser extension errors
    /chrome-extension:/i,
    /moz-extension:/i,
    /webkit-masked-url:/i,
    /runtime\.sendMessage/i,
    /hideCertainAdElements/i,
    /browser\.storage\.local/i,
    /userscript\.html/i,
    // Seznam browser (Czech) injected bridge errors
    /sbrowserTsBridge/i,
    // OneTrust cookie consent script errors (blocked by content blockers)
    /DomainData/i,
    /GVLError/i, // IAB TCF Global Vendor List errors
    'Load failed',
    // Third-party tracking pixels blocked by ad blockers or consent
    /Can't find variable: fbq/i, // Facebook Pixel
    /fbq is not defined/i,
    // Android WebView app bridge errors (SnapTube, Samsung browser, etc.)
    /Java bridge method invocation error/i,
    /jsReceiveMessages/i,
    /Java object is gone/i,
    /swbrowser/i,
    /xbrowser/i,
    // Common non-actionable errors
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured',
    /reading 'touches'/i,
    /setting 'controlsList'/i,
    // Cross-origin iframe access errors (often from Sentry Replay trying to capture iframes)
    /Blocked a frame with origin/i,
    /cross-origin frame/i,
    // Generic origin errors (privacy browsers blocking third-party scripts)
    /^invalid origin$/i,
    // Minified third-party script errors (meaningless without source maps)
    /^hd$/,
    /^jd$/,
    // Unsupported browser syntax errors (older browsers not in browserslist)
    /Unexpected token/i,
    /Unexpected identifier/i,
    /Unexpected end of input/i,
    /require is not defined/i,
    // Network connectivity errors (user's connection dropped)
    /^Connection closed\.?$/i,
    /Failed to fetch/i,
    /NetworkError/i,
    /Network request failed/i,
    /^network error$/i,
    /BodyStreamBuffer was aborted/i,
    /signal is aborted without reason/i,
    /^AbortError/i, // Navigation-related fetch aborts
    // Stack overflow errors (usually third-party scripts or browser issues)
    /Maximum call stack size exceeded/i,
    // Hydration errors (often caused by browser extensions modifying DOM)
    /Hydration failed/i,
    /There was an error while hydrating/i,
    /Hydration Error/i,
    /is not valid JSON$/i,
    /Can't find variable: ResizeObserver/i,
    /Can't find variable: UTItemActionController/i,
    /An error occurred in the Server Components render/i,
    /Database deleted by request of the user/i,
    /IndexedDB/i,
    /Invalid regular expression/i,
  ],

  // Ignore errors from known browser extension scripts and third-party services
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
    // OneTrust cookie consent CDN
    /cdn\.cookielaw\.org/i,
    /optanon/i,
    /otTCF\.js/i, // OneTrust TCF (IAB vendor list)
    /otBannerSdk\.js/i, // OneTrust banner SDK
    /otSDKStub\.js/i, // OneTrust main SDK
    // Google Tag Manager (errors should be fixed in GTM, not app)
    /googletagmanager\.com/i,
    /gtm\.js/i,
    // Xiaomi/MIUI browser injected scripts
    /instantweb/i,
    /inpage\.js/i,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
