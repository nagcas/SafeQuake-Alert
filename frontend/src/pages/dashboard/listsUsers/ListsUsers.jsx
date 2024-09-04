/*
 * Componente `ListsUsers`
 * 
 * Il componente `ListsUsers` è progettato per gestire e visualizzare una lista di utenti con supporto per la paginazione, la visualizzazione, la modifica e l'eliminazione degli utenti. 
 * Questo componente si integra perfettamente in un'applicazione che richiede una gestione dettagliata degli utenti e offre una panoramica delle informazioni pertinenti in un formato ben organizzato.
 * 
 * Funzionalità Principali:
 * 
 * 1. **Visualizzazione degli Utenti**:
 *    - Mostra una tabella di utenti con colonne per il numero, ID utente, nome, cognome, username, email, data di registrazione e ruolo. 
 *      La tabella è responsive e si adatta alle dimensioni dello schermo, rendendo l'interfaccia utente flessibile e adattabile.
 * 
 * 2. **Azioni Sugli Utenti**:
 *    - Include pulsanti per le azioni di visualizzazione, modifica e eliminazione degli utenti. Questi pulsanti sono gestiti tramite i componenti `ViewUser`, `EditUser`, e `DeleteUser`, che consentono di eseguire operazioni dettagliate su ogni utente. 
 *      Le modifiche o eliminazioni sono seguite da un aggiornamento dei dati visualizzati tramite una funzione di callback.
 * 
 * 3. **Gestione degli Errori**:
 *    - Gestisce gli errori di rete con una robusta gestione delle eccezioni e log degli errori nella console, assicurando che eventuali problemi durante il caricamento dei dati siano visibili e gestibili.
 * 
 * Parametri del Componente:
 * 
 * - **`onLatestUsers`**: Una funzione callback che viene chiamata ogni volta che i dati degli utenti vengono aggiornati. Questa funzione riceve il totale degli utenti, permettendo al componente genitore di aggiornare lo stato in base alle modifiche recenti.
 * 
 * Stato e Effetti:
 * 
 * - **Stato**:
 *   - `users`: Memorizza la lista degli utenti da visualizzare.
 *   - `isSpinner`: Booleano che indica se lo spinner di caricamento deve essere mostrato.
 *   - `currentPage`: Numero della pagina corrente della paginazione.
 *   - `totalPages`: Numero totale delle pagine per la paginazione.
 *   - `limit`: Numero di utenti per pagina.
 * 
 * - **Effetti**:
 *   - `useEffect` viene utilizzato per caricare i dati degli utenti ogni volta che il componente viene montato o quando cambiano la pagina corrente o il limite degli utenti per pagina.
 * 
 * Uso e Integrazione:
 * 
 * Il componente `ListsUsers` è ideale per applicazioni che richiedono una gestione efficiente degli utenti, come dashboard amministrative o sistemi di gestione delle risorse umane. 
 * La sua architettura modulare e la chiara separazione delle preoccupazioni consentono una facile integrazione e manutenzione. 
 * Il design responsive e la gestione della paginazione assicurano una visualizzazione ottimale dei dati, anche quando si lavora con un gran numero di utenti.
 */

