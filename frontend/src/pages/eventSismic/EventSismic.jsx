/*
 * Componente `EventSismic`
 * 
 * Il componente `EventSismic` è responsabile per la visualizzazione degli eventi sismici recenti. Utilizza il contesto per ottenere le informazioni sull'utente autenticato e visualizza una lista di eventi sismici tramite il componente `ListsSismicEvents`.
 * 
 * Funzionalità principali:
 * 
 * 1. **Gestione dell'Utente**:
 *    - Utilizza il contesto per accedere alle informazioni dell'utente autenticato (`userLogin`). Questo potrebbe essere utile per personalizzare o filtrare i dati mostrati, se necessario.
 * 
 * 2. **Visualizzazione degli Eventi Sismici**:
 *    - Mostra una lista degli ultimi 20 eventi sismici in tempo reale utilizzando il componente `ListsSismicEvents`.
 * 
 * 3. **Layout**:
 *    - Utilizza il componente `Container` di Bootstrap per gestire il layout e garantire che il contenuto sia ben strutturato e responsivo.
 * 
 * Uso e Integrazione:
 * 
 * Il componente `EventSismic` è progettato per essere utilizzato in un'applicazione che monitorizza eventi sismici, offrendo agli utenti una panoramica degli eventi più recenti. È particolarmente utile in contesti dove è necessario monitorare o visualizzare eventi sismici in tempo reale.
 */

import './EventSismic.css';

import { Container } from 'react-bootstrap';
import ListsSismicEvents from '../dashboard/listsSismicEvents/ListsSismicEvents';
import { useContext } from 'react';
import { Context } from '../../modules/Context.jsx';

function EventSismic() {

  const { userLogin } = useContext(Context);

  return (
    <Container fluid className='content__event__sismic'>
      {/* Visualizza tabella degli utltimi 20 eventi sismici in tempo reale */}
      <ListsSismicEvents userLogin={userLogin} />
    </Container>
  );
};

export default EventSismic;