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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://safe-quake-alert.vercel.app', // Frontend in produzione
      'https://safequake-alert.onrender.com' // Backend in produzione
    ];
    
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
};

// Abilita CORS
app.use(cors(corsOptions));

// Creazione del server HTTP
const server = http.createServer(app);

// Inizializzazione di socket.io con CORS configurato
const io = new SocketServer(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://safe-quake-alert.vercel.app',
    ],
    methods: ['GET', 'POST'],
  },
});

// Variabile per memorizzare l'ID del socket dell'admin
let adminSocketID = null;

// Log delle richieste HTTP per il debug
app.use(morgan('dev'));

// Middleware per il parsing del JSON nel corpo delle richieste
app.use(express.json());

// Configurazione della sessione
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Inizializzazione e gestione di Passport per l'autenticazione
app.use(passport.initialize());
app.use(passport.session());

// Gestione delle connessioni WebSocket
io.on('connection', (socket) => {
  console.log(`Nuovo client connesso: ${socket.id}`);

  // Event handler per la registrazione dell'admin (SafeQuake Alert)
  socket.on('registerAdmin', () => {
    adminSocketID = socket.id; // Memorizza l'ID del socket dell'admin
    console.log('Admin (SafeQuake Alert) registrato con ID:', adminSocketID);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnesso: ${socket.id}`);
    if (socket.id === adminSocketID) {
      adminSocketID = null; // Resetta l'ID quando l'admin si disconnette
    }
  });

  // Gestione dei messaggi privati
  socket.on('privateMessage', (data) => {
    console.log('Messaggio privato ricevuto:', data);
    if (adminSocketID) {
      // Invia il messaggio solo all'admin
      socket.to(adminSocketID).emit('privateMessage', {
        body: data.body,
        from: data.from,
      });
    }
  });

  // Emissione del messaggio a tutti i client tranne l'emittente
  socket.on('message', (data) => {
    console.log('Messaggio ricevuto:', data);
    socket.broadcast.emit('message', {
      body: data.body,
      from: data.from,
    });
  });
});

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso a MongoDB correttamente!'))
  .catch((err) => console.error('Errore di connessione a MongoDB - Dettagli:', err));

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 5000;

// Rotte dell'applicazione
app.use('/api/auth', authRoutes);
app.use('/api/userTelegram', userTelegramRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactsRoute);
app.use('/api/posts', postsRoutes);
app.use('/api/advices', adviceRoutes);
app.use('/api/seismicEvents', seismicEventRoutes);
app.use('/api/telegram', telegramRouter);

// Error handling middleware
app.use(badRequestHandler);
app.use(authorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

// Funzione di avvio del bot Telegram con webhook
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
  setTimeout(setupBot, 5000); // Tentativo di riavvio dopo 5 secondi
}

setupBot();

// Controllo eventi sismici periodico
setInterval(() => {
  console.log('Avvio del controllo degli eventi sismici');
  checkForNewEvent();
}, 30000); // Ogni 30 secondi

// Avvio del server
server.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.table(endpoints(app));
});




