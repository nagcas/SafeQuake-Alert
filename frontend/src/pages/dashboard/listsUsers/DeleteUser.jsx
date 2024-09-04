/*
 * Componente `DeleteUser`
 * 
 * Il componente `DeleteUser` fornisce un'interfaccia modale per eliminare un utente dal sistema. È progettato per consentire agli amministratori o agli utenti autorizzati di rimuovere un utente con conferma, per evitare eliminazioni accidentali. Utilizza un modale per richiedere conferma e gestire l'operazione di cancellazione.
 * 
 * Funzionalità principali:
 * 
 * 1. **Eliminazione Utente**:
 *    - Fornisce un modale di conferma che chiede all'utente di confermare l'eliminazione dell'utente specificato. Se confermato, l'utente viene eliminato tramite una richiesta API.
 * 
 * 2. **Interfaccia Modale**:
 *    - Utilizza un modale di dimensioni grandi per mostrare un messaggio di conferma e due pulsanti per annullare o confermare l'eliminazione.
 *    - Durante il processo di eliminazione, viene visualizzato un indicatore di caricamento (spinner) per mostrare che l'operazione è in corso.
 * 
 * 3. **Gestione Stato**:
 *    - **Stato di Visibilità**: Gestisce la visibilità del modale tramite il valore booleano `show`.
 *    - **Stato di Caricamento**: Gestisce lo stato di caricamento durante l'eliminazione tramite il valore booleano `loading`.
 * 
 * Parametri del Componente:
 * 
 * - **`user`**: Oggetto contenente le informazioni dell'utente da eliminare. Deve includere almeno l'ID dell'utente (`_id`), che viene utilizzato per identificare l'utente da eliminare.
 * - **`onUpdate`**: Funzione di callback che viene chiamata dopo che l'utente è stato eliminato, permettendo al componente genitore di aggiornare la lista degli utenti o eseguire altre azioni necessarie.
 * 
 * Stato e Funzioni:
 * 
 * - **Stato**:
 *   - `show`: Booleano che controlla la visibilità del modale. Impostato su `true` per mostrare il modale e su `false` per nasconderlo.
 *   - `loading`: Booleano che indica se l'operazione di eliminazione è in corso. Impostato su `true` durante l'eliminazione e su `false` quando l'operazione è completata.
 * 
 * - **Funzioni**:
 *   - `handleClose`: Imposta `show` su `false` per chiudere il modale.
 *   - `handleShow`: Imposta `show` su `true` per aprire il modale.
 *   - `handleDeleteUser`: Gestisce l'eliminazione dell'utente. Imposta `loading` su `true` prima della richiesta e su `false` dopo che l'operazione è completata. Chiama `onUpdate` per aggiornare i dati nel componente genitore.
 * 
 * Uso e Integrazione:
 * 
 * Il componente `DeleteUser` è ideale per applicazioni che necessitano di una conferma esplicita prima di eseguire operazioni di eliminazione. La separazione del processo di conferma dall'azione effettiva riduce il rischio di errori e migliora l'esperienza utente.
 */

import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import { useTranslation } from 'react-i18next';

function DeleteUser({ user, onUpdate }) {

  const { t } = useTranslation('global');
  
  // Tooltip per visualizza informazioni sul pulsante
  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('delete-user.elimina-user')}
    </Tooltip>
  );

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleDeleteUser = async () => {

    setLoading(true); // Imposta lo stato di caricamento
    
    try {
      await fetchWithAuth(`${API_URL}/api/users/${user._id}`, {
        method: 'DELETE',
      });
      handleClose();
    } catch (error) {
      console.error(t('delete-user.error'), error);
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
      onUpdate(); // Chiamare la callback per aggiornare i dati nel componente padre
    };
  };

  return (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >
        <Button 
          variant='danger'
          aria-label={t('delete-user.elimina')}
          onClick={handleShow}
        >
          <i className='bi bi-trash'></i>
        </Button>
      </OverlayTrigger>
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-user.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p className='text-center fs-6'>{t('delete-user.msg')} <span className='fw-bold'>{user.name} {user.lastname}</span> ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className='btn__cancel'
            aria-label={t('delete-user.button-annulla')}
            onClick={handleClose}
          >
            {t('delete-user.annulla')}
          </Button>
          <Button
            className='btn__save'
            aria-label={t('delete-user.title')}
            onClick={handleDeleteUser}
          >
            {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('delete-user.conferma')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUser;
