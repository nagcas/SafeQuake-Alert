/*
 * Componente Login
 * 
 * Questo componente gestisce il processo di autenticazione dell'utente tramite login tradizionale e Google.
 * 
 * Funzionalità:
 * - Gestisce l'inserimento e la validazione dei dati di login.
 * - Gestisce la richiesta di login al server e le risposte.
 * - Permette il login tramite Google.
 * - Visualizza messaggi di errore e successo.
 * 
 * Stato:
 * - `errors`: Memorizza errori di validazione e messaggi di errore generali.
 * - `message`: Visualizza messaggi di successo o errore.
 * - `loadingClassic`: Indica se il login tradizionale è in fase di caricamento.
 * - `loadingGoogle`: Indica se il login tramite Google è in fase di caricamento.
 * - `login`: Memorizza i dati del modulo di login (email e password).
 * 
 * Effetti:
 * - Controlla la query string per il token di Google e gestisce il login se presente.
 * 
 */

// Importa il file di stile per il componente Login
import './Login.css';

// Importa i componenti e hooks necessari da React e React Router
import { useContext, useEffect, useState } from 'react';
import { Button, Container, FloatingLabel, Form, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Context } from '../../modules/Context.jsx';
import { useTranslation } from 'react-i18next';
import { loadAdvices } from '../../services/loadAdvice.jsx';


function Login() {

  const { t } = useTranslation('global');

  // Ottiene lo stato di autenticazione dal contesto
  const { isLoggedIn } = useContext(Context);

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const navigate = useNavigate();
  const location = useLocation();

  // Stati per gestire errori, messaggi, e stato di caricamento
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loadingClassic, setLoadingClassic] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Stato per i dati di login
  const [login, setLogin] = useState({
    email: '',
    password: ''
  });

  // Gestisce i cambiamenti nei campi del modulo di login
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Valida i dati del modulo
  const validate = () => {
    const newErrors = {};
    if (!login.email.trim()) {
      newErrors.email = t('login.error-email');
    };
    if (!login.password.trim()) {
      newErrors.password = t('login.error-password');
    };
    return newErrors;
  };

  // Gestisce l'invio del modulo di login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };

    setErrors({});
    setLoadingClassic(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ form: errorData.message || t('login.error-message')});
        return;
      };

      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('storage'));
      setMessage({ type: 'success', text: t('login.success')});
      // Richiama la funzione dei consigli e li carica nel localstorage
      loadAdvices();
      navigate('/profile');
    } catch (error) {
      setMessage({ type: 'danger', text: t('login.danger')});
      console.error(t('login.error-login'), error);
    } finally {
      setLoadingClassic(false);
    };
  };

  // Gestisce il login tramite Google se il token è presente nella query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('storage'));
      navigate('/profile');
    };
  }, [location, navigate]);

  // Gestisce il login tramite Google reindirizzando l'utente
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <Container>
      {!isLoggedIn ? (
        <div className='form__login d-flex justify-content-center align-items-center'>
          <div className='content__form__login'>
            <div className='form__content__title__login d-flex flex-column justify-content-center align-items-center'>
              <i className='bi bi-person-fill title__icons__login'></i>
              <p className='title__login'>{t('login.login')}</p>
            </div>
            <Form onSubmit={handleLoginSubmit}>
              <FloatingLabel
                controlId='login-email'
                label={errors.email ? <span className='text-danger'>{errors.email}</span> : t('login.text-danger-email')}
                className='mb-3'
              >
                <Form.Control 
                  type='email'
                  name='email'
                  aria-label={t('login.inserisci-email')}
                  placeholder='name@example.com'
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                />
              </FloatingLabel>
              <FloatingLabel 
                controlId='login-password' 
                label={errors.password ? <span className='text-danger'>{errors.password}</span> : t('login.text-danger-password')}
              >
                <Form.Control 
                  type='password'
                  name='password'
                  aria-label={t('login.inserisci-password')}
                  placeholder='password'
                  onChange={handleInputChange}
                  isInvalid={!!errors.password}
                />
              </FloatingLabel>

              {errors.form && (
                <Alert variant='danger' className='mt-3 text-center' aria-live='assertive'>
                  {errors.form}
                </Alert>
              )}

              <Button 
                type='submit' 
                className='btn__accedi__form__login w-100 mt-3'
                aria-label={t('login.button-accedi')}
                disabled={loadingClassic}
              >
                {loadingClassic ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('login.accedi')}
              </Button>
              <Button
                className='btn__accedi__form__login w-100 mt-3'
                aria-label={t('login.button-google')}
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
              >
                {loadingGoogle ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('login.accedi-google')}
              </Button>
            </Form>

            {message && (
              <Alert variant={message.type} className='mt-3 text-center' aria-live='assertive'>
                {message.text}
              </Alert>
            )}

            <p className='text__registrato mt-3'>{t('login.no-registrazione')} <Link className='link__register' to='/register'>{t('login.registrati')}</Link></p>
            <p className='text__password__forgot'>{t('login.password-dimenticata')} <Link className='link__forgot' to='/forgot-password'>{t('login.recupera')}</Link></p>
          </div>
        </div>
      ) : (
        <Navigate to='/dashboard' replace={true} />
      )}
    </Container>
  );
};

export default Login;

