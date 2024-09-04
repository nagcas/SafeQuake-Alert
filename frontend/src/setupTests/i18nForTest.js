/*
 * Configura i18next per l'internazionalizzazione nelle prove (test).
 * 
 * Questa configurazione è utilizzata per garantire che i testi tradotti siano disponibili durante l'esecuzione dei test.
 * 
 * @see https://www.i18next.com/
 */

// Importa le librerie necessarie per la configurazione della traduzione
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa i file di traduzione. Assicurati di puntare al file JSON corretto.
import translationGlobal from '../translations/it/global.json';

i18n.use(initReactI18next).init({
  lng: 'it', // Lingua predefinita (italiano)
  fallbackLng: 'it',
  debug: false,
  resources: {
    it: {
      global: translationGlobal,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
