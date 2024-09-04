/*
 * `NewPost` è un componente React che permette all'utente di creare un nuovo post.
 * 
 * **Funzionalità principali:**
 * 1. **Apertura e Chiusura del Modal:**
 *    - Usa uno stato per gestire la visibilità del modal che consente di creare un nuovo post.
 * 
 * 2. **Gestione dei Dati del Post:**
 *    - Mantiene lo stato per i dati del post, i file di copertura e eventuali errori di validazione.
 *    - Gestisce il cambiamento dei valori dei campi di input, tag e file di copertura.
 * 
 * 3. **Validazione e Invio del Post:**
 *    - Valida i dati del post prima di inviarli al server.
 *    - Utilizza `FormData` per gestire l'invio dei dati e dei file.
 * 
 * 4. **Messaggi e Stato di Caricamento:**
 *    - Mostra messaggi di successo o errore e gestisce un indicatore di caricamento durante l'invio dei dati.
 * 
 * **Proprietà:**
 * - `onUpdate` (Function): Callback per aggiornare i dati nel componente padre dopo che il post è stato creato.
 */

import { useContext, useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { Context } from '../../../modules/Context.jsx';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';


function NewPost({ onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('new-post.crea-nuovo-post')}
    </Tooltip>
  );
  
  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const { userLogin } = useContext(Context); // Recupera le informazioni dell'utente loggato dal contesto

  const [errors, setErrors] = useState({}); // Stato per gestire gli errori di validazione
  const [message, setMessage] = useState(null); // Stato per gestire i messaggi di successo o errore
  const [coverFile, setCoverFile] = useState(null); // Stato per gestire il file di copertura
  const [show, setShow] = useState(false); // Stato per gestire la visibilità del modal
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento durante l'invio

  // Stato iniziale per i dati del nuovo post
  const [newPost, setNewPost] = useState({
    title: '',
    author: `${userLogin.name} ${userLogin.lastname}`,
    publishedAt: new Date().toISOString(),
    category: '',
    telegram: false,
    cover: '',
    tags: [],
    description: '',
    content: '',
  });

  // Funzione per chiudere il modale e resettare i dati del form
  const handleClose = () => {
    setShow(false);
    setNewPost({
      title: '',
      author: `${userLogin.name} ${userLogin.lastname}`,
      publishedAt: new Date().toISOString(),
      category: '',
      telegram: false,
      cover: '',
      tags: [],
      description: '',
      content: '',
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per resettare i dati del form
  const handleCloseNewPost = () => {
    handleClose();
    setNewPost({
      title: '',
      author: `${userLogin.name} ${userLogin.lastname}`,
      publishedAt: new Date().toISOString(),
      category: '',
      telegram: false,
      cover: '',
      tags: [],
      description: '',
      content: '',
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per aprire il modale
  const handleShow = () => setShow(true);

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Funzione per gestire i cambiamenti nei tag
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setNewPost((prevState) => {
      const newTags = checked
        ? [...prevState.tags, value]
        : prevState.tags.filter((tag) => tag !== value);
      return { ...prevState, tags: newTags };
    });
  };

  // Funzione per gestire il cambiamento del file di copertura
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Funzione per validare i dati del post
  const validate = () => {
    const newErrors = {};
    if (!newPost.title?.trim()) {
      newErrors.title = t('new-post.error-title');
    };
    if (!newPost.description?.trim()) {
      newErrors.description = t('new-post.error-description');
    };
    if (!newPost.content?.trim()) {
      newErrors.content = t('new-post.error-content');
    };
    return newErrors;
  };

  // Funzione per creare l'oggetto FormData per l'invio al server
  const createFormData = () => {
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('author', newPost.author);
    formData.append('publishedAt', newPost.publishedAt);
    formData.append('category', newPost.category);
    formData.append('description', newPost.description);
    formData.append('content', newPost.content);

    // Aggiungi i tag come array
    newPost.tags.forEach((tag) => formData.append('tags', tag));

    // Aggiungi il file di copertura solo se esiste
    if (coverFile) {
      formData.append('cover', coverFile);
    };

    return formData;
  };

  // Funzione per gestire l'invio del nuovo post
  const handleNewPost = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true);

    const formData = createFormData(); // Crea FormData con i dati del post

    try {
      await fetchWithAuth(`${API_URL}/api/posts`, {
        method: 'POST',
        body: formData,
      });

      setMessage({ type: 'success', text: t('new-post.success')});
      handleClose(); // Chiudi il modale dopo l'invio
    } catch (error) {
      console.error(t('new-post.error-invio'), error);
      setMessage({ type: 'danger', text: t('new-post.error-danger')});
    } finally {
      setLoading(false);
      onUpdate(); // Chiama la funzione di aggiornamento nel componente padre
      // Resetta i dati del post
      setNewPost({
        title: '',
        author: `${userLogin.name} ${userLogin.lastname}`,
        publishedAt: new Date().toISOString(),
        category: '',
        telegram: false,
        cover: '',
        tags: [],
        description: '',
        content: '',
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
          aria-label={t('new-post.aggiungi-post')} 
          onClick={handleShow}
        >
          <i className='bi bi-plus-square'></i> {t('new-post.crea-post')}
        </Button>
      </OverlayTrigger>

      {/* Modal per creare un nuovo post */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('new-post.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewPost}>
            <Form.Group className='mb-3' controlId='form-new-post'>
              {/* Campo per il titolo del post */}
              <FloatingLabel 
                controlId='new-title'
                label={
                  errors.title ? (
                    <span className='text-danger'>{errors.title}</span>
                  ) : (
                    t('new-post.inserisci-titolo')
                  )
                }
                className='mb-3'
              >
                <Form.Control
                  type='text'
                  placeholder={t('new-post.inserisci-titolo')}
                  name='title'
                  aria-label={t('new-post.inserisci-titolo')}
                  value={newPost.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
              </FloatingLabel>
              {/* Selezione della categoria del post */}
              <FloatingLabel 
                controlId='new-category'
                label={t('new-post.seleziona-categoria')}
              >
                <Form.Select
                  className='mb-3'
                  aria-label={t('new-post.seleziona-categoria')}
                  name='category'
                  value={newPost.category}
                  onChange={handleChange}
                >
                  <option value=''>{t('new-post.seleziona')}</option>
                  <option value='Notifiche sismiche'>{t('new-post.notifiche')}</option>
                  <option value='Comprendere i terremoti'>{t('new-post.comprendere')}</option>
                  <option value='Prevenzione e preparazione'>{t('new-post.prevenzione')}</option>
                  <option value='Comportamento durante un sisma'>{t('new-post.comportamento')}</option>
                  <option value='Dopo il terremoto'>{t('new-post.dopo-terremoto')}</option>
                  <option value='Tecnologia e innovazione'>{t('new-post.tecnologia')}</option>
                </Form.Select>
              </FloatingLabel>
              {/* Campo per la descrizione del post */}
              <FloatingLabel
                controlId='new-description'
                label={
                  errors.description ? (
                    <span className='text-danger'>{errors.description}</span>
                  ) : (
                    t('new-post.inserisci-description')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea' 
                  placeholder={t('new-post.inserisci-description-textarea')}
                  style={{ height: '100px' }}
                  name='description'
                  aria-label={t('new-post.inserisci-description-textarea')}
                  value={newPost.description}
                  onChange={handleChange}
                  isInvalid={!!errors.description}
                />
              </FloatingLabel>
              {/* Campo per il contenuto del post */}
              <FloatingLabel
                controlId='new-content'
                label={
                  errors.content ? (
                    <span className='text-danger'>{errors.content}</span>
                  ) : (
                    t('new-post.inserisci-post')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea'
                  placeholder={t('new-post.inserisci-post-textarea')}
                  style={{ height: '200px' }}
                  name='content'
                  aria-label={t('new-post.inserisci-post-textarea')}
                  value={newPost.content}
                  onChange={handleChange}
                  isInvalid={!!errors.content}
                />
              </FloatingLabel>
              {/* Selezione dei tag del post */}
              <div className='mb-3'>
                <Form.Check
                  inline
                  label={t('new-post.sismologia-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-sismologia'
                  value='Sismologia'
                  checked={newPost.tags.includes('Sismologia')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('new-post.sicurezza-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-sicurezza'
                  value='Sicurezza'
                  checked={newPost.tags.includes('Sicurezza')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('new-post.prevenzione-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-prevenzione'
                  value='Prevenzione'
                  checked={newPost.tags.includes('Prevenzione')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('new-post.terremoti-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-terremoti'
                  value='Terremoti'
                  checked={newPost.tags.includes('Terremoti')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('new-post.tecnologie-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-tecnologie'
                  value='Tecnologie'
                  checked={newPost.tags.includes('Tecnologie')}
                  onChange={handleTagChange}
                />
              </div>
              {/* Campo per la copertura del post */}
              <FloatingLabel 
                controlId='new-cover'
                label={t('new-post.inserisci-copertina')}
              >
                <Form.Control
                  className='mb-3'
                  type='file'
                  placeholder={t('new-post.inserisci-copertina')}
                  name='cover'
                  aria-label={t('new-post.inserisci-copertina')}
                  onChange={handleFileChange}
                />
              </FloatingLabel>
              {/* Mostra l'autore del post */}
              <span className='fw-bold mb-3'>{t('new-post.autore')}</span> {newPost.author}
            </Form.Group>
            <Modal.Footer>
              <Button 
                onClick={handleCloseNewPost} 
                className='btn__cancel'
                aria-label={t('new-post.button-annulla')}
              >
                {t('new-post.annulla')}
              </Button>
              <Button 
                type='submit' 
                className='btn__save'
                aria-label={t('new-post.button-salva')}
                disabled={loading}
              >
                {loading ? (
                  <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
                ) : (
                  t('new-post.salva')
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
}

export default NewPost;

