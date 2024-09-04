/*
 * Il componente Contacts gestisce un modulo di contatto per l'utente.
 * 
 * Questo modulo consente agli utenti di inviare richieste o domande, specificando il loro nome, email, oggetto della richiesta, e un messaggio dettagliato.
 * 
 * - Mostra un modulo di contatto con i campi per il nome, l'email, l'oggetto della richiesta e il messaggio.
 * - Include un checkbox per accettare i termini e le condizioni d'uso.
 * - Gestisce l'invio dei dati al server e mostra messaggi di errore o conferma del successo.
 * - Fornisce informazioni di contatto alternative come email, telefono e Telegram.
 * 
 * Utilizza React Hooks per gestire lo stato del modulo e la navigazione.
 */

import './Contacts.css'; // Importa gli stili CSS specifici per il componente
import { useState } from 'react'; // Importa gli hook di stato di React
import { Alert, Button, Col, Container, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap'; // Importa i componenti Bootstrap
import { useNavigate } from 'react-router-dom'; // Importa il hook per la navigazione di React Router
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Importa il servizio per effettuare chiamate API con autenticazione
import { useTranslation } from 'react-i18next';

function Contacts() {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const navigate = useNavigate(); // Hook per la navigazione

  const [errors, setErrors] = useState({}); // Stato per gestire gli errori di input
  const [message, setMessage] = useState(null); // Stato per gestire i messaggi di conferma
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento

  const [contact, setContact] = useState({
    name: '',
    email: '',
    object: 'Evento Sismico', // Valore predefinito per il campo oggetto
    request: '',
    response: '', // Questo campo non è utilizzato e può essere rimosso
    terms: false, // Stato del checkbox dei termini e condizioni
  });

  // Gestisce i cambiamenti nei campi di input del modulo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Gestisce i cambiamenti nel checkbox dei termini e condizioni
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setContact({
      ...contact,
      terms: checked
    });
    if (checked) {
      setErrors((prevErrors) => ({ ...prevErrors, terms: '' }));
    };
  };

  // Funzione di validazione del modulo
  const validate = () => {
    const newErrors = {};
    if (!contact.name.trim()) {
      newErrors.name = t('contact.error-name');
    };
    if (!contact.email.trim()) {
      newErrors.email = t('contact.error-email');
    };
    if (!contact.request.trim()) {
      newErrors.request = t('contact.error-request');
    };
    if (!contact.terms) {
      newErrors.terms = t('contact.error-terms');
    };
    return newErrors;
  };

  // Gestisce l'invio dei dati del modulo
  const handleSaveSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo

    const validationErrors = validate(); // Esegue la validazione del modulo
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Mostra gli errori di validazione
      return;
    };
    setErrors({});
    setLoading(true); // Mostra lo spinner di caricamento

    try {
      await fetchWithAuth(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact),
      });

      setMessage({ type: 'success', text: t('contact.success')}); // Mostra un messaggio di successo

      // Reset del modulo dopo il successo
      setTimeout(() => {
        setContact({
          name: '',
          email: '',
          object: 'Evento Sismico', // Reset del valore predefinito
          request: '',
          terms: false,
        });
        setMessage(null); // Rimuove il messaggio di successo
      }, 1500);
    } catch (error) {
      console.error('contact:', error.message);
      setErrors({ email: t('contact.error-email')}); // Mostra un errore specifico per l'email
    } finally {
      setLoading(false); // Nasconde lo spinner di caricamento
    };
  };

  return (
    <Container>
      <Row>
        <Col>
          {/* Sezione informativa per gli utenti */}
          <div className='contact__info mb-4'>
            <h4>{t('contact.info-1')}</h4>
            <p>{t('contact.info-2')}</p>
            <h4>{t('contact.info-3')}</h4>
            <p>{t('contact.info-4')} <span className='fw-bold'>support@safequakealert.com</span>.{t('contact.info-5')} </p>
            <h4>{t('contact.info-6')}</h4>
            <p>{t('contact.info-7')} <span className='fw-bold'>+39 123 456 7890</span>. {t('contact.info-8')} </p>
            <h4>{t('contact.info-9')}</h4>
            <p>{t('contact.info-10')}</p>
          </div>
        </Col>
        <Col>
          <div className='form__contacts d-flex justify-content-center align-items-center'>
            <div className='content__form__contacts'>
              <div className='form__content__title__contacts d-flex flex-column justify-content-center align-items-center'>
                <i className='bi bi-envelope-fill title__icons__contacts'></i>
                <p className='title__contacts'>{t('contact.title')}</p>
              </div>
              <Form onSubmit={handleSaveSubmit}>
                <Row>
                  <Col md={6}>
                    <FloatingLabel
                      controlId='contact-name'
                      label={errors.name ? <span className='text-danger'>{errors.name}</span> : t('contact.inserisci-nome')}
                      className='mb-3'
                    >
                      <Form.Control 
                        type='text' 
                        name='name'
                        aria-label={t('contact.inserisci-nome')}
                        placeholder={t('contact.nome')}
                        value={contact.name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel
                      controlId='contact-email'
                      label={errors.email ? <span className='text-danger'>{errors.email}</span> : t('contact.inserisci-email')}
                      className='mb-3'
                    >
                      <Form.Control 
                        type='email'
                        name='email'
                        aria-label={t('contact.inserisci-email')}
                        placeholder={t('contact.email')}
                        value={contact.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={12}>
                    <FloatingLabel 
                      controlId='contact-object'
                      label={t('contact.seleziona-richiesta')}
                    >
                      <Form.Select 
                        className='mb-3'
                        aria-label={t('contact.seleziona-richiesta')}
                        name='object'
                        value={contact.object}
                        onChange={handleInputChange}
                        isInvalid={!!errors.object}
                      >
                        <option value='Prevenzione e preparazione'>{t('contact.option-1')}</option>
                        <option value='Informazioni'>{t('contact.option-2')}</option>
                        <option value='Comportamento durante un terremoto'>{t('contact.option-3')}</option>
                        <option value='Ho sentito un terremoto'>{t('contact.option-4')}</option>
                        <option value='Altro'>{t('contact.option-5')}</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <FloatingLabel 
                  controlId='contact-request'
                  label={errors.request ? <span className='text-danger'>{errors.request}</span> : t('contact.inserisci-messaggio')}
                >
                  <Form.Control
                    className='mb-3'
                    as='textarea'
                    placeholder={t('contact.inserisci-messaggio')}
                    style={{ height: '150px' }}
                    name='request'
                    value={contact.request}
                    onChange={handleInputChange}
                    isInvalid={!!errors.request}
                  />
                </FloatingLabel>

                <Form.Check
                  className='my-3'
                  label={t('contact.termini')}
                  name='terms'
                  checked={contact.terms}
                  onChange={handleCheckboxChange}
                  isInvalid={!!errors.terms}
                  feedback={errors.terms}
                  feedbackType='invalid'
                />
                <Button 
                  type='submit' 
                  className='btn__register__form w-100' 
                  aria-label={t('contact.button-invia')}
                  disabled={loading}
                >
                  {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('contact.invia')}
                </Button>
              </Form>
              {message && (
                <Alert variant={message.type} className='m-3 text-center' aria-live='assertive'>
                  {message.text}
                </Alert>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacts;

