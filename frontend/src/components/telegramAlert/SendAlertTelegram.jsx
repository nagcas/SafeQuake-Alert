/*
 * Componente React per inviare un'allerta sismica tramite Telegram.
 * 
 * Questo componente consente di inserire la magnitudo e la località di un evento sismico
 * e inviare un messaggio di allerta a un canale Telegram. I dati inseriti vengono inviati
 * a un server backend tramite una richiesta POST.
 * 
 * - Utilizza un'API REST per inviare l'allerta a Telegram.
 * - L'URL dell'API è configurabile tramite variabile d'ambiente o un valore di fallback.
 * - Viene gestita una risposta dall'API e vengono mostrati eventuali errori nella console.
 */

import './SendAlertTelegram.css';

import React, { useState } from 'react';

function SendAlertTelegram() {

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  // Stato per memorizzare la magnitudo dell'evento sismico
  const [magnitude, setMagnitude] = useState('');
  // Stato per memorizzare la località dell'evento sismico
  const [location, setLocation] = useState('');

  /**
   * Funzione per inviare l'allerta sismica al backend tramite una richiesta POST.
   * Invia i dati della magnitudo e della località all'endpoint dell'API.
   */
  const sendAlert = async () => {
    try {
      // Effettua la richiesta POST al server con i dati dell'allerta
      const response = await fetch(`${API_URL}/api/telegram/sendAlert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          magnitude,
          location
        }),
      });
  
      // Controlla se la risposta è OK
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      };
  
      const data = await response.json();
  
      // Verifica se l'operazione ha avuto successo
      if (data.success) {
        console.log('Allerta sismica inviata con successo!');
      } else {
        console.log('Errore durante l\'invio dell\'allerta.');
      };
    } catch (error) {
      console.error('Errore durante l\'invio della richiesta:', error);
    };
  };
  

  return (
    <div className="App">
      <h1>Invia un'allerta sismica</h1>
      <input
        type="text"
        placeholder="Magnitudo"
        value={magnitude}
        onChange={(e) => setMagnitude(e.target.value)}
      />
      <input
        type="text"
        placeholder="Località"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={sendAlert}>Invia Allerta</button>
    </div>
  );
}

export default SendAlertTelegram;
