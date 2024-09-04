import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';

import global_en from './translations/en/global.json'
import global_es from './translations/es/global.json'
import global_it from './translations/it/global.json'


i18next.init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem('language') || 'it',
  resources: {
    en: {
      global: global_en,
    },
    es: {
      global: global_es,
    },
    it: {
      global: global_it,
    }
  }
});


// Registra il service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.jsx')
      .then((registration) => {
        // console.log('Service Worker registrato con successo:', registration);
      })
      .catch((error) => {
        console.log('Errore nella registrazione del Service Worker:', error);
      });
  });
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18next}>
      <App />
  </I18nextProvider>
);

