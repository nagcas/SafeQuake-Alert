/*
 * Componente `SismicMapSafe` che visualizza una mappa sismica interattiva e gestisce l'evento sismico più forte.
 * Utilizza `react-bootstrap` per il layout e gestisce lo stato dell'evento sismico più forte tramite `useState`.
 *
 * Struttura:
 * - `Container`: Contenitore fluido per garantire che il layout si estenda per tutta la larghezza disponibile.
 * - `SismicMap`: Componente personalizzato che mostra la mappa sismica e gestisce gli eventi sismici in tempo reale.
 *
 * Stato:
 * - `latestSismicEventHigh`: Stato per memorizzare l'evento sismico più forte. Inizialmente impostato su `null`.
 * - `setLatestSismicEventHigh`: Funzione per aggiornare lo stato di `latestSismicEventHigh`.
 *
 * Funzionalità:
 * - Il componente `SismicMapSafe` include il componente `SismicMap` che è responsabile della visualizzazione della mappa sismica.
 * - Il componente `SismicMap` riceve la funzione `setLatestSismicEventHigh` come prop, permettendo al componente mappa di aggiornare lo stato dell'evento sismico più forte.
 * - La mappa visualizza gli eventi sismici in tempo reale e può aggiornare il valore di `latestSismicEventHigh` in base ai dati ricevuti.
 *
 * Note:
 * - `SismicMap` dovrebbe essere configurato per utilizzare la funzione `setLatestSismicEventHigh` per comunicare i dati dell'evento sismico più forte al componente `SismicMapSafe`.
 */

import './SismicMapSafe.css';

import { Container } from 'react-bootstrap';
import SismicMap from '../dashboard/sismicMap/SismicMap';
import { useState } from 'react';

function SismicMapSafe() {
  
  // Definisci lo stato per l'evento sismico più forte
  const [latestSismicEventHigh, setLatestSismicEventHigh] = useState(null);
  
  return (
    <Container fluid className='content__sismic__map'>
      {/* Mappa sismica eventi sismici in tempo reale */}
      <SismicMap setLatestSismicEventHigh={setLatestSismicEventHigh} />
    </Container>
  ); 
};

export default SismicMapSafe;