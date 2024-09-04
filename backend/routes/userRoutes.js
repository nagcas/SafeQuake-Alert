// Importazione del modulo express
import express from 'express';
// Importazione del modello User

import cloudinaryUploader from '../config/cloudinaryConfig.js';
import User from '../models/user.js';
import { transporter } from '../config/mailer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


// Creazione di un router Express
const router = express.Router();

/* Gestione delle route per user */


// Definizione di una route POST per creare un nuovo utente
router.post('/', async (req, res) => {
  try {
    // Verifica se l'username è già preso
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata!' });
    };

    // Crea un nuovo utente
    const user = new User(req.body);

    // Salva il nuovo utente nel database
    const newUser = await user.save();

    // Rimuovi la password dall'oggetto di risposta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Invio email con il servizio Nodemailer
    await transporter.sendMail({
      from: '"SafeQuake Alert" <support@safequakealert.com>',
      to: user.email, 
      subject: 'Registrazione avvenuta con successo',
      html: 
        `
          <p>Ciao <strong>${user.name}</strong>,</p>
          <p>Grazie per esserti registrato a <strong>SafeQuake Alert</strong>.</p>
          <p>Siamo entusiasti di averti con noi! Ora sarai sempre aggiornato con le ultime informazioni sugli eventi sismici e 
            potrai ricevere notifiche tempestive per garantire la tua sicurezza.</p>
          <p><strong>Ricorda di aggiornare i tuoi dati del profilo</strong> per assicurarti di ricevere avvisi accurati in caso 
            di sismi nella tua zona. Ti consigliamo inoltre di attivare le notifiche push e Telegram per ricevere aggiornamenti 
            in tempo reale. Se non hai un account Telegram, ti suggeriamo di crearne uno per non perdere nessuna informazione importante.</p>
          <p>Se hai domande o bisogno di assistenza, non esitare a contattarci.</p>
          <p>Grazie,</p>
          <h3>Il team di <strong>SafeQuake Alert</strong></h3>
        `,
    });
    

    // Risposta con i dati dell'utente creato
    res.status(201).json(userResponse);

  } catch (err) {
    // Gestione degli errori generici
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una rotta GET per ottenere una lista degli utenti con paginazione e ordinamento
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per ottenere un singolo utente per id specificato
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non presente nel database!' });
    };
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});



// Definizione di una route PATCH per aggiornare un utente per id specificato
router.patch('/:userId', authMiddleware, async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true // Restituisce il documento aggiornato anziché quello vecchio
      }
    );
    if (!updateUser) {
      return res.status(404).json({ message: 'Utente non presente nel database!' });
    };

    // Invio email con il servizio Nodemailer
    await transporter.sendMail({
      from: '"SafeQuake Alert" <support@safequakealert.com>',
      to: updateUser.email, 
      subject: 'Aggiornamento dei tuoi dati avvenuto con successo', // Subject line
      html: 
        `
          <p>Ciao <strong>${updateUser.name}</strong>,</p>
          <p>Hai appena aggiornato con successo i tuoi dati su <strong>SafeQuake Alert</strong>.</p>
          <p>Grazie per mantenere il tuo profilo aggiornato. Questo ci aiuterà a fornirti un servizio migliore e a garantire che le notifiche e le informazioni che ricevi siano sempre pertinenti e accurate.</p>
          <p>Se non hai effettuato questa modifica o hai domande, ti preghiamo di contattarci immediatamente.</p>
          <p>Grazie per la tua attenzione,</p>
          <h3>Il team di <strong>SafeQuake Alert</strong></h3>
        `, // html body
    });

    res.json(updateUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  };
});


