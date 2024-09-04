import jwt from 'jsonwebtoken';

// Funzione per generare un JSON Web Token (JWT)
export const generateJWT = (payload) => {
  
  // Restituisce una nuova Promise, che risolverà o rifiuterà in base al risultato della firma del token
  return new Promise((resolve, reject) => 

    // Firma il token JWT con il payload fornito, una chiave segreta e un'opzione di scadenza
    jwt.sign(
      // Dati da includere nel token
      payload, 
      // Chiave segreta per firmare il token, presa dalle variabili d'ambiente per sicurezza
      process.env.JWT_SECRET, 
      // Opzione che specifica che il token scadrà dopo 1 giorno
      { expiresIn: '1 day' }, 
      // Callback che viene eseguito quando la firma del token è completata
      (err, token) => {
        
        // Se c'è un errore durante la firma del token, la Promise viene rifiutata con l'errore
        if (err) reject(err);
        // Altrimenti, la Promise viene risolta con il token generato
        else resolve(token);
      }
    )
  );
};


// Esporta la funzione verifyJWT che verifica un token JWT
export const verifyJWT = (token) => {
  
  // Restituisce una nuova Promise per gestire l'operazione in modo asincrono
  return new Promise((resolve, reject) =>
    
    // Utilizza il metodo verify di jwt per decodificare e verificare il token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      
      // Se c'è un errore durante la verifica, rifiuta la Promise con l'errore
      if (err) reject(err);
      
      // Altrimenti, risolve la Promise con il payload decodificato
      else resolve(decoded); 
    })
  );
};