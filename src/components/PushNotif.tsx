import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BOfwsDSCZO6kuC_SRV2msy8A314imszcI1Kj-UOtvycdci1Co1KnnjNKbmjQEBpNV_SzFO8MkNfb49pSr7PkQHY',
  privateKey: 'srdsvowl-tUTvbFSVqH9j3tbr6nofxkUAB0NM0aD27k'
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {
  endpoint: 'USER_SUBSCRIPTION_ENDPOINT',
  keys: {
    auth: 'USER_AUTH_KEY',
    p256dh: 'USER_P256DH_KEY'
  }
};

const payload = JSON.stringify({
  title: 'Push Notification Title',
  body: 'This is the body of the push notification.',
  icon: 'path/to/icon.png',
  badge: 'path/to/badge.png',
  data: {
    url: 'https://example.com'
  }
});

webpush.sendNotification(pushSubscription, payload)
  .then(response => {
    console.log('Push notification sent successfully:', response);
  })
  .catch(error => {
    console.error('Error sending push notification:', error);
  });
