/*
 * Componente Register
 * 
 * Questo componente gestisce il processo di registrazione dell'utente.
 * Permette di inserire le informazioni richieste e inviare una richiesta di registrazione al server.
 * Se l'utente è già autenticato, viene reindirizzato alla dashboard.
 * 
 * Funzionalità:
 * - Gestisce l'inserimento e la validazione dei dati di registrazione.
 * - Invia i dati al server per la registrazione.
 * - Visualizza messaggi di errore e successo.
 * 
 * Stato:
 * - `errors`: Memorizza errori di validazione e messaggi di errore generali.
 * - `message`: Visualizza messaggi di successo o errore.
 * - `loading`: Indica se il modulo è in fase di caricamento.
 * - `register`: Memorizza i dati del modulo di registrazione.
 * 
 */

import './Register.css';
import { useContext, useState } from 'react';
import { Alert, Button, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx';
import { Context } from '../../modules/Context.jsx';
import { useTranslation } from 'react-i18next';


function Register() {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(Context);

  // Stati per gestire errori, messaggi, e stato di caricamento
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Stato per i dati del modulo di registrazione
  const [register, setRegister] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    terms: false,
    place: {
      region: '',
      province: '',
      city: '',
      address: '',
      cap: ''
    },
    notifications: {
      push: false,
      telegram: false,
      userTelegram: ''
    },
    googleId: '',
  });

  // Gestisce i cambiamenti nei campi di input del modulo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegister({
      ...register,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
  };

  // Gestisce i cambiamenti nel checkbox dei termini
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setRegister({
      ...register,
      terms: checked
    });
    if (checked) {
      setErrors((prevErrors) => ({ ...prevErrors, terms: '' })); 
    };
  };

  // Funzione per validare i dati del modulo
  const validate = () => {
    const newErrors = {};
    if (!register.name.trim()) {
      newErrors.name = t('register.error-name'); 
    };
    if (!register.lastname.trim()) {
      newErrors.lastname = t('register.error-lastname'); 
    };
    if (!register.username.trim()) {
      newErrors.username = t('register.error-username'); 
    };
    if (!register.email.trim()) {
      newErrors.email = t('register.error-email'); 
    };
    if (!register.password.trim()) {
      newErrors.password = t('register.error-password'); 
    } else if (register.password.length < 8) {
      newErrors.password = t('register.error-password-length');
    };
    if (!register.terms) {
      newErrors.terms = t('register.terms'); 
    };
    return newErrors;
  };

  // Gestisce l'invio del modulo di registrazione
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true);
  
    try {
      await fetchWithAuth(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(register),
      });
  
      setMessage({ type: 'success', text: t('register.success')});
  
      setTimeout(() => {
        // Resetta il modulo e reindirizza alla pagina di login
        setRegister({
          name: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
          terms: false,
          place: {
            region: '',
            province: '',
            city: '',
            address: '',
            cap: ''
          },
          notifications: {
            push: false,
            telegram: false,
            userTelegram: ''
          },
          googleId: '',
        });
        setMessage(null);
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error(t('register.error-message'), error.message);
      
      // Gestisci l'errore specifico per l'email
      if (error.message === 'Email già registrata!') {
        setErrors({ email: t('register.message-email')});
      } else {
        setErrors({ general: t('register.error-general')});
      };
    } finally {
      setLoading(false); // Rimuove lo stato di caricamento
    };
  };
  
  return (
    <Container>
      {!isLoggedIn ? (
        <div className='form__register d-flex justify-content-center align-items-center'>
          <div className='content__form__register'>
            <div className='form__content__title__register d-flex flex-column justify-content-center align-items-center'>
              <i className='bi bi-person-plus-fill title__icons__register'></i>
              <p className='title__register'>{t('register.registrati')}</p>
            </div>
              <Form onSubmit={handleSaveSubmit}>
                <FloatingLabel
                  controlId='register-name'
                  label={errors.name ? <span className='text-danger'>{errors.name}</span> : t('register.inserisci-nome')}
                  className='mb-3'
                >
                  <Form.Control 
                    type='text' 
                    name='name'
                    aria-label={t('register.inserisci-nome')}
                    placeholder={t('register.nome')}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId='register-lastname'
                  label={errors.lastname ? <span className='text-danger'>{errors.lastname}</span> : t('register.inserisci-cognome')}
                  className='mb-3'
                >
                  <Form.Control 
                    type='text' 
                    name='lastname'
                    aria-label={t('register.inserisci-cognome')}
                    placeholder={t('register.cognome')} 
                    onChange={handleInputChange}
                    isInvalid={!!errors.lastname}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId='register-username'
                  label={errors.username ? <span className='text-danger'>{errors.username}</span> : t('register.inserisci-username')}
                  className='mb-3'
                >
                  <Form.Control 
                    type='text'
                    name='username'
                    aria-label={t('register.inserisci-username')}
                    placeholder={t('register.username')}
                    onChange={handleInputChange}
                    isInvalid={!!errors.username}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId='register-email'
                  label={errors.email ? <span className='text-danger'>{errors.email}</span> : t('register.inserisci-email')}
                  className='mb-3'
                >
                  <Form.Control 
                    type='email'
                    name='email'
                    aria-label={t('register.inserisci-email')}
                    placeholder={t('register.email')}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId='register-password' 
                  label={errors.password ? <span className='text-danger'>{errors.password}</span> : t('register.inserisci-password')}
                >
                  <Form.Control 
                    type='password'
                    name='password'
                    aria-label={t('register.inserisci-password')}
                    placeholder={t('register.password')}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                  />
                </FloatingLabel>
                <Form.Check
                  className='my-3'
                  label={t('register.termini')}
                  name='terms'
                  checked={register.terms}
                  onChange={handleCheckboxChange}
                  isInvalid={!!errors.terms}
                  feedback={errors.terms}
                  feedbackType='invalid'
                />
                <Button 
                  type='submit' 
                  className='btn__register__form w-100' 
                  aria-label={t('register.button-register')}
                  disabled={loading}
                >
                  {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('register.registrati')}
                </Button>
              </Form>
              {message && (
                <Alert variant={message.type} className='m-3 text-center' aria-live='assertive'>{message.text}</Alert>
              )}
              <p className='text__login'>{t('register.registrato')}{' '}<Link className='link__login' to='/login'>{t('register.login')}</Link></p>
          </div>
        </div>
      ) : (
        <Navigate to='/dashboard' replace={true} />
      )}
    </Container>
  );
};

export default Register;
