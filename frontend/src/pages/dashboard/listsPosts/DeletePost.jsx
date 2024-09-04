/*
 * `DeletePost` è un componente React che permette agli utenti di eliminare un post esistente.
 * 
 * **Funzionalità principali:**
 * 1. **Gestione della visibilità del Modal:**
 *    - Utilizza uno stato per aprire e chiudere il modal di conferma.
 * 
 * 2. **Gestione della richiesta di eliminazione:**
 *    - Esegue una richiesta di eliminazione al server quando l'utente conferma l'azione.
 *    - Mostra uno spinner di caricamento durante l'eliminazione.
 * 
 * 3. **Gestione dei Messaggi e Stato di Caricamento:**
 *    - Gestisce lo stato di caricamento per visualizzare un indicatore durante l'eliminazione del post.
 * 
 * **Proprietà:**
 * - `post` (Object): L'oggetto del post da eliminare.
 * - `onUpdate` (Function): Callback per aggiornare i dati nel componente padre dopo che il post è stato eliminato.
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';


function DeletePost({ post, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('delete-post.elimina-post')}
    </Tooltip>
  );

  const [show, setShow] = useState(false); // Stato per gestire la visibilità del modal
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento durante l'eliminazione

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Funzione per chiudere il modal
  const handleClose = () => setShow(false);

  // Funzione per aprire il modal
  const handleShow = () => setShow(true);

  // Funzione per gestire l'eliminazione del post
  const handleDeletePost = async () => {
    setLoading(true); // Imposta lo stato di caricamento

    try {
      // Esegue la richiesta di eliminazione al server
      await fetchWithAuth(`${API_URL}/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      handleClose();
    } catch (error) {
      console.error(t('delete-post.error'), error);
    } finally {
      setLoading(false);
      onUpdate(); // Chiama la funzione di aggiornamento nel componente padre
    };
  };

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >
        {/* Pulsante per aprire il modal di eliminazione */}
        <Button 
          variant='danger' 
          aria-label={t('delete-post.button-elimina')}
          onClick={handleShow}
        >
          <i className='bi bi-trash'></i>
        </Button>
      </OverlayTrigger>
      {/* Modal per confermare l'eliminazione del post */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-post.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Messaggio di conferma */}
          <p className='text-center fs-6'>
          {t('delete-post.message-delete')}
            <span className='fw-bold'> {post.title}</span>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          {/* Pulsante per annullare l'operazione */}
          <Button 
            className='btn__cancel'
            aria-label={t('delete-post.button-delete')}
            onClick={handleClose}
          >
            {t('delete-post.annulla')}
          </Button>
          {/* Pulsante per confermare l'eliminazione */}
          <Button
            className='btn__save'
            aria-label={t('delete-post.button-conferma')}
            onClick={handleDeletePost}
          >
            {loading ? (
              <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
            ) : (
              t('delete-post.conferma')
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeletePost;
