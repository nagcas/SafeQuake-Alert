import fs from 'fs';
import path from 'path';
import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import UserTelegram from '../models/userTelegram.js';

// Percorso del file per salvare l'ultimo evento notificato
const lastEventFilePath = path.resolve('./lastNotifiedEvent.json');

// Funzione per caricare l'ultimo evento notificato da un file
// const loadLastNotifiedEventId = () => {
//   try {
//     if (fs.existsSync(lastEventFilePath)) {
//       const data = fs.readFileSync(lastEventFilePath, 'utf8');
//       const parsedData = JSON.parse(data);
//       // console.log(parsedData);
//       console.log(`Ultimo evento salvato con ID: ${parsedData.lastEventId}`);
//       return parsedData.lastEventId || null; // Ritorna solo l'ID dell'evento
//     };
//   } catch (error) {
//     console.error("Errore nel caricamento dell'ultimo evento notificato:", error);
//   };
//   return null;
// };

// // Funzione per salvare l'ultimo evento notificato in un file
// const saveLastNotifiedEventId = (eventId) => {
//   if (!eventId) {
//     console.error("Tentativo di salvare un ID evento non valido (undefined o null).");
//     return;
//   };

//   try {
//     fs.writeFileSync(lastEventFilePath, JSON.stringify({ lastEventId: eventId }, null, 2)); 
//     console.log(`ID dell'ultimo evento sismico salvato: ${eventId}`);
//   } catch (error) {
//     console.error("Errore nel salvataggio dell'ultimo evento notificato:", error);
//   };
// };

// // Funzione per caricare gli eventi sismici
// const loadSismicEvents = async () => {
//   const today = new Date();
//   const startDate = new Date(today.getFullYear(), 0, 1);
//   const formattedStartDate = startDate.toISOString().split('T')[0];
//   const formattedToday = today.toISOString().split('T')[0];

//   // URL dell'API per ottenere gli eventi sismici da INGV
//   const API_URL_INGV = `https://webservices.ingv.it/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&endtime=${formattedToday}&minmagnitude=0&minlatitude=35.3&maxlatitude=47.5&minlongitude=6.4&maxlongitude=18.3`;

//   try {
//     const response = await fetch(`${API_URL_INGV}`);
    
//     if (!response.ok) {
//       // Se la risposta non è OK, lancia un errore
//       throw new Error(`Errore nella richiesta API: ${response.status} ${response.statusText}`);
//     }

//     const contentLength = response.headers.get('Content-Length');
//     if (contentLength && parseInt(contentLength) > 1000000) { // Controlla se la risposta è troppo grande
//       console.warn("La risposta dell'API è troppo grande per essere elaborata.");
//       return null;
//     }

//     const data = await response.json();
    
//     if (data && Array.isArray(data.features)) {
//       const sortedSismics = data.features.sort((a, b) => {
//         return new Date(b.properties.time) - new Date(a.properties.time);
//       });
//       return sortedSismics[0]; // Restituisci l'evento più recente
//     } else {
//       console.error('La risposta API non è corretta:', data);
//       return null;
//     }
//   } catch (error) {
//     console.error('Errore nel caricamento degli eventi sismici:', error);
//     throw error;
//   }
// };


const loadSismicEvents = async () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedToday = today.toISOString().split('T')[0];

  // URL dell'API per ottenere gli eventi sismici da INGV
  const API_URL_INGV = `https://webservices.ingv.it/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&endtime=${formattedToday}&minmagnitude=0&minlatitude=35.3&maxlatitude=47.5&minlongitude=6.4&maxlongitude=18.3`;

  try {
    const response = await fetch(`${API_URL_INGV}`);
    const data = await response.json();

    if (data && Array.isArray(data.features)) {
      const sortedSismics = data.features.sort((a, b) => {
        return new Date(b.properties.time) - new Date(a.properties.time);
      });
      return sortedSismics[0]; // Restituisci l'evento più recente
    } else {
      console.error('La risposta API non è corretta:', data);
      return null;
    };
  } catch (error) {
    console.error('Errore nel caricamento degli eventi sismici:', error);
    throw error;
  };
};

const bot = new Telegraf(process.env.TOKEN_BOT_KEY_TELEGRAM);
const userFilePath = path.resolve('./users.json');

// Funzione per formattare la data e l'ora nel fuso orario italiano
const formatDateToItalianTime = (utcDateString) => {
  const date = new Date(utcDateString);
  date.setHours(date.getHours());

  return date.toLocaleString('it-IT', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

// Funzione per inviare una notifica Telegram agli utenti registrati
const sendAlertToUsers = async (evento) => {
  try {
    // Ottieni tutti gli utenti registrati dal database
    const utentiRegistrati = await UserTelegram.find(); // Trova tutti gli utenti nel database

    for (const user of utentiRegistrati) {
      try {
        await bot.telegram.sendMessage(
          user.idTelegram, // Corretto: usa user.telegramId per inviare messaggi
          `⚠️ Avviso Terremoto!\n` +
          `Un sisma di magnitudo ML ${evento.properties.mag} è avvenuto nella zona: ` +
          `${evento.properties.place} il ${formatDateToItalianTime(evento.properties.time)} ` +
          `con coordinate geografiche (latitudine ${evento.geometry.coordinates[0]}, longitudine ${evento.geometry.coordinates[1]}), ` +
          `ad una profondità di ${evento.geometry.coordinates[2]} Km. ` +
          `Il terremoto è stato localizzato da: ${evento.properties.author}.`
        );
      } catch (error) {
        console.error(`Errore nell'invio dell'allerta all'utente ${user.telegramId}:`, error);
      };
    };
  } catch (error) {
    console.error("Errore durante l'invio delle notifiche agli utenti:", error);
  };
};

// Funzione per controllare se è avvenuto un nuovo evento sismico
export const checkForNewEvent = async () => {
  console.log('Esecuzione della funzione checkForNewEvent');

  try {
    const latestEvent = await loadSismicEvents(); // Prendi l'evento più recente

    if (latestEvent) {
      const lastNotifiedEventId = loadLastNotifiedEventId(); // Carica l'ID dell'ultimo evento notificato

      // Verifica se l'evento ha un ID valido (eventId si trova in properties)
      const currentEventId = latestEvent.properties.eventId;

      if (!currentEventId) {
        console.error("L'evento sismico non ha un eventId valido.");
        return;
      };

      // Se l'ID dell'ultimo evento è diverso da quello memorizzato, invia una notifica
      if (currentEventId !== lastNotifiedEventId) {
        console.log(`Nuovo evento sismico rilevato: ${latestEvent.properties.place}`);
        await sendAlertToUsers(latestEvent); // Invia notifica agli utenti
        saveLastNotifiedEventId(currentEventId); // Aggiorna l'ID dell'ultimo evento notificato nel file
      } else {
        // console.log('Nessun nuovo evento sismico da notificare');
      };
    };
  } catch (error) {
    console.error('Errore nel controllo degli eventi sismici:', error);
  };
};

export default loadSismicEvents;

