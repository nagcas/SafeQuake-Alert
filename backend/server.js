// Importazione dei moduli necessari
import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passportConfig.js';
import session from 'express-session';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';

import userRoutes from './routes/userRoutes.js';
import contactsRoute from './routes/contactsRoute.js';
import authRoutes from './routes/authRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import adviceRoutes from './routes/adviceRoutes.js';
import seismicEventRoutes from './routes/seismicEventRoutes.js';
import userTelegramRoutes from './routes/userTelegramRoutes.js';
import { checkForNewEvent } from './eventSismic/eventSismic.js';


import telegramRouter from './routes/telegramRoutes.js';
import { bot } from './telegram/telegraf.js';


import { 
  badRequestHandler, 
  authorizedHandler, 
  notFoundHandler, 
  genericErrorHandler 
} from './middlewares/errorHandlers.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configurazione di dotenv per caricare le variabili d'ambiente dal file .env
dotenv.config(); 

// Creazione di un'applicazione Express
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://safe-quake-alert.vercel.app', // Frontend in produzione
      'https://safequake-alert.onrender.com' // Backend in produzione
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
  // basata su sessioni.
};

// Permette richieste da domini diversi dal dominio del server, utile per sviluppare API e frontend separatamente.
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: 'https://safe-quake-alert.vercel.app',
  }
});


// Logga le richieste HTTP nel terminale, utile per il debug e per vedere le richieste che arrivano al server.
app.use(morgan('dev'));

// Gestisce la connessione con un client tramite WebSocket usando socket.io
io.on('connection', (socket) => {
  // Quando un client si connette, stampa un messaggio nella console.

  // const utenti = [];
  // utenti.push(socket.id);

  // Utente disconnesso
  socket.on('disconnect', () => {
    console.log('Utente disconnesso!', socket.id);
  });

  // Stampa l'ID univoco del socket, utile per identificare connessioni individuali.
  console.log(socket.id);

  // Ascolta l'evento 'message' inviato dal client.
  socket.on('message', (data) => {
    console.log('Utente connesso!', socket.id);
    console.log('Utenti connessi:', utenti);
    // Stampa il messaggio ricevuto nella console.
    // console.log(data);

    // Invia il messaggio ricevuto
    socket.broadcast.emit('message', {
      body: data.body,  // Corpo del messaggio.
      from: data.from,  // Nome dell'utente che ha inviato il messaggio.
    });

  });
});

// Middleware per il parsing del JSON nel corpo delle richieste
app.use(express.json());


// configurazione della sessione con Google
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// fine autentificazione con google


// Connessione a MongoDB utilizzando l'URI presente nelle variabili d'ambiente
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso a MongoDB correttamente!'))
  .catch((err) => console.error('Errore di connessione a MongoDB - Dettagli:', err));

// Servire file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Definizione della porta su cui il server ascolterà, utilizzando le variabili d'ambiente o un valore di default
const PORT = process.env.PORT || 5000;

// Definzione delle rotte pwe l'autenticazione
app.use('/api/auth', authRoutes);

// Definzione delle rotte degli utenti registrati a Telegram
app.use('/api/userTelegram', userTelegramRoutes);

// Definizione delle rotte degli users
app.use('/api/users', userRoutes);

// Definizio delle rotte per i contatti
app.use('/api/contacts', contactsRoute)

// Definizione delle rotte per le news
app.use('/api/posts', postsRoutes);

// Definizione delle rotte per le advice
app.use('/api/advices', adviceRoutes);

// Definizione delle rotte per le seismicEvent
app.use('/api/seismicEvents', seismicEventRoutes);

// Usa il router per gestire le richieste relative alle allerte
app.use('/api/telegram', telegramRouter);


app.use(badRequestHandler);
app.use(authorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);


// Funzione di avvio del bot Telegram con gestione degli errori
const setupBot = async () => {
  try {
    // Avvio del bot con long polling
    await bot.launch();
    console.log('Bot Telegram avviato');

  } catch (error) {
    console.error('Errore nell\'avvio del bot Telegram:', error);

    // Riavvia il bot dopo un breve ritardo in caso di errore
    setTimeout(() => {
      console.log('Tentativo di riavvio del bot Telegram...');
      setupBot(); // Richiama la funzione per rilanciare il bot
    }, 5000); // Attende 5 secondi prima di riprovare
  };
};

setupBot();

 // Avvia il controllo degli eventi sismici periodicamente
 setInterval(() => {
  console.log('Avvio del controllo degli eventi sismici');
  checkForNewEvent();
}, 30000); // Verifica ogni 30 secondi

// Avvio del server
server.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.log('Ecco l\'elenco degli endpoint disponibili:');
  // Stampa tutti gli endpoint disponibili nell'app in formato tabella
  console.table(endpoints(app));
});