// Definizione di una route DELETE per eliminare un utente per id specificato
router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);
    if (!deleteUser) {
      return res.status(404).json({ message: 'Utente non presente nel database!' });
    };

    // Verifica se esiste un avatar
    if (deleteUser.avatar) {
      // Estrai public_id da Cloudinary dall'URL della cover
      const publicId = `safeQuake/${deleteUser.avatar.split('/').pop().split('.')[0]}`;
      console.log('PublicId estratto:', publicId);
      
      // Elimina l'immagine da Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Risultato della cancellazione:', result);
      } catch (cloudinaryError) {
        console.error('Errore di eliminazione Cloudinary:', cloudinaryError);
      };
    };

    // Invio email con il servizio Nodemailer
    await transporter.sendMail({
      from: '"SafeQuake Alert" <support@safequakealert.com>',
      to: deleteUser.email,
      subject: 'Conferma di eliminazione account', // Subject line
      html: 
        `
          <p>Ciao <strong>${deleteUser.name}</strong>,</p>
          <p>Abbiamo ricevuto la tua richiesta di eliminazione del tuo account su <strong>SafeQuake Alert</strong>.</p>
          <p>Il tuo account è stato eliminato con successo. Ci dispiace vederti andare via e speriamo che la nostra piattaforma ti sia stata utile durante il tuo periodo con noi.</p>
          <p>Se hai cambiato idea o desideri iscriverti nuovamente in futuro, sarai sempre il benvenuto.</p>
          <p>Grazie per aver fatto parte della nostra comunità. Se hai domande o bisogno di ulteriori informazioni, non esitare a contattarci.</p>
          <p>Con i migliori saluti,</p>
          <h3>Il team di <strong>SafeQuake Alert</strong></h3>
        `, // html body
    });
    
    res.json({ message: 'Utente eliminato con successo!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route PATCH per aggiornare l'avatar di un utente per id e salvare la sua immagine in cloudinary
router.patch('/:userId/avatar', authMiddleware, cloudinaryUploader.single('avatar'), async (req, res) => {
  try {
    // verifica se il file sia stato caricato
    if(!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato!'});
    };

    console.log('File caricato:', req.file);

    // cerca l'utente nel database con id
    const user = await User.findById(req.params.userId);
    if(!user) {
      return res.status(404).json({ message: 'Utente non presente nel database!'});
    };

    // Aggiorna l'URL dell'avatar dell'utente con l'URL fornito da Cloudinary
    user.avatar = req.file.path;

    // Salva le modifiche nel db
    await user.save();

    // Invio email con il servizio Nodemailer
    await transporter.sendMail({
      from: '"SafeQuake Alert" <support@safequakealert.com>',
      to: user.email,
      subject: 'Aggiornamento Avatar', // Subject line
      html: 
        `
          <p>Ciao <strong>${user.name}</strong>,</p>
          <p>Il tuo avatar su <strong>SafeQuake Alert</strong> è stato aggiornato con successo.</p>
          <p>Grazie per aver personalizzato il tuo profilo. Questo ci aiuta a riconoscerti meglio e a rendere la tua esperienza sulla nostra piattaforma ancora più personalizzata.</p>
          <p>Se non hai effettuato questa modifica o hai domande, ti preghiamo di contattarci immediatamente.</p>
          <p>Grazie per la tua attenzione,</p>
          <h3>Il team di <strong>SafeQuake Alert</strong></h3>
        `, // html body
    });

    // Invia la risposta con l'autore aggiornato
    res.json(user);

    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'avatar:', error);
      res.status(500).json({ message: 'Errore del server!' });
    };
});


// Definizione di una route GET per visualizzare la località di un utente
router.get('/:userId/locations', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };
    res.json(user.place); // Restituisce tutte le località
  } catch (error) {
    res.status(500).json({ message: 'Errore interno del server!', error });
  };
});


// Definizione di una route POST per aggiungere una nuova località di un utente
router.post('/:userId/locations', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };

    const newLocation = {
      region: req.body.region,
      province: req.body.province,
      city: req.body.city,
      address: req.body.address,
      cap: req.body.cap
    };

    user.place.push(newLocation); // Aggiunge la nuova località
    await user.save();
    res.status(201).json(user.place); // Restituisce la lista aggiornata delle località
  } catch (error) {
    res.status(500).json({ message: 'Errore del server!', error });
  };
});


// Definizione di una route PATCH per modificare una località di un singolo utente
router.patch('/:userId/locations/:locationId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };
    const location = user.place.id(req.params.locationId);
    if (!location) {
      return res.status(404).json({ message: 'Località dell\'utente non trovata!' });
    };

    // Aggiorna i campi della località
    Object.keys(req.body).forEach((key) => {
      location[key] = req.body[key];
    });

    await user.save();
    res.json(location); // Restituisce la località aggiornata
  } catch (error) {
    res.status(500).json({ message: 'Errore del server!', error });
  };
});


// Definizione di una route GET per visualizzare tutte le notifiche selezionate di un utente
router.get('/:userId/notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };
    res.json(user.notifications); // Restituisce tutte le località
  } catch (error) {
    res.status(500).json({ message: 'Errore interno del server!', error });
  };
});


// Definizione di una route POST per aggiungere le notifiche di un utente
router.post('/:userId/notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };

    const newNotification = {
      push: req.body.push,
      sms: req.body.sms,
      telegram: req.body.telegram,
      userTelegram: req.body.userTelegram
    };

    user.notifications.push(newNotification); // Aggiunge nuove notifiche
    await user.save();
    res.status(201).json(user.notifications); // Restituisce la lista aggiornata delle notifiche
  } catch (error) {
    res.status(500).json({ message: 'Errore del server!', error });
  };
});


// Definizione di una route PATCH per modificare le notifiche di un singolo utente
router.patch('/:userId/notifications/:notificationId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };
    const notification = user.notifications.id(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notifiche dell\'utente non trovate!' });
    };

    // Aggiorna i campi delle notifiche
    Object.keys(req.body).forEach((key) => {
      notification[key] = req.body[key];
    });

    await user.save();
    res.json(notification); // Restituisce la località aggiornata
  } catch (error) {
    res.status(500).json({ message: 'Errore interno del server!', error });
  };
});


// Esportazione del router
export default router;
