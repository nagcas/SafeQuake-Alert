/*
 * `NotificationProvider` è un componente React che gestisce e fornisce il contesto per le notifiche dell'app.
 * Utilizza il contesto di React per fornire una funzione di notifica (`notify`) ai componenti figli.
 * Le notifiche possono essere visive all'interno dell'app e tramite l'API Notification del browser.
 *
 * Gestisce lo stato dell'utente, le sue preferenze di notifica e le autorizzazioni per le notifiche del browser.
 * - `userLogin`: Stato per memorizzare le informazioni dell'utente, incluse le preferenze di notifica.
 * - `useEffect` per richiedere il permesso per le notifiche al caricamento dell'app.
 * - `useEffect` per ascoltare i cambiamenti nel `localStorage` e aggiornare `userLogin` di conseguenza.
 * - `formatDateToItalianTime`: Funzione per convertire la data UTC in formato orario italiano.
 * - `notify`: Funzione che invia notifiche basate su eventi sismici e le preferenze dell'utente.
 * 
 * Fornisce il contesto delle notifiche ai componenti figli tramite `NotificationContext.Provider` e rende visibili le notifiche utilizzando `react-hot-toast`.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // Importa le funzioni per le notifiche visive all'interno dell'app
import notificationSound from '../assets/audio/message-13716.mp3'; // File audio per le notifiche (attualmente non utilizzato nel codice)
import ImageNotify from '../assets/images/carl-wang-OCe8cTGymSQ-unsplash.jpg'; // Immagine da utilizzare nelle notifiche
import HaversineDistance from './HaversineDistance.jsx'; // Funzione per calcolare la distanza tra il sisma e la posizione dell'utente


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

  // Stato per memorizzare le informazioni dell'utente, inclusa la configurazione delle notifiche
  const [userLogin, setUserLogin] = useState(() => {
    const storedUserLogin = localStorage.getItem('userLogin');
    if (storedUserLogin) {
      try {
        const parsedUserLogin = JSON.parse(storedUserLogin);
        // Verifica che i dati dell'utente siano validi e contengano le informazioni sulle notifiche
        if (parsedUserLogin && parsedUserLogin.place && parsedUserLogin.notifications) {
          return parsedUserLogin;
        };
      } catch (error) {
        console.error('Errore nella lettura di userLogin da localStorage', error);
      };
    };
    return null;
  });

  // Richiedi permesso per le notifiche al caricamento dell'app
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log(permission === 'granted'
          ? t('notification.permesso-concesso')
          : t('notification.permesso-negato'));
      });
    };
  }, []);

  // Aggiorna userLogin da localStorage quando cambia
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserLogin = localStorage.getItem('userLogin');
      if (storedUserLogin) {
        try {
          const parsedUserLogin = JSON.parse(storedUserLogin);
          // Verifica che i dati dell'utente siano validi e contengano le informazioni sulle notifiche
          if (parsedUserLogin && parsedUserLogin.place && parsedUserLogin.notifications) {
            setUserLogin(parsedUserLogin);
          } else {
            setUserLogin(null);
          };
        } catch (error) {
          console.error('Errore nella lettura di userLogin da localStorage', error);
          setUserLogin(null);
        };
      } else {
        setUserLogin(null);
      };
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Funzione per formattare la data UTC in formato orario italiano
  const formatDateToItalianTime = (utcDateString) => {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 2); // Corregge il fuso orario per l'Italia

    return date.toLocaleString('it-IT', {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Funzione per inviare le notifiche
  const notify = async (event, userLogin, tt, i18n) => {
    if (!userLogin || !userLogin.notifications) {
      console.log(tt('notification.utente-no-loggato'));
      return;
    };

    if (userLogin.notifications[0] && userLogin.notifications[0].push) {
      console.log(tt('notification.notifiche-attive'));
      if (event?.properties?.mag && event.properties.place) {
        const lastEventId = localStorage.getItem('lastEventId');
        const currentEventId = `${event.properties.time}-${event.properties.place}-${event.properties.mag}`;

        if (lastEventId === currentEventId) {
          return; // Evita notifiche duplicate per lo stesso evento
        };

        localStorage.setItem('lastEventId', currentEventId);

        const distanza = HaversineDistance(event, userLogin);
        // console.log('distanza: ', distanza);

        // Aggiorna il contenuto in base alla lingua selezionata
        if (i18n.resolvedLanguage === 'it') {

          // Notifica tramite API Notification del browser in italiano
          if ('Notification' in window && Notification.permission === 'granted') {
            const title = `SafeQuake Alert - Magnitudo: ${event.properties.magType} ${event.properties.mag}`;
            const options = {
              body:
                `Zona: ${event.properties.place}\n` +
                `Data: ${formatDateToItalianTime(event.properties.time)}\n` +
                `Profondità: ${event.geometry.coordinates[2]} Km\n` +
                `Distanza: Km ${distanza}`,
              icon: ImageNotify,
            };
            new Notification(title, options);

          } else {
            console.log(tt('notification.permesso-notifiche'));
            // Notifica visiva all'interno dell'app
            toast((t) => (
              <div>
                <p className='fw-bold'>SafeQuake Alert</p>
                <p>{tt('notification.permesso-notifiche')}</p>
              </div>
            ));
          };

          // Notifica visiva all'interno dell'app in italiano
          toast((t) => (
            <div>
              <p className='fw-bold'>{`SafeQuake Alert - Magnitudo: ${event.properties.magType} ${event.properties.mag}`}</p>
              <p>{`Zona: ${event.properties.place}`}</p>
              <p>{`Data: ${formatDateToItalianTime(event.properties.time)}`}</p>
              <p>{`Profondità: Km ${event.geometry.coordinates[2]}`}</p>
              <p>{`Distanza: Km ${distanza}`}</p>
            </div>
          ));
          
        } else if (i18n.resolvedLanguage === 'en') {

          // Notifica tramite API Notification del browser in inglese
          if ('Notification' in window && Notification.permission === 'granted') {
            const title = `SafeQuake Alert - Magnitude: ${event.properties.magType} ${event.properties.mag}`;
            const options = {
              body:
                `Zone: ${event.properties.place}\n` +
                `Date: ${formatDateToItalianTime(event.properties.time)}\n` +
                `Depth: Km ${event.geometry.coordinates[2]}\n` +
                `Distance: Km ${distanza}`,
              icon: ImageNotify,
            };
            new Notification(title, options);


          } else {
            console.log(tt('notification.permesso-notifiche'));
            // Notifica visiva all'interno dell'app
            toast((t) => (
              <div>
                <p className='fw-bold'>SafeQuake Alert</p>
                <p>{tt('notification.permesso-notifiche')}</p>
              </div>
            ));
          };

          // Notifica visiva all'interno dell'app in inglese
          toast((t) => (
            <div>
              <p className='fw-bold'>{`SafeQuake Alert - Magnitude: ${event.properties.magType} ${event.properties.mag}`}</p>
              <p>{`Zone: ${event.properties.place}`}</p>
              <p>{`Date: ${formatDateToItalianTime(event.properties.time)}`}</p>
              <p>{`Depth: Km ${event.geometry.coordinates[2]}`}</p>
              <p>{`Distance: Km ${distanza}`}</p>
            </div>
          ));
          
        } else {

          // Notifica tramite API Notification del browser in spagnolo
          if ('Notification' in window && Notification.permission === 'granted') {
            const title = `SafeQuake Alert - Magnitud: ${event.properties.magType} ${event.properties.mag}`;
            const options = {
              body:
                `Zona: ${event.properties.place}\n` +
                `Fecha: ${formatDateToItalianTime(event.properties.time)}\n` +
                `Profundidad: Km ${event.geometry.coordinates[2]}\n` +
                `Distancia: Km ${distanza}`,
              icon: ImageNotify,
            };
            new Notification(title, options);

          } else {
            console.log(tt('notification.permesso-notifiche'));
            // Notifica visiva all'interno dell'app
            toast((t) => (
              <div>
                <p className='fw-bold'>SafeQuake Alert</p>
                <p>{tt('notification.permesso-notifiche')}</p>
              </div>
            ));
          };

          // Notifica visiva all'interno dell'app in spagnolo
          toast((t) => (
            <div>
              <p className='fw-bold'>{`SafeQuake Alert - Magnitud: ${event.properties.magType} ${event.properties.mag}`}</p>
              <p>{`Zona: ${event.properties.place}`}</p>
              <p>{`Fecha: ${formatDateToItalianTime(event.properties.time)}`}</p>
              <p>{`Profondidad: Km ${event.geometry.coordinates[2]}`}</p>
              <p>{`Distancia: Km ${distanza}`}</p>
            </div>
          ));
        };

      } else {
        console.log(tt('notification.evento-non-valido'), event);
        // Notifica visiva all'interno dell'app
        toast((t) => (
          <div>
            <p className='fw-bold'>SafeQuake Alert</p>
            <p>{tt('notification.evento-simulazione')}</p>
          </div>
        ));
      };
    } else {
      console.log('Le tue notifiche sono disattivate');
      // Notifica visiva all'interno dell'app
      toast((t) => (
        <div>
          <p className='fw-bold'>SafeQuake Alert</p>
          <p>{tt('notification-notifiche-disattivate')}</p>
        </div>
      ));
    };
  };
 
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Toaster position='top-right' reverseOrder={false} />
    </NotificationContext.Provider>
  );
};

// Hook personalizzato per accedere al contesto delle notifiche
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(tt('notification.error-notifiche'));
  };

  return context;
};


