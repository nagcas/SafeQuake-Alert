/*
 * Componente React per la creazione di un nuovo consiglio (advice).
 * 
 * Questo componente gestisce la creazione di un nuovo consiglio sismico attraverso un form modale.
 * Consente all'utente di inserire vari campi descrittivi per il consiglio e inviare i dati tramite una 
 * richiesta POST a un'API REST.
 * 
 * - Utilizza React Bootstrap per la struttura del modale e i componenti del form (FloatingLabel, Form, Modal).
 * - Implementa la traduzione multilingua tramite il pacchetto `react-i18next`.
 * - Gestisce lo stato del caricamento (spinner) e della validazione dei campi, mostrando messaggi di errore 
 *   in tempo reale.
 * - Dopo la creazione del consiglio, il modale viene chiuso e l'aggiornamento della lista dei consigli viene
 *   comunicato al componente genitore tramite `onUpdate`.
 * 
 * Props:
 * - onUpdate: funzione di callback da eseguire dopo l'invio del nuovo consiglio, per aggiornare i dati nel 
 *   componente genitore.
 */


import { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';

function NewAdvice({ onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('new-advice.crea-un-advice')}
    </Tooltip>
  );

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [errors, setErrors] = useState({}); // Stato per gestire gli errori di validazione
  const [message, setMessage] = useState(null); // Stato per gestire i messaggi di successo o errore
  const [show, setShow] = useState(false); // Stato per gestire la visibilità del modal
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento durante l'invio

  // Stato iniziale per i dati del nuovo consiglio
  const [newAdvice, setNewAdvice] = useState({
    magnitudo: 2,
    consigli: '',
    avvisiDiReplica: '',
    possibileImpatto: '',
    duranteIlTerremoto: '',
    dopoIlTerremoto: '',
    consigliDiSicurezza: '',
  });

  // Funzione per chiudere il modal e resettare i dati del consiglio
  const handleClose = () => {
    setShow(false);
    setNewAdvice({
      magnitudo: 2,
      consigli: '',
      avvisiDiReplica: '',
      possibileImpatto: '',
      duranteIlTerremoto: '',
      dopoIlTerremoto: '',
      consigliDiSicurezza: '',
    });
    setErrors({});
    setMessage(null);
  };
  
  // Funzione per chiudere il modale e resettare i dal del form
  const handleCloseNewAdvice = () => {
    handleClose();
    setNewAdvice({
      magnitudo: 2,
      consigli: '',
      avvisiDiReplica: '',
      possibileImpatto: '',
      duranteIlTerremoto: '',
      dopoIlTerremoto: '',
      consigliDiSicurezza: '',
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per aprire il modal
  const handleShow = () => setShow(true);

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdvice((prevAdvice) => ({
      ...prevAdvice,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Funzione per validare i dati del consiglio
  const validate = () => {
    const newErrors = {};
    if (!newAdvice.consigli?.trim()) {
      newErrors.consigli = t('new-advice.error-consigli');
    };
    if (!newAdvice.avvisiDiReplica?.trim()) {
      newErrors.avvisiDiReplica = t('new-advice.error-avvisi_di_replica');
    };
    if (!newAdvice.possibileImpatto?.trim()) {
      newErrors.possibileImpatto = t('new-advice.error-possibile_impatto');
    };
    if (!newAdvice.duranteIlTerremoto?.trim()) {
      newErrors.duranteIlTerremoto = t('new-advice.error-durante_il_terremoto');
    };
    if (!newAdvice.dopoIlTerremoto?.trim()) {
      newErrors.dopoIlTerremoto = t('new-advice.error-dopo_il_terremoto');
    };
    if (!newAdvice.consigliDiSicurezza?.trim()) {
      newErrors.consigliDiSicurezza = t('new-advice.error-consigli_di_sicurezza');
    };
    
    return newErrors;
  };

  // Funzione per gestire l'invio del nuovo post
  const handleNewAdvice = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true);

    try {
      await fetchWithAuth(`${API_URL}/api/advices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdvice),
      });

      setMessage({ type: 'success', text: t('new-advice.success')});
      handleClose(); // Chiudi il modal dopo l'invio
    } catch (error) {
      console.error(t('new-advice.error-invio'), error);
      setMessage({ type: 'danger', text: t('new-advice.error-danger')});
    } finally {
      setLoading(false);
      onUpdate(); // Chiama la funzione di aggiornamento nel componente padre
      // Resetta i dati del consiglio
      setNewAdvice({
        magnitudo: 2,
        consigli: '',
        avvisiDiReplica: '',
        possibileImpatto: '',
        duranteIlTerremoto: '',
        dopoIlTerremoto: '',
        consigliDiSicurezza: '',
      });
    };
  };

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >
        {/* Pulsante per aprire il modal */}
        <Button
          className='me-3'
          variant='success' 
          aria-label={t('new-advice.aggiungi-advice')} 
          onClick={handleShow}
        >
          <i className='bi bi-plus-square'></i> {t('new-advice.crea-advice')}
        </Button>
      </OverlayTrigger>
      {/* Modal per creare un nuovo consiglio */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('new-advice.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewAdvice}>
            <Form.Group className='mb-3' controlId='form-new-advice'>
              {/* Campo per magnitudo */}
              <FloatingLabel 
                controlId='new-magnitudo'
                label={t('new-advice.inserisci-magnitudo')} 
                className='mb-3'
              >
                <Form.Control
                  type='number'
                  placeholder={t('new-advice.inserisci-magnitudo')}
                  name='magnitudo'
                  aria-label={t('new-advice.inserisci-magnitudo')}
                  value={newAdvice.magnitudo}
                  min={2}
                  max={10}
                  onChange={handleChange}
                  isInvalid={!!errors.magnitudo}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione di un consiglio */}
              <FloatingLabel
                controlId='new-consigli'
                label={
                  errors.consigli ? (
                    <span className='text-danger'>{errors.consigli}</span>
                  ) : (
                    t('new-advice.inserisci-consigli-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-advice.inserisci-consigli-textarea')}
                  style={{ height: '100px' }}
                  name='consigli'
                  aria-label={t('new-advice.inserisci-consigli-textarea')}
                  value={newAdvice.consigli}
                  onChange={handleChange}
                  isInvalid={!!errors.consigli}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione avvisi di replica */}
              <FloatingLabel
                controlId='new-avvisi_di_replica'
                label={
                  errors.avvisiDiReplica ? (
                    <span className='text-danger'>{errors.avvisiDiReplica}</span>
                  ) : (
                    t('new-advice.inserisci-avvisi_di_replica-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-advice.inserisci-avvisi_di_replica-textarea')}
                  style={{ height: '100px' }}
                  name='avvisiDiReplica'
                  aria-label={t('new-advice.inserisci-avvisi_di_replica-textarea')}
                  value={newAdvice.avvisiDiReplica}
                  onChange={handleChange}
                  isInvalid={!!errors.avvisiDiReplica}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizone possibile impatto */}
              <FloatingLabel
                controlId='new-possibile_impatto'
                label={
                  errors.possibileImpatto ? (
                    <span className='text-danger'>{errors.possibileImpatto}</span>
                  ) : (
                    t('new-advice.inserisci-possibile_impatto-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-advice.inserisci-possibile_impatto-textarea')}
                  style={{ height: '100px' }}
                  name='possibileImpatto'
                  aria-label={t('new-advice.inserisci-possibile_impatto-textarea')}
                  value={newAdvice.possibileImpatto}
                  onChange={handleChange}
                  isInvalid={!!errors.possibileImpatto}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione durante il terremoto */}
              <FloatingLabel
                controlId='new-durante_il_terremoto'
                label={
                  errors.duranteIlTerremoto ? (
                    <span className='text-danger'>{errors.duranteIlTerremoto}</span>
                  ) : (
                    t('new-advice.inserisci-durante_il_terremoto-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-advice.inserisci-durante_il_terremoto-textarea')}
                  style={{ height: '100px' }}
                  name='duranteIlTerremoto'
                  aria-label={t('new-advice.inserisci-durante_il_terremoto-textarea')}
                  value={newAdvice.duranteIlTerremoto}
                  onChange={handleChange}
                  isInvalid={!!errors.duranteIlTerremoto}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione dopo il terremoto */}
              <FloatingLabel
                controlId='new-dopo_il_terremoto'
                label={
                  errors.dopoIlTerremoto ? (
                    <span className='text-danger'>{errors.dopoIlTerremoto}</span>
                  ) : (
                    t('new-advice.inserisci-dopo_il_terremoto-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-advice.inserisci-dopo_il_terremoto-textarea')}
                  style={{ height: '100px' }}
                  name='dopoIlTerremoto'
                  aria-label={t('new-advice.inserisci-dopo_il_terremoto-textarea')}
                  value={newAdvice.dopoIlTerremoto}
                  onChange={handleChange}
                  isInvalid={!!errors.dopoIlTerremoto}
                />
              </FloatingLabel>
              {/* Campo per inserire descrizione consigli di sicurezza */}
              <FloatingLabel
                controlId='new-consigli_di_sicurezza'
                label={
                  errors.consigliDiSicurezza ? (
                    <span className='text-danger'>{errors.consigliDiSicurezza}</span>
                  ) : (
                    t('new-advice.inserisci-consigli_di_sicurezza-textarea')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-advice.inserisci-consigli_di_sicurezza-textarea')}
                  style={{ height: '100px' }}
                  name='consigliDiSicurezza'
                  aria-label={t('new-advice.inserisci-consigli_di_sicurezza-textarea')}
                  value={newAdvice.consigliDiSicurezza}
                  onChange={handleChange}
                  isInvalid={!!errors.consigliDiSicurezza}
                />
              </FloatingLabel>
            
            </Form.Group>
            <Modal.Footer>
              <Button 
                onClick={handleCloseNewAdvice} 
                className='btn__cancel'
                aria-label={t('new-advice.button-annulla')}
              >
                {t('new-advice.annulla')}
              </Button>
              <Button 
                type='submit' 
                className='btn__save'
                aria-label={t('new-advice.button-salva')}
                disabled={loading}
              >
                {loading ? (
                  <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
                ) : (
                  t('new-advice.salva')
                )}
              </Button>
            </Modal.Footer>
          </Form>
          {/* Mostra il messaggio di successo o errore */}
          {message && (
            <Alert variant={message.type} className='m-3 text-center' aria-live='assertive'>
              {message.text}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewAdvice;