/*
 * Invia un'allerta sismica tramite l'API di Telegram.
 * 
 * Effettua una richiesta POST all'endpoint `/telegram/sendAlert` dell'API per inviare un'allerta sismica a Telegram.
 * 
 * @param {string} event - Il tipo di evento per l'allerta sismica.
 * @param {number} distanza - La distanza dell'evento dall'utente.
 * @param {string} idTelegram - L'ID del destinatario su Telegram.
 * @returns {Promise<void>} - Non restituisce nulla.
 */

export const sendTelegram = async (event, distanza, idTelegram) => {

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  try {
    // Crea un oggetto con i dati necessari
    const bodyData = {
      event,
      distanza,
      idTelegram
    };

    const response = await fetch(`${API_URL}/api/telegram/sendAlert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Converte l'oggetto in JSON per il corpo della richiesta
      body: JSON.stringify(bodyData),
    });

    // Controlla se la risposta è OK
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log('Allerta sismica inviata con successo!');
    } else {
      console.log('Errore durante l\'invio dell\'allerta.');
    }
  } catch (error) {
    console.error('Errore durante l\'invio della richiesta:', error);
  }
};



