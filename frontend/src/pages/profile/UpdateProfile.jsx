/*
 * Componente UpdateProfile
 * 
 * Il componente `UpdateProfile` consente agli utenti di aggiornare le proprie informazioni di profilo, inclusi nome, cognome, username, email, data di nascita, sesso, numero di telefono e lingua preferita.
 * 
 * Funzionalità principali:
 * - **Caricamento del Profilo**: Carica le informazioni del profilo dell'utente (se fornito tramite `user` o `userLogin`) e inizializza lo stato di editing del profilo con questi dati.
 * - **Gestione del Modulo**: Gestisce le modifiche ai campi del profilo, con validazione in tempo reale per i campi di input.
 * - **Validazione dei Dati**: Verifica che i dati inseriti siano corretti, inclusi nome, cognome, email, data di nascita (con verifica dell'età), sesso, e numero di telefono (con validazione del formato internazionale).
 * - **Aggiornamento del Profilo**: Invia una richiesta PATCH all'API per aggiornare le informazioni del profilo dell'utente e gestisce il feedback visivo tramite messaggi di successo e stato di caricamento.
 * - **Feedback e Navigazione**: Mostra un messaggio di successo e gestisce le azioni di navigazione, come la possibilità di annullare le modifiche e tornare alla home page.
 * 
 */


