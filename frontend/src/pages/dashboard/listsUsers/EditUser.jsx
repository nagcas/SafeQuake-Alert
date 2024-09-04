/*
 * Componente `EditUser`
 * 
 * Il componente `EditUser` offre un'interfaccia per modificare le informazioni di un utente tramite un modale. Questo componente è particolarmente utile in un'applicazione di gestione utenti per consentire agli amministratori o agli utenti stessi di aggiornare le loro informazioni in modo strutturato e interattivo.
 * 
 * Funzionalità principali:
 * 
 * 1. **Modifica Dettagli Utente**:
 *    - Fornisce un modale con schede (tabs) che permettono la modifica di diverse categorie di informazioni relative all'utente. Le schede disponibili sono:
 *      - **Profilo**: Permette la modifica delle informazioni del profilo dell'utente come nome, cognome, email, ecc. tramite il componente `UpdateProfile`.
 *      - **Località**: Consente di aggiornare le informazioni relative alla località dell'utente, inclusi indirizzo e coordinate, utilizzando il componente `UpdateLocation`.
 *      - **Notifiche**: Gestisce le preferenze di notifica dell'utente (come notifiche push e Telegram) tramite il componente `UpdateNotifications`.
 * 
 * 2. **Interfaccia Modale**:
 *    - Utilizza un modale di dimensioni grandi per ospitare le schede di modifica. Il modale può essere aperto o chiuso tramite i pulsanti dedicati.
 * 
 * 3. **Tabs per Organizzazione**:
 *    - Le informazioni da modificare sono organizzate in schede per migliorare l'esperienza utente e rendere le modifiche più facili da gestire. Ogni scheda è dedicata a un aspetto specifico delle informazioni dell'utente.
 * 
 * Parametri del Componente:
 * 
 * - **`user`**: Oggetto contenente le informazioni dell'utente da modificare. Deve includere dati per tutte le sezioni del modale (Profilo, Località, Notifiche).
 * - **`onUpdate`**: Funzione di callback che viene chiamata quando le informazioni dell'utente vengono aggiornate, permettendo al componente genitore di gestire l'aggiornamento dello stato o di eseguire altre azioni necessarie.
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
 * Il componente `EditUser` è ideale per applicazioni di gestione utenti dove è necessario consentire la modifica delle informazioni utente in modo strutturato. La separazione delle sezioni in schede e l'uso di moduli dedicati per ciascuna sezione semplificano l'interazione e migliorano la gestione dei dati utente.
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tab, Tabs, Tooltip } from 'react-bootstrap';
import UpdateProfile from '../../profile/UpdateProfile';
import UpdateLocation from '../../profile/UpdateLocation';
import UpdateNotifications from '../../profile/UpdateNotifications';
import { useTranslation } from 'react-i18next'

function EditUser({ userLogin, user, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('edit-user.modifica-user')}
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
          variant='warning'
          aria-label={t('edit-user.modifica')}
          onClick={handleShow}
        >
          <i className='bi bi-pencil-square'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit-user.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='border boredr-1 p-4'>
        <Tabs
          defaultActiveKey='profile'
          id='tab-view-profilo-utente'
          className='mb-3 tabs__view__user'
        > 
          <Tab 
            eventKey='profile' 
            title={t('edit-user.profilo')}
          >
            <UpdateProfile userLogin={userLogin} user={user} onUpdate={onUpdate} handleClose={handleClose} />
          </Tab>
          <Tab 
            eventKey='località' 
            title={t('edit-user.località')}
          >
            <UpdateLocation userlogin={userLogin} user={user} onUpdate={onUpdate} handleClose={handleClose} />
          </Tab>
          <Tab 
            eventKey='notifiche'
            title={t('edit-user.notifiche')}
          >
            <UpdateNotifications userlogin={userLogin} user={user} onUpdate={onUpdate} handleClose={handleClose} />
          </Tab>
        </Tabs> 
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditUser;