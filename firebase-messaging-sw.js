// Service Worker do Firebase Cloud Messaging (push em segundo plano)
// O FCM registra este arquivo automaticamente no escopo
// "/firebase-cloud-messaging-push-scope", então NÃO conflita com o sw.js do PWA.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAskgM5cxiR4DI2PXrccBxOvPZzMPDKdCo",
  authDomain: "gen-lang-client-0963611393.firebaseapp.com",
  projectId: "gen-lang-client-0963611393",
  messagingSenderId: "158833761867",
  appId: "1:158833761867:web:f9db6cb6dc6b5785cfb7ce"
});

const messaging = firebase.messaging();

// Mensagem recebida com o app fechado / em segundo plano
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Prefeitura de Doresópolis', {
    body: n.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: payload.data || {}
  });
});

// Ao tocar na notificação, abre o acompanhamento de solicitações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./solicitacoes.html'));
});