import { useContext, useEffect, useState } from 'react';
import { Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import formatData from '../../../services/formatDate.jsx';
import ViewUser from './ViewUser';
import DeleteUser from './DeleteUser';
import EditUser from './EditUser.jsx';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../modules/Context';

function ListsUsers({ onLatestUsers }) {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const { userLogin, setUserLogin } = useContext(Context);

  const [users, setUsers] = useState([]);
  const [isSpinner, setIsSpinner] = useState(false);
  const [totalUsers, setTotalUsers] = useState('');

  // Stati per ricerca
  const [searchEmail, setSearchEmail] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchData, setSearchData] = useState('');

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1); // Stato per la pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Stato per il totale delle pagine
  const [limit, setLimit] = useState(16); // Stato per il limite di utenti per pagina


  // Funzione per caricare la lista di tutti gli utenti
  const loadUsers = async () => {
    setIsSpinner(true);
    try {
      // Effettua una richiesta GET per ottenere la lista degli utenti
      const response = await fetchWithAuth(`${API_URL}/api/users?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`); 
      
      // Verifica se la risposta è corretta
      if (response && Array.isArray(response.users)) {
        // Aggiorna lo stato con i dati ricevuti dall'API
        setUsers(response.users);
        setTotalPages(response.totalPages); // Imposta il totale delle pagine nello stato
        setIsSpinner(false);
        setTotalUsers(totalUsers);
        await onLatestUsers(response.totalUsers);
      } else {
        console.error(t('lists-users.error-response'), response);
      };
    } catch (error) {
      // Gestione dell'errore in caso la richiesta fallisca
      console.error(t('lists-users.error'), error);
    };
  };

  useEffect(() => {
    loadUsers();
  }, [onLatestUsers, currentPage, limit])

  // Callback da passare al componente figlio per aggiornare i contatti
  const handleDataUpdate = () => {
    loadUsers(); // Ricarica i dati
  };

  // Funzioni per aggiornare i campi di ricerca
  const handleSearchEmail = (e) => setSearchEmail(e.target.value.toLowerCase());
  const handleSearchUsername = (e) => setSearchUsername(e.target.value.toLowerCase());
  const handleSearchData = (e) => setSearchData(e.target.value);

  // Funzione per filtrare i contatti
  const filteredUsers = users.filter((user) => {
    // Filtra per email
    const matchEmail = user.email.toLowerCase().includes(searchEmail);
    // Filtra per username
    const matchUsername = user.username.toLowerCase().includes(searchUsername);
    // Filtra per data
    const matchData = user.createdAt.includes(searchData);
    
    return matchEmail && matchUsername && matchData;
  });
  
  return(
    <>
      {isSpinner && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'></Spinner>
        </div>
      )}
      <Row className='d-flex justify-content-center'>
        <Col md={4}>
          <Form.Control
            type='text'
            id='search-email'
            aria-describedby={t('lists-users.ricerca-email')}
            placeholder={t('lists-users.ricerca-email')}
            value={searchEmail}
            onChange={handleSearchEmail}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type='text'
            id='search-username'
            aria-describedby={t('lists-users.ricerca-username')}
            placeholder={t('lists-users.ricerca-username')}
            value={searchUsername}
            onChange={handleSearchUsername}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type='date'
            id='search-data'
            aria-describedby={t('lists-users.ricerca-data')}
            value={searchData}
            onChange={handleSearchData}
            className='mb-4 input__search'
          />
        </Col>
      </Row>
      <Table responsive='sm' className='table__users'>
        <thead>
          <tr>
            <th>{t('lists-users.nr')}</th>
            <th className='d-none d-md-table-cell'>{t('lists-users.id-user')}</th>
            <th>{t('lists-users.nome')}</th>
            <th>{t('lists-users.cognome')}</th>
            <th>{t('lists-users.username')}</th>
            <th>{t('lists-users.email')}</th>
            <th>{t('lists-users.registrazione')}</th>
            <th>{t('lists-users.ruolo')}</th>
            <th>{t('lists-users.action')}</th>
          </tr>
        </thead>
        <tbody>
        {totalUsers < 1 ? (
          filteredUsers.map((user, index) => (
            <tr key={user._id} className='select__user'>
              <td>{index + 1}</td>
              <td className='d-none d-md-table-cell'>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.lastname}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{formatData(user.createdAt, 'it')}</td>
              <td>{user.role === 'admin' ? <span className='fw-bold'>admin</span> : 'user'}</td>
              <td className='btn__action'>
                <div className='btn__wrapper'>
                  <ViewUser user={user} />
                  <EditUser userLogin={userLogin} user={user} onUpdate={handleDataUpdate} />
                  <DeleteUser user={user} onUpdate={handleDataUpdate} />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
              <td colSpan='9' className='text-white text-center'>{t('lists-users.no-utenti')}</td>
            </tr>
        )}
        </tbody>
      </Table>
      
      {/* Paginazione */}
      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
        {/* Selezione del numero di elementi per pagina */}
        <div className='mb-3 mb-md-0 me-md-5'>
          <span className='text-white'>{t('lists-users.paginazione')}</span>
          <select
            className='ms-2 p-1 custom__select'
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
          </select>
        </div>

        {/* Paginazione */}
        <Pagination className='d-flex justify-content-center align-items-center flex-wrap mb-0'>
          <Pagination.First
            className='btn__pagination'
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            className='btn__pagination'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              className='btn__pagination'
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            className='btn__pagination'
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            className='btn__pagination'
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </>
  );
};

export default ListsUsers;