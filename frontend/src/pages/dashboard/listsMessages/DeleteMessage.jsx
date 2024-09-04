/*
 * `DeleteMessage` è un componente React che permette di eliminare un messaggio.
 * 
 * Questo componente mostra un pulsante che, quando cliccato, apre una finestra modale chiedendo conferma per l'eliminazione del messaggio.
 * 
 * Le principali funzionalità includono:
 * - Visualizzazione di un pulsante di eliminazione che apre una modale di conferma.
 * - Mostra un messaggio di conferma dell'eliminazione con i dettagli del contatto.
 * - Gestione dello stato di caricamento e conferma dell'eliminazione.
 * - Invio della richiesta di eliminazione al server tramite una richiesta DELETE.
 * - Aggiornamento dei dati nel componente padre tramite la callback `onUpdate`.
 * 
 * contact - L'oggetto che rappresenta il messaggio da eliminare. Deve contenere le proprietà:
 *   - `_id`: ID del messaggio
 *   - `name`: Nome del mittente
 *   - `email`: Email del mittente
 * onUpdate - Callback da chiamare dopo che il messaggio è stato eliminato con successo.
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';


function DeleteMessage({ contact, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('delete-message.elimina-message')}
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
  const handleDeleteContact = async () => {
    setLoading(true); // Imposta lo stato di caricamento
    
    try {
      await fetchWithAuth(`${API_URL}/api/contacts/${contact._id}`, {
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
          aria-label={t('delete-message.button-elimina')}
          onClick={handleShow}
        >
          <i className='bi bi-trash'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-message.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-center fs-6'>
          {t('delete-message.conferma')}<span className='fw-bold'> {contact.name} - {contact.email}</span>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('delete-message.button-annulla')}
            onClick={handleClose}
          >
            {t('delete-message.annulla')}
          </Button>
          <Button
            className='btn__save'
            aria-label={t('delete-message.button-conferma')}
            onClick={handleDeleteContact}
          >
            {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('delete-message.conferma-breve')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteMessage;
