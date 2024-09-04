/*
 * Componente React per gestire l'invio di un post a un bot di Telegram.
 * 
 * Questo componente mostra un pulsante che, quando cliccato, apre un modal di conferma per l'invio di un post al bot di Telegram.
 * Include anche la logica per aggiornare lo stato del post e inviarlo tramite la funzione `sendPost` e una chiamata API autenticata.
 * 
 * - Utilizza React Bootstrap per la creazione dell'interfaccia utente, inclusi il modal, il pulsante e il tooltip.
 * - Gestisce lo stato del modal per mostrare o nascondere il dialogo di conferma.
 * - Invia una richiesta PATCH all'API per aggiornare lo stato del post e poi invia il post al bot di Telegram.
 * - Utilizza `react-i18next` per la gestione della traduzione dei testi.
 * 
 * Props:
 * - post: oggetto che rappresenta il post da inviare al bot di Telegram.
 * - onUpdate: funzione di callback che viene chiamata per aggiornare il componente padre dopo l'invio del post.
 * 
 * Stati:
 * - show: booleano che indica se il modal è visibile o meno.
 * 
 * Funzioni:
 * - handleClose: chiude il modal impostando `show` a `false`.
 * - handleShow: apre il modal impostando `show` a `true`.
 * - handleEditPost: gestisce l'invio del post al bot di Telegram. Aggiorna lo stato del post tramite una richiesta PATCH e poi invia il post. Chiama `onUpdate` e chiude il modal al termine.
 * 
 * Render:
 * - Pulsante con un tooltip per aprire il modal.
 * - Modal di conferma per l'invio del post a Telegram, con pulsanti per confermare o annullare l'operazione.
 */


import { useState } from 'react';
import { sendPost } from '../../../components/telegramPost/SendPostTelegram';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next'


function TelegramPost({ post, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('telegram-post.invia-post-a-telegram')}
    </Tooltip>
  );

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [show, setShow] = useState(false); // Stato per la visibilità del modal

  // Funzione per chiudere il modal
  const handleClose = () => setShow(false);

  // Funzione per mostrare il modal
  const handleShow = () => setShow(true);

  // Funzione per gestire l'invio del post a telegram bot
  const handleEditPost = async (e) => {
    e.preventDefault();

    try {
      await fetchWithAuth(`${API_URL}/api/posts/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegram: true,
        }),
      });

      // Chiama la funzione per inviare il messaggio a telegram bot
      sendPost(post, t);

    } catch (error) {
      console.error(t('telegram-post.error'), error);
    } finally {
      onUpdate(); // Chiama la funzione di aggiornamento nel componente padre
      handleClose();
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
          variant='success'
          aria-label={t('telegram-post.button-invia')}
          onClick={handleShow}
        >
          <i className='bi bi-telegram'></i> {/* Icona per l'invio del post a telegram */}
        </Button>
      </OverlayTrigger>
      {/* Modal per confermare l'invio del post a telegram bot */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('telegram-post.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Messaggio di conferma */}
          <p className='text-center fs-6'>
          {t('telegram-post.msg-invio')} <span className='fw-bold'> {post.title}</span>{t('telegram-post.button-invia-2')} 
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn__cancel'
            aria-label={t('telegram-post.button-chiudi')}
            onClick={handleClose}
          >
            {t('telegram-post.chiudi')}
          </Button>
          <Button
            className='btn__send__telegram'
            aria-label={t('telegram-post.button-invia-telegram')}
            onClick={handleEditPost}
          >
            {t('telegram-post.invia')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TelegramPost;