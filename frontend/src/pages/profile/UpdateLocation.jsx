/*
 * Componente UpdateLocation
 * 
 * Il componente `UpdateLocation` consente agli utenti di aggiornare le informazioni di località nel loro profilo. 
 * Fornisce un modulo per l'inserimento di dettagli come regione, provincia, città, indirizzo e CAP, e calcola automaticamente 
 * le coordinate geografiche (latitudine e longitudine) basate sull'indirizzo inserito tramite l'API di Geocoding di Google Maps.
 * 
 * Funzionalità principali:
 * - **Caricamento dei Dati Utente**: Se l'utente è autenticato, carica e precompila i dati di località esistenti nel modulo.
 * - **Gestione del Modulo**: Permette all'utente di modificare i dettagli della località e gestisce la validazione dei dati inseriti.
 * - **Calcolo delle Coordinate**: Utilizza l'API di Geocoding di Google Maps per ottenere le coordinate geografiche dell'indirizzo inserito.
 * - **Aggiornamento del Profilo**: Invia una richiesta PATCH all'API per aggiornare le informazioni di località dell'utente, inclusi latitudine e longitudine.
 * - **Gestione Errori e Messaggi**: Mostra messaggi di successo o errore basati sull'esito della richiesta di aggiornamento.
 * - **Feedback e Navigazione**: Mostra un spinner durante il caricamento e fornisce feedback visivo al termine del processo. Inoltre, consente di annullare l'operazione e tornare alla home page.
 * 
 */

import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context';
import { useTranslation } from 'react-i18next'


