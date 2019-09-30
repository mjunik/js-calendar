'use strict';

const CACHE_NAME = 'static-cache-v2';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './main.js',
    './manifest.json',
    './styles.css',
    './images/hero-bg.jpg',
    './images/meeting.png',
    './images/reminder.png',
    './images/app-icons/icon-72x72.png',
    './images/app-icons/icon-96x96.png',
    './images/app-icons/icon-128x128.png',
    './images/app-icons/icon-144x144.png',
    './images/app-icons/icon-152x152.png',
    './images/app-icons/icon-192x192.png',
    './images/app-icons/icon-384x384.png',
    './images/app-icons/icon-512x512.png',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches
            .keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                }))
            )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.open(CACHE_NAME)
            .then(cache => cache.match(e.request))
            .then(res => res || fetch(e.request))
    );
});