# The Android App is Capacitor with the game packaged inside

Teach Clock goes on Google Play as an Android App built with Capacitor: the same Vue build as the Web App, packaged inside the app and served from the device, with no service worker. It opens and plays offline from the very first launch, which matters for a children's game handed over on a phone with no signal.

## Considered Options

- **Trusted Web Activity** (the PWA wrapper made with Bubblewrap or PWABuilder). Rejected:
  - it loads the site from the web, so the first launch fails offline;
  - it needs `assetlinks.json` at the root of `denysslobodianyk1996.github.io`, but the Web App lives on the `/teach-clock/` subpath and we don't control that root;
  - if that check fails, it shows a browser address bar over the game;
  - it depends on Chrome being installed and up to date.

## Consequences

- Every change to the Android App is a Play release (built and uploaded by CI, then reviewed by Google), not an instant web deploy. The Web App still updates on every merge.
- One codebase, two builds: `VITE_TARGET=android` marks the Android build, and the app reads it from one place (`src/platform.ts`). Anything the two builds do differently (no service worker, no Support Button) hangs off that flag.
