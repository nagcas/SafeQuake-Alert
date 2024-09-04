/*
 * Componente React che mostra un modal con informazioni utili riguardanti i sismi.
 * 
 * Questo componente visualizza un pulsante di aiuto che, quando cliccato, apre un modal con dettagli informativi
 * riguardanti vari aspetti dei sismi, come tempo di origine, localizzazione, ipocentro, magnitudo e zona.
 * Utilizza React Bootstrap per il modal e il tooltip.
 * 
 * - Utilizza `react-i18next` per la gestione della traduzione dei testi all'interno del modal.
 * 
 * Stati:
 * - show: booleano che indica se il modal è visibile o meno.
 * 
 * Funzioni:
 * - handleClose: chiude il modal impostando `show` a `false`.
 * - handleShow: apre il modal impostando `show` a `true`.
 * 
 * Render:
 * - Un pulsante di aiuto che mostra un tooltip quando l'utente ci passa sopra.
 * - Un modal di dimensioni grandi che contiene le informazioni suddivise in sezioni.
 * - Ogni sezione del modal presenta un titolo e uno o più paragrafi informativi tradotti tramite `react-i18next`.
 * - Un pulsante di chiusura del modal.
 * 
 * Utilizza:
 * - `OverlayTrigger` e `Tooltip` di React Bootstrap per visualizzare un tooltip informativo sul pulsante.
 * - `Modal` di React Bootstrap per mostrare le informazioni dettagliate.
 * - `useState` di React per gestire la visibilità del modal.
 * - `useTranslation` di `react-i18next` per il supporto della traduzione dei testi.
 */


import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'

function InfoSismic() {

  const { t } = useTranslation('global');

  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('info-utili.informazioni')}
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
          className='info-sismic'
          aria-label={t('info-utili.button-info')}
          onClick={handleShow}>
          ?
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('info-utili.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-4'>

        <section>
          <h2>{t('info-utili.tempo-origine-1')}</h2>
          <p>{t('info-utili.tempo-origine-2')}</p>
          <p>{t('info-utili.tempo-origine-3')}</p>
          <p><span className='fw-bold'>{t('info-utili.tempo-origine-4')}</span>{t('info-utili.tempo-origine-5')} </p>
        </section>

        <section>
          <h2>{t('info-utili.localizzazione-1')}</h2>
          <p>{t('info-utili.localizzazione-2')}</p>
          <p>{t('info-utili.localizzazione-3')}</p>
        </section>

        <section>
          <h2>{t('info-utili.ipocentro-1')}</h2>
          <p>{t('info-utili.ipocentro-2')}</p>
        </section>

        <section>
          <h2>{t('info-utili.magnitudo-1')}</h2>
          <p>{t('info-utili.magnitudo-2')}</p>
          <p>{t('info-utili.magnitudo-3')} <span className='fw-bold'>{t('info-utili.magnitudo-4')}</span> <span className='fw-bold'>{t('info-utili.magnitudo-5')}</span>.</p>
          <p>{t('info-utili.magnitudo-6')}</p>
          <ul>
            <li className='fw-bold'>{t('info-utili.magnitudo-7')}</li>
            <li className='fw-bold'>{t('info-utili.magnitudo-8')}</li>
            <li className='fw-bold'>{t('info-utili.magnitudo-9')}</li>
            <li className='fw-bold'>{t('info-utili.magnitudo-10')}</li>
            <li className='fw-bold'>{t('info-utili.magnitudo-11')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('info-utili.zona-1')}</h2>
          <p>{t('info-utili.magnitudo-2')} <strong>{t('info-utili.magnitudo-3')}</strong>  <strong>{t('info-utili.magnitudo-4')}</strong> </p>
          <p>{t('info-utili.magnitudo-5')}</p>
        </section>

        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('info-utili.button-chiudi')}
            onClick={handleClose}>
            {t('info-utili.chiudi')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InfoSismic;

