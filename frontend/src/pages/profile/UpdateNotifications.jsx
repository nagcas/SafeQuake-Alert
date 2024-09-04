/*
 * Componente UpdateNotifications
 * 
 * Il componente `UpdateNotifications` permette agli utenti di aggiornare le preferenze di notifica del loro profilo. 
 * Consente di configurare le notifiche push e Telegram, e di specificare un username Telegram se le notifiche Telegram sono attivate.
 * 
 * Funzionalità principali:
 * - **Caricamento delle Preferenze**: Carica e precompila le preferenze di notifica esistenti dell'utente (push e Telegram) al montaggio del componente.
 * - **Gestione del Modulo**: Permette all'utente di attivare/disattivare le notifiche push e Telegram, e di inserire un username Telegram se necessario.
 * - **Validazione dei Dati**: Verifica che l'username Telegram sia fornito solo se le notifiche Telegram sono attivate.
 * - **Aggiornamento delle Preferenze**: Invia una richiesta PATCH all'API per aggiornare le preferenze di notifica dell'utente, e aggiorna lo stato globale dell'utente nel contesto.
 * - **Feedback e Navigazione**: Mostra un messaggio di successo e gestisce lo stato di caricamento. Fornisce anche la possibilità di annullare l'operazione e tornare alla home page.
 * 
 */


import { useContext, useEffect, useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context';
import { useTranslation } from 'react-i18next';


function UpdateNotifications({ userlogin, user, onUpdate, handleClose }) {

  const { t } = useTranslation('global');

  const { isLoggedIn, userLogin, setUserLogin } = useContext(Context); // Ottieni lo stato dell'autore dal contesto.

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [message, setMessage] = useState(false); // Stato per visualizzare messaggi di successo.
  const [errors, setErrors] = useState({}); // Stato per memorizzare errori di validazione.
  const [loading, setLoading] = useState(false);

  // Se `user` è definito, usa `user`, altrimenti usa `userLogin`
  const currentUser = user || userLogin;

  // console.log('Utente:', currentUser);

  // Inizializza lo stato delle notifiche verificando l'esistenza di userLogin.notifications e userLogin.notifications[0]
  const [notification, setNotification] = useState({
    push: currentUser?.notifications?.[0]?.push || false,
    telegram: currentUser?.notifications?.[0]?.telegram || false,
    userTelegram: currentUser?.notifications?.[0]?.userTelegram || '',
    userIdTelegram: currentUser?.notifications?.[0]?.userIdTelegram || ''
  });

  // Aggiorna lo stato delle notifiche quando userLogin cambia
  useEffect(() => {
    if (currentUser && currentUser.notifications && currentUser.notifications[0]) {
      setNotification({
        push: currentUser.notifications[0].push,
        telegram: currentUser.notifications[0].telegram,
        userTelegram: currentUser.notifications[0].userTelegram,
        userIdTelegram: currentUser.notifications[0].userIdTelegram
      });
    };
  }, [currentUser]);

  // Gestisce i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotification((prevNotification) => ({
      ...prevNotification,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Validazione dei campi del form
  const validate = () => {
    const newErrors = {};
    if (notification.telegram && !notification.userTelegram.trim()) {
      newErrors.userTelegram = t('update-notificaton.error-telegram');
    };
     // Verifica se userIdTelegram non è vuoto e non è un numero
    if (notification.userIdTelegram && !/^\d+$/.test(notification.userIdTelegram)) {
      newErrors.userIdTelegram = t('update-notification.error-telegram-id');
    }
    return newErrors;
  };

  // Gestisce la sottomissione del form
  const handleSaveSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento

    try {
      const response = await fetchWithAuth(`${API_URL}/api/users/${currentUser._id}/notifications/${currentUser.notifications[0]._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      // console.log(response);
      setMessage(true);

      // Aggiorna lo stato dell'utente nel contesto
      setUserLogin(prevUserLogin => ({
        ...prevUserLogin,
        notifications: [notification], // Solo la notifica aggiornata
      }));
    } catch (error) {
      console.error('Dati non inviati correttamente!', error);
    } finally {
      if (user) {
        onUpdate();
      }
      setMessage(false); // Nasconde il messaggio dopo 1.5 secondi
      setLoading(false); // Imposta lo stato di caricamento
    };
  };

  const handleResetform = () => {
    setNotification({
      push: '',
      telegram: '',
      userTelegram: '',
      userIdTelegram: ''
    });
  };

  return (
    <>
      <div className='content__dati'>
        <h5 className='title__dati'>{t('update-notification.title')}</h5>
        <Form onSubmit={handleSaveSubmit}> {/* Modulo per l'aggiornamento delle notifiche */}
          <Form.Group className='mb-3 custom-checkbox' controlId='edit-user-push'>
            <Form.Label>
              {t('update-notification.update-msg-1')}
            </Form.Label>
            <Form.Check
              className='mx-2 my-2'
              type='checkbox'
              id='edit-user-push'
              name='push'
              checked={notification.push}
              onChange={handleChange}
              label={t('update-notification.notifiche-push')}
            />
          </Form.Group>
          <Form.Group className='mb-3 custom-checkbox' controlId='edit-user-telegram'>
            <Form.Label>
            {t('update-notification.update-msg-2')}
            </Form.Label>
            <Form.Check
              className='mx-2 my-2'
              type='checkbox'
              id='edit-user-telegram'
              name='telegram'
              checked={notification.telegram}
              onChange={handleChange}
              label={t('update-notification.notifiche-telegram')}
            />
          </Form.Group>
          {notification.telegram && (
            <>
              <FloatingLabel
                controlId='Edit-Input-userTelegram'
                label={errors.userTelegram ? <span className='text-danger'>{errors.userTelegram}</span> : t('update-notification.user-telegram')}
                className='mb-3'
              >
              <Form.Control 
                type='text'
                name='userTelegram'
                aria-label={t('update-notification.inserisci-user-telegram')}
                value={notification.userTelegram || ''}
                onChange={handleChange}
                isInvalid={!!errors.userTelegram}
              />
              </FloatingLabel>
              <FloatingLabel
                controlId='Edit-Input-userIdTelegram'
                label={errors.userIdTelegram ? <span className='text-danger'>{errors.userIdTelegram}</span> : t('update-notification.user-telegram-id')}
                className='mb-3'
              >
              <Form.Control 
                type='text'
                name='userIdTelegram'
                aria-label={t('update-notification.inserisci-user-id-telegram')}
                value={notification.userIdTelegram || ''}
                onChange={handleChange}
                isInvalid={!!errors.userIdTelegram}
              />
            </FloatingLabel>
            </>
          )}
          {message && <Alert className='m-3 text-center' variant='success'>{t('update-notification.success')}</Alert>}
          <div className='d-flex justify-content-center'>
            {location.pathname === '/dashboard' && (
              <Button
                className='me-3 btn__cancel'
                aria-label={t('edit-user.button-chiudi')}
                onClick={handleClose}
              >
                {t('edit-user.chiudi')}
              </Button>
            )}
            <Button
              className='me-3 btn__cancel'
              aria-label={t('update-notification.button-annulla')}
              onClick={handleResetform}
            >
              {t('update-notification.annulla')}
            </Button>
            <Button
              className='btn__save'
              type='submit'
              aria-label={t('update-notification.button-salva')}
            >
              {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('update-notification.salva')}
            </Button>
          </div>
        </Form>
      </div>
      {location.pathname === '/profile' && (
        <div>
          <p className='content__informazioni'>
          {t('update-notification.informazioni-1')}
          </p>
        </div>
      )}
    </>
  );
}

export default UpdateNotifications;