import { useEffect, useState } from 'react';
import { Alert, Button, Col, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/fetchWithAuth';
import formatData from '../../services/formatDate';
import { useTranslation } from 'react-i18next';

function UpdateProfile({ userLogin, setUserLogin, user, onUpdate, handleClose }) {

  const { t, i18n } = useTranslation('global'); 
  
  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [message, setMessage] = useState(false); // Stato per visualizzare messaggi di successo.
  const [errors, setErrors] = useState({}); // Stato per memorizzare errori di validazione.
  const [loading, setLoading] = useState(false);

  // Se `user` è definito, usa `user`, altrimenti usa `userLogin`
  const currentUser = user || userLogin;

  // Stato iniziale per l'editing del profilo, con valori predefiniti per evitare input non controllati.
  const [editProfile, setEditProfile] = useState({
    name: currentUser?.name || '',
    lastname: currentUser?.lastname || '',
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    birthdate: formatData(currentUser?.birthdate) || '',
    gender: currentUser?.gender || '',
    phone: currentUser?.phone || '',
    favoriteLanguage: currentUser?.favoriteLanguage || '',
    avatar: currentUser?.avatar || '',
  });

  // Aggiorna lo stato del profilo quando l'oggetto userLogin o user cambia.
  useEffect(() => {
    if (currentUser) {
      setEditProfile({
        name: currentUser.name || '',
        lastname: currentUser.lastname || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        birthdate: formatData(currentUser.birthdate) || '',
        gender: currentUser.gender || '',
        phone: currentUser.phone || '',
        favoriteLanguage: currentUser.favoriteLanguage || '',
        avatar: currentUser.avatar || '',
      });
    };
  }, [currentUser]);

  // Gestisce i cambiamenti nei campi del profilo.
  const handleChangeProfile = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      // verifichiamo che il numero contenga sempre il + iniziale
      newValue = value ? (value.startsWith('+') ? value : '+' + value.replace(/^\+/, '')) : '';
    };
    setEditProfile({
      ...editProfile,
      [name]: value,
    });
    // Reset specifico errore per il campo modificato
    setErrors({
      ...errors,
      [name]: '',
    });

    // Se cambia la lingua preferita, aggiorna subito i18n e salva nel localStorage
    if (name === 'favoriteLanguage') {
      i18n.changeLanguage(value); // Cambia la lingua istantaneamente
      localStorage.setItem('language', value); // Salva nel localStorage
    };
  };

  // Funzione per validare la data di nascita.
  const validateBirthdate = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
    const minDate = new Date('1900-01-01');

    const age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const isOldEnough =
      age > 18 ||
      (age === 18 &&
        currentDate >= new Date(birthDateObj.setFullYear(birthDateObj.getFullYear() + 18)));

    if (birthDateObj < minDate) {
      return t('update-profile.current-data'); // Errore se la data è prima del 1900.
    } else if (!isOldEnough) {
      return t('update-profile.verify-data'); // Errore se l'età è inferiore a 18 anni.
    };
    return '';
  };

  // funzione che verifica l'inserimento corretto del numero di telefono
  const validatePhoneNumber = (phone) => {
    if (!phone) return ''; // Se il campo è vuoto, è valido
    // Accetta numeri che iniziano con +, seguito da 10-15 cifre
    const phoneRegex = /^\+\d{2}\d{10,15}$/;
    return phoneRegex.test(phone) ? '' : t('update-profile.error-telefono');
  };

  // Funzione per validare i dati del profilo
  const validate = () => {
    const newErrors = {};

    if (!editProfile.name.trim()) {
      newErrors.name = t('update-profile.error-nome'); // Errore se il nome non è inserito.
    };
    if (!editProfile.lastname.trim()) {
      newErrors.lastname = t('update-profile.error-cognome'); // Errore se il cognome non è inserito.
    };
    if (!editProfile.username.trim()) {
      newErrors.username = t('update-profile.error-username'); // Errore se l'username non è inserito.
    };
    if (!editProfile.email.trim()) {
      newErrors.email = t('update-profile.error-email'); // Errore se l'email non è inserita.
    };
    if (!editProfile.birthdate.trim()) {
      newErrors.birthdate = t('update-profile.error-birthdate'); // Errore se la data di nascita non è inserita.
    } else {
      const birthdateError = validateBirthdate(editProfile.birthdate);
      if (birthdateError) newErrors.birthdate = birthdateError;
    };
    if (!editProfile.gender.trim()) {
      newErrors.gender = t('update-profile.error-gender'); // Errore se il sesso non è selezionato.
    };

    // Validazione del numero di telefono
    const phoneError = validatePhoneNumber(editProfile.phone);
    if (phoneError) newErrors.phone = phoneError; // Aggiungi l'errore se presente

    if (!editProfile.favoriteLanguage.trim()) {
      newErrors.favoriteLanguage = t('update-profile.error-lingua-favorita'); // Errore se la lingua non è selezionata.
    };

    return newErrors;
  };


  // Gestisce l'aggiornamento del profilo.
  const handleEditProfile = async (e) => {
    e.preventDefault(); // Previene l'invio del modulo predefinito.

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Imposta gli errori di validazione.
      return;
    };
    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento

    try {
      // Effettua una richiesta PATCH per aggiornare il profilo dell'utente.
      await fetchWithAuth(`${API_URL}/api/users/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProfile),
      });

      setMessage(true); // Mostra un messaggio di successo.

    } catch (error) {
      console.error('Errore invio dati', error); // Log dell'errore.
    } finally {
      if(user) {
        onUpdate();
      } else {
        //setUserLogin({ ...currentUser, ...editProfile }); // Aggiorna lo stato dell'utente nel contesto.
      };
      setMessage(false); // Nasconde il messaggio dopo 1.5 secondi.
      setLoading(false); // Imposta lo stato di caricamento
    };
  };

  const handleResetform = () => {
    setEditProfile({
      name: '',
      lastname: '',
      username: currentUser.username || '',
      email: currentUser.email || '',
      birthdate: '',
      gender: '',
      phone: '',
      favoriteLanguage: '',
      avatar: '',
    });
    setErrors({});
    setMessage(null);
  };

  return (
    <>
      <div className='content__dati'>
        <h5 className='title__dati'>
          {t('update-profile.profilo')} {currentUser.name}{' '}
          <span className='role__user'>
            {currentUser.role === 'admin' ? t('update-profile.amministratore') : t('update-profile.user')}
          </span>
        </h5>
        <Form onSubmit={handleEditProfile}>
          <Row>
            <Col md={12}>
              <span className='fw-bold mb-3'>{t('update-profile.user-id')}</span> {currentUser._id}
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId='update-name'
                label={errors.name ? <span className='text-danger'>{errors.name}</span> : t('update-profile.nome')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='name'
                  aria-label={t('update-profile.modifica-nome')}
                  value={editProfile.name || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.name}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId='update-lastname'
                label={errors.lastname ? <span className='text-danger'>{errors.lastname}</span> : t('update-profile.cognome')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='lastname'
                  aria-label={t('update-profile.modifica-cognome')}
                  value={editProfile.lastname || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.lastname}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId='update-username'
                label={errors.username ? <span className='text-danger'>{errors.username}</span> : t('update-profile.username')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='username'
                  aria-label={t('update-profile.modifica-username')}
                  value={editProfile.username || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.username}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId='update-email'
                label={errors.email ? <span className='text-danger'>{errors.email}</span> : t('update-profile.email')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='email'
                  aria-label={t('update-profile.modifica-email')}
                  value={editProfile.email || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.email}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
            <FloatingLabel
                controlId='update-birthdate'
                label={errors.birthdate ? <span className='text-danger'>{errors.birthdate}</span> : t('update-profile.data')}
                className='mb-3'
              >
                <Form.Control 
                  type='date'
                  name='birthdate'
                  aria-label={t('update-profile.modifica-data-nascita')}
                  value={editProfile.birthdate || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.birthdate}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel 
                controlId='update-gender'
                label={t('update-profile.seleziona-sesso')}
              >
                <Form.Select
                  className='mb-3'
                  aria-label={t('update-profile.modifica-sesso')}
                  name='gender'
                  value={editProfile.gender || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.gender}
                >
                  <option value=''>{t('update-profile.seleziona-sesso')}</option>
                  <option value='Maschile'>{t('update-profile.maschile')}</option>
                  <option value='Femminile'>{t('update-profile.femminile')}</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId='update-phone'
                label={errors.phone ? <span className='text-danger'>{errors.phone}</span> : t('update-profile.telefono')}
                className='mb-3'
              >
                <Form.Control 
                  type='tel'
                  name='phone'
                  aria-label={t('update-profile.modifica-telefono')}
                  value={editProfile.phone || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.phone}
                  placeholder='+XXXXXXXXXX'
                />
              </FloatingLabel>
              <Form.Text className='text-muted'>
                {t('update-profile.info-telefono')}
              </Form.Text>
            </Col>
            <Col md={6}>
              <FloatingLabel 
                controlId='update-category' 
                label={t('update-profile.seleziona-lingua')}
              >
                <Form.Select
                  className='mb-3'
                  aria-label={t('update-profile.modifica-lingua')}
                  name='favoriteLanguage'
                  value={editProfile.favoriteLanguage || ''}
                  onChange={handleChangeProfile}
                  isInvalid={!!errors.favoriteLanguage}
                >
                  <option value=''>{t('update-profile.seleziona-lingua')}</option>
                  <option value='it'>{t('update-profile.italiano')}</option>
                  <option value='en'>{t('update-profile.inglese')}</option>
                  <option value='es'>{t('update-profile.spagnolo')}</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          {message && (
            <Alert className='m-3 text-center' variant='success'>
              {t('update-profile.success')}
            </Alert>
          )}
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
              aria-label={t('update-profile.button-annulla')}
              onClick={handleResetform}
              >
              {t('update-profile.annulla')}
            </Button>
            <Button
              className='btn__save'
              type='submit'
              aria-label={t('update-profile.button-salva')}
              >
              {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('update-profile.salva')}
            </Button>
          </div>
        </Form>
      </div>
      {location.pathname === '/profile' && (
        <div>
          <p className='content__informazioni'>
            {t('update-profile.informazioni')}
          </p>
        </div>
      )}
    </>
  );
}

export default UpdateProfile;

