# SafeQuake Alert - Backend ⚙️

## Descrizione
Il backend di SafeQuake Alert gestisce le funzionalità principali del sistema di allerta terremoti. Fornisce un'API REST per l'invio e la gestione degli avvisi, gestisce l'autenticazione degli utenti, l'interazione con il database, e utilizza WebSocket per le notifiche in tempo reale. Integra anche un sistema di notifiche tramite bot Telegram.

## 🛠️ Tecnologie utilizzate
- **Node.js**: Runtime JavaScript lato server.
- **Express.js**: Framework per la creazione di API e gestione del server.
- **MongoDB**: Database NoSQL per la memorizzazione dei dati.
- **Mongoose**: ODM per interagire con MongoDB.
- **JWT (jsonwebtoken)**: Gestione dell'autenticazione degli utenti tramite token.
- **bcrypt**: Per la crittografia delle password.
- **Passport.js (Google OAuth 2.0)**: Autenticazione tramite account Google.
- **Socket.io**: Per l'invio di notifiche in tempo reale agli utenti.
- **Nodemailer**: Per l'invio di email.
- **Cloudinary**: Gestione delle immagini sul cloud.
- **Multer**: Gestione dell'upload di file.
- **Telegraf**: Libreria per la gestione di bot Telegram.
- **Cors**: Per abilitare le richieste tra domini diversi.
- **dotenv**: Per la gestione delle variabili d'ambiente.
- **Morgan**: Logger HTTP per il monitoraggio delle richieste.
- **Node-cron**: Per eseguire task pianificati (es. invio notifiche regolari).

## 🚀 Comandi per iniziare il progetto

1. Clonare il repository:
    ```bash
    git clone https://github.com/nagcas/SafeQuake-Alert.git
    cd backend
    ```

2. Installare le dipendenze:
    ```bash
    npm install
    ```

3. Creare un file `.env` nella root del progetto e configurare le variabili d'ambiente:
    ```bash
    MONGO_URI=<url-del-tuo-database-mongodb>
    JWT_SECRET=<tuo-segreto-jwt>
    CLOUDINARY_URL=<url-cloudinary>
    TELEGRAM_BOT_TOKEN=<token-bot-telegram>
    ```

4. Avviare il server in modalità sviluppo:
    ```bash
    npm run dev
    ```

5. Avviare il server in modalità produzione:
    ```bash
    npm start
    ```

## ℹ️ Note aggiuntive
- 🔧 Ricorda di configurare correttamente i servizi esterni come MongoDB, Cloudinary, e il bot Telegram.
