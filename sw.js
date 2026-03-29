// Truth or Dare For My Fans — Service Worker for Push Notifications
self.addEventListener('push', function(event) {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch(e) {}

    const title = data.title || '🔔 Truth or Dare For My Fans';
    const options = {
        body: data.body || 'You have a new notification.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: { url: data.url || '/dashboard.html' },
        requireInteraction: true,
        vibrate: [200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const url = event.notification.data && event.notification.data.url
        ? event.notification.data.url
        : '/dashboard.html';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
