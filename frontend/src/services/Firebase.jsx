/*
 * Richiede un token di registrazione per le notifiche push.
 * 
 * Questo metodo registra il Service Worker, poi richiede un token di registrazione
 * per ricevere notifiche push. Se il token è ottenuto con successo, può essere
 * inviato al backend per associarlo all'utente.
 * 
 */


import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configurazione di Firebase con le credenziali dell'ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Inizializzazione dell'app Firebase
initializeApp(firebaseConfig);

// Ottenimento del servizio di messaggistica per le notifiche push
const messaging = getMessaging();

export const requestForToken = async () => {
  try {
    // Registra il Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    // console.log('Service Worker registrato con successo:', registration);

    // Attende che il Service Worker sia pronto
    await navigator.serviceWorker.ready;
    // console.log('Service Worker pronto.');

    // Richiede il token di registrazione per le notifiche push
    const currentToken = await getToken(messaging, { 
      vapidKey: import.meta.env.VITE_VAPIDKEY,
      serviceWorkerRegistration: registration 
    });

    if (currentToken) {
      // console.log('Token corrente del cliente: ', currentToken);
      // Qui puoi decidere di inviare il token al tuo backend o salvarlo per future notifiche push
    } else {
      console.log('Nessun token di registrazione disponibile. Richiesta di permesso per generare uno.');
    };
  } catch (err) {
    if (err.code === 'messaging/token-unsubscribe-failed') {
      console.warn('Non è stato possibile disiscrivere l\'utente, il token potrebbe essere già stato rimosso o non valido.');
    } else {
      console.error('Si è verificato un errore durante la generazione del token', err);
    };
  };
};

/*
 * Imposta un listener per i messaggi ricevuti quando l'app è in primo piano.
 * 
 * Questo metodo crea una promessa che si risolve quando un messaggio push è ricevuto.
 * Utilizza il listener `onMessage` per gestire i messaggi in arrivo e loggarli.
 * 
 */

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // console.log('Messaggio ricevuto in primo piano:', payload);
      resolve(payload);
    });
  });



