/*
 * `AuthProvider` Component
 *
 * Questo componente funge da provider per il contesto di autenticazione dell'applicazione. Utilizza i contesti di React per fornire
 * informazioni relative all'autenticazione e allo stato dell'utente ai componenti figli.
 * 
 * - **Stato `userLogin`**: Memorizza i dettagli dell'utente loggato, come il nome utente e altre informazioni di profilo.
 * - **Stato `isLoggedIn`**: Gestisce lo stato di autenticazione dell'utente, indicando se l'utente è attualmente loggato o meno.
 * 
 * **Funzionalità**:
 * - Fornisce i dettagli dell'utente e lo stato di login tramite il contesto, che può essere consumato da altri componenti 
 *   dell'applicazione.
 * - `setUserLogin` e `setIsLoggedIn` sono funzioni che permettono di aggiornare lo stato di autenticazione e i dettagli dell'utente.
 * 
 * **Usage**:
 * - `AuthProvider` deve avvolgere i componenti dell'applicazione che necessitano di accesso alle informazioni di autenticazione.
 * - I componenti figli possono utilizzare il contesto per ottenere informazioni sull'utente e lo stato di login tramite `useContext`.
 * 
 * **Dependencies**:
 * - `React`: Per la creazione e gestione del componente e degli stati.
 * - `Context`: Il contesto di autenticazione creato per la gestione dello stato dell'utente e dell'autenticazione.
 */

import { useState } from 'react';
import { Context } from './Context.jsx';

// Componente AuthProvider che fornisce lo stato di autenticazione e l'utente ai componenti figli
export const AuthProvider = ({ children }) => {

  // Stato per memorizzare i dettagli dell'utente/log-in
  const [userLogin, setUserLogin] = useState({});
  // Stato per gestire se l'utente è loggato o meno
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    // Provider del contesto che rende disponibili i valori agli altri componenti
    <Context.Provider value={
      { 
        userLogin,  // Dettagli dell'utente attualmente loggato
        setUserLogin,  // Funzione per aggiornare i dettagli dell'utente
        isLoggedIn,  // Stato che indica se l'utente è loggato
        setIsLoggedIn  // Funzione per aggiornare lo stato di login dell'utente
      }
    }>
      {children}
    </Context.Provider>
  );
};

