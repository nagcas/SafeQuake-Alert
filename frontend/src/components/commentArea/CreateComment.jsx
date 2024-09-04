/*
 * CreateComment Component
 *
 * Questo componente gestisce la creazione di un nuovo commento. 
 * L'utente può aprire un modale (finestra popup) dove inserire il proprio commento, 
 * e inviarlo per aggiungerlo all'elenco dei commenti.
 *
 * Importazioni:
 * - `useContext`, `useState`: Hook di React per gestire lo stato locale e il contesto.
 * - `Alert`, `Button`, `FloatingLabel`, `Form`, `Modal`, `Spinner` da 'react-bootstrap': Componenti utilizzati per creare e stilizzare il modale e il form di inserimento del commento.
 * - `fetchWithAuth`: Funzione personalizzata per effettuare richieste API autenticate.
 * - `Context`: Contesto dell'applicazione per ottenere le informazioni dell'utente loggato.
 *
 * Stato:
 * - `show`: Gestisce la visibilità del modale.
 * - `errors`: Contiene eventuali errori di validazione del form.
 * - `loading`: Stato di caricamento durante l'invio del commento.
 * - `comment`: Stato che contiene i dati del commento che l'utente sta creando.
 *
 * Funzioni principali:
 * - `handleShow` e `handleClose`: Funzioni per mostrare e nascondere il modale.
 * - `handleChange`: Aggiorna lo stato del commento mentre l'utente compila il form.
 * - `validate`: Funzione che verifica che il campo del commento non sia vuoto.
 * - `handleSaveSubmit`: Gestisce la sottomissione del form, effettua la richiesta API per salvare il commento, e aggiorna la lista dei commenti.
 * - `handleResetClose`: Resetta il form e chiude il modale.
 *
 * Flusso di lavoro:
 * - Quando l'utente clicca sul pulsante "Lascia un commento", si apre un modale dove può inserire il contenuto del commento.
 * - Dopo aver scritto il commento, l'utente può inviarlo. Il componente valida l'input, invia il commento tramite una richiesta API, 
 *   e aggiorna la lista dei commenti visualizzati nell'app.
 * - Se l'operazione ha successo, il modale si chiude e il form viene resettato. Se ci sono errori, vengono mostrati all'utente.
 *
 * Accessibilità:
 * - Sono stati aggiunti `aria-label` ai pulsanti e al campo del form per migliorare l'accessibilità.
 */


import { useContext, useState } from 'react'; // Hook di React
import { Alert, Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap'; // Componenti di React-Bootstrap
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Funzione per richieste API autenticate
import { Context } from '../../modules/Context.jsx'; // Contesto dell'app
import { useTranslation } from 'react-i18next';

function CreateComment({ id, updateComments }) {

  const { t } = useTranslation('global');
  
  const { userLogin } = useContext(Context); // Utente loggato

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [show, setShow] = useState(false); // Stato per mostrare/nascondere il modal
  const [errors, setErrors] = useState({}); // Stato per gli errori di validazione
  const [loading, setLoading] = useState(false);

  // Funzione per chiudere il modale e ripristinare i dati del form
  const handleClose = () => {
    setShow(false);
    setComment({
      name: userLogin.name,
      email: userLogin.email,
      content: '',
    });
    setErrors({});
  };

  // Funzione per chiudere il modale e resettare il form senza cambiare i dati
  const handleResetClose = () => {
    handleClose();
    setComment({
      name: userLogin.name,
      email: userLogin.email,
      content: '',
    });
    setErrors({});
  };

  // Funzione per aprire il modale
  const handleShow = () => setShow(true);

  // Stato per il commento
  const [comment, setComment] = useState({
    name: userLogin.name,
    email: userLogin.email,
    content: '',
  });

  // Gestisce i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment({
      ...comment,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  // Validazione dei campi del form
  const validate = () => {
    const newErrors = {};
    if (!comment.content.trim()) {
      newErrors.content = t('create-comment.error-content');
    };
    return newErrors;
  };

  // Gestisce la sottomissione del form
  const handleSaveSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };

    setErrors({});
    setLoading(true); // Imposta lo stato di caricamento

    try {
      const response = await fetchWithAuth(`${API_URL}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      // console.log(response);
      setComment({
        name: userLogin.name,
        email: userLogin.email,
        content: '',
      });
      updateComments((prevComments) => [...prevComments, comment]);
      handleClose();
    } catch (error) {
      console.error(t('create-comment.error-invio'), error);
    } finally {
        setLoading(false); // Imposta lo stato di caricamento
        setComment({
          name: userLogin.name,
          email: userLogin.email,
          content: '',
        });
    };
  };

  return (
    <>
      <Button
        aria-label={t('create-comment.button-comment')}
        className='btn__save__comment'
        onClick={handleShow}
      >
        {t('create-comment.lascia-commento')}
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('create-comment.title-cerate-comment')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveSubmit}>
            <Form.Group className='mb-3' controlId='create-comment-name'>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('create-comment.nome')}</span> {comment.name}
              </Form.Label>
              <Form.Label className='mb-3 d-block'>
                <span className='fw-bold'>{t('create-comment.email')}</span> {comment.email}
              </Form.Label>
              <FloatingLabel
                controlId='comment-message'
                label={
                  errors.content ? (
                    <span className='text-danger'>{errors.content}</span>
                  ) : (
                    t('create-comment.error-inserisci')
                  )
                }
              >
                <Form.Control
                  as='textarea'
                  placeholder={t('create-comment.texarea-comment')}
                  style={{ height: '200px' }}
                  name='content'
                  aria-label={t('create-comment.insert-comment')}
                  value={comment.content}
                  onChange={handleChange}
                  isInvalid={!!errors.content}
                />
              </FloatingLabel>
            </Form.Group>

            <Modal.Footer>
              <Button
                className='btn__cancel__comment'
                aria-label={t('create-comment.button-annulla')}
                onClick={handleResetClose}
              >
                {t('create-comment.text-annulla')}
              </Button>

              <Button
                className='btn__save__comment'
                type='submit'
                aria-label={t('create-comment.button-conferma')}
              >
                 {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('create-comment.text-invia')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateComment;
