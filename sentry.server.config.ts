// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://bbb9f55feab0b26964a78e9ee9b1b41e@o4507700792459264.ingest.de.sentry.io/4510663361364048',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  beforeSend(event) {
    const message = event.exception?.values?.[0]?.value ?? '';

    // Node.js v22 internal webstreams bug (not fixable in application code)
    if (message.includes('transformAlgorithm is not a function')) {
      return null;
    }

    // Sentry SDK internal error with certain runtimes (util.getSystemErrorMap)
    if (message.includes('getSystemErrorMap is not a function')) {
      return null;
    }

    return event;
  },
});
