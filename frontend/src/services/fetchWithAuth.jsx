/*
 * Esegue una richiesta HTTP con autenticazione.
 * 
 * Questa funzione utilizza `fetch` per effettuare una richiesta HTTP e include un token di 
 * autenticazione (se disponibile) per le richieste protette. Gestisce anche le intestazioni 
 * della richiesta e il parsing della risposta.
 * 
 * @param {string} url - L'URL al quale inviare la richiesta.
 * @param {Object} [options={}] - Opzioni aggiuntive per la richiesta `fetch`, come metodo, 
 *                                 intestazioni e corpo.
 * 
 * @returns {Promise<Object>} - La risposta JSON della richiesta, o un oggetto vuoto se 
 *                               non c'è contenuto.
 * 
 * @throws {Error} - Lancia un errore se la richiesta non è riuscita o se si è verificato 
 *                    un errore durante il parsing della risposta.
 */

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
  };

  // Aggiungi l'intestazione Authorization solo se il token è presente
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  };

  // Se il corpo della richiesta è un FormData, non impostare Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Si è verificato un errore!';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Errore durante il parsing della risposta di errore:', parseError);
      };
      throw new Error(errorMessage);
    };

    // Verifica se c'è del contenuto e se il content-type è JSON
    const contentType = response.headers.get('Content-Type');
    if (response.status !== 204 && contentType && contentType.includes('application/json')) {
      return await response.json();
    };

    return {}; // Ritorna un oggetto vuoto per risposte senza contenuto
  } catch (error) {
    console.error('Errore nella richiesta:', error.message);
    throw error;
  };
};



