/*
 * Componente React per gestire l'eliminazione di un consiglio (advice).
 * 
 * Questo componente permette all'utente di eliminare un consiglio tramite una richiesta DELETE 
 * a un'API REST. Viene utilizzata una modale di conferma prima di procedere con l'eliminazione.
 * 
 * - Utilizza il servizio fetchWithAuth per gestire la richiesta DELETE autenticata.
 * - Visualizza un pulsante con un'icona di eliminazione e un tooltip informativo.
 * - Mostra una modale per confermare l'eliminazione, con uno stato di caricamento durante l'operazione.
 * 
 * Props:
 * - advice: l'oggetto del consiglio da eliminare.
 * - onUpdate: funzione di callback per aggiornare i dati nel componente genitore dopo l'eliminazione.
 */


import { useState } from 'react';
import { fetchWithAuth } from '../../../services/fetchWithAuth';
import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


function DeleteAdvice({ advice, onUpdate }) {
  
  const { t } = useTranslation('global');

  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('delete-advice.elimina-advice')}
    </Tooltip>
  );

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funzioni per gestire la visibilità della modale
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Funzione per gestire l'eliminazione del messaggio
  const handleDeleteAdvice = async () => {
    setLoading(true); // Imposta lo stato di caricamento
    
    try {
      await fetchWithAuth(`${API_URL}/api/advices/${advice._id}`, {
        method: 'DELETE',
      });
      // Chiamare la callback per aggiornare i dati nel componente padre
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
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
          variant='danger' 
          aria-label={t('delete-advice.button-elimina')}
          onClick={handleShow}
        >
          <i className='bi bi-trash'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-advice.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-center fs-6'>
          {t('delete-advice.conferma')}con id: <span className='fw-bold'>{advice._id}</span>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('delete-advice.button-annulla')}
            onClick={handleClose}
          >
            {t('delete-advice.annulla')}
          </Button>
          <Button
            className='btn__save'
            aria-label={t('delete-advice.button-conferma')}
            onClick={handleDeleteAdvice}
          >
            {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('delete-advice.conferma-breve')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAdvice;