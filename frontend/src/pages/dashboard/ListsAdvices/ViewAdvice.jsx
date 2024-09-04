/*
 * Componente React per la visualizzazione dei dettagli di un consiglio (advice).
 * 
 * Questo componente mostra un modale che presenta i dettagli completi di un consiglio sismico. 
 * Fornisce un'interfaccia utente per visualizzare le informazioni relative a un consiglio specifico, 
 * inclusi i dati come magnitudo, consigli, avvisi di replica e impatti. 
 * L'utente può accedere a questi dettagli cliccando su un pulsante che apre il modale.
 * 
 * - Utilizza React Bootstrap per il modale e i componenti UI (Button, Modal, Tooltip).
 * - Implementa la traduzione multilingua tramite `react-i18next`.
 * - Mostra i dettagli del consiglio formattati e gestisce la visibilità del modale tramite stato.
 * - Utilizza una funzione di utilità (`formatData`) per formattare la data di creazione del consiglio.
 * 
 * Props:
 * - advice: oggetto contenente i dettagli del consiglio da visualizzare. Deve includere i seguenti campi:
 *   - _id: ID del consiglio
 *   - magnitudo: magnitudo del terremoto
 *   - consigli: consigli generali
 *   - avvisiDiReplica: avvisi di replica
 *   - possibileImpatto: possibile impatto del terremoto
 *   - duranteIlTerremoto: cosa fare durante il terremoto
 *   - dopoIlTerremoto: cosa fare dopo il terremoto
 *   - consigliDiSicurezza: consigli di sicurezza
 *   - createdAt: data di creazione del consiglio
 */


import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import formatData from '../../../services/formatDate';
import { useTranslation } from 'react-i18next';

function ViewAdvice({ advice }) {
  
  const { t } = useTranslation('global')

  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('view-advice.visualizza-advice')}
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
          aria-label={t('view-advice.button-view')} // pulsante per visualizzare il modale
          onClick={handleShow}
        >
          <i className='bi bi-binoculars-fill'></i> {/* Icona per la visualizzazione */}
        </Button>
      </OverlayTrigger>
      {/* Modal per visualizzare i dettagli del post */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('view-advice.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Dettagli del post */}
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.id')}</span> {advice._id}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.magnitudo')}</span> ML {advice.magnitudo}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.consigli')}</span> {advice.consigli}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.avvisi_di_replica')}</span> {advice.avvisiDiReplica}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.possibile_impatto')}</span> {advice.possibileImpatto}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.durante_il_terremoto')}</span> {advice.duranteIlTerremoto}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.dopo_il_terremoto')}</span> {advice.dopoIlTerremoto}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.consigli_di_sicurezza')}</span> {advice.consigliDiSicurezza}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-advice.pubblicato')}</span> {formatData(advice.createdAt, 'it')}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn__cancel'
            aria-label={t('view-advice.button-chiudi')}
            onClick={handleClose}
          >
            {t('view-advice.chiudi')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewAdvice;