// Importazione del modulo express
import express from 'express';

// Importazione del modello UserTelegram
import UserTelegram from '../models/userTelegram.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';



// Creazione di un router Express
const router = express.Router();

/* Gestione delle route per userTelegram */

// Definizione di una rotta GET per ottenere una lista degli utenti registrati a Telegram
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const usersTelegram = await UserTelegram.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await UserTelegram.countDocuments();

    res.json({
      usersTelegram,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsersTelegram: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route POST per creare un nuovo utente con id Telegram
router.post('/', async (req, res) => {
  try {
    // Crea un nuovo utente
    const userTelegram = new UserTelegram(req.body);

    // Salva il nuovo utente id telegram nel database
    const newUserTelegram = await userTelegram.save();    

    // Risposta con i dati dell'utente creato
    res.status(201).json(newUserTelegram);

  } catch (err) {
    // Gestione degli errori generici
    res.status(500).json({ message: err.message });
  };
});



// Definizione di una route PATCH per aggiornare un singolo consiglio con ùun id specificato
router.patch('/:userTelegramId', authMiddleware, async (req, res) => {
  try {
    // Cerca il consiglio nel database
    const updateIdTelegram = await UserTelegram.findByIdAndUpdate(
      req.params.userTelegramId,
      req.body,
      {
        new: true // Restituisce il documento aggiornato anziché quello vecchio
      }
    );

    if (!updateIdTelegram) {
      return res.status(404).json({ message: 'Id Telegram non presente nel database!' });
    };
    
    // Invia la risposta con il consiglio aggiornato
    res.json(updateIdTelegram);
  } catch (err) {
    console.error('Errore durante l\'aggiornamento dell\'id di Telegram:', err);
    res.status(400).json({ message: 'Errore durante l\'aggiornamento dell\'id di Telegram!' });
  };
});


// Definizione di una route DELETE per eliminare un utente Telegram per id
router.delete('/:userTelegramId', authMiddleware, async (req, res) => {
  try {
    const deleteUserTelegram = await UserTelegram.findByIdAndDelete(req.params.userTelegramId);
    if (!deleteUserTelegram) {
      return res.status(404).json({ message: 'Id utente Telegram non trovato nel database!' });
    };

    res.json({ message: 'Id utente Telegram cancellato correttamente!' });
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