const fetchCoordinates = async (location) => {

  const { city, province, region, cap, address } = location; 

  const apiKey = import.meta.env.VITE_API_GOOGLE_MAPS; 

  // Costruisci l'indirizzo completo usando le variabili corrette
  const fullAddress = `${encodeURIComponent(address)}+${encodeURIComponent(city)}+${encodeURIComponent(province)}+${encodeURIComponent(region)}+${encodeURIComponent(cap)}+${encodeURIComponent('Italia')}`;

  // Costruisci l'URL di Geocoding di Google Maps
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${apiKey}`;

  // console.log('URL Generato: ', url); // Log per debug

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;

      return { lat, lng };
    } else {
      console.error('Errore dati: ', data); // Log per debugging
      throw new Error(t('update-location.error-dati'));
    }
  } catch (error) {
    console.error('Errore nel recuperare i dati dall\'API di Geocoding di Google Maps!', error); // Log per debugging
    throw error;
  }
};


function UpdateLocation({ userlogin, user, onUpdate, handleClose }) {

  const { t } = useTranslation('global');
  
  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const { isLoggedIn, userLogin, setUserLogin } = useContext(Context); // Ottieni lo stato dell'autore dal contesto

  const [message, setMessage] = useState(false); // Stato per visualizzare messaggi di successo.
  const [errors, setErrors] = useState({}); // Stato per memorizzare errori di validazione.
  const [loading, setLoading] = useState(false);

  // Se `user` è definito, usa `user`, altrimenti usa `userLogin`
  const currentUser = user || userLogin;

  const [locationUser, setLocationUser] = useState({
    region: currentUser?.place?.region || '',
    province: currentUser?.place?.province || '',
    city: currentUser?.place?.city || '',
    address: currentUser?.place?.address || '',
    cap: currentUser?.place?.cap || '',
    latitude: currentUser?.place?.latitude || '',
    longitude: currentUser?.place?.longitude || ''
  });

  useEffect(() => {
    if (currentUser && currentUser.place && currentUser.place[0]) {
      setLocationUser({
        region: currentUser.place[0].region || '',
        province: currentUser.place[0].province || '',
        city: currentUser.place[0].city || '',
        address: currentUser.place[0].address || '',
        cap: currentUser.place[0].cap || '',
        latitude: currentUser.place[0].latitude || '',
        longitude: currentUser.place[0].longitude || ''
      });
    };
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationUser({
      ...locationUser,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!locationUser.region.trim()) {
      newErrors.region = t('update-location.error-region');
    };
    if (!locationUser.province.trim()) {
      newErrors.province = t('update-location.error-province');
    };
    if (!locationUser.city.trim()) {
      newErrors.city = t('update-location.error-city');
    };
    if (!locationUser.address.trim()) {
      newErrors.address = t('update-location.error-address');
    };
    if (!locationUser.cap.trim()) {
      newErrors.cap = t('update-location.error-cap');
    };
    return newErrors;
  };

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
      // Ottieni le coordinate basate sulla località inserita
      const { lat, lng } = await fetchCoordinates(locationUser);
  
      // Aggiungi le coordinate all'oggetto location
      const updatedLocation = { ...locationUser, latitude: lat, longitude: lng };
  
      // Aggiorna lo stato locale con le nuove coordinate
      setLocationUser(updatedLocation);
  
      // Effettua la richiesta PATCH con le nuove coordinate
      const response = await fetchWithAuth(`${API_URL}/api/users/${currentUser._id}/locations/${currentUser.place[0]._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLocation),
      });
  
      // console.log(response);
      setMessage(true);
    } catch (error) {
      console.error('Dati non inviati correttamente!', error);
    } finally {
      if (user) {
        onUpdate();
      };
      setMessage(false); // Nasconde il messaggio dopo 1.5 secondi
      setLoading(false); // Imposta lo stato di caricamento
    };
  };

  const handleResetForm = () => {
    setLocationUser({
      region: '',
      province: '',
      city: '',
      address: '',
      cap: '',
      latitude: '',
      longitude: ''
    });
  };
  
  return (
    <>
      <div className='content__dati'>
        <h5 className='title__dati'>{t('update-location.title')}</h5>
        <Form onSubmit={handleSaveSubmit}> {/* Modulo per l'aggiornamento del profilo */}
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId='edit-region'
                label={errors.region ? <span className='text-danger'>{errors.region}</span> : t('update-location.regione')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='region'
                  aria-label={t('update-location.modifica-regione')}
                  value={locationUser.region || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.region}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                  controlId='edit-province'
                  label={errors.province ? <span className='text-danger'>{errors.province}</span> : t('update-location.provincia')}
                  className='mb-3'
                >
                  <Form.Control 
                    type='text'
                    name='province'
                    aria-label={t('update-location.modifica-regione')}
                    value={locationUser.province || ''}
                    onChange={handleChange}
                    isInvalid={!!errors.province}
                  />
                </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                  controlId='edit-city'
                  label={errors.city ? <span className='text-danger'>{errors.city}</span> : t('update-location.città')}
                  className='mb-3'
                >
                  <Form.Control 
                    type='text'
                    name='city'
                    aria-label={t('update-location.modifica-regione')}
                    value={locationUser.city || ''}
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                  />
                </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
                controlId='edit-cap'
                label={errors.cap ? <span className='text-danger'>{errors.cap}</span> : t('update-location.cap')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='cap'
                  aria-label={t('update-location.modifica-regione')}
                  value={locationUser.cap || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.cap}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId='edit-address'
                label={errors.address ? <span className='text-danger'>{errors.address}</span> : t('update-location.indirizzo')}
                className='mb-3'
              >
                <Form.Control 
                  type='text'
                  name='address'
                  aria-label={t('update-location.modifica-regione')}
                  value={locationUser.address || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                />
              </FloatingLabel>
            </Col>
          </Row>
          {message && <Alert className='m-3 text-center' variant='success'>{t('update-location.success')}</Alert>}
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
              aria-label={t('update-location.button-annulla')}
              onClick={handleResetForm}
            >
              {t('update-location.annulla')}
            </Button>
            <Button
              className='btn__save'
              type='submit'
              aria-label={t('update-location.button-salva')}
            >
              {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('update-location.salva')}
            </Button>
          </div>
        </Form>
      </div>
      {location.pathname === '/profile' && (
        <div>
          <p className='content__informazioni'>
            {t('update-location.info-location')}
          </p>
        </div>
      )}
    </>
  );
}

export default UpdateLocation;

