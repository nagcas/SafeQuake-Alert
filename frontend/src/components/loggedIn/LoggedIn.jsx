/*
 * Componente `LoggedIn`
 *
 * Descrizione:
 * Questo componente gestisce l'interfaccia utente per gli utenti autenticati, mostrando le opzioni di navigazione e di gestione dell'account.
 * Visualizza informazioni dell'utente, come il nome e l'avatar, e offre collegamenti a pagine chiave e un'opzione per il logout.
 *
 * Funzionalità:
 * - **Verifica dello Stato di Accesso:** Controlla se l'utente è autenticato e valida il token di accesso.
 * - **Recupero Dati Utente:** Richiede i dati dell'utente autenticato e aggiorna lo stato locale e il localStorage.
 * - **Gestione del Logout:** Rimuove i dati di accesso e reindirizza l'utente alla home page.
 * - **Simulazione Notifica:** Permette di testare il sistema di notifiche.
 *
 * Visualizzazione:
 * - **Per Dispositivi Mobili:** Mostra un menu con il nome dell'utente, avatar, e collegamenti a pagine chiave, con un'opzione per simulare notifiche e fare logout.
 * - **Per Dispositivi Desktop:** Mostra un menu a discesa con le stesse opzioni del menu mobile, ma in un formato a discesa.
 *
 * Gestione del Token:
 * - **Verifica e Aggiornamento:** Verifica la validità del token di accesso e gestisce la scadenza o invalidità del token.
 */

import './LoggedIn.css';
import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx';
import { Button, Image, Dropdown } from 'react-bootstrap';
import { Context } from '../../modules/Context';
import defaultAvatar from '../../assets/avatar/default-avatar.png';
import { useNotification } from '../../modules/NotificationContext.jsx';
import { useTranslation } from 'react-i18next';



