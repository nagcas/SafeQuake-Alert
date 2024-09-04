/*
 * `EditPost` è un componente React che consente agli utenti di modificare un post esistente.
 * 
 * **Funzionalità principali:**
 * 1. **Apertura e Chiusura del Modal:**
 *    - Usa uno stato per gestire la visibilità del modal che permette di modificare il post.
 * 
 * 2. **Gestione dei Dati del Post:**
 *    - Mantiene lo stato per i dati del post, i file di copertura e eventuali errori di validazione.
 *    - Gestisce il cambiamento dei valori dei campi di input, tag e file di copertura.
 * 
 * 3. **Validazione e Invio del Post Modificato:**
 *    - Valida i dati del post prima di inviarli al server.
 *    - Utilizza `FormData` per gestire l'invio dei dati e dei file.
 * 
 * 4. **Messaggi e Stato di Caricamento:**
 *    - Mostra messaggi di successo o errore e gestisce un indicatore di caricamento durante l'invio dei dati.
 * 
 * **Proprietà:**
 * - `post` (Object): L'oggetto del post da modificare.
 * - `onUpdate` (Function): Callback per aggiornare i dati nel componente padre dopo che il post è stato modificato.
 */

import { useContext, useState, useEffect } from 'react';
import { Alert, Button, FloatingLabel, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { Context } from '../../../modules/Context.jsx';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next'


function EditPost({ post, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('edit-post.modifica-post')}
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

  // Stato iniziale per i dati del post da modificare
  const [editPost, setEditPost] = useState({
    _id: post._id,
    title: post.title,
    author: `${userLogin.name} ${userLogin.lastname}`,
    category: post.category || '',
    cover: post.cover,
    tags: post.tags || [], // Assicurati che i tag siano un array
    description: post.description || '',
    content: post.content || '',
  });

  // Funzione per chiudere il modal e resettare il form
  const handleClose = () => {
    setShow(false);
    setEditPost({
      _id: post._id,
      title: post.title,
      author: `${userLogin.name} ${userLogin.lastname}`,
      category: post.category || '',
      cover: post.cover,
      tags: post.tags || [],
      description: post.description || '',
      content: post.content || '',
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per chiudere il modale e resettare il form senza cambiare i dati
  const handleCloseEditPost = () => {
    handleClose();
    setEditPost({
      _id: post._id,
      title: post.title,
      author: `${userLogin.name} ${userLogin.lastname}`,
      category: post.category || '',
      cover: post.cover,
      tags: post.tags || [],
      description: post.description || '',
      content: post.content || '',
    });
    setErrors({});
    setMessage(null);
  };

  // Funzione per aprire il modale
  const handleShow = () => setShow(true);

  // Effetto per aggiornare i tag quando il modal è visibile
  useEffect(() => {
    if (show) {
      setEditPost((prevState) => ({
        ...prevState,
        tags: post.tags || [],
      }));
    };
  }, [show, post.tags]);

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Funzione per gestire i cambiamenti nei tag
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setEditPost((prevState) => {
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
    if (!editPost.title?.trim()) {
      newErrors.title = t('edit-post.error-title');
    };
    if (!editPost.description?.trim()) {
      newErrors.description = t('edit-post.error-description');
    };
    if (!editPost.content?.trim()) {
      newErrors.content = t('edit-post.error-content');
    };
    return newErrors;
  };

  // Funzione per creare l'oggetto FormData per l'invio al server
  const createFormData = () => {
    const formData = new FormData();
    formData.append('title', editPost.title);
    formData.append('author', editPost.author);
    // Solo aggiungi publishedAt se è presente
    if (editPost.publishedAt) {
      formData.append('publishedAt', editPost.publishedAt);
    };
    formData.append('category', editPost.category);
    formData.append('description', editPost.description);
    formData.append('content', editPost.content);
  
    // Aggiungi i tag come array
    editPost.tags.forEach((tag) => formData.append('tags', tag));
  
    // Aggiungi il file di copertura solo se esiste un nuovo file
    if (coverFile) {
      formData.append('cover', coverFile);
    };
  
    return formData;
  };

  // Funzione per gestire l'invio del post modificato
  const handleEditPost = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    };
    setErrors({});
    setLoading(true);

    const formData = createFormData(); // Crea FormData con i dati del post.

    try {
      await fetchWithAuth(`${API_URL}/api/posts/${post._id}`, {
        method: 'PATCH',
        body: formData,
      });

      setMessage({ type: 'success', text: t('edit-post.success')});
      handleClose(); // Chiudi il modal dopo l'invio
    } catch (error) {
      console.error(t('edit-post.msg-error'), error);
      setMessage({ type: 'danger', text: t('edit-post.error-danger')});
    } finally {
      setLoading(false);
      // Resetta i dati del post
      setEditPost({
        _id: editPost._id,
        title: editPost.title,
        author: `${userLogin.name} ${userLogin.lastname}`,
        category: editPost.category || '',
        cover: editPost.cover,
        tags: editPost.tags || [],
        description: editPost.description || '',
        content: editPost.content || '',
      });
      onUpdate(); // Chiama la funzione di aggiornamento nel componente padre
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
        {/* Pulsante per aprire il modal */}
        <Button 
          variant='warning' 
          aria-label={t('edit-post.button-modifica')}
          onClick={handleShow}
        >
          <i className='bi bi-pencil-square'></i>
        </Button>
      </OverlayTrigger>
      {/* Modal per modificare un post */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit-post.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditPost}>
            <Form.Group className='mb-3' controlId='form-edit-post'>
              {/* Mostra l'ID del post */}
              <span className='fw-bold mb-3'>Id:</span> {post._id}
              {/* Campo per il titolo del post */}
              <FloatingLabel 
                controlId='edit-title'
                label={
                  errors.title ? (
                    <span className='text-danger'>{errors.title}</span>
                  ) : (
                    t('edit-post.inserisci-titolo')
                  )
                }
                className='mb-3'
              >
                <Form.Control
                  type='text'
                  placeholder={t('edit-post.inserisci-titolo')}
                  name='title'
                  aria-label={t('edit-post.inserisci-titolo')}
                  value={editPost.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
              </FloatingLabel>
              {/* Selezione della categoria del post */}
              <FloatingLabel 
                controlId='edit-category'
                label={t('edit-post.seleziona-categoria')}
              >
                <Form.Select
                  className='mb-3'
                  aria-label={t('edit-post.seleziona-categoria')}
                  name='category'
                  value={editPost.category}
                  onChange={handleChange}
                >
                  <option value='Notifiche sismiche'>{t('edit-post.notifiche')}</option>
                  <option value='Comprendere i terremoti'>{t('edit-post.comprendere')}</option>
                  <option value='Prevenzione e preparazione'>{t('edit-post.prevenzione')}</option>
                  <option value='Comportamento durante un sisma'>{t('edit-post.comportamento')}</option>
                  <option value='Dopo il terremoto'>{t('edit-post.dopo-terremoto')}</option>
                  <option value='Tecnologia e innovazione'>{t('edit-post.tecnologia')}</option>
                </Form.Select>
              </FloatingLabel>
              {/* Campo per la descrizione del post */}
              <FloatingLabel
                controlId='edit-description'
                label={
                  errors.description ? (
                    <span className='text-danger'>{errors.description}</span>
                  ) : (
                    t('edit-post.modifica-description')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea'
                  placeholder={t('edit-post.inserisci-description')}
                  style={{ height: '100px' }}
                  name='description'
                  aria-label={t('edit-post.inserisci-description')}
                  value={editPost.description}
                  onChange={handleChange}
                  isInvalid={!!errors.description}
                />
              </FloatingLabel>
              {/* Campo per il contenuto del post */}
              <FloatingLabel
                controlId='edit-content'
                label={
                  errors.content ? (
                    <span className='text-danger'>{errors.content}</span>
                  ) : (
                    t('edit-post.modifica-post')
                  )
                }
              >
                <Form.Control
                  className='mb-3'
                  as='textarea'
                  placeholder={t('edit-post.inserisci-post')}
                  style={{ height: '200px' }}
                  name='content'
                  aria-label={t('edit-post.inserisci-post')}
                  value={editPost.content}
                  onChange={handleChange}
                  isInvalid={!!errors.content}
                />
              </FloatingLabel>
              {/* Selezione dei tag del post */}
              <div className='mb-3'>
                <Form.Check
                  inline
                  label={t('edit-post.sismologia-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-sismologia'
                  value='Sismologia'
                  checked={editPost.tags.includes('Sismologia')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('edit-post.sicurezza-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-sicurezza'
                  value='Sicurezza'
                  checked={editPost.tags.includes('Sicurezza')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('edit-post.prevenzione-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-prevenzione'
                  value='Prevenzione'
                  checked={editPost.tags.includes('Prevenzione')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('edit-post.terremoti-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-terremoti'
                  value='Terremoti'
                  checked={editPost.tags.includes('Terremoti')}
                  onChange={handleTagChange}
                />
                <Form.Check
                  inline
                  label={t('edit-post.tecnologie-tags')}
                  name='tags'
                  type='checkbox'
                  id='inline-checkbox-tecnologie'
                  value='Tecnologie'
                  checked={editPost.tags.includes('Tecnologie')}
                  onChange={handleTagChange}
                />
              </div>
              {/* Campo per la copertura del post */}
              <FloatingLabel controlId='edit-cover' label={t('edit-post.modifica-copertina')}>
                <Form.Control
                  className='mb-3'
                  type='file'
                  placeholder={t('edit-post.modifica-copertina')}
                  name='cover'
                  aria-label={t('edit-post.modifica-copertina')}
                  onChange={handleFileChange}
                />
              </FloatingLabel>
              {/* Mostra l'autore del post */}
              <span className='fw-bold mb-3'>{t('edit-post.autore')}</span> {editPost.author}
            </Form.Group>
            <Modal.Footer>
              {/* Pulsante di annullamento */}
              <Button 
                onClick={handleCloseEditPost} 
                aria-label={t('edit-post.button-annulla')}
                className='btn__cancel'
              >
                {t('edit-post.annulla')}
              </Button>
              {/* Pulsante di salvataggio */}
              <Button 
                type='submit' 
                className='btn__save'
                aria-label={t('edit-post.salva')}
                disabled={loading}
              >
                {loading ? (
                  <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
                ) : (
                  t('edit-post.salva')
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

export default EditPost;




