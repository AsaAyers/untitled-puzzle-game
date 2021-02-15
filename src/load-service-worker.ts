// I'm hiding the path from the bundler so that I can use the `public/sw.js` If
// I don't do this then the bundler sees this and complains the file doesn't
// exist. Even though the bundler sees the path, it doesn't actually make
// `sw.js` a new entry point. It also doesn't pick up the importScripts in sw.js
// to make push.sw.js a new entry point.
const swPath = './sw.js';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(swPath);
}

let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();

  // // Stash the event so it can be triggered later.
  deferredPrompt = e;
  console.log('beforeinstallprompt', e);
  // // Update UI to notify the user they can add to home screen
  // addBtn.style.display = 'block';

  // addBtn.addEventListener('click', (e) => {
  //   // hide our user interface that shows our A2HS button
  //   addBtn.style.display = 'none';
  //   // Show the prompt
  //   deferredPrompt.prompt();
  //   // Wait for the user to respond to the prompt
  //   deferredPrompt.userChoice.then((choiceResult) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the A2HS prompt');
  //       } else {
  //         console.log('User dismissed the A2HS prompt');
  //       }
  //       deferredPrompt = null;
  //     });
  // });
});
