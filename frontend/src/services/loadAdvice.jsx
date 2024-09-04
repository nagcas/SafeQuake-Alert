/*
 * Verifica se i consigli sono già presenti nel localStorage.
 * Se non sono presenti, chiama `loadAdvices` per caricarli.
 * 
 * @returns {Promise<void>} - Non restituisce nulla.
 */


import { fetchWithAuth } from './fetchWithAuth.jsx';

// Funzione principale per verificare e caricare i consigli nel localStorage
const checkAndLoadAdvices = async () => {
  if (!localStorage.getItem('advices')) {
    // console.log('I consigli non esistono nel localStorage. Caricamento in corso...');
    await loadAdvices();
  }
};

// Funzione per caricare i consigli nel localStorage
export const loadAdvices = async () => {

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  try {
    // Effettua una richiesta GET per ottenere la lista dei consigli
    const response = await fetchWithAuth(`${API_URL}/api/advices`);
    
    // Controlla se la risposta contiene i consigli e li salva nel localStorage
    if (response.advices) {
      localStorage.setItem('advices', JSON.stringify(response.advices));
    } else {
      console.error('Nessun consiglio trovato nella risposta.');
    }
  } catch (error) {
    // Gestione dell'errore in caso la richiesta fallisca
    console.error('Errore nella richiesta', error);
  }
};

// Chiama la funzione di verifica e caricamento
checkAndLoadAdvices();
