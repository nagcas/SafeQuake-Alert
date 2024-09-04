// Importazione delle dipendenze necessarie
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';


// Configurazione di dotenv per caricare le variabili d'ambiente dal file .env
dotenv.config(); 

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

// Configurazione della strategia di autenticazione Google
passport.use(
  new GoogleStrategy(
    {
      // Configurazione delle credenziali Google
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerca l'utente nel database usando l'ID Google
        let user = await User.findOne({ googleId: profile.id });

        // Se l'utente non esiste, creane uno nuovo
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.name.givenName, 
            lastname: profile.name.familyName, 
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            birthdate: '',
            gender: '',
            phone: '',
            favoriteLanguage: '',
            terms: true,
            username: profile.emails[0].value.split('@')[0], // Usa la parte prima della @ dell'email come username
            notifications: [{ 
              push: false, 
              telegram: false, 
              userTelegram: '' 
            }], // Aggiungi le notifiche
            place: [{
              region: '',
              province: '',
              city: '',
              address: '',
              cap: '',
              latitude: '',
              longitude: '',
            }],
            seismicEvents: [],
            advices: [],
          });
          // Salvo il nuovo utente nel database
          await user.save();
        };

        done(null, user);
      } catch (error) {
        done(error, null);
      };
    }
  )
);


// Serializzazione dell'utente per la sessione
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  };
});

export default passport;
