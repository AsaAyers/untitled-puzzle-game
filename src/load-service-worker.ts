// I'm hiding the path from the bundler so that I can use the `public/sw.js` If
// I don't do this then the bundler sees this and complains the file doesn't
// exist. Even though the bundler sees the path, it doesn't actually make
// `sw.js` a new entry point. It also doesn't pick up the importScripts in sw.js
// to make push.sw.js a new entry point.
const swPath = './sw.js';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(swPath);
}
