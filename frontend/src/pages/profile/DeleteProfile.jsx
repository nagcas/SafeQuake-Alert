/*
 * Componente DeleteProfile
 * 
 * Il componente `DeleteProfile` gestisce l'eliminazione dell'account utente. Fornisce una finestra modale di conferma 
 * per consentire agli utenti di confermare o annullare l'eliminazione del proprio account.
 * 
 * Funzionalità principali:
 * - **Visualizzazione Modale**: Mostra una finestra modale quando l'utente clicca il pulsante "Elimina account", chiedendo conferma per l'eliminazione.
 * - **Eliminazione dell'Account**: Se l'utente conferma, invia una richiesta DELETE autenticata al server per eliminare l'account dell'utente.
 * - **Gestione del Logout**: Dopo la conferma dell'eliminazione, effettua il logout dell'utente, rimuovendo il token di autenticazione e aggiornando lo stato di login nel contesto globale.
 * - **Navigazione**: Reindirizza l'utente alla home page dopo l'eliminazione dell'account.
 * - **Gestione dello Stato di Caricamento**: Mostra uno spinner di caricamento durante l'eliminazione per fornire un feedback visivo.
 * 
 * - Le proprietà del componente.
 * - Oggetto che contiene le informazioni dell'utente da eliminare, inclusi nome e cognome.
 * 
 */


import { useContext, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../modules/Context';
import { useTranslation } from 'react-i18next';

function DeleteProfile({ user }) {

  const { t } = useTranslation('global');

  // Accesso al contesto globale per gestire lo stato di login
  const { setIsLoggedIn } = useContext(Context);
  // Hook per la navigazione programmatica
  const navigate = useNavigate();

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Stato per controllare la visibilità del modale
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funzioni per gestire l'apertura e la chiusura del modale
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Funzione per gestire l'eliminazione dell'autore
  const handleDeleteAuthor = async () => {

    setLoading(true); // Imposta lo stato di caricamento

    try {
      // Richiesta DELETE autenticata per eliminare l'autore
      await fetchWithAuth(`${API_URL}/api/users/${user._id}`, {
        method: 'DELETE',
      });

      // Chiude il modale dopo l'eliminazione
      handleClose();

      // Effettua il logout dell'utente
      setIsLoggedIn(false);
      localStorage.removeItem('token');

      // Reindirizza l'utente alla home page
      navigate('/');

      // Emette un evento di storage per aggiornare altri componenti
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Imposta lo stato di caricamento
    };
  };

  return (
    <>
      {/* Pulsante per aprire il modale di conferma */}
      <div className='text-center'>
        <Button
          className='mt-2 btn__cancel m-auto' 
          aria-label={t('delete-profile.button-elimina')} 
          onClick={handleShow}
        >
          {t('delete-profile.elimina')}
        </Button>
      </div>

      {/* Modale di conferma per l'eliminazione */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete-profile.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
        {t('delete-profile.msg-elimina')} <p className='fw-bold'>{user.name}{' '}{user.lastname}?</p>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {/* Pulsante per annullare l'eliminazione */}
          <Button
            className='me-3 btn__cancel'
            aria-label={t('delete-profile.button-annulla')}
            onClick={handleClose}
          >
            {t('delete-profile.no')}
          </Button>
          {/* Pulsante per confermare l'eliminazione */}
          <Button
            className='btn__save'
            aria-label={t('delete-profile.button-conferma')}
            onClick={handleDeleteAuthor}
          >
            {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : t('delete-profile.si')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteProfile;