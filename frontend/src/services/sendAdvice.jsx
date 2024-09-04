/*
 * Invia un consiglio tramite l'API di Telegram.
 * 
 * Effettua una richiesta POST all'endpoint `/telegram/sendAdvice` dell'API per inviare un messaggio a Telegram.
 * 
 * @param {string} idTelegram - L'ID del destinatario su Telegram.
 * @param {string} message - Il messaggio da inviare.
 * @param {string} msg - Un messaggio aggiuntivo (opzionale).
 * @returns {Promise<void>} - Non restituisce nulla.
 */

export const sendAdvice = async (idTelegram, message, msg) => {

  // console.log('id', idTelegram);
  // console.log('message', message);
  // console.log('msg', msg);
  
  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  try {
    const response = await fetch(`${API_URL}/api/telegram/sendAdvice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idTelegram,
        message,
        msg
      }),
    });
    // Controlla se la risposta è OK
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    };
    
    const data = await response.json();
    console.log('Messaggio inviato a telegram');
    
    if (data.success) {
      console.log('Allerta sismica inviata con successo!');
    } else {
      console.log('Errore durante l\'invio dell\'allerta.');
    };
  } catch (error) {
    console.error('Errore durante l\'invio della richiesta:', error);
  };
};