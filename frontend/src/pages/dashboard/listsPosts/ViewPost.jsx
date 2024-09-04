/*
 * `ViewPost` è un componente React che visualizza i dettagli di un post in un modal.
 * 
 * **Funzionalità principali:**
 * 1. **Visualizzazione dei Dettagli del Post:**
 *    - Mostra informazioni dettagliate sul post, come ID, titolo, data di pubblicazione, categoria, stato della cover, contenuto, tag e autore.
 * 
 * 2. **Gestione della Visualizzazione del Modal:**
 *    - Utilizza uno stato per controllare la visibilità del modal.
 *    - Include pulsanti per aprire e chiudere il modal.
 * 
 * **Proprietà:**
 * - `post` (Object): Oggetto contenente le informazioni del post da visualizzare.
 * 
 * **Stato:**
 * - `show` (Boolean): Stato che determina se il modal è visibile o nascosto.
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import formatData from '../../../services/formatDate.jsx';
import { sendPost } from '../../../components/telegramPost/SendPostTelegram.jsx';
import { useTranslation } from 'react-i18next';


function ViewPost({ post }) {

  const { t } = useTranslation('global')
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('view-post.visualizza-post')}
    </Tooltip>
  );

  const [show, setShow] = useState(false); // Stato per la visibilità del modal

  // Funzione per chiudere il modal
  const handleClose = () => setShow(false);

  // Funzione per mostrare il modal
  const handleShow = () => setShow(true);

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >
        {/* Pulsante per aprire il modal */}
        <Button
          variant='primary'
          onClick={handleShow}
        >
          <i className='bi bi-binoculars-fill'></i> {/* Icona per la visualizzazione */}
        </Button>
      </OverlayTrigger>
      {/* Modal per visualizzare i dettagli del post */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('view-post.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Dettagli del post */}
            <p className='fs-6'><span className='fw-bold'>{t('view-post.id')}</span> {post._id}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.title-post')}</span> {post.title}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.pubblicato')}</span> {formatData(post.createdAt, 'it')}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.categoria')}</span> {post.category}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.cover')}</span> {post.cover ? t('view-post.presente') : t('view-post.non-presente')}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.descrizione')}</span> {post.description}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.contenuto')}</span></p>
            <div className='content__post' dangerouslySetInnerHTML={{ __html: post.content }}></div>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.tags')}</span> 
              {post.tags.map((tag, index) => (
                <span key={index}> {tag} </span>
              ))}
            </p>
            <p className='fs-6'><span className='fw-bold'>{t('view-post.autore')}</span> {post.author}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn__cancel'
            aria-label={t('view-post.button-chiudi')}
            onClick={handleClose}
          >
            {t('view-post.chiudi')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewPost;
