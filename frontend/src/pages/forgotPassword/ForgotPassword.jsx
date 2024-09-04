/*
  * Componente `ForgotPassword`
  * 
  * Il componente `ForgotPassword` fornisce una form per permettere agli utenti di recuperare la loro password dimenticata. L'utente inserisce il proprio indirizzo email e, se l'email è registrata, riceve un'email con le istruzioni per il recupero della password.
  * 
  * Funzionalità principali:
  * 
  * 1. **Gestione dello Stato**:
  *    - **Stato degli Errori (`errors`)**: Memorizza eventuali errori di validazione del modulo.
  *    - **Stato del Messaggio (`message`)**: Memorizza messaggi di successo o errore generali.
  *    - **Stato di Caricamento (`loading`)**: Indica se la richiesta di recupero password è in corso.
  *    - **Stato dell'Email (`forgotEmail`)**: Memorizza l'email inserita dall'utente.
  * 
  * 2. **Gestione degli Input**:
  *    - **`handleInputChange`**: Gestisce i cambiamenti nei campi di input del modulo, aggiornando lo stato e resettando gli errori.
  * 
  * 3. **Validazione del Modulo**:
  *    - **`validate`**: Verifica che l'email non sia vuota e restituisce eventuali errori di validazione.
  * 
  * 4. **Gestione della Richiesta di Recupero Password**:
  *    - **`handleSubmitForgot`**: Gestisce la sottomissione del modulo, effettua una richiesta API per inviare l'email di recupero e gestisce la risposta dell'API.
  * 
  * 5. **Interfaccia Utente**:
  *    - **Form di Recupero**: Mostra un campo di input per l'email e un pulsante di submit. Se la richiesta è in corso, viene mostrato uno spinner di caricamento.
  *    - **Messaggi di Errore e Successo**: Mostra messaggi di errore o di successo basati sulla risposta dell'API.
  * 
  * Uso e Integrazione:
  * 
  * Il componente `ForgotPassword` è destinato a essere utilizzato in una pagina dedicata al recupero della password. Deve essere integrato in un'applicazione che supporta l'invio di email di recupero password tramite un endpoint API.
  */

import './ForgotPassword.css';

import { useState } from 'react';
import { Alert, Button, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const navigate = useNavigate();

  // Stato per memorizzare errori di validazione e messaggi di errore generali
  const [errors, setErrors] = useState({});
  // Stato per visualizzare un messaggio di successo o errore generale
  const [message, setMessage] = useState(null);
  // Stato per indicare il caricamento durante la richiesta di login
  const [loading, setLoading] = useState(false);

  // Stato per memorizzare i dati del modulo di login
  const [forgotEmail, setForgotEmail] = useState({
    email: '',
  });

  // Gestisce i cambiamenti nei campi di input del modulo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForgotEmail({
      ...forgotEmail,
      [name]: value
    });
    setErrors({});
  };

  // Funzione per validare il modulo
  const validate = () => {
    const newErrors = {};
    if (!forgotEmail.email.trim()) {
      newErrors.email = t('forgot-password.error-email'); // Errore se l'email è vuota
    };
    return newErrors;
  };

  const handleSubmitForgot = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
  
    setErrors({});
    setLoading(true);
  
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotEmail),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 404) {
          setErrors({ email: data.message || t('forgot-password.error-message')});
        } else if (response.status === 500) {
          setErrors({ email: t('forgot-password.error-status')});
        } else {
          setErrors({ email: data.message || t('forgot-password.error')});
        };
        return;
      };
  
      setMessage({ type: 'success', text: t('forgot-password.success')});
      setTimeout(() => navigate('/'), 1500); 
  
    } catch (error) {
      console.error('Errore:', error);
      setErrors({ email: t('forgot-password.error-server')});
    } finally {
      setLoading(false);
    };
  };

  return (
    <Container>
      <div className='form__forgot__email d-flex justify-content-center align-items-center'>
        <div className='content__form__forgot'>
          <div className='form__content__title__forgot d-flex flex-column justify-content-center align-items-center'>
            <i className='bi bi-person-fill title__icons__forgot'></i>
            <p className='title__forgot text-center'>{t('forgot-password.title')}</p>
          </div>
          <Form onSubmit={handleSubmitForgot}>
            <FloatingLabel
              controlId='forgot-email'
              label={errors.email ? <span className='text-danger'>{errors.email}</span> : t('forgot-password.inserisci-email')}
              className='mb-3'
            >
              <Form.Control 
                type='email'
                name='email'
                aria-label={t('forgot-password.inserisci-email')}
                placeholder='name@example.com'
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
            </FloatingLabel>
            <Button 
              type='submit' 
              className='btn__form__forgot w-100 mt-3'
              aria-label={t('forgot-password.button-recupera')}
              disabled={loading}
            >
              {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('forgot-password.recupera')}
            </Button>
          </Form>

          {message && (
            <Alert variant={message.type} className='mt-3 text-center' aria-live='assertive'>
              {message.text}
            </Alert>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;

