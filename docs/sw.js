if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let i=Promise.resolve();return r[e]||(i=new Promise((async i=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=i}else importScripts(e),i()}))),i.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},i=(i,r)=>{Promise.all(i.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(i)};self.define=(i,s,n)=>{r[i]||(r[i]=Promise.resolve().then((()=>{let r={};const o={uri:location.origin+i.slice(1)};return Promise.all(s.map((i=>{switch(i){case"exports":return r;case"module":return o;default:return e(i)}}))).then((e=>{const i=n(...e);return r.default||(r.default=i),r}))})))}}define("./sw.js",["./workbox-4681948c"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"build-manifest.json",revision:"19119f8681ebe53bd03dd90a8d942a72"},{url:"dist/index.css",revision:"fa089713cee34d65383120807c9dba83"},{url:"dist/index.js",revision:"db4e99fb928960df9ba0461679601d11"},{url:"favicon.ico",revision:"6e1267d9d946b0236cdf6ffd02890894"},{url:"icon-192x192.png",revision:"7188e698fb05866c64821a196e520d41"},{url:"icon-256x256.png",revision:"911dffad3b639c747af6b59d14771bb9"},{url:"icon-384x384.png",revision:"0c625503200ffb28e6ac473c70a74226"},{url:"icon-512x512.png",revision:"699acb47294187c96ec119e0308dfbb5"},{url:"index.html",revision:"3f3ba8de31c003e8fde6efc6e1ddeb27"},{url:"manifest.json",revision:"907551d9d0d0955bc8a0c6b564905862"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"}],{})}));
//# sourceMappingURL=sw.js.map
