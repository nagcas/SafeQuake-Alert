/*
 * DeleteComment Component
 *
 * Questo componente gestisce l'eliminazione di un commento specifico. 
 * L'utente può aprire un modale di conferma, e se conferma l'azione, 
 * il commento viene eliminato dal database tramite una richiesta API.
 *
 * Importazioni:
 * - `useState`: Hook di React per gestire lo stato locale.
 * - `Button`, `Modal`, `Spinner` da 'react-bootstrap': Componenti utilizzati per creare e stilizzare il modale di conferma e il pulsante di eliminazione.
 * - `fetchWithAuth`: Funzione personalizzata per effettuare richieste API autenticate.
 *
 * Stato:
 * - `show`: Gestisce la visibilità del modale di conferma.
 * - `loading`: Stato di caricamento durante l'eliminazione del commento.
 *
 * Funzioni principali:
 * - `handleShow` e `handleClose`: Funzioni per mostrare e nascondere il modale di conferma.
 * - `handleDeleteComment`: Gestisce l'eliminazione del commento tramite una richiesta API `DELETE`.
 *   Se l'operazione ha successo, il commento viene rimosso dalla lista dei commenti nel componente padre.
 *
 * Flusso di lavoro:
 * - L'utente clicca sul pulsante di eliminazione, che apre un modale di conferma.
 * - Se l'utente conferma, viene effettuata una richiesta API per eliminare il commento.
 * - Dopo l'eliminazione, il commento viene rimosso dalla lista visualizzata e il modale viene chiuso.
 * - Se l'utente annulla, il modale viene semplicemente chiuso senza eliminare nulla.
 *
 * Accessibilità:
 * - È stato aggiunto un `aria-label` al pulsante di eliminazione per migliorare l'accessibilità.
 */


import { useState } from 'react'; // Hook di React
import { Button, Modal, Spinner } from 'react-bootstrap'; // Componenti di React-Bootstrap
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Funzione per richieste API autenticate
import { useTranslation } from 'react-i18next';

function DeleteComment({ id, commentId, updateComments }) {

  const { t } = useTranslation('global');
  
  const [show, setShow] = useState(false); // Stato per la visibilità del modal
  const [loading, setLoading] = useState(false);

  // Funzioni per gestire la visibilità del modal
  const handleClose = () => setShow(false); 
  const handleShow = () => setShow(true);

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Funzione per eliminare un commento
  const handleDeleteComment = async () => {

    setLoading(true); // Imposta lo stato di caricamento

    try {
      await fetchWithAuth(`${API_URL}/api/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
      });
      // Rimuove il commento eliminato dalla lista nel componente padre
      updateComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
      handleClose(); // Chiude il modal dopo l'operazione
    } catch (error) {
      console.error(t('delete-comment.error'), error); // Log degli errori
    } finally {
      
      setLoading(false); // Imposta lo stato di caricamento
    };
  };

  return (
    <>
      <Button 
        variant='danger' 
        aria-label={t('delete-comment.button-elimina')}
        onClick={handleShow}
      >
        <i className='bi bi-trash'></i>
      </Button>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-comment.title-delete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p className='text-center fs-6'>{t('delete-comment.confirm-delete')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('delete-comment.button-annulla')} 
            onClick={handleClose}
          >
            {t('delete-comment.annulla')}
          </Button>
          <Button
            className='btn__save'
            aria-label={t('delete-comment.button-confirm')}
            onClick={handleDeleteComment}
          >
             {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('delete-comment.confirm')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComment;
