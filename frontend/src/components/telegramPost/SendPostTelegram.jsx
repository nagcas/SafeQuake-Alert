/*
 * Funzione che collega il forntend al backend per inviare il post a telegram bot
 *
*/

export const sendPost = async (post, t) => {

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  try {
    const response = await fetch(`${API_URL}/api/telegram/sendPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post, // post da inviare
      })
    });

    // Controlla se la risposta è OK
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    };

    const data = await response.json();

    if (data.success) {
      console.log(t('send-post-telegram.success'));
    } else {
      console.log(t('send-post-telegram.errorSend'));
    };
  } catch (error) {
    console.error(t('send-post-telegram.error'), error);
  };
};