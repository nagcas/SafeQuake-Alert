import express from 'express';
import Advice from '../models/advice.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


// Creazione di una router Express
const router = express.Router();


/* Gestione delle route per gli advice di un singolo user */

// Definizione di una route GET per ottenere tutte le informazioni sui consigli
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const advices = await Advice.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await Advice.countDocuments();

    res.json({
      advices,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAdvices: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per ottenere le informazioni sui consigli in funzione dell'id
router.get('/:adviceId', authMiddleware, async (req, res) => {
  try {
    // Cerca il documento Advice per l'id specifico
    const advice = await Advice.findById(req.params.adviceId);

    // Se il consiglio non è trovato, ritorna un errore 404
    if (!advice) {
      return res.status(404).json({ message: 'Consiglio utente non trovato!' });
    };

    // Se trovato, ritorna il consiglio come risposta
    res.json(advice);
  } catch (err) {
    // Se c'è un errore (ad esempio, id non valido), ritorna un errore 500
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per ottenere tutti i consigli associati a un determinato utente
router.get('/:userId/advice', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId; // Estrai l'ID dell'utente dai parametri della richiesta

    // Cerca tutti i documenti Advice associati all'utente specifico
    const advices = await Advice.find({ user: userId });

    // Se non sono trovati consigli, ritorna un errore 404
    if (advices.length === 0) {
      return res.status(404).json({ message: 'Nessun consiglio trovato per questo utente!' });
    };

    // Se trovati, ritorna i consigli come risposta
    res.json(advices);
  } catch (err) {
    // Se c'è un errore (ad esempio, id non valido), ritorna un errore 500
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route POST per l'inserimento di un nuovo consiglio in funzione di un evento sismico
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Crea una nuova istanza di Advice utilizzando i dati forniti nel corpo della richiesta
    const advice = new Advice(req.body);

    // Salva il nuovo consiglio nel database
    const newAdvice = await advice.save();

    // Converte il documento salvato in un oggetto plain JavaScript
    const adviceResponse = newAdvice.toObject();

    // Restituisce una risposta con lo status 201 (Created) e l'oggetto del nuovo consiglio
    res.status(201).json(adviceResponse);

  } catch (err) {
    // In caso di errore, restituisce un messaggio di errore con lo status 400 (Bad Request)
    res.status(400).json({ message: err.message });
  };
});


// Definizione di una route PATCH per aggiornare un singolo consiglio con ùun id specificato
router.patch('/:adviceId', authMiddleware, async (req, res) => {
  try {
    // Cerca il consiglio nel database
    const updateAdvice = await Advice.findByIdAndUpdate(
      req.params.adviceId,
      req.body,
      {
        new: true // Restituisce il documento aggiornato anziché quello vecchio
      }
    );

    if (!updateAdvice) {
      return res.status(404).json({ message: 'Consiglio non presente nel database!' });
    };
    
    // Invia la risposta con il consiglio aggiornato
    res.json(updateAdvice);
  } catch (err) {
    console.error('Errore durante l\'aggiornamento del consiglio:', err);
    res.status(400).json({ message: 'Errore durante l\'aggiornamento del consiglio!' });
  };
});


// Definizione di una route DELETE per eliminare un advice per id
router.delete('/:adviceId', authMiddleware, async (req, res) => {
  try {
    const deleteAdvice = await Advice.findByIdAndDelete(req.params.adviceId);
    if (!deleteAdvice) {
      return res.status(404).json({ message: 'Consiglio utente non trovato nel database!' });
    };

    res.json({ message: 'Consiglio utente cancellato correttamente!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Esportazione del router
export default router;

