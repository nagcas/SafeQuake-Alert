/*
 * `ViewMessage` è un componente React che visualizza i dettagli di un messaggio in un modal di Bootstrap.
 * 
 * Questo componente mostra un pulsante che, quando cliccato, apre una finestra modale con le informazioni dettagliate del messaggio.
 * Le informazioni visualizzate includono:
 * - ID del messaggio
 * - Nome del mittente
 * - Email del mittente
 * - Data di invio del messaggio
 * - Testo della domanda (richiesta)
 * - Stato della risposta (inviata/non inviata)
 * - Data di risposta
 * - Testo della risposta
 * 
 * - L'oggetto che rappresenta il messaggio da visualizzare. Deve contenere le proprietà:
 *   - `_id`: ID del messaggio
 *   - `name`: Nome del mittente
 *   - `email`: Email del mittente
 *   - `createdAt`: Data di invio del messaggio
 *   - `request`: Testo della domanda (richiesta)
 *   - `response`: Testo della risposta (o `null` se non inviato)
 *   - `updatedAt`: Data della risposta (se disponibile)
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import formatData from '../../../services/formatDate';
import { useTranslation } from 'react-i18next';


function ViewMessage({ contact }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('view-message.visualizza-message')}
    </Tooltip>
  );

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >
        <Button
          variant='primary'
          onClick={handleShow}
        >
          <i className='bi bi-binoculars-fill'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('view-message.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.id')}</span> {contact._id}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.nome')}</span> {contact.name}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.email')}</span> {contact.email}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.data-invio')}</span> {formatData(contact.createdAt, 'it')}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.domanda')}</span> {contact.request}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.esito')}</span> {contact.response ? 'inviata' : 'non inviata'}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.data-risposta')}</span> {contact.response ? formatData(contact.updatedAt, 'it') : '-'}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-message.risposta')}</span> {contact.response || '-'}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('view-message.button-close')}
            onClick={handleClose}
          >
            {t('view-message.chiudi')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewMessage;
