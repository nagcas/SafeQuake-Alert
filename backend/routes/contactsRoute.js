// Importazione del modulo express
import express from 'express';
// Importazione del modello Contatti
import Contact from '../models/contacts.js';
import { transporter } from '../config/mailer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


// Creazione di un router Express
const router = express.Router();

/* Gestione delle route per contacts */

// Definizione di una rotta GET per ottenere una lista dei messaggi con paginazione e ordinamento
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.json({
      contacts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContacts: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


router.post('/', async (req, res) => {
  try {
    // Crea un nuovo documento con i dati forniti
    const newContactData = req.body;

    // Crea un nuovo contatto senza modificare i dati esistenti nel database
    const newContact = new Contact(newContactData);

    // Salva il nuovo contatto nel database
    await newContact.save();

    // Invio email con il servizio Nodemailer
    await transporter.sendMail({
      from: '"SafeQuake Alert" <support@safequakealert.com>',
      to: newContact.email,
      subject: 'Conferma di ricezione del tuo messaggio',
      html: `
        <p>Ciao <strong>${newContact.name}</strong>,</p>
        <p>Grazie per averci contattato tramite <strong>SafeQuake Alert</strong>.</p>
        <p>Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto. Il nostro team sta già esaminando la tua richiesta.</p>
        <p>Se hai bisogno di ulteriore assistenza o desideri fornire ulteriori dettagli, non esitare a rispondere a questa email.</p>
        <p>Grazie per la tua pazienza,</p>
        <p><strong>Il team di SafeQuake Alert</strong></p>
      `,
    });

    // Invia una risposta con stato 201 e i dati del nuovo contatto salvato
    res.status(201).json(newContact);

  } catch (err) {
    // Gestione degli errori
    console.error('Errore durante il salvataggio o l\'invio dell\'email:', err);
    res.status(500).json({ message: 'Errore del server, impossibile processare la richiesta!' });
  };
});


// Definizione di una route PATCH per aggiornare la risposta di un messaggio 
router.patch('/:contactId', authMiddleware, async (req, res) => {
  try {
    const updateMessage = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      {
        new: true // Restituisce il documento aggiornato anziché quello vecchio
      }
    );
    if (!updateMessage) {
      return res.status(404).json({ message: 'Messaggio non presente nel database!' });
    };

    // Invio email con il servizio Nodemailer
    await transporter.sendMail({
      from: '"SafeQuake Alert" <support@safequakealert.com>',
      to: updateMessage.email, 
      subject: 'Hai ricevuto una risposta alla tua richiesta', // Subject line
      html: 
        `
          <p>Ciao <strong>${updateMessage.name}</strong>,</p>
          <p>Hai ricevuto una risposta alla tua richiesta su <strong>SafeQuake Alert</strong>.</p>
          <p>La nostra risposta:</p>
          <blockquote>
            <p>${updateMessage.response}</p>
          </blockquote>
          <p>Se hai ulteriori domande o necessiti di ulteriori chiarimenti, non esitare a contattarci.</p>
          <p>Grazie per averci contattato,</p>
          <h3>Il team di <strong>SafeQuake Alert</strong></h3>
        `, // html body
    });

    res.json(updateMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  };
});


// Definizione di una route DELETE per eliminare un messaggio di un utente
router.delete('/:contactId', authMiddleware, async (req, res) => {
  try {
    const deleteContact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!deleteContact) {
      return res.status(404).json({ message: 'Contatto non presente nel database!' });
    };

    res.json({ message: 'Messaggio eliminato con successo!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Middleware per gestire le rotte non trovate
router.use((req, res, next) => {
  //res.status(404).json({ error: 'Risorsa non trovata!', message: 'La risorsa richiesta non è stata trovata!' });
  // Reindirizza alla pagina 404 del frontend
  res.redirect(`${FRONTEND_URL}/404`);
});


// Esportazione del router
export default router;

