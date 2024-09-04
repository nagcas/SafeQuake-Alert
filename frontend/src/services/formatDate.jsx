/*
 * Formatta una data secondo il formato specificato in base al paese.
 *
 * @param {string|Date} data - La data da formattare. Può essere una stringa di data o un oggetto Date.
 * @param {string} paese - Una stringa che indica il formato della data in base al paese ('it' per Italia o altri per formato ISO).
 * @returns {string} La data formattata come stringa. Restituisce una stringa vuota se l'input non è valido o se la formattazione fallisce.
 */


const formatData = (data, paese) => {
  // Se non viene fornita alcuna data, restituisce una stringa vuota.
  if (!data) return '';

  try {
    // Crea un oggetto Date dalla data fornita. Gestisce sia stringhe di data che oggetti Date.
    const date = new Date(data);

    // Estrae l'anno, il mese e il giorno dall'oggetto Date.
    const year = date.getFullYear();
    // `getMonth()` restituisce il mese come indice basato su zero (0 per gennaio, 11 per dicembre). Aggiungiamo 1 per ottenere il mese basato su uno.
    // `padStart(2, '0')` garantisce che il mese sia sempre composto da due cifre (e.g., '01' per gennaio).
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // `padStart(2, '0')` garantisce che il giorno sia sempre composto da due cifre (e.g., '01' per il primo giorno).
    const day = String(date.getDate()).padStart(2, '0');

    // Formatta la data in base al formato richiesto dal paese.
    if (paese === 'it') {
      // Per l'Italia, restituisce la data nel formato `gg/mm/aaaa`.
      return `${day}/${month}/${year}`;  
    };

    // Per altri paesi, restituisce la data nel formato ISO `aaaa-mm-gg`.
    return `${year}-${month}-${day}`;
  } catch (error) {
    // Registra un messaggio di errore nella console se la formattazione della data non è valida.
    console.error('Invalid date format', error);
    // Restituisce una stringa vuota in caso di errore.
    return ''; 
  };
};

// Esporta la funzione `formatData` come predefinita per essere utilizzata in altri moduli.
export default formatData;
