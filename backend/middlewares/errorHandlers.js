// Gestore per le richieste non valide (400 Bad Request)
export const badRequestHandler = (err, req, res, next) => {
  // Controlla se l'errore è di tipo 400 o di validazione
  if (err.status === 400 || err.name === 'validationError') {
    // Invia una risposta JSON con status 400
    res.status(400).json({
      error: 'Richiesta non valida!',
      message: err.message
    })
  } else {
    // Passa l'errore al prossimo middleware
    next(err);
  };
};

// Gestore per gli errori di autenticazione (401 Unauthorized)
export const authorizedHandler = (err, req, res, next) => {
  // Controlla se l'errore ha status 401
  if (err.status === 401) {
    // Invia una risposta JSON con status 401
    res.status(401).json({
      error: 'Errore di autenticazione!',
      message: 'Riautenticarsi!'
    })
  } else {
    // Passa l'errore al prossimo middleware
    next(err)
  };
};

// Gestore per le risorse non trovate (404 Not Found)
export const notFoundHandler = (req, res, next) => {
  // Invia una risposta JSON con status 404
  res.status(404).json({
    error: 'Risorsa non trovata!',
    message: 'La risorsa richiesta non è stata trovata!'
  })
};

// Gestore generico per gli errori del server (500 Internal Server Error)
export const genericErrorHandler = (err, req, res, next) => {
  // Registra lo stack dell'errore nella console
  console.error(err.stack);
  // Invia una risposta JSON con status 500
  res.status(500).json({
    error: 'Errore interno del server!',
    message: 'Errore generico!'
  })
};