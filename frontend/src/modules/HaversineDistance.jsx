/*
 * Calcola la distanza tra un evento sismico e un luogo dell'utente utilizzando la formula di Haversine.
 *
 * La formula di Haversine è utilizzata per calcolare la distanza più breve tra due punti sulla superficie 
 * di una sfera, data la loro latitudine e longitudine. Questo è utile per determinare la distanza tra 
 * un evento sismico e una posizione specifica.
 *
 * **Parametri:**
 * - `event` (Object): Un oggetto che rappresenta un evento sismico con le coordinate geografiche.
 *   Deve avere la struttura seguente: 
 *   `event.geometry.coordinates` come un array contenente [longitude, latitude].
 * - `userLogin` (Object): Un oggetto che rappresenta l'utente e deve contenere un array `place` con
 *   le informazioni sulla posizione dell'utente. 
 *   Deve avere la struttura seguente: `userLogin.place` come array con oggetti che contengono `latitude` e `longitude`.
 *
 * **Returna:**
 * - (Number | null): La distanza tra l'evento sismico e la posizione dell'utente in chilometri,
 *   arrotondata a due decimali. Se i dati di input non sono validi, ritorna `null`.
 *
 * **Eccezioni:**
 * - Se `event` o `userLogin.place` non sono definiti o vuoti, la funzione restituisce `null`.
 * - Se `latitude` o `longitude` non sono definiti correttamente, la funzione restituisce `null`.
 *
 * **Funzione Interna:**
 * - `haversineDistance(lat1, lon1, lat2, lon2)`: Calcola la distanza tra due punti specificati
 *   da latitudine e longitudine utilizzando la formula di Haversine.
 *
 * **Dipendenze:**
 * - Nessuna libreria esterna; utilizza solo funzioni matematiche di base.
 */

const HaversineDistance = (event, userLogin) => {
  // Verifica che l'oggetto evento e le sue proprietà siano definiti
  if (!event || !event.geometry || !event.geometry.coordinates || event.geometry.coordinates.length < 2) {
    console.error('Errore: event o le sue proprietà non sono definiti.');
    return null;
  };

  // Verifica che l'array place esista e non sia vuoto
  if (!userLogin.place || userLogin.place.length === 0) {
    console.log('Errore: userLogin.place non è definito o è vuoto.');
    return null;
  };
 
  // Estrai il primo oggetto dall'array place
  const place = userLogin.place[0];

  // Verifica che latitude e longitude esistano
  const lat1 = place.latitude;
  const lon1 = place.longitude;

  if (lat1 == null || lon1 == null) {
    console.log('Latitudine o longitudine non definite correttamente in userLogin!');
    return null;
  };

  const lat2 = event.geometry.coordinates[1];
  const lon2 = event.geometry.coordinates[0];

  // Funzione per calcolare la distanza utilizzando la formula di Haversine
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => value * Math.PI / 180;

    const R = 6371; // Raggio della Terra in chilometri
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distanza in chilometri
  };

  // Calcola e ritorna la distanza, arrotondata a due decimali
  const distance = haversineDistance(lat1, lon1, lat2, lon2);
  return parseFloat(distance.toFixed(2)); // Converti a numero con due decimali
};

export default HaversineDistance;