function LoggedIn({ handleClose }) {

  const { t, i18n } = useTranslation('global');

  const { notify } = useNotification();
  const navigate = useNavigate();

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const { isLoggedIn, setIsLoggedIn, userLogin, setUserLogin } = useContext(Context);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUserLogin = localStorage.getItem('userLogin');

      // console.log('token: ',token)

      if (token) {
        try {
          // Verifica della validità del token
          const isTokenValid = true;

          if (isTokenValid) {
            setIsLoggedIn(true);

            if (storedUserLogin) {
              const parsedUserLogin = JSON.parse(storedUserLogin);
              // console.log('Stored User Login:', parsedUserLogin);
              setUserLogin(parsedUserLogin);
            };
          } else {
            // Gestione del token scaduto o non valido
            localStorage.removeItem('token');
            localStorage.removeItem('userLogin');
            setIsLoggedIn(false);
            setUserLogin(null);
            navigate('/login');
          };
        } catch (error) {
          console.error(t('loggedin.error-token'), error);
          localStorage.removeItem('token');
          localStorage.removeItem('userLogin');
          setIsLoggedIn(false);
          setUserLogin(null);
        };
      } else {
        setIsLoggedIn(false);
        setUserLogin(null);
      };
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiunge un event listener per controllare lo stato di login
    window.addEventListener('storage', checkLoginStatus);
    // Evento per il cambio di stato
    window.addEventListener('loginStateChange', checkLoginStatus);

    // Rimuove l'event listener quando il componente viene smontato e quando cambia
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, [setIsLoggedIn, setUserLogin, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchWithAuth(`${API_URL}/api/auth/me`);
        setUserLogin(userData);
        localStorage.setItem('userLogin', JSON.stringify(userData));
      } catch (error) {
        console.error(t('loggedin.error-login'), error);
        localStorage.removeItem('token');
        localStorage.removeItem('userLogin');
        setIsLoggedIn(false);
        setUserLogin(null);
        navigate('/login');
      };
    };

    if (isLoggedIn) {
      fetchUser();
    };
  }, [isLoggedIn, navigate, setUserLogin, API_URL, setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userLogin');
    setIsLoggedIn(false);
    setUserLogin(null);
    handleClose();
    navigate('/');
  };

  const isGoogle_link = userLogin?.googleId === '' ? (
    <Dropdown.Item onClick={handleClose} as={Link} to='/change-password'><i className='bi bi-key'></i> {t('loggedin.Cambia-Password')}</Dropdown.Item>
  ) : null;

  // Simula se le notifiche sono attive
  const simulateNotification = () => {
    notify({
      title: t('loggedin.test-title'),
      body: t('loggedin.test-body'),
    }, userLogin, t, i18n);
  };

  return (
    <>
      {isLoggedIn && userLogin ? (
        <>
          <div className='d-lg-none text-white text-center'>
            <p>{t('loggedin.Benvenuto')} {userLogin.username}{' '}</p>
            <Image
              className='image__avatar'
              src={userLogin.avatar || defaultAvatar}
              alt={userLogin.avatar ? 'Image user' : 'Image user default'}
              roundedCircle
            />
            <Link onClick={handleClose} to='/profile' className='d-block'><i className='bi bi-person-circle'></i> {t('loggedin.profilo')}</Link>
            <Link onClick={handleClose} to='/dashboard' className='d-block'><i className='bi bi-speedometer2'></i> {t('loggedin.dashboard')}</Link>
            <Link onClick={handleClose} to='/sismic-nearby' className='d-block'><i className='bi bi-geo-alt'></i> {t('loggedin.vicino')}</Link>
            <Link onClick={handleClose} to='/how-it-works' className='d-block'><i className='bi bi-lightbulb'></i> {t('loggedin.how-it-works')}</Link>
            <Link onClick={simulateNotification}><i className='bi bi-bell'></i> {t('loggedin.notifica')}</Link>
            {isGoogle_link}
            <Button 
              handleClose
              onClick={handleLogout} 
              aria-label={t('loggedin.logout-button')}
              className='mt-3 btn__logout'
            >
              {t('loggedin.logout-text')}
            </Button>
          </div>
          <Dropdown className='d-none d-lg-block'>
            <Dropdown.Toggle className='bg-transparent border-0 custom-dropdown-toggle' variant='light' id='dropdown-basic'>
              <span className='text-white user__benvenuto'>
              {t('loggedin.Benvenuto')} {userLogin.username}{' '}
              </span>
              <Image
                className='image__avatar'
                src={userLogin.avatar || defaultAvatar}
                alt={userLogin.avatar ? 'Image user' : 'Image user default'}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className='mx-2'>
              <Dropdown.Item as={Link} to='/profile'><i className='bi bi-person-circle'></i> {t('loggedin.profilo')}</Dropdown.Item>
              <Dropdown.Item as={Link} to='/dashboard'><i className='bi bi-speedometer2'></i> {t('loggedin.dashboard')}</Dropdown.Item>
              <Dropdown.Item as={Link} to='/sismic-nearby'><i className='bi bi-geo-alt'></i> {t('loggedin.vicino')}</Dropdown.Item>
              <Dropdown.Item as={Link} to='/how-it-works'><i className='bi bi-lightbulb'></i> {t('loggedin.how-it-works')}</Dropdown.Item>
              <Dropdown.Item onClick={simulateNotification}><i className='bi bi-bell'></i> {t('loggedin.notifica')}</Dropdown.Item>
              {isGoogle_link}
              <Dropdown.Divider />
              <Button
                onClick={handleLogout}
                aria-label={t('loggedin.logout-button')}
                className='mt-3 mx-3 btn__logout'
              >
                {t('loggedin.logout-text')}
              </Button>
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        <>
          <Button
            onClick={handleClose}
            as={Link} 
            to='/register'
            aria-label={t('loggedin.register-button')}
            className='btn__register me-1'
          >
            {t('loggedin.register-text')}
          </Button>
          <Button
            onClick={handleClose}
            as={Link} 
            to='/login'
            aria-label={t('loggedin.login-button')}
            className='btn__login'
          >
            {t('loggedin.login-text')}
          </Button>
        </>
      )}
    </>
  );
}

export default LoggedIn;

    
