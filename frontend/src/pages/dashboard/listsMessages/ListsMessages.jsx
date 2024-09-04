/*
 * Componente React per la visualizzazione e gestione dei contatti.
 * 
 * Questo componente recupera e mostra una lista di contatti tramite una chiamata API. Include funzionalità di ricerca e filtraggio,
 * paginazione dei risultati e azioni sui singoli contatti come visualizzazione, modifica e cancellazione.
 * 
 * - Utilizza React Bootstrap per la creazione dell'interfaccia utente, inclusi il modulo, la tabella e la paginazione.
 * - Recupera i dati dei contatti tramite una chiamata API autenticata.
 * - Gestisce il caricamento dei dati, la visualizzazione di uno spinner durante il caricamento e la paginazione dei risultati.
 * - Permette di cercare e filtrare i contatti in base a nome, email e stato di risposta.
 * - Fornisce pulsanti per visualizzare, modificare e cancellare i contatti tramite i componenti `ViewMessage`, `EditMessage` e `DeleteMessage`.
 * - Utilizza `react-i18next` per la gestione della traduzione dei testi.
 * 
 * Props:
 * - onLatestContacts: funzione di callback che viene chiamata con il numero totale dei contatti dopo il caricamento dei dati.
 * 
 * Stati:
 * - contacts: array di contatti recuperati dall'API.
 * - isSpinner: booleano che indica se mostrare lo spinner di caricamento.
 * - totalContacts: numero totale di contatti.
 * - searchNome: stringa per il filtro del nome dei contatti.
 * - searchEmail: stringa per il filtro dell'email dei contatti.
 * - searchInviato: stringa per il filtro dello stato di risposta dei contatti.
 * - currentPage: numero della pagina corrente per la paginazione.
 * - totalPages: numero totale di pagine per la paginazione.
 * - limit: numero di contatti da mostrare per pagina.
 * 
 * Effetti:
 * - `useEffect` per caricare i contatti quando il componente viene montato o quando cambia la pagina o il limite di risultati.
 */


import { useEffect, useState } from 'react';
import { Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import formatData from '../../../services/formatDate.jsx';
import EditMessage from './EditMessage.jsx';
import ViewMessage from './ViewMessage.jsx';
import DeleteMessage from './DeleteMessage.jsx';
import { useTranslation } from 'react-i18next';


function ListsMessages({ onLatestContacts }) {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const [contacts, setContacts] = useState([]);
  const [isSpinner, setIsSpinner] = useState(true);
  const [totalContacts, setTotalContats] = useState('');

  // Stati per ricerca
  const [searchNome, setSearchNome] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchInviato, setSearchInviato] = useState('');

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(16);

  // Funzione per caricare i contatti
  const loadContacts = async () => {
    setIsSpinner(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/contacts?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
      if (response && Array.isArray(response.contacts)) {
        setContacts(response.contacts);
        setIsSpinner(false);
        setTotalPages(response.totalPages);
        setTotalContats(response.totalContacts);
        await onLatestContacts(response.totalContacts);
      } else {
        console.error(t('lists-messages.response'), response);
      }
    } catch (error) {
      console.error(t('lists-messages.error'), error);
    };
  };

  useEffect(() => {
    loadContacts();
  }, [onLatestContacts, currentPage, limit]);

  // Funzioni per aggiornare i campi di ricerca
  const handleSearchNome = (e) => setSearchNome(e.target.value.toLowerCase());
  const handleSearchEmail = (e) => setSearchEmail(e.target.value.toLowerCase());
  const handleSearchInviato = (e) => setSearchInviato(e.target.value);

  // Funzione per filtrare i contatti
  const filteredContacts = contacts.filter((contact) => {
    // Filtra per nome
    const matchNome = contact.name.toLowerCase().includes(searchNome);
    // Filtra per email
    const matchEmail = contact.email.toLowerCase().includes(searchEmail);
    // Filtra per stato di risposta (inviata o non inviata)
    const matchInviato = searchInviato === '' || 
      (searchInviato === '1' && contact.response) || 
      (searchInviato === '2' && !contact.response);

    return matchNome && matchEmail && matchInviato;
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
            id='search-nome'
            aria-describedby={t('lists-messages.ricerca-nome')}
            placeholder={t('lists-messages.ricerca-nome')}
            value={searchNome}
            onChange={handleSearchNome}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type='text'
            id='search-email'
            aria-describedby={t('lists-messages.ricerca-email')}
            placeholder={t('lists-messages.ricerca-email')}
            value={searchEmail}
            onChange={handleSearchEmail}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Select
            id='search-inviato'
            aria-label={t('lists-messages.ricerca-inviato')}
            value={searchInviato}
            onChange={handleSearchInviato}
            className='mb-4 custom__select'
          >
            <option value=''>{t('lists-messages.tutti')}</option>
            <option value='1'>{t('lists-messages.inviata')}</option>
            <option value='2'>{t('lists-messages.non-inviata')}</option>
          </Form.Select>
        </Col>
      </Row>

      <Table responsive='sm' className='table__messages'>
        <thead>
          <tr>
            <th>{t('lists-messages.nr')}</th>
            <th className='d-none d-md-table-cell'>{t('lists-messages.id')}</th>
            <th>{t('lists-messages.nome')}</th>
            <th>{t('lists-messages.email')}</th>
            <th>{t('lists-messages.oggetto')}</th>
            <th>{t('lists-messages.data-invio')}</th>
            <th>{t('lists-messages.risposta')}</th>
            <th>{t('lists-messages.azioni')}</th>
          </tr>
        </thead>
        <tbody>
          {totalContacts > 0 ? (
            filteredContacts.map((contact, index) => (
              <tr key={contact._id} className='select__message'>
                <td>{index + 1}</td>
                <td className='d-none d-md-table-cell'>{contact._id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.object}</td>
                <td>{formatData(contact.createdAt, 'it')}</td>
                <td>{contact.response ? t('lists-messages.msg-inviata') : t('lists-messages.msg-non-inviata')}</td>
                <td className='btn__action'>
                  <div className='btn__wrapper'>
                    <ViewMessage contact={contact} />
                    <EditMessage contact={contact} onUpdate={loadContacts} />
                    <DeleteMessage contact={contact} onUpdate={loadContacts} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' className='text-white text-center'>{t('lists-messages.nessun-contatto')}</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginazione */}
      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
        <div className='mb-3 mb-md-0 me-md-5'>
          <span className='text-white'>{t('lists-messages.messaggi-per-pagina')}</span>
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
}

export default ListsMessages;
