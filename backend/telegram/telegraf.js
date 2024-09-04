import { Telegraf, Markup } from 'telegraf';
import UserTelegram from '../models/userTelegram.js'; // Assicurati di importare il modello corretto

const bot = new Telegraf(process.env.TOKEN_BOT_KEY_TELEGRAM);

const infoApp = `
SafeQuake Alert è un'applicazione web avanzata progettata per fornirti allerte istantanee sui terremoti e consigli su come comportarti durante questi eventi.

Con SafeQuake Alert, puoi migliorare la tua sicurezza e quella della tua famiglia con notifiche tempestive, informazioni educative e aggiornamenti costanti.

Per ricevere allerte sismiche personalizzate e consigli di comportamento in base alla tua posizione geografica, è necessario che tu fornisca il tuo ID utente Telegram.
Una volta registrato il tuo ID utente, il nostro sistema potrà monitorare i terremoti entro un raggio di 100 km dalla tua posizione e inviarti immediatamente gli aggiornamenti rilevanti. A seconda della magnitudo del sisma, riceverai anche consigli utili su come comportarti per proteggerti al meglio.

Per maggiori informazioni sul funzionamento digita il comando /start.
`;

const msg = `
Benvenuto in SafeQuake Alert, l'applicazione di monitoraggio e allerta sismica che ti tiene sempre informato in caso di terremoti. Grazie a notifiche in tempo reale, consigli pratici e una guida su come comportarsi in situazioni di emergenza, SafeQuake Alert è qui per aiutarti a rimanere al sicuro.

Caratteristiche principali:
📡 Allerta in tempo reale: Ricevi notifiche immediate in caso di terremoto nella tua area o nelle vicinanze.
📈 Informazioni dettagliate: Magnitudo, epicentro, località.
🧭 Suggerimenti di sicurezza: Consigli su cosa fare prima, durante e dopo un evento sismico.
🔄 Aggiornamenti costanti: Articoli con link diretto alla pagina di SafeQuake Alert.

Come utilizzare SafeQuake Alert:
🆔 Digita /mioId per ottenere il tuo id di Telegram.
ℹ️ Digita /info per visualizzare informazioni sull'app.

Contatti e supporto:
Per domande o segnalazioni, puoi contattare il nostro team di supporto scrivendo a: supporto@safequakealert.com.
`;

// Comando di avvio del bot
bot.start(async (ctx) => {
  const userId = ctx.from.id;

  try {
    // Verifica se l'utente è già registrato nel database
    const user = await UserTelegram.findOne({ idTelegram: userId });

    if (user) {
      // Se l'utente è già registrato
      ctx.reply('Il tuo ID Telegram è già registrato.');
    } else {
      // Se l'utente non è registrato, crealo
      await UserTelegram.create({ idTelegram: userId });
      ctx.reply('Il tuo ID Telegram è stato registrato con successo.');
    };

    // Invia il messaggio di benvenuto
    ctx.reply(msg, 
      Markup.inlineKeyboard([
        [Markup.button.callback('Mostra Mio ID Telegram', 'mioId')],
        [Markup.button.callback('Informazioni App', 'info')],
      ])
    );

  } catch (err) {
    console.error('Errore durante la registrazione dell\'utente:', err);
    ctx.reply('Si è verificato un errore durante la registrazione del tuo ID Telegram. Riprova più tardi.');
  }
});

// Comando di aiuto help
bot.help((ctx) => {
  ctx.reply(infoApp);
});

// Comando informazioni
bot.command('info', (ctx) => {
  ctx.reply(infoApp);
});

// Callback query per gestire i bottoni
bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;
  
  switch (data) {
    case 'mioId':
      ctx.reply(`Questo è il tuo ID personale da inserire nel tuo profilo SafeQuake Alert alla sezione notifiche telegram:\n ${ctx.from.id}`);
      break;
    case 'info':
      ctx.reply(infoApp);
      break;
    default:
      ctx.reply('Comando non riconosciuto.');
  };

  // Risposta per chiudere la notifica del pulsante
  ctx.answerCbQuery();
});

export { bot };



