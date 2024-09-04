/*
 * Componente React per la modifica di un consiglio (advice).
 * 
 * Questo componente consente di modificare i dettagli di un consiglio esistente e di inviare 
 * le modifiche tramite una richiesta PATCH a un'API REST.
 * 
 * - Utilizza React Bootstrap per l'interfaccia utente, con modale, input formattati e tooltip.
 * - Gestisce la validazione degli input utente e mostra messaggi di errore.
 * - Visualizza uno stato di caricamento (spinner) mentre la richiesta è in corso.
 * 
 * Props:
 * - advice: l'oggetto del consiglio da modificare.
 * - onUpdate: funzione di callback per aggiornare i dati nel componente genitore dopo l'aggiornamento.
 */

import { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';

function EditAdvice({ advice, onUpdate }) {
  
  const { t } = useTranslation('global');

  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('edit-advice.modifica-advice')}
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

  // Stato per gestire i dati del consiglio
  const [editAdvice, setEditAdvice] = useState({
    _id: advice._id,
    magnitudo: advice.magnitudo || '',
    consigli: advice.consigli || '',
    avvisiDiReplica: advice.avvisiDiReplica || '',
    possibileImpatto: advice.possibileImpatto || '',
    duranteIlTerremoto: advice.duranteIlTerremoto || '',
    dopoIlTerremoto: advice.dopoIlTerremoto || '',
    consigliDiSicurezza: advice.consigliDiSicurezza || ''
  });

  // Funzione per chiudere il modale e ripristinare i dati del form
  const handleClose = () => {
    setShow(false);
    setEditAdvice({
      _id: advice._id,
      magnitudo: advice.magnitudo || '',
      consigli: advice.consigli || '',
      avvisiDiReplica: advice.avvisiDiReplica || '',
      possibileImpatto: advice.possibileImpatto || '',
      duranteIlTerremoto: advice.duranteIlTerremoto || '',
      dopoIlTerremoto: advice.dopoIlTerremoto || '',
      consigliDiSicurezza: advice.consigliDiSicurezza || ''
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per chiudere il modale e resettare il form senza cambiare i dati
  const handleCloseResponseAdvice = () => {
    handleClose();
    setEditAdvice({
      _id: advice._id,
      magnitudo: advice.magnitudo || '',
      consigli: advice.consigli || '',
      avvisiDiReplica: advice.avvisiDiReplica || '',
      possibileImpatto: advice.possibileImpatto || '',
      duranteIlTerremoto: advice.duranteIlTerremoto || '',
      dopoIlTerremoto: advice.dopoIlTerremoto || '',
      consigliDiSicurezza: advice.consigliDiSicurezza || ''
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditAdvice((prevAdvice) => ({
      ...prevAdvice,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };


  // Funzione per validare i dati del consiglio
  const validate = () => {
    const newErrors = {};
    if (!editAdvice.consigli?.trim()) {
      newErrors.consigli = t('edit-advice.error-consigli');
    };
    if (!editAdvice.avvisiDiReplica?.trim()) {
      newErrors.avvisiDiReplica = t('edit-advice.error-avvisi_di_replica');
    };
    if (!editAdvice.possibileImpatto?.trim()) {
      newErrors.possibileImpatto = t('edit-advice.error-possibile_impatto');
    };
    if (!editAdvice.duranteIlTerremoto?.trim()) {
      newErrors.duranteIlTerremoto = t('edit-advice.error-durante_il_terremoto');
    };
    if (!editAdvice.dopoIlTerremoto?.trim()) {
      newErrors.dopoIlTerremoto = t('edit-advice.error-dopo_il_terremoto');
    };
    if (!editAdvice.consigliDiSicurezza?.trim()) {
      newErrors.consigliDiSicurezza = t('edit-advice.error-consigli_di_sicurezza');
    };
    
    return newErrors;
  };

  // Funzione per gestire l'invio della risposta
  const handleEditAdvice = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento
  
    try {
      await fetchWithAuth(`${API_URL}/api/advices/${advice._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editAdvice),
      });
      setMessage({ type: 'success', text: t('edit-advice.success')});
      handleClose();
    } catch (error) {
      console.error('Errore invio dati', error);
      setMessage({ type: 'danger', text: t('edit-advice.error-danger')});
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
      setEditAdvice({
        _id: editAdvice._id,
        magnitudo: editAdvice.magnitudo,
        consigli: editAdvice.consigli,
        avvisiDiReplica: editAdvice.avvisiDiReplica,
        possibileImpatto: editAdvice.possibileImpatto,
        duranteIlTerremoto: editAdvice.duranteIlTerremoto,
        dopoIlTerremoto: editAdvice.dopoIlTerremoto,
        consigliDiSicurezza: editAdvice.consigliDiSicurezza
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
          disabled={!!advice.response}
          variant='warning' 
          aria-label={t('edit-advice.button-modifica')}
          onClick={handleShow}
        >
          <i className='bi bi-pencil-square'></i>
        </Button>
        </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit-advice.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditAdvice}>
            <Form.Group className='mb-3' controlId='form-edit-advice'>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-advice.id')}</span> {editAdvice._id}
              </Form.Label>
              {/* Campo per magnitudo */}
              <FloatingLabel 
                controlId='edit-advice.magnitudo'
                label={t('edit-advice.inserisci-magnitudo')} 
                className='mb-3'
              >
                <Form.Control
                  type='number'
                  placeholder={t('edit-advice.inserisci-magnitudo')}
                  name='magnitudo'
                  aria-label={t('edit-advice.inserisci-magnitudo')}
                  value={editAdvice.magnitudo}
                  min={2}
                  max={10}
                  onChange={handleChange}
                  isInvalid={!!errors.magnitudo}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione di un consiglio */}
              <FloatingLabel
                controlId='edit-consigli'
                label={
                  errors.consigli ? (
                    <span className='text-danger'>{errors.consigli}</span>
                  ) : (
                    t('edit-advice.inserisci-consigli-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('edit-advice.inserisci-consigli-textarea')}
                  style={{ height: '100px' }}
                  name='consigli'
                  aria-label={t('edit-advice.inserisci-consigli-textarea')}
                  value={editAdvice.consigli}
                  onChange={handleChange}
                  isInvalid={!!errors.consigli}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione avvisi di replica */}
              <FloatingLabel
                controlId='edit-avvisi_di_replica'
                label={
                  errors.avvisiDiReplica ? (
                    <span className='text-danger'>{errors.avvisiDiReplica}</span>
                  ) : (
                    t('edit-advice.inserisci-avvisi_di_replica-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('edit-advice.inserisci-avvisi_di_replica-textarea')}
                  style={{ height: '100px' }}
                  name='avvisiDiReplica'
                  aria-label={t('edit-advice.inserisci-avvisi_di_replica-textarea')}
                  value={editAdvice.avvisiDiReplica}
                  onChange={handleChange}
                  isInvalid={!!errors.avvisiDiReplica}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizone possibile impatto */}
              <FloatingLabel
                controlId='edit-possibile_impatto'
                label={
                  errors.possibileImpatto ? (
                    <span className='text-danger'>{errors.possibileImpatto}</span>
                  ) : (
                    t('edit-advice.inserisci-possibile_impatto-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('edit-advice.inserisci-possibile_impatto-textarea')}
                  style={{ height: '100px' }}
                  name='possibileImpatto'
                  aria-label={t('edit-advice.inserisci-possibile_impatto-textarea')}
                  value={editAdvice.possibileImpatto}
                  onChange={handleChange}
                  isInvalid={!!errors.possibileImpatto}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione durante il terremoto */}
              <FloatingLabel
                controlId='edit-durante_il_terremoto'
                label={
                  errors.duranteIlTerremoto ? (
                    <span className='text-danger'>{errors.duranteIlTerremoto}</span>
                  ) : (
                    t('edit-advice.inserisci-durante_il_terremoto-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('edit-advice.inserisci-durante_il_terremoto-textarea')}
                  style={{ height: '100px' }}
                  name='duranteIlTerremoto'
                  aria-label={t('edit-advice.inserisci-durante_il_terremoto-textarea')}
                  value={editAdvice.duranteIlTerremoto}
                  onChange={handleChange}
                  isInvalid={!!errors.duranteIlTerremoto}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione dopo il terremoto */}
              <FloatingLabel
                controlId='edit-dopo_il_terremoto'
                label={
                  errors.dopoIlTerremoto ? (
                    <span className='text-danger'>{errors.dopoIlTerremoto}</span>
                  ) : (
                    t('edit-advice.inserisci-dopo_il_terremoto-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('edit-advice.inserisci-dopo_il_terremoto-textarea')}
                  style={{ height: '100px' }}
                  name='dopoIlTerremoto'
                  aria-label={t('edit-advice.inserisci-dopo_il_terremoto-textarea')}
                  value={editAdvice.dopoIlTerremoto}
                  onChange={handleChange}
                  isInvalid={!!errors.dopoIlTerremoto}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione consigli di sicurezza */}
              <FloatingLabel
                controlId='edit-consigli_di_sicurezza'
                label={
                  errors.consigliDiSicurezza ? (
                    <span className='text-danger'>{errors.consigliDiSicurezza}</span>
                  ) : (
                    t('edit-advice.inserisci-consigli_di_sicurezza-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('edit-advice.inserisci-consigli_di_sicurezza-textarea')}
                  style={{ height: '100px' }}
                  name='consigliDiSicurezza'
                  aria-label={t('edit-advice.inserisci-consigli_di_sicurezza-textarea')}
                  value={editAdvice.consigliDiSicurezza}
                  onChange={handleChange}
                  isInvalid={!!errors.consigliDiSicurezza}
                />
              </FloatingLabel>
              
            </Form.Group> 
            <Modal.Footer>
              <Button 
                onClick={handleCloseResponseAdvice}
                aria-label={t('edit-advice.button-annulla')}
                className='btn__cancel'
              >
                {t('edit-advice.annulla')}
              </Button>
              <Button 
                type='submit'
                aria-label={t('edit-advice.button-save')}
                className='btn__save'
              >
                {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('edit-advice.salva')}
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
};

export default EditAdvice;