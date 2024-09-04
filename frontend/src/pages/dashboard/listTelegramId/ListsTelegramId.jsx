/*
 * Componente React per la visualizzazione e gestione degli ID Telegram degli utenti.
 * 
 * Questo componente visualizza una lista di ID Telegram memorizzati nel backend, inclusi i pulsanti per modificare o eliminare ciascun ID.
 * Permette di cercare, filtrare e paginare i risultati.
 * 
 * Utilizza React Bootstrap per la gestione dell'interfaccia utente, come le tabelle, la paginazione e gli spinner di caricamento.
 * 
 * Stati:
 * - userIdTelegram: array di oggetti che rappresentano gli ID Telegram degli utenti.
 * - isSpinner: booleano che indica se è in corso un'operazione di caricamento.
 * - totalIdTelegram: numero totale di ID Telegram nel backend.
 * - searchId: stringa che memorizza il valore corrente del campo di ricerca.
 * - currentPage: numero della pagina corrente nella paginazione.
 * - totalPages: numero totale di pagine per la paginazione.
 * - limit: numero di risultati per pagina.
 * 
 * Funzioni:
 * - loadIdTelegram: carica gli ID Telegram dal server e aggiorna lo stato del componente.
 * - handleSearchIdTelegram: aggiorna lo stato `searchId` quando l'utente inserisce un valore nel campo di ricerca.
 * - filteredIdTelegram: funzione per filtrare gli ID Telegram in base al valore di ricerca.
 * 
 * Effetti:
 * - useEffect: richiama `loadIdTelegram` quando `currentPage` o `limit` cambiano per aggiornare la lista di ID Telegram.
 * 
 * Render:
 * - Spinner di caricamento visualizzato mentre i dati sono in fase di caricamento.
 * - Campo di ricerca per filtrare gli ID Telegram in base al valore inserito dall'utente.
 * - Tabella responsive che mostra gli ID Telegram e include i pulsanti per la modifica e l'eliminazione.
 * - Paginazione per navigare tra le pagine dei risultati.
 * 
 * Utilizza:
 * - `useState` di React per gestire gli stati locali del componente.
 * - `useEffect` di React per eseguire l'effetto collaterale del caricamento dei dati.
 * - `fetchWithAuth` per effettuare richieste HTTP protette al server.
 * - `formatData` per formattare le date.
 * - `EditTelegramId` e `DeleteTelegramId` per gestire le azioni di modifica ed eliminazione degli ID Telegram.
 * - `react-bootstrap` per la creazione di interfacce utente come tabelle, modali e spinner.
 */


import { useEffect, useState } from 'react';
import { Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import formatData from '../../../services/formatDate.jsx';
import EditTelegramId from './EditTelegramId.jsx';
import DeleteTelegramId from './DeleteTelegramId.jsx';

function ListsTelegramId() {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const [userIdTelegram, setUserIdTelegram] = useState([]);
  const [isSpinner, setIsSpinner] = useState(true);
  const [totalIdTelegram, setTotalIdTelegram] = useState('');

  // Stati per ricerca
  const [searchId, setSearchId] = useState('');

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(16);

  // Funzione per caricare i contatti
  const loadIdTelegram = async () => {
    setIsSpinner(true);
    try { 
      const response = await fetchWithAuth(`${API_URL}/api/userTelegram?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
      if (response && Array.isArray(response.usersTelegram)) {
        setUserIdTelegram(response.usersTelegram);
        setIsSpinner(false);
        setTotalPages(response.totalPages);
        setTotalIdTelegram(response.totalUsersTelegram);
      } else {
        console.error(t('lists-id-telegram.response'), response);
      }
    } catch (error) {
      console.error(t('lists-id-telegram.error'), error);
    };
  };

  useEffect(() => {
    loadIdTelegram();
  }, [currentPage, limit]);

  // Funzioni per aggiornare i campi di ricerca
  const handleSearchIdTelegram = (e) => setSearchId(e.target.value);

  // Funzione per filtrare i contatti
  const filteredIdTelegram = userIdTelegram.filter((user) => {
    const idTelegramStr = String(user.idTelegram);
    const matchId = idTelegramStr.includes(searchId);
    return matchId;
  });

  return (
    <>
      {isSpinner && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'>
          </Spinner>
        </div>
      )}

      <Row className='d-flex justify-content-center'>
        <Col md={4}>
          <Form.Control
            type='text'
            id='search-id'
            aria-describedby={t('lists-id-telegram.ricerca-id')}
            placeholder={t('lists-id-telegram.ricerca-id')}
            value={searchId}
            onChange={handleSearchIdTelegram}
            className='mb-4 input__search'
          />
        </Col>
      </Row>

      <Table responsive='sm' className='table__id__telegram'>
        <thead>
          <tr>
            <th>{t('lists-id-telegram.nr')}</th>
            <th>{t('lists-id-telegram.id')}</th>
            <th>{t('lists-id-telegram.registrazione')}</th>
            <th>{t('lists-id-telegram.id-telegram')}</th>
            <th>{t('lists-id-telegram.azioni')}</th>
          </tr>
        </thead>
        <tbody>
          {totalIdTelegram > 0 ? (
            filteredIdTelegram.map((telegram, index) => (
              <tr key={telegram._id} className='select__id__telegram'>
                <td>{index + 1}</td>
                <td>{telegram._id}</td>
                <td>{formatData(telegram.createdAt, 'it')}</td>
                <td>{telegram.idTelegram}</td>
                
                <td className='btn__action'>
                  <div className='btn__wrapper'>
                    <EditTelegramId telegram={telegram} onUpdate={loadIdTelegram} />
                    <DeleteTelegramId telegram={telegram} onUpdate={loadIdTelegram} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' className='text-white text-center'>{t('lists-id-telegram.nessun-id-telegram')}</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginazione */}
      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
        <div className='mb-3 mb-md-0 me-md-5'>
          <span className='text-white'>{t('lists-id-telegram.id-per-pagina')}</span>
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

      <Pagination className='d-flex flex-wrap justify-content-center mb-0'>
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

export default ListsTelegramId;