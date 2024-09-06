import express from 'express';
import { Telegraf } from 'telegraf'; // Importa il framework Telegraf per gestire i bot di Telegram
import UserTelegram from '../models/userTelegram.js'; // Importa il modello UserTelegram per ottenere gli utenti dal database
import dotenv from 'dotenv';

dotenv.config();

// URL frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const router = express.Router(); // Crea un router Express per gestire le richieste HTTP

// Funzione per formattare la data e l'ora nel fuso orario italiano
const formatDateToItalianTime = (utcDateString) => {
  const date = new Date(utcDateString); // Crea un oggetto Date a partire dalla stringa UTC
  date.setHours(date.getHours() + 2);

  return date.toLocaleString('it-IT', {
    timeZone: 'Europe/Rome', // Specifica il fuso orario europeo
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Imposta il formato orario a 24 ore
  });
};

// Inizializza un'istanza del bot Telegram utilizzando il token presente nelle variabili d'ambiente
const bot = new Telegraf(process.env.TOKEN_BOT_KEY_TELEGRAM);


// Funzione per inviare una notifica Telegram agli utenti registrati
const sendAlertToUsers = async (evento, distanza, idTelegram) => {
  try {
    await bot.telegram.sendMessage(
      idTelegram, // Invia un messaggio all'utente con l'idTelegram specificato
      `⚠️ Avviso Terremoto (Raggio di 100km)!\n` +
      `Un sisma di magnetudo ${evento.properties.magType} ${evento.properties.mag} è avvenuto nella zona: ` +
      `${evento.properties.place} il ${formatDateToItalianTime(evento.properties.time)} ` +
      `con coordinate geografiche (latitudine ${evento.geometry.coordinates[0]}, longitudine ${evento.geometry.coordinates[1]}), ` +
      `ad una profondità di ${evento.geometry.coordinates[2]} Km. ` +
      `Il terremoto è stato localizzato da: ${evento.properties.author}.\n` +
      `Il terremoto dalla tua posizione è distante Km ${distanza}.`
    );
  } catch (error) {
    console.error(`Errore nell'invio dell'allerta all'utente ${idTelegram}:`, error); // Gestione errori
  };
};


// Funzione per inviare un post agli utenti Telegram registrati
const sendPostToUsers = async (post) => {
  try {
    // Ottieni tutti gli utenti registrati dal database
    const utentiRegistrati = await UserTelegram.find(); // Trova tutti gli utenti nel database

    // Itera sugli utenti registrati e invia il messaggio a ciascuno
    for (const user of utentiRegistrati) {
      try {
        await bot.telegram.sendMessage(
          user.idTelegram, // Invia il messaggio all'utente
          `${post.title}\n\n` +
          `Categoria: ${post.category}\n\n` +
          `Autore: ${post.author}\n\n` +
          `Data Pubblicazione: ${formatDateToItalianTime(post.createdAt)}\n\n` +
          `${post.description}\n\n` +
          `Link: ${FRONTEND_URL}/detail-post/${post._id}`
        );
      } catch (error) {
        console.error(`Errore nell'invio del post all'utente ${user.idTelegram}:`, error); // Gestione errori per ogni utente
      };
    };
  } catch (error) {
    console.error('Errore durante l\'invio del post agli utenti:', error); // Gestione errori generale
  };
};


// Funzione per inviare un messaggio di consiglio (advice) agli utenti Telegram
const sendAdviceToUsers = async (idTelegram, message, msg) => {
  try {
    await bot.telegram.sendMessage(
      idTelegram, // Invia il messaggio all'utente con l'idTelegram specificato
      `Informazioni utili\n\n` +
      `${msg}\n\n` +
      `Consiglio: ${message.consigli}\n\n` +
      `Avvisi di replica: ${message.avvisiDiReplica}\n\n` +
      `Possibile impatto: ${message.possibileImpatto}\n\n` +
      `Durante il terremoto: ${message.duranteIlTerremoto}\n\n` +
      `Dopo il terremoto: ${message.dopoIlTerremoto}\n\n` +
      `Consigli di sicurezza: ${message.consigliDiSicurezza}`
    );
  } catch (error) {
    console.error(`Errore nell'invio dell'advice all'utente ${idTelegram}:`, error); // Gestione errori
  };
};


// Definizione della route POST per inviare un avviso sismico in base alla distanza
router.post('/sendAlert', async (req, res) => {
  const { event, distanza, idTelegram } = req.body;

  if (!event) {
    return res.status(400).json({ success: false, message: 'Nessun evento sismico fornito.' }); // Validazione
  };

  try {
    await sendAlertToUsers(event, distanza, idTelegram); // Invio dell'allerta
    res.status(200).json({ success: true, message: 'Allerta sismica inviata agli utenti!' });
  } catch (error) {
    console.error('Errore durante l\'invio dell\'allerta:', error); // Gestione errori
    res.status(500).json({ success: false, message: 'Errore nell\'invio dell\'allerta.' });
  };
});


// Definizione della route POST per inviare un post a tutti gli iscritti
router.post('/sendPost', async (req, res) => {
  const { post } = req.body;

  if (!post) {
    return res.status(400).json({ success: false, message: 'Nessun post fornito.' }); // Validazione
  };

  try {
    await sendPostToUsers(post); // Invio del post
    res.status(200).json({ success: true, message: 'Post inviato agli utenti!' });
  } catch (error) {
    console.error('Errore durante l\'invio del post:', error); // Gestione errori
    res.status(500).json({ success: false, message: 'Errore nell\'invio del post.' });
  };
});


// Definizione della route POST per inviare un messaggio di consiglio agli utenti
router.post('/sendAdvice', async (req, res) => {
  const { idTelegram, message, msg } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Nessun advice fornito.' }); // Validazione
  };

  try {
    await sendAdviceToUsers(idTelegram, message, msg); // Invio del messaggio di consiglio
    res.status(200).json({ success: true, message: 'Advice inviato agli utenti!' });
  } catch (error) {
    console.error('Errore durante l\'invio dell\'advice:', error); // Gestione errori
    res.status(500).json({ success: false, message: 'Errore nell\'invio dell\'advice.' });
  };
});


// Middleware per gestire le rotte non trovate
router.use((req, res, next) => {
  //res.status(404).json({ error: 'Risorsa non trovata!', message: 'La risorsa richiesta non è stata trovata!' });
  // Reindirizza alla pagina 404 del frontend
  res.redirect(`${FRONTEND_URL}/404`);
});

export default router; // Esporta il router per essere utilizzato nell'app principale

