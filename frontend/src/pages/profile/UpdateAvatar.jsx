/*
 * Componente UpdateAvatar
 * 
 * Il componente `UpdateAvatar` permette agli utenti di aggiornare il loro avatar nel profilo. 
 * Fornisce una finestra modale con un modulo per caricare e salvare una nuova immagine avatar.
 * 
 * Funzionalità principali:
 * - **Visualizzazione Modale**: Utilizza una finestra modale per consentire all'utente di selezionare e caricare un'immagine avatar.
 * - **Gestione del File**: Permette all'utente di selezionare un file immagine dal proprio dispositivo. L'immagine viene memorizzata nello stato locale.
 * - **Caricamento dell'Avatar**: Quando il modulo viene inviato, l'immagine selezionata viene inviata al server tramite una richiesta PATCH. Il componente utilizza `fetchWithAuth` per gestire la richiesta autenticata.
 * - **Gestione degli Stati**: Gestisce vari stati, inclusi quelli per la visualizzazione della modale (`show`), messaggi di successo e errori (`message` e `errors`), e lo stato di caricamento (`loading`).
 * - **Gestione degli Errori**: Mostra messaggi di errore se si verifica un problema durante l'aggiornamento dell'avatar e fornisce feedback all'utente.
 * - **Feedback Visivo**: Durante il caricamento, mostra uno spinner per indicare che l'aggiornamento è in corso e mostra messaggi di successo o errore al termine dell'operazione.
 * 
 * props - Le proprietà del componente.
 * userLogin - Oggetto che contiene le informazioni dell'utente attualmente autenticato.
 * props.setUserLogin - Funzione per aggiornare lo stato dell'utente nel contesto.
 * 
 */


import { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';

function UpdateAvatar({ userLogin, setUserLogin }) {
  const { t } = useTranslation('global');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setMessage('');
    setErrors('');
  };

  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setErrors('');
    }
  };

  const saveAvatar = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      setErrors(t('update-profile.avatar-file'));
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    setErrors('');
    setLoading(true);

    try {
      const updatedUser = await fetchWithAuth(`${API_URL}/api/users/${userLogin._id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });

      setUserLogin(updatedUser); // Aggiorna direttamente con `updatedUser`
      setMessage(t('update-profile.avatar-success'));

    } catch (error) {
      console.error('Errore di aggiornamento avatar:', error);
      setErrors(t('update-avatar.error-response'));
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleShow} className='btn__avatar'>
        <i className='bi bi-pencil-square'></i>
      </Button>
      <Modal size='md' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('update-avatar.title')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveAvatar} className='modal__user'>
          <Form.Group controlId='profile__avatar' className='mt-3'>
            <Form.Label className='fw-bold'>{t('update-avatar.seleziona-file')}</Form.Label>
            <Form.Control
              className='border-0 border-bottom input__avatar shadow'
              type='file'
              name='avatar'
              onChange={handleFileChange}
              accept='image/*'
            />
            {message && <Alert className='m-3 text-center' variant='success'>{message}</Alert>}
            {errors && <Alert className='m-3 text-center' variant='danger'>{errors}</Alert>}
          </Form.Group>
          <Modal.Footer>
            <Button
              className='btn__cancel'
              aria-label={t('update-avatar.button-annulla')}
              onClick={handleClose}
            >
              {t('update-avatar.annulla')}
            </Button>
            <Button
              className='btn__save'
              aria-label={t('update-avatar.button-conferma')}
              type='submit'
            >
              {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('update-avatar.salva')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateAvatar;



