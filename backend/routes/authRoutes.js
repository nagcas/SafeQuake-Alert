import express from 'express';
import User from '../models/user.js';
import { generateJWT } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { transporter } from '../config/mailer.js';
import passport from '../config/passportConfig.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// URL frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Creazione di una router Express
const router = express.Router();


// Funzione di callback per gestire il successo dell'autenticazione
async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  };
};

/* Gestione delle route per auth */

// Definizione di una route POST /login => restituisce token di accesso
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide!' });
    };

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide!' });
    };

    const token = await generateJWT({ id: user._id });
    res.json({ token, message: 'Accesso login con successo!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Errore del server!' });
  };
});


// Definizione di una route GET/me => restituisce l'user collegato al token di accesso
router.get('/me', authMiddleware, (req, res) => {
  try {
    const userData = req.user.toObject();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('Errore durante il ripristino dell\'utente:', error);
    res.status(500).json({ message: 'Errore del server!' });
  };
});


// Definizione della router POST per password dimenticata dell'utente
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Email non trovata!' });
    };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${FRONTEND_URL}/reset-password/${user._id}/${token}`;

    await transporter.sendMail({
      from: `"SafeQuake Alert" <support@safequakealert.com>`,
      to: user.email,
      subject: 'Recupero della password',
      html: `
        <p>Ciao <strong>${user.name}</strong>,</p>
        <p>Hai richiesto di recuperare la tua password. Per procedere, clicca sul link sottostante:</p>
        <br />
        <a href="${resetUrl}" target="_blank">Reimposta la tua password</a>
        <br /><br />
        <p>Se non hai richiesto il recupero della password, ignora questa email. La tua password rimarrà invariata.</p>
        <br />
        <p>Grazie,</p>
        <h3>Il team di <strong>SafeQuake Alert</strong></h3>
      `,
    });

    res.status(200).json({ message: 'Email di recupero inviata con successo!' });
  } catch (error) {
    console.error('Errore nel recupero della password:', error);
    res.status(500).json({ message: 'Errore del server!', error: error.message });
  };
});


// Definizione della router POST per resettare la password dell'utente
router.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.trim() === '') {
      return res.status(400).json({ Status: 'Password non fornita!' });
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const hash = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(id, { password: hash }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ Status: 'Utente non trovato!' });
    };

    res.json({ Status: 'Password resettata con successo!' });
  } catch (err) {
    console.error('Errore durante il reset della password:', err);
    if (err.name === 'JsonWebTokenError') {
      res.status(400).json({ message: 'Token non valido!' });
    } else if (err.name === 'TokenExpiredError') {
      res.status(400).json({ message: 'Token scaduto!' });
    } else {
      res.status(500).json({ message: 'Errore del server!', Error: err.message });
    };
  };
});


// Definizione di router PATCH per aggiornare la password dell'utente
router.patch('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verifica se la password corrente e la nuova password sono fornite
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'La password corrente e la nuova password sono obbligatorie!' });
    };

    // Trova l'utente che ha effettuato il login
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    };

    // Confronta la password corrente con quella salvata
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'La password corrente non è corretta!' });
    };

    // Verifica che la nuova password sia diversa dalla vecchia
    if (await user.comparePassword(newPassword)) {
      return res.status(400).json({ message: 'La nuova password deve essere diversa dalla password corrente!' });
    };

    // Aggiorna la password nel database
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password aggiornata con successo!' });
  } catch (error) {
    console.error('Errore durante il cambiamento della password:', error);
    res.status(500).json({ message: 'Errore del server!', error: error.message });
  };
});


// Rotte di autenticazione con Google
router.get(
  '/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


router.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  handleAuthCallback
);



// Esportazione del router
export default router;
