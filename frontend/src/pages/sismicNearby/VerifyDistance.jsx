/*
 * Componente VerifyDistance
 * 
 * Questo componente verifica se l'ultimo evento sismico registrato è avvenuto entro un raggio
 * di 100 km dalla posizione dell'utente. Se l'evento è rilevante e non è già stato postato,
 * invia i dati dell'evento al server e aggiorna la lista degli eventi postati nel localStorage.
 */


import HaversineDistance from '../../modules/HaversineDistance.jsx';
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx';
import { sendAdvice } from '../../services/sendAdvice.jsx';
import { sendTelegram } from '../../services/sendTelegram.jsx';

// URL dell'API di backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DIST_UTIL = 100; // Distanza massima in km per considerare un evento rilevante

export const verifyDistance = async () => {

  // Ottieni i dati dell'utente dal localStorage
  const userLogin = (() => {
    const storedUserLogin = localStorage.getItem('userLogin');
    if (storedUserLogin) {
      try {
        const parsedUserLogin = JSON.parse(storedUserLogin);
        if (parsedUserLogin && parsedUserLogin.place && parsedUserLogin.notifications) {
          return parsedUserLogin;
        }
      } catch (error) {
        console.error('Errore nella lettura di userLogin da localStorage!', error);
      }
    }
    return null;
  })();

  // Leggi l'ultimo evento sismico registrato
  const ultimoEvento = (() => {
    const latestEventData = localStorage.getItem('lastNotifiedEvent');
    if (latestEventData) {
      try {
        return JSON.parse(latestEventData);
      } catch (error) {
        console.error('Errore nel parsing di lastNotifiedEvent:', error);
      }
    } else {
      console.log('Nessun evento sismico registrato trovato nel localStorage!');
    }
    return null;
  })();

  if (ultimoEvento && userLogin) {
    const distanza = HaversineDistance(ultimoEvento, userLogin);

    if (userLogin.place[0].latitude && userLogin.place[0].longitude) {
      // Verifica se l'evento è entro il raggio definito e non è già stato postato
      if (distanza <= DIST_UTIL && !isEventAlreadyPosted(ultimoEvento.properties.eventId)) {
        await postEventSismicUser(ultimoEvento, userLogin, distanza);

        // Aggiungi l'evento alla lista degli eventi postati
        const postedEvents = JSON.parse(localStorage.getItem('postedEvents') || '[]');
        postedEvents.push(ultimoEvento.properties.eventId);
        localStorage.setItem('postedEvents', JSON.stringify(postedEvents));

        // Assegna alla variabile il valore dell'id di Telegram
        const idTelegram = userLogin.notifications[0].userIdTelegram;

        // Carica dalla localstorage gli advices
        const advice = JSON.parse(localStorage.getItem('advices') || '[]');

        // Logica per consigliare il comportamento in base alla magnitudo
        let magnitude = ultimoEvento.properties.mag;
        // console.log(magnitude)

        // Verifico la magnitudo del sisma e invio un messaggio telegram su come comportarsi durante un sisma
        switch (true) {
          case magnitude >= 2.0 && magnitude < 2.3:
            // console.log('Magnitudo tra 2 e 2.3: Terremoto leggero');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[0], 'Magnitudo tra 2 e 2.3: Terremoto leggero');
            break;
          case magnitude >= 2.4 && magnitude < 3.3:
            // console.log('Magnitudo tra 2.4 e 3.3: Terremoto moderato');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[1], 'Magnitudo tra 2.4 e 3.3: Terremoto moderato');
            break;
          case magnitude >= 3.4 && magnitude < 4.3:
            // console.log('Magnitudo tra 3.4 e 4.3: Terremoto forte');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[2], 'Magnitudo tra 3.4 e 4.3: Terremoto forte');
            break;
          case magnitude >= 4.4 && magnitude < 5.3:
            // console.log('Magnitudo tra 4.4 e 5.3: Terremoto molto forte');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[3], 'Magnitudo tra 4.4 e 5.3: Terremoto molto forte');
            break;
          case magnitude >= 5.4 && magnitude < 6.3:
            // console.log('Magnitudo tra 5.4 e 6.3: Terremoto severo');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[4], 'Magnitudo tra 5.4 e 6.3: Terremoto severo');
            break;
          case magnitude >= 6.4 && magnitude < 7.3:
            // console.log('Magnitudo tra 6.4 e 7.3: Terremoto devastante');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[5], 'Magnitudo tra 6.4 e 7.3: Terremoto devastante');
            break;
          case magnitude >= 7.4 && magnitude < 8.3:
            // console.log('Magnitudo tra 7.4 e 8.3: Terremoto devastante');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[6], 'Magnitudo tra 7.4 e 8.3: Terremoto devastante');
            break;
          case magnitude >= 8.4 && magnitude <= 9.3:
            // console.log('Magnitudo tra 8.4 e 9.3: Terremoto catastrofico');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[7], 'Magnitudo tra 8.4 e 9.3: Terremoto catastrofico');
            break;
            case magnitude >= 9.4 && magnitude <= 10:
            // console.log('Magnitudo tra 9.4 e 10: Terremoto catastrofico');
            sendTelegram(ultimoEvento, distanza, idTelegram);
            sendAdvice(idTelegram, advice[8], 'Magnitudo tra 9.4 e 10: Terremoto catastrofico');
            break;
          default:
            // console.log('Magnitudo non valida o troppo bassa per essere rilevante.');
        }
      }
    } else {
      console.log('Devi aggiornare la tua posizione');
    }
  }
};

// Verifica se l'evento è già stato postato nel localStorage
const isEventAlreadyPosted = (eventId) => {
  const postedEvents = JSON.parse(localStorage.getItem('postedEvents') || '[]');
  return postedEvents.includes(eventId);
};

//Funzione per inviare i dati dell'evento sismico al server
const postEventSismicUser = async (ultimoEvento, userLogin, distanza) => {
  if (!ultimoEvento || !userLogin) {
    console.error('Ultimo Evento o userLogin non disponibile!');
    return;
  }

  const dati = {
    eventId: ultimoEvento.properties.eventId,
    time: ultimoEvento.properties.time,
    magType: ultimoEvento.properties.magType,
    magnitude: ultimoEvento.properties.mag,
    geometry: {
      latitude: ultimoEvento.geometry.coordinates[1],
      longitude: ultimoEvento.geometry.coordinates[0],
      depth: ultimoEvento.geometry.coordinates[2],
    },
    place: ultimoEvento.properties.place,
    proximity: distanza,
    user: userLogin._id,
  };

  try {
    const response = await fetchWithAuth(`${API_URL}/api/seismicEvents`, {
      method: 'POST',
      body: JSON.stringify(dati),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Dati inviati con successo:', response);
  } catch (error) {
    console.error('Errore invio dati', error);
  }
};
