/*
 * `Context` - Contesto di Autenticazione
 *
 * Questo contesto è utilizzato per gestire e condividere lo stato di autenticazione e le informazioni dell'utente 
 * attraverso l'applicazione React. Il contesto permette ai componenti di accedere a dati relativi all'autenticazione 
 * senza dover passare questi dati tramite props manualmente attraverso la gerarchia dei componenti.
 *
 * **Funzionalità:**
 * - **Fornire:** Consente a un componente di fornire dati e metodi relativi all'autenticazione (es. dettagli dell'utente, stato di login) 
 *   ai suoi componenti figli attraverso il provider del contesto.
 * - **Consumare:** Permette ai componenti di accedere ai dati e ai metodi forniti dal contesto utilizzando il consumatore del contesto.
 *
 * **Usage:**
 * - Creare un provider per questo contesto che avvolga i componenti dell'applicazione che necessitano di accedere 
 *   ai dati di autenticazione.
 * - Utilizzare `useContext` per consumare il contesto all'interno dei componenti figli.
 *
 * **Dependencies:**
 * - **`React`:** Fornisce le funzionalità per creare e gestire il contesto.
 */

import { createContext } from 'react';

// Crea un contesto per l'autenticazione e lo stato dell'utente
// Questo contesto può essere utilizzato per fornire e consumare dati relativi all'autenticazione dell'utente
export const Context = createContext();
