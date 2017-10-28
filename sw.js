importScripts('workbox-sw.prod.v2.1.0.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "index.html",
    "revision": "30173953ab6a94f1ec8180cd222daf4a"
  },
  {
    "url": "main.js",
    "revision": "025d4d66afd7b689566b3c856f255472"
  },
  {
    "url": "style.css",
    "revision": "fcb6f1d3f049c70e23e774ccaac37787"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
