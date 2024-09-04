/*
  * Componente `ResetPassword`
  * 
  * Il componente `ResetPassword` permette agli utenti di reimpostare la loro password utilizzando un link di reset inviato via email. Gli utenti devono inserire una nuova password che soddisfi i requisiti minimi di sicurezza.
  * 
  * Funzionalità principali:
  * 
  * 1. **Gestione dello Stato**:
  *    - **Stato degli Errori (`errors`)**: Memorizza gli errori di validazione del modulo, come una password mancante o troppo corta.
  *    - **Stato del Messaggio (`message`)**: Memorizza messaggi di successo o errore generale da visualizzare all'utente.
  *    - **Stato di Caricamento (`loading`)**: Indica se la richiesta di reset della password è in corso.
  *    - **Stato della Password (`resetPassword`)**: Memorizza la nuova password inserita dall'utente.
  * 
  * 2. **Gestione degli Input**:
  *    - **`handleInputChange`**: Aggiorna lo stato della password e resetta gli errori e i messaggi.
  * 
  * 3. **Validazione del Modulo**:
  *    - **`validate`**: Verifica che la nuova password non sia vuota e sia lunga almeno 8 caratteri.
  * 
  * 4. **Gestione della Richiesta di Reset Password**:
  *    - **`handleSubmitReset`**: Gestisce la sottomissione del modulo, effettua una richiesta API per resettare la password e gestisce la risposta dell'API.
  * 
  * 5. **Interfaccia Utente**:
  *    - **Form di Reset**: Mostra un campo di input per la nuova password e un pulsante di submit. Se la richiesta è in corso, viene mostrato uno spinner di caricamento.
  *    - **Messaggi di Errore e Successo**: Mostra messaggi di errore o successo basati sulla risposta dell'API.
  * 
  * Uso e Integrazione:
  * 
  * Il componente `ResetPassword` è destinato ad essere utilizzato come parte del processo di recupero della password. Deve essere integrato in un'applicazione che supporta il reset della password tramite un endpoint API.
  */

import './ForgotPassword.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Button, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'

function ResetPassword() {

  const { t } = useTranslation('global');

  const navigate = useNavigate();
  const { id, token } = useParams();

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || `http://localhost:5001`;

  // Stato per memorizzare errori di validazione e messaggi di errore generali
  const [errors, setErrors] = useState({});
  // Stato per visualizzare un messaggio di successo o errore generale
  const [message, setMessage] = useState(null);
  // Stato per indicare il caricamento durante la richiesta di reset
  const [loading, setLoading] = useState(false);

  // Stato per memorizzare i dati del modulo di reset password
  const [resetPassword, setResetPassword] = useState({
    password: '',
  });

  // Gestisce i cambiamenti nei campi di input del modulo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResetPassword({
      ...resetPassword,
      [name]: value
    });
    setErrors({});
    setMessage(null);
  };
  
  // Funzione per validare il modulo
  const validate = () => {
    const newErrors = {};
    if (!resetPassword.password.trim()) {
      newErrors.password = t('reset-password.error-password');
    } else if (resetPassword.password.length < 8) {
      newErrors.password = t('reset-password.error-password-length');
    };
    return newErrors;
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();

    const validationErrors = validate(); // Valida i dati
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Imposta gli errori di validazione
      return;
    };
    
    setLoading(true);
  
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password/${id}/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetPassword),
      });
  
      if (response.ok) {
        setMessage({ type: 'success', text: t('reset-password.success')});
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'danger', text: errorData.Status || t('reset-password.error-response')});
      };
  
    } catch (error) {
      setMessage({ type: 'danger', text: t('reset-password.error-danger')});
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    };
  };

  return (
    <Container>
      <div className='form__reset__password d-flex justify-content-center align-items-center'>
        <div className='content__form__reset'>
          <div className='form__content__title__reset d-flex flex-column justify-content-center align-items-center'>
            <i className='bi bi-person-fill title__icons__reset'></i>
            <p className='title__reset text-center'>{t('reset-password.title')}</p>
          </div>
          <Form onSubmit={handleSubmitReset}>
            <FloatingLabel
              controlId='reset-password'
              label={errors.password ? <span className='text-danger'>{errors.password}</span> : t('reset-password.inserisci-nuova-password')}
              className='mb-3'
            >
              <Form.Control 
                type='password'
                name='password'
                aria-label={t('reset-password.inserisci-nuova-password')}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
            </FloatingLabel>
            <Button 
              type='submit' 
              className='btn__form__reset w-100 mt-3'
              aria-label={t('reset-password.button-recupera')}
              disabled={loading}
            >
              {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('reset-password.recupera')}
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
}

export default ResetPassword;
