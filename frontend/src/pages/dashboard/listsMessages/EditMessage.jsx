/*
 * `EditMessage` è un componente React che permette di modificare e inviare una risposta a un messaggio.
 * 
 * Questo componente mostra un pulsante che, quando cliccato, apre una finestra modale con un modulo per inserire la risposta al messaggio.
 * 
 * Le principali funzionalità includono:
 * - Visualizzazione di un pulsante di modifica, che è disabilitato se il messaggio ha già una risposta.
 * - Apertura di una modale con un modulo di risposta al messaggio.
 * - Validazione del modulo per garantire che il campo di risposta non sia vuoto.
 * - Invio della risposta al server tramite una richiesta PATCH.
 * - Gestione dello stato di caricamento e visualizzazione di messaggi di successo o errore.
 * 
 * - L'oggetto che rappresenta il messaggio da modificare. Deve contenere le proprietà:
 *   - `_id`: ID del messaggio
 *   - `name`: Nome del mittente
 *   - `email`: Email del mittente
 *   - `object`: Oggetto del messaggio
 *   - `request`: Testo della domanda (richiesta)
 *   - `createdAt`: Data di invio del messaggio
 *   - `response`: Testo della risposta (o `null` se non inviata)
 * - Callback da chiamare dopo che il messaggio è stato modificato e inviato con successo.
 */

import { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';


function EditMessage({ contact, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('edit-message.modifica-message')}
    </Tooltip>
  );

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funzione per gestire la visibilità della modale e resettare 
  const handleClose = () => {
    setShow(false);
    setEditMessageContact({
      _id: contact._id,
      name: contact.name || '',
      email: contact.email || '',
      object: contact.object || '',
      request: contact.request || '',
      createdAt: contact.createdAt || '',
      response: contact.response || ''
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per chiudere il modale e resettare il form senza cambiare i dati
  const handleCloseResponseMessage = () => {
    handleClose();
    setEditMessageContact({
      _id: contact._id,
      name: contact.name || '',
      email: contact.email || '',
      object: contact.object || '',
      request: contact.request || '',
      createdAt: contact.createdAt || '',
      response: contact.response || ''
    });
    setErrors({});
    setMessage(null);
  };
  
  // Funzione per aprire il modale
  const handleShow = () => setShow(true);

  // Stato per gestire i dati del messaggio da modificare
  const [editMessageContact, setEditMessageContact] = useState({
    _id: contact._id,
    name: contact.name || '',
    email: contact.email || '',
    object: contact.object || '',
    request: contact.request || '',
    createdAt: contact.createdAt || '',
    response: contact.response || ''
  });

  // Funzione per gestire le modifiche ai campi del modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditMessageContact({
      ...editMessageContact,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
  };

  // Funzione per la validazione del modulo
  const validate = () => {
    const newErrors = {};
    if (!editMessageContact.response.trim()) {
      newErrors.response = t('edit-message.error-response');
    };
    return newErrors;
  };

  // Funzione per gestire l'invio della risposta
  const handleEditMessage = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento
  
    try {
      await fetchWithAuth(`${API_URL}/api/contacts/${contact._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editMessageContact),
      });
      setMessage({ type: 'success', text: t('edit-message.success')});
      handleClose();
    } catch (error) {
      console.error('Errore invio dati', error);
      setMessage({ type: 'danger', text: t('edit-message.error-danger')});
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
      setEditMessageContact({
        _id: editMessageContact._id,
        name: editMessageContact.name,
        email: editMessageContact.email,
        object: editMessageContact.object,
        request: editMessageContact.request,
        createdAt: editMessageContact.createdAt,
        response: editMessageContact.response
      });
      onUpdate(); // Chiamare la callback per aggiornare i dati nel componente padre
      setMessage(null);
    };
  };

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >
          <Button
            disabled={!!contact.response}
            variant='warning' 
            aria-label={t('edit-message.button-modifica')}
            onClick={handleShow}
          >
            <i className='bi bi-pencil-square'></i>
          </Button>
        </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit-message.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditMessage}>
            <Form.Group className='mb-3' controlId='form-edit-message'>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-message.id')}</span> {editMessageContact._id}
              </Form.Label>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-message.nome')}</span> {editMessageContact.name}
              </Form.Label>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-message.email')}</span> {editMessageContact.email}
              </Form.Label>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-message.domanda')}</span> {editMessageContact.request}
              </Form.Label>
              <FloatingLabel 
                controlId='edit-message-response'
                label={errors.response ? <span className='text-danger'>{errors.response}</span> : t('edit-message.error-rispondi')}
              >
                <Form.Control
                  as='textarea'
                  placeholder={t('edit-message.inserire-messaggio')}
                  style={{ height: '200px' }}
                  name='response'
                  aria-label={t('edit-message.rispondi-messaggio')}
                  value={editMessageContact.response}
                  onChange={handleChange}
                  isInvalid={!!errors.response}
                />
              </FloatingLabel>
            </Form.Group> 
            <Modal.Footer>
              <Button 
                onClick={handleCloseResponseMessage}
                aria-label={t('edit-message.button-annulla')}
                className='btn__cancel'
              >
                {t('edit-message.annulla')}
              </Button>
              <Button 
                type='submit'
                aria-label={t('edit-message.button-save')}
                className='btn__save'
              >
                {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('edit-message.invia')}
              </Button>
            </Modal.Footer>
          </Form>
          {message && (
            <Alert variant={message.type} className='m-3 text-center' aria-live='assertive'>{message.text}</Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditMessage;

