// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  sampleRate: 0.2,

  tracesSampler: ({ name, attributes, parentSampled }) => {
    if (name.includes("paddle") || name.includes("upgrade") || name.includes("database") || name.includes("transaction") || name.includes("payment")) {
      return 1;
    }
    return 0.5;
  },

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
  
});
