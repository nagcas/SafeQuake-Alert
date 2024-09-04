import { verifyJWT } from '../utils/jwt.js';
import User from '../models/user.js';

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estrae il token JWT dall'header di autorizzazione della richiesta
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Verifica se il token è presente
    if (!token) {
      return res.status(401).json({ message: 'Token mancante!' });
    };

    // Verifica il token e decodifica il payload
    const decoded = await verifyJWT(token);

    // Cerca l'utente nel database usando l'ID decodificato dal token
    const user = await User.findById(decoded.id).select('-password');

    // Se l'utente non viene trovato, invia una risposta 401 (Unauthorized)
    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato!' });
    };

    // Aggiunge l'utente decodificato alla richiesta per uso futuro
    req.user = user;

    // Passa il controllo al middleware successivo nella catena
    next();
  } catch (error) {
    console.error('Errore di autenticazione:', error);
    if (error.name === 'JsonWebTokenError') {
      // In caso di errore (es. token non valido), invia una risposta 401 (Unauthorized)
      return res.status(401).json({ message: 'Token non valido!' });
    };
    // In caso di errore sconosciuto, invia una risposta 500 (Internal Server Error)
    res.status(500).json({ message: "Errore interno del server durante l'autenticazione!" });
  };
};

