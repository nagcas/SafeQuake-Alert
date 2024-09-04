import express from 'express';
import SeismicEvent from '../models/seismicEvent.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


// Creazione di una router Express
const router = express.Router();


/* Gestione delle route per gli eventi sismici di un singolo user */

// Definizione di una route GET per ottenere tutte le informazioni sugli eventi sismici
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const seismicEvents = await SeismicEvent.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await SeismicEvent.countDocuments();

    res.json({
      seismicEvents,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSeismicEvents: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per ottenere le informazioni sugli eventi sismici in funzione dell'id
router.get('/:seismicId', authMiddleware, async (req, res) => {
  try {
    // Cerca il documento seismic event per l'id specifico
    const seismicEvent = await SeismicEvent.findById(req.params.seismicId);

    // Se l'evento sismico non è trovato, ritorna un errore 404
    if (!seismicEvent) {
      return res.status(404).json({ message: 'Evento sismico non trovato!' });
    };

    // Se trovato, ritorna l'evento sismico come risposta
    res.json(seismicEvent);
  } catch (err) {
    // Se c'è un errore (ad esempio, id non valido), ritorna un errore 500
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per ottenere tutti gli eventi sismici associati a un determinato utente
router.get('/:userId/seismicEvent', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId; // Estrai l'ID dell'utente dai parametri della richiesta

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    // Cerca tutti i documenti Advice associati all'utente specifico
    const seismicEvents = await SeismicEvent.find({ user: userId })
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await SeismicEvent.countDocuments();

    res.json({
      seismicEvents,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSeismicEvents: total,
    });
  } catch (err) {
    // Se c'è un errore (ad esempio, id non valido), ritorna un errore 500
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route POST per l'inserimento di un nuovo evento sismico
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Crea una nuova istanza di SeismicEvent utilizzando i dati forniti nel corpo della richiesta
    const seismic = new SeismicEvent(req.body);

    // Salva il nuovo consiglio nel database
    const newSeismic = await seismic.save();

    // Converte il documento salvato in un oggetto plain JavaScript
    const seismicResponse = newSeismic.toObject();

    // Restituisce una risposta con lo status 201 (Created) e l'oggetto del nuovo consiglio
    res.status(201).json(seismicResponse);

  } catch (err) {
    // In caso di errore, restituisce un messaggio di errore con lo status 400 (Bad Request)
    res.status(400).json({ message: err.message });
  };
});


// Definizione di una route DELETE per eliminare un evento sismico per id
router.delete('/:seismicId', authMiddleware, async (req, res) => {
  try {
    const deleteSeismicEvent = await SeismicEvent.findByIdAndDelete(req.params.seismicId);
    if (!deleteSeismicEvent) {
      return res.status(404).json({ message: 'Evento sismico non presente nel database!' });
    };

    res.json({ message: 'Evento sismico eliminato con successo!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Esportazione del router
export default router;