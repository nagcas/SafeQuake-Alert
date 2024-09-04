/*
 * Componente React per la cancellazione di un ID Telegram.
 * 
 * Questo componente mostra un pulsante di eliminazione che, quando cliccato, apre un modal per confermare l'eliminazione
 * di un ID Telegram. Utilizza React Bootstrap per il modal e il tooltip e gestisce lo stato di caricamento durante
 * l'eliminazione tramite una spinner.
 * 
 * - Utilizza `react-i18next` per la traduzione dei testi.
 * 
 * Stati:
 * - show: booleano che determina se il modal è visibile o meno.
 * - loading: booleano che indica se è in corso un'operazione di eliminazione.
 * 
 * Funzioni:
 * - handleClose: chiude il modal impostando `show` a `false`.
 * - handleShow: apre il modal impostando `show` a `true`.
 * - handleDeleteIdTelegram: gestisce la richiesta di eliminazione dell'ID Telegram tramite una chiamata API e
 *   aggiorna il componente padre dopo il completamento.
 * 
 * Render:
 * - Un pulsante di eliminazione con un tooltip informativo.
 * - Un modal che chiede conferma all'utente prima di procedere con l'eliminazione.
 * - Un pulsante di conferma che mostra uno spinner di caricamento se l'operazione è in corso.
 * - Un pulsante di annullamento che chiude semplicemente il modal.
 * 
 * Utilizza:
 * - `OverlayTrigger` e `Tooltip` di React Bootstrap per mostrare un tooltip informativo sul pulsante di eliminazione.
 * - `Modal` di React Bootstrap per confermare l'azione di eliminazione.
 * - `Spinner` di React Bootstrap per mostrare un indicatore di caricamento.
 * - `useState` di React per gestire gli stati di visibilità del modal e di caricamento.
 * - `useTranslation` di `react-i18next` per la gestione della traduzione dei testi.
 */


import { useTranslation } from 'react-i18next';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useState } from 'react';

function DeleteTelegramId({ telegram, onUpdate }) {
  
  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('delete-id-telegram.elimina-id-telegram')}
    </Tooltip>
  );

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleDeleteIdTelegram = async () => {

    setLoading(true); // Imposta lo stato di caricamento
    
    try {
      await fetchWithAuth(`${API_URL}/api/userTelegram/${telegram._id}`, {
        method: 'DELETE',
      });
      handleClose();
    } catch (error) {
      console.error(t('delete-id-telegram.error'), error);
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
      onUpdate(); // Chiamare la callback per aggiornare i dati nel componente padre
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
          aria-label={t('delete-id-telegram.elimina')}
          onClick={handleShow}
        >
          <i className='bi bi-trash'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-id-telegram.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p className='text-center fs-6'>{t('delete-id-telegram.message-delete')} <span className='fw-bold'>{telegram.idTelegram}</span> ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('delete-id-telegram.title')}
            onClick={handleClose}
          >
            {t('delete-id-telegram.annulla')}
          </Button>
          <Button
            className='btn__save'
            aria-label={t('delete-id-telegram.title')}
            onClick={handleDeleteIdTelegram}
          >
            {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('delete-id-telegram.conferma')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteTelegramId;