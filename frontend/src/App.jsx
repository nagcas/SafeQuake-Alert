/*
 * Componente per gestire le notifiche push.
 * 
 * Utilizza i servizi Firebase per richiedere un token di registrazione e ascoltare i messaggi push
 * ricevuti mentre l'app è in primo piano. Le notifiche vengono poi propagate utilizzando il contesto
 * delle notifiche.
 */

import './App.css'; // Importa gli stili personalizzati per l'applicazione
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa gli stili di Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa le icone di Bootstrap

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './modules/AuthProvider.jsx';
import { requestForToken, onMessageListener } from './services/Firebase.jsx';


import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NavbarSafe from './components/common/navbar/NavbarSafe';
import Profile from './pages/profile/Profile';
import DetailNews from './pages/detailNews/DetailNews';
import Dashboard from './pages/dashboard/Dashboard';
import EventSismic from './pages/eventSismic/EventSismic';
import About from './pages/about/About';
import BlogPosts from './pages/blog/BlogPosts';
import Contacts from './pages/contacts/Contacts';
import Services from './pages/services/Services';
import PageNotFound from './pages/pageNotfound/PageNotFound';
import DetailPost from './pages/detailPost/DetailPost';
import { NotificationProvider, useNotification } from './modules/NotificationContext.jsx';
import Info from './pages/Info/Info';
import SismicMapSafe from './pages/sismicMapSafe/SismicMapSafe';
import SismicNearby from './pages/sismicNearby/SismicNearby';
import HowItWorks from './pages/howItWorks/HowItWorks';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/forgotPassword/ResetPassword';
import ChangePassword from './pages/changePassword/ChangePassword';
import Chat from './pages/chat/Chat';
import FooterSafe from './components/common/footer/FooterSafe.jsx';
import License from './pages/license/License.jsx';


function NotificationHandler() {
  
  const { notify } = useNotification();

  useEffect(() => {
    // Richiede un token di registrazione per le notifiche push
    requestForToken();

    // Imposta un listener per i messaggi push ricevuti in primo piano
    onMessageListener()
      .then(payload => {
        // console.log('Messaggio ricevuto in primo piano:', payload);
        notify(payload.notification);
      })
      .catch(err => console.log('Errore nella ricezione del messaggio in primo piano:', err));
  }, [notify]);

  return null; // Questo componente non rende nulla, serve solo per gestire le notifiche
}

/*
 * Componente principale dell'applicazione.
 * 
 * Configura il provider di autenticazione e il provider delle notifiche. Definisce le rotte dell'applicazione
 * e rende la struttura dell'app, inclusi il Navbar e il gestore delle notifiche.
 */

function App() {
  
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <NavbarSafe /> {/* Barra di navigazione persistente */}
          <NotificationHandler /> {/* Gestisce le notifiche push */}
          <Routes>
            <Route path='/' element={<Home />} /> {/* Route per aprire il componente home */}
            <Route path='/event-sismic' element={<EventSismic />} /> {/* Route per aprire il componente eventi sismici */}
            <Route path='/sismic-map' element={<SismicMapSafe />} /> {/* Route per aprire il componente mappa eventi */}
            <Route path='/services' element={<Services />} /> {/* Route per aprire il componente servizi */}
            <Route path='/about' element={<About />} /> {/* Route per aprire il componente about */}
            <Route path='/blog-posts' element={<BlogPosts />} /> {/* Route per aprire il componente blog */}
            <Route path='/info' element={<Info />} /> {/* Route per aprire il componente info */}
            <Route path='/contacts' element={<Contacts />} /> {/* Route per aprire il componente contattaci */}
            <Route path='/login' element={<Login />} /> {/* Route per aprire il componente login */}
            <Route path='/register' element={<Register />} /> {/* Route per aprire il componente registrati */}
            <Route path='/detail-news/:title' element={<DetailNews />} /> {/* Route per aprire il componente dettagli news */}
            <Route path='/detail-post/:id' element={<DetailPost />} /> {/* Route per aprire il componente dettagli post */}
            <Route path='/profile' element={<Profile />} /> {/* Route per aprire il componente profilo utente */}
            <Route path='/dashboard' element={<Dashboard />} /> {/* Route per aprire il componente pannello dashboard */}
            <Route path='/sismic-nearby' element={<SismicNearby />} /> {/* Route per aprire il componente eventi sismici personali */}
            <Route path='/how-it-works' element={<HowItWorks />} /> {/* Route per aprire informazioni di utilizzo */}
            <Route path='/forgot-password' element={<ForgotPassword />} /> {/* Route per aprire il componente password dimenticata */}
            <Route path='/reset-password/:id/:token' element={<ResetPassword />} /> {/* Route per aprire il componente reset password */}
            <Route path='/change-password/' element={<ChangePassword />} /> {/* Route per aprire il componente cambia password personale esclusa google */}
            <Route path='/license' element={<License />} /> {/* Route per gestire pagine non trovate */}
            <Route path='*' element={<PageNotFound />} /> {/* Route per gestire pagine non trovate */}
          </Routes>
          <FooterSafe />
        </Router>
        <Chat /> {/* Route per aprire il componente chat in tempo reale */}
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;





