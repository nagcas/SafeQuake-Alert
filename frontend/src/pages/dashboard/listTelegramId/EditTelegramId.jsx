/**
 * Componente React per la modifica di un ID Telegram.
 * 
 * Questo componente consente agli utenti di modificare un ID Telegram esistente tramite un form all'interno di un modal.
 * Utilizza React Bootstrap per il modal e il tooltip, e gestisce il caricamento e gli errori di validazione.
 * 
 * - Utilizza `react-i18next` per la traduzione dei testi.
 * 
 * Stati:
 * - errors: oggetto che memorizza gli errori di validazione del form.
 * - message: oggetto che memorizza il messaggio di successo o errore dopo l'operazione.
 * - show: booleano che determina se il modal è visibile o meno.
 * - loading: booleano che indica se è in corso un'operazione di salvataggio.
 * - editIdTelegram: oggetto che memorizza i dati dell'ID Telegram da modificare.
 * 
 * Funzioni:
 * - handleShow: apre il modal impostando `show` a `true`.
 * - handleClose: chiude il modal e ripristina i dati del form e gli errori.
 * - handleCloseEditIdTelegram: chiude il modal senza modificare i dati e ripristina il form.
 * - handleChange: gestisce i cambiamenti nei campi di input e ripristina gli errori di validazione.
 * - validate: valida i dati del form e restituisce un oggetto con eventuali errori.
 * - handleEditIdTelegram: gestisce l'invio dei dati modificati al server e gestisce il caricamento e i messaggi di stato.
 * 
 * Render:
 * - Un pulsante per aprire il modal con un tooltip informativo.
 * - Un modal che contiene un form per modificare l'ID Telegram.
 * - Un campo di input per l'ID Telegram con feedback per errori di validazione.
 * - Un pulsante di annullamento e un pulsante di salvataggio con uno spinner di caricamento se l'operazione è in corso.
 * - Un messaggio di stato (successo o errore) visualizzato sopra il form.
 * 
 * Utilizza:
 * - `OverlayTrigger` e `Tooltip` di React Bootstrap per mostrare un tooltip informativo sul pulsante di modifica.
 * - `Modal` di React Bootstrap per visualizzare il form di modifica.
 * - `Spinner` di React Bootstrap per mostrare un indicatore di caricamento.
 * - `Alert` di React Bootstrap per mostrare messaggi di stato.
 * - `useState` di React per gestire gli stati locali del componente.
 * - `useTranslation` di `react-i18next` per la gestione della traduzione dei testi.
 */
 

import { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';

function EditTelegramId({ telegram, onUpdate }) {
  
  const { t } = useTranslation('global');

  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('edit-id-telegram.modifica-id-telegram')}
    </Tooltip>
  );

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funzione per aprire il modale
  const handleShow = () => setShow(true);

  // Stato per gestire i dati del form
  const [editIdTelegram, setEditIdTelegram] = useState({
    _id: telegram._id,
    idTelegram: telegram.idTelegram || '',
  });

  // Funzione per chiudere il modale e ripristinare i dati del form
  const handleClose = () => {
    setShow(false);
    setEditIdTelegram({
      _id: telegram._id,
      idTelegram: telegram.idTelegram || '',
    });
    setErrors({});
    setMessage(null);
  };

    // Funzione per chiudere il modale e resettare il form senza cambiare i dati
    const handleCloseEditIdTelegram = () => {
      handleClose();
      setEditIdTelegram({
        _id: telegram._id,
        idTelegram: telegram.idTelegram || '',
      });
      setErrors({});
      setMessage(null);
    };

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditIdTelegram((prevIdTelegram) => ({
      ...prevIdTelegram,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Funzione per validare i dati del form
  const validate = () => {
    const newErrors = {};
    if (!editIdTelegram.idTelegram) {
      newErrors.idTelegram = t('edit-id-telegram.error-id-telegram');
    }
    return newErrors;
  };

  // Funzione per gestire l'invio dei dati
  const handleEditIdTelegram = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento

    try {
      await fetchWithAuth(`${API_URL}/api/userTelegram/${telegram._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editIdTelegram),
      });

      setMessage({ type: 'success', text: t('edit-id-telegram.success') });
      handleClose();
    } catch (error) {
      console.error('Errore invio dati', error);
      setMessage({ type: 'danger', text: t('edit-id-telegram.error-danger') });
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
      setEditIdTelegram({
        _id: editIdTelegram._id,
        idTelegram: editIdTelegram.idTelegram || '',
      });
      onUpdate(); // Chiamare la callback per aggiornare i dati nel componente padre
    }
  };

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <Button
          disabled={!!telegram.response}
          variant='warning'
          aria-label={t('edit-id-telegram.button-modifica')}
          onClick={handleShow}
        >
          <i className='bi bi-pencil-square'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit-id-telegram.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditIdTelegram}>
            <Form.Group className='mb-3' controlId='form-edit-id-telegram'>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-id-telegram.id')}</span> {editIdTelegram._id}
              </Form.Label>
              {/* Campo per id telegram */}
              <FloatingLabel
                controlId='edit-id-telegram-id-telegram'
                label={errors.idTelegram ? <span className='text-danger'>{errors.idTelegram}</span> : t('edit-id-telegram.error-id-telegram')}
                className='mb-3'
              >
                <Form.Control
                  type='text'
                  placeholder={t('edit-id-telegram.inserisci-id-telegram')}
                  name='idTelegram'
                  aria-label={t('edit-id-telegram.inserisci-id-telegram')}
                  value={editIdTelegram.idTelegram}
                  onChange={handleChange}
                  isInvalid={!!errors.idTelegram}
                />
              </FloatingLabel>
            </Form.Group>
            <Modal.Footer>
              <Button
                onClick={handleCloseEditIdTelegram}
                aria-label={t('edit-id-telegram.button-annulla')}
                className='btn__cancel'
              >
                {t('edit-id-telegram.annulla')}
              </Button>
              <Button
                type='submit'
                aria-label={t('edit-id-telegram.button-save')}
                className='btn__save'
              >
                {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('edit-id-telegram.salva')}
              </Button>
            </Modal.Footer>
          </Form>
          {message && (
            <Alert variant={message.type} className='m-3 text-center' aria-live='assertive'>
              {message.text}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditTelegramId;
