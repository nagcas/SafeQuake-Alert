/*
 * EditComment Component
 *
 * Questo componente permette agli utenti di modificare i commenti esistenti. 
 * Gli utenti possono aprire un modal, aggiornare il contenuto del commento e salvarlo, 
 * convalidando i dati inseriti prima dell'invio.
 *
 * Importazioni:
 * - `useContext`, `useState`: Hook di React per gestire lo stato locale e accedere al contesto dell'app.
 * - `Button`, `Modal`, `Spinner`, `FloatingLabel`, `Form`: Componenti di React-Bootstrap utilizzati per creare l'interfaccia utente.
 * - `fetchWithAuth`: Funzione per effettuare richieste API autenticate.
 * - `Context`: Contesto dell'app utilizzato per ottenere informazioni sull'utente loggato.
 *
 * Stato:
 * - `show`: Stato per la visibilità del modal.
 * - `errors`: Stato per memorizzare eventuali errori di validazione.
 * - `loading`: Stato per gestire il caricamento durante la modifica del commento.
 * - `editComment`: Stato che contiene i dati del commento modificabile.
 *
 * Funzioni principali:
 * - `handleShow` e `handleClose`: Funzioni per gestire la visibilità del modal.
 * - `handleChange`: Aggiorna lo stato del commento quando l'utente modifica i campi del form.
 * - `validate`: Verifica che il campo del commento non sia vuoto e restituisce eventuali errori.
 * - `handleEditSubmit`: Gestisce l'invio del form, esegue la validazione, invia la richiesta API `PATCH` per aggiornare il commento, e aggiorna la lista dei commenti nel componente padre.
 * - `handleResetClose`: Chiude il modal e resetta gli errori.
 *
 * Flusso di lavoro:
 * - L'utente clicca sul pulsante di modifica, aprendo un modal con il contenuto del commento precompilato.
 * - L'utente può aggiornare il testo del commento e salvare le modifiche.
 * - Se il commento è vuoto, viene mostrato un messaggio di errore.
 * - Alla conferma, il commento aggiornato viene inviato all'API e aggiornato nella lista visualizzata.
 *
 * Accessibilità:
 * - Un `aria-label` è stato aggiunto al pulsante di modifica per migliorare l'accessibilità.
 */


import './CommentArea.css';

import { useContext, useState } from 'react'; // Hook di React per gestire stato e contesto
import { Alert, Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'; // Componenti di React-Bootstrap per UI
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Funzione per effettuare richieste API autenticate
import { Context } from '../../modules/Context.jsx'; // Contesto per ottenere informazioni sull'utente
import { useTranslation } from 'react-i18next';

function EditComment({ id, comment, commentId, updateComments }) {

  const { t } = useTranslation('global');
  
  const { userLogin } = useContext(Context); // Ottiene informazioni sull'utente loggato dal contesto

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [show, setShow] = useState(false); // Stato per la visibilità del modal
  const [errors, setErrors] = useState({}); // Stato per memorizzare eventuali errori di validazione
  const [loading, setLoading] = useState(false);

  // Funzione per chiudere il modale e ripristinare i dati del form
  const handleClose = () => {
    setShow(false);
  };

  // Funzione per chiudere il modale e resettare il form senza cambiare i dati
  const handleResetClose = () => {
    handleClose();
    setEditComment({
      _id: userLogin._id,
      name: userLogin.name,
      email: userLogin.email,
      content: comment.content,
    });
    setErrors({});
  };

  // Funzione per aprire il modale
  const handleShow = () => setShow(true); // Mostra il modal

  const [editComment, setEditComment] = useState({
    _id: userLogin._id,
    name: userLogin.name,
    email: userLogin.email,
    content: comment.content,
  });

  // Gestisce le modifiche ai campi del modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditComment({
      ...editComment,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Funzione per la validazione del commento
  const validate = () => {
    const newErrors = {};
    if (!editComment.content.trim()) {
      newErrors.content = t('edit-comment.error-content'); // Messaggio di errore se il campo contenuto è vuoto
    };
    return newErrors;
  };

  // Gestisce l'invio del modulo di modifica
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };

    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento

    try {
      await fetchWithAuth(`${API_URL}/api/posts/${id}/comments/${comment._id}`, {
        method: 'PATCH', // Metodo HTTP per aggiornare il commento
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editComment), // Corpo della richiesta con il commento aggiornato
      });
      
        updateComments((prevComments) => 
        prevComments.map((comm) => (comm._id === comment._id ? { ...comm, content: editComment.content } : comm))
      ); // Aggiorna il commento nella lista del componente padre
      handleClose(); // Chiude il modal
    } catch (error) {
      console.error(t('edit-comment.error-send'), error); // Log degli errori
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
      setEditComment({
        _id: userLogin._id,
        name: userLogin.name,
        email: userLogin.email,
        content: editComment.content,
      });
    };
  };

  return (
    <>
      <Button
        className='btn'
        aria-label={t('edit-comment.button-modify')}
        onClick={handleShow} // Mostra il modal quando cliccato
      >
        <i className='bi bi-pencil-square'></i>
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit-comment.title-modify')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className='mb-3' controlId='edit-comment-id'>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-comment.nome')}</span> {userLogin.name}
              </Form.Label>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('edit-comment.email')}</span> {userLogin.email}
              </Form.Label>
              <FloatingLabel 
                controlId='comment-message'
                label={errors.content ? <span className='text-danger'>{errors.content}</span> : t('edit-comment.insert-comment')}
              >
                <Form.Control
                  as='textarea'
                  placeholder={t('edit-comment.insert-textarea')}
                  style={{ height: '200px' }}
                  name='content'
                  aria-label={t('edit-comment.insert-comment')}
                  value={editComment.content}
                  onChange={handleChange}
                  isInvalid={!!errors.content}
                />
              </FloatingLabel>
            </Form.Group>
            <Modal.Footer>
              <Button 
                onClick={handleResetClose}
                className='btn__cancel__comment'
                aria-label={t('edit-comment.button-annulla')}
              >
                {t('edit-comment.annulla')}
              </Button>
              <Button 
                type='submit'
                className='btn__save__comment'
                aria-label={t('edit-comment.button-salva')}
              >
                {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('edit-comment.salva')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditComment;

