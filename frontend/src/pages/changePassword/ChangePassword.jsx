/*
 * Il componente ChangePassword gestisce il cambio della password dell'utente.
 * 
 * - Permette all'utente di inserire la password attuale e la nuova password.
 * - Verifica che la password attuale sia corretta e che la nuova password rispetti i requisiti di lunghezza.
 * - Gestisce la richiesta di cambio password al server tramite una chiamata API.
 * - Mostra messaggi di errore o conferma del successo dell'operazione.
 * - Redirige l'utente alla pagina del profilo dopo un cambiamento riuscito o se l'utente non è autenticato.
 * 
 * Utilizza React Hooks per gestire lo stato del modulo e la navigazione.
 */

import './ChangePassword.css'; // Importa gli stili CSS specifici per il componente

import { Alert, Button, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap'; // Importa i componenti Bootstrap
import { useContext, useState } from 'react'; // Importa i React Hooks per la gestione dello stato e del contesto
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Importa il servizio per effettuare chiamate API con autenticazione
import { Navigate, useNavigate } from 'react-router-dom'; // Importa i componenti di navigazione di React Router
import { Context } from '../../modules/Context.jsx'; // Importa il contesto dell'applicazione
import { useTranslation } from 'react-i18next';

function ChangePassword() {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const navigate = useNavigate(); // Hook per la navigazione
  const { userLogin } = useContext(Context); // Estrae lo stato di login dell'utente dal contesto

  const [currentPassword, setCurrentPassword] = useState(''); // Stato per la password attuale
  const [newPassword, setNewPassword] = useState(''); // Stato per la nuova password
  const [errors, setErrors] = useState({}); // Stato per i messaggi di errore
  const [message, setMessage] = useState(null); // Stato per il messaggio di conferma
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento

  // Gestore per le modifiche ai campi del modulo
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: ''
    }));
    setErrors({});
  };

  // Funzione per la validazione del modulo
  const validate = () => {
    const newErrors = {};
    if (!currentPassword.trim()) {
      newErrors.currentPassword = t('change-password.errors-current-password');
    };
    if (!newPassword.trim()) {
      newErrors.newPassword = t('change-password.errors-new-password');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t('change-password.errors-new-password-length');
    };
    return newErrors;
  };

  // Funzione per gestire il cambiamento della password
  const handleChangePassword = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo

    const validationErrors = validate(); // Esegue la validazione
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Mostra gli errori di validazione
      return;
    };

    setLoading(true); // Mostra lo spinner di caricamento
    setErrors({});
    setMessage(null);

    try {
      const result = await fetchWithAuth(`${API_URL}/api/auth/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setLoading(false); // Nasconde lo spinner di caricamento

      if (result.message) {
        // Se c'è un messaggio di errore nella risposta
        setErrors({ form: result.message });
      } else {
        // Successo, mostra un messaggio di conferma
        setMessage({ type: 'success', text: t('change-password.success')});
      };
    } catch (error) {
      setLoading(false); // Nasconde lo spinner di caricamento
      if (error.message.includes('La password corrente non è corretta!')) {
        setErrors({ currentPassword: error.message });
      } else if (error.message.includes('La nuova password deve essere diversa dalla password corrente!')) {
        setErrors({ newPassword: error.message });
      } else {
        setErrors({ form: error.message || t('change-password.error-message')});
      };
    } finally {
      // Pulisce i campi del modulo e naviga alla pagina del profilo
      setCurrentPassword('');
      setNewPassword('');
      navigate('/profile');
    };
  };

  return (
    <Container>
      {userLogin?.googleId === '' ? (
        // Verifica se l'utente è autenticato e non ha effettuato l'accesso tramite Google
        <div className='form__change__password d-flex justify-content-center align-items-center'>
          <div className='content__form__change'>
            <div className='form__content__title__change d-flex flex-column justify-content-center align-items-center'>
              <i className='bi bi-key title__icons__change'></i>
              <p className='title__change text-center'>{t('change-password.title')}</p>
            </div>
            <Form onSubmit={handleChangePassword}>
              <FloatingLabel
                controlId='change-passwordOld'
                label={errors.currentPassword ? <span className='text-danger'>{errors.currentPassword}</span> : t('change-password.inserisci-password-attuale')}
                className='mb-3'
              >
                <Form.Control 
                  type='password'
                  name='currentPassword'
                  aria-label={t('change-password.inserisci-password-attuale')}
                  value={currentPassword} 
                  onChange={handleInputChange(setCurrentPassword)}
                  isInvalid={!!errors.currentPassword} // Mostra errore se presente
                />
              </FloatingLabel>
              <FloatingLabel
                controlId='change-passwordNew'
                label={errors.newPassword ? <span className='text-danger'>{errors.newPassword}</span> : t('change-password.inserisci-nuova-password')}
                className='mb-3'
              >
                <Form.Control 
                  type='password'
                  name='newPassword'
                  aria-label={t('change-password.inserisci-nuova-password')}
                  value={newPassword}
                  onChange={handleInputChange(setNewPassword)}
                  isInvalid={!!errors.newPassword} // Mostra errore se presente
                />
              </FloatingLabel>
              {errors.form && (
                <Alert variant='danger' className='mt-3 text-center' aria-live='assertive'>
                  {errors.form} {/* Messaggio di errore globale */}
                </Alert>
              )}
              <Button 
                type='submit'
                className='btn__form__change w-100 mt-3'
                aria-label={t('change-password.button-password')}
                disabled={loading} // Disabilita il pulsante se in caricamento
              >
                {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('change-password.cambia')} {/* Mostra lo spinner se in caricamento */}
              </Button>
            </Form>

            {message && (
              <Alert 
                variant={message.type} 
                className='mt-3 text-center' 
                aria-live='assertive'
              >
                {message.text} {/* Messaggio di conferma del successo */}
              </Alert>
            )}
          </div>
        </div>
      ) : (
        <Navigate to='/profile' replace={true} /> // Redirige se l'utente non è autenticato
      )}
    </Container>
  );
}

export default ChangePassword;

