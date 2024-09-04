/*
 * Componente `ViewUser`
 * 
 * Il componente `ViewUser` permette di visualizzare i dettagli di un utente tramite un modale. Questo componente è utile per le applicazioni che necessitano di una visualizzazione approfondita delle informazioni di un utente in modo organizzato e interattivo.
 * 
 * Funzionalità principali:
 * 
 * 1. **Visualizzazione Dettagliata**:
 *    - Fornisce una panoramica dettagliata delle informazioni dell'utente tramite un modale che si apre al clic del pulsante di visualizzazione. Le informazioni sono suddivise in tre schede (tabs):
 *      - **Profilo**: Mostra dettagli come ID utente, data di creazione dell'account, nome, cognome, username, email, data di nascita, genere, telefono, lingua preferita e stato dell'avatar.
 *      - **Località**: Fornisce informazioni sulla località dell'utente, inclusi regione, provincia, città, indirizzo, CAP, latitudine e longitudine.
 *      - **Notifiche**: Indica le preferenze di notifica dell'utente, come le notifiche push e Telegram, e il nome utente di Telegram se presente.
 * 
 * 2. **Interfaccia Modale**:
 *    - Utilizza un modale di dimensioni grandi per presentare le informazioni dell'utente. Include un pulsante di chiusura per chiudere il modale.
 * 
 * 3. **Tabs per Organizzazione**:
 *    - Le informazioni sono organizzate in schede per facilitare la navigazione e la lettura. Ogni scheda mostra un gruppo specifico di dettagli, rendendo l'interfaccia utente più chiara e accessibile.
 * 
 * Parametri del Componente:
 * 
 * - **`user`**: Oggetto contenente le informazioni dell'utente da visualizzare. Deve includere dati per tutte le sezioni del modale (Profilo, Località, Notifiche).
 * 
 * Stato e Funzioni:
 * 
 * - **Stato**:
 *   - `show`: Booleano che controlla la visibilità del modale. Impostato su `true` per mostrare il modale e su `false` per nasconderlo.
 * 
 * - **Funzioni**:
 *   - `handleClose`: Imposta `show` su `false` per chiudere il modale.
 *   - `handleShow`: Imposta `show` su `true` per aprire il modale.
 * 
 * Uso e Integrazione:
 * 
 * Il componente `ViewUser` è ideale per le applicazioni di gestione utenti o dashboard amministrative dove è necessario visualizzare informazioni dettagliate su un utente specifico. La sua struttura modulare e l'uso di Bootstrap per il design dell'interfaccia rendono facile l'integrazione e l'adattamento alle esigenze dell'applicazione.
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tab, Tabs, Tooltip } from 'react-bootstrap';
import formatData from '../../../services/formatDate.jsx';
import { useTranslation } from 'react-i18next';

function ViewUser({ user }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('view-user.visualizza-user')}
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
          <Modal.Title>{t('view-user.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='border boredr-1 p-4'>
        <Tabs
          defaultActiveKey='profile'
          id='tab-view-profilo-utente'
          className='mb-3 tabs__view__user'
        >
          <Tab 
            eventKey='profile' 
            title={t('view-user.profilo')}
          >
            <p className='fs-6'><span className='fw-bold'>Id:</span> {user._id}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.account')}</span> {formatData(user.createdAt, 'it')}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.nome')}</span> {user.name}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.cognome')}</span> {user.lastname}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.username')}</span> {user.username}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.email')}</span> {user.email}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.data')}</span> {formatData(user.birthdate, 'it')}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.genere')}</span> {user.gender}</p> 
            <p className='fs-6'><span className='fw-bold'>{t('view-user.telefono')}</span> {user.phone}</p> 
            <p className='fs-6'><span className='fw-bold'>{t('view-user.lingua')}</span> {user.favoriteLanguage}</p> 
            <p className='fs-6'><span className='fw-bold'>{t('view-user.avatar')}</span> {user.avatar ? 'presente' : 'non presente'}</p>
          </Tab>
          <Tab 
            eventKey='località' 
            title={t('view-user.località')}
          >
            <p className='fs-6'><span className='fw-bold'>{t('view-user.regione')}</span> {user.place[0]?.region}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.provincia')}</span> {user.place[0]?.province}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.città')}</span> {user.place[0]?.city}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.indirizzo')}</span> {user.place[0]?.address}</p> 
            <p className='fs-6'><span className='fw-bold'>{t('view-user.cap')}</span> {user.place[0]?.cap}</p>
            <p className='fs-6'><span className='fw-bold'>{t('view-user.latitudine')}</span> {user.place[0]?.latitude}</p> 
            <p className='fs-6'><span className='fw-bold'>{t('view-user.longitudine')}</span> {user.place[0]?.longitude}</p>
          </Tab>
          <Tab 
            eventKey='notifiche' 
            title={t('view-user.notifiche')}
          >
          <p className='fs-6'><span className='fw-bold'>{t('view-user.notifiche-push')}</span> {user.notifications[0]?.push ? 'accettata' : 'non accettata'}</p> 
          <p className='fs-6'><span className='fw-bold'>{t('view-user.notifiche-telegram')}</span> {user.notifications[0]?.telegram ? 'accettata' : 'non accettata'}</p> 
          <p className='fs-6'><span className='fw-bold'>{t('view-user.user-telegram')}</span> {user.notifications[0]?.userTelegram ? user.notifications[0]?.userTelegram : 'non presente'}</p>
          <p className='fs-6'><span className='fw-bold'>{t('view-user.user-id-telegram')}</span> {user.notifications[0]?.userIdTelegram ? user.notifications[0]?.userIdTelegram : 'non presente'}</p>
          </Tab>
        </Tabs> 
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn__cancel'
            aria-label={t('view-user.button-chiudi')}
            onClick={handleClose}
          >
            {t('view-user.chiudi')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewUser;