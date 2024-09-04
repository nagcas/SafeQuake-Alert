/*
 * Componente React per visualizzare e gestire una lista di consigli (advices).
 * 
 * Questo componente mostra un elenco di consigli provenienti da un'API e consente di eseguire
 * operazioni come ricerca, filtro, paginazione, e gestione dei consigli (creazione, modifica, eliminazione).
 * 
 * - Utilizza React Bootstrap per costruire l'interfaccia utente, con tabelle, form, spinner di caricamento, 
 *   e componenti di layout reattivo.
 * - Gestisce le operazioni di ricerca e filtro su base locale, filtrando i consigli per magnitudo e testo.
 * - Supporta la paginazione, consentendo agli utenti di navigare tra le pagine e selezionare il numero di 
 *   consigli da visualizzare per pagina.
 * - Utilizza funzioni asincrone per recuperare i dati dall'API e aggiorna la visualizzazione dinamicamente
 *   in base alle interazioni dell'utente.
 * 
 * Props:
 * - Nessuna props viene passata direttamente, ma il componente contiene funzioni di callback per aggiornare
 *   lo stato interno in base alle operazioni svolte sui consigli.
 */

import '../Dashboard.css';
import { useEffect, useState } from 'react';
import { Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth';
import formatData from '../../../services/formatDate'; 
import NewAdvice from './NewAdvice';
import ViewAdvice from './ViewAdvice';
import DeleteAdvice from './DeleteAdvice';
import EditAdvice from './EditAdvice';
import { useTranslation } from 'react-i18next'


function ListsAdvices() {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [advices, setAdvices] = useState([]);
  const [isSpinner, setIsSpinner] = useState(true);
  const [totalAdvices, setTotalAdvices] = useState('');

  // Stati per ricerca
  const [searchMagnitudo, setSearchMagnitudo] = useState('');
  const [searchConsiglio, setSearchConsiglio] = useState('');
  

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(16);

  // Funzione per caricare i consigli
  const loadAdvices = async () => {
    setIsSpinner(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/advices?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
      if (response && Array.isArray(response.advices)) {
        setAdvices(response.advices);
        setIsSpinner(false);
        setTotalPages(response.totalPages);
        setTotalAdvices(response.totalAdvices);
      } else {
        console.error(t('lists-advices.response'), response);
      };
    } catch (error) {
      console.error(t('lists-advices.error'), error);
    };
  };

  useEffect(() => {
    loadAdvices();
  }, [currentPage, limit]);

  // Funzioni per aggiornare i campi di ricerca
  const handleSearchMagnitudo = (e) => setSearchMagnitudo(e.target.value);
  const handleSearchConsiglio = (e) => setSearchConsiglio(e.target.value.toLowerCase());
  

  // Funzione per filtrare i consigli
  const filteredAdvices = advices.filter((advice) => {
    // Filtra per Magnitudo
    const matchMagnitudo = advice.magnitudo ? advice.magnitudo.includes(searchMagnitudo) : false;
    // Filtra per consiglio
    const matchConsiglio = advice.consigli ? advice.consigli.toLowerCase().includes(searchConsiglio) : false;
    
    return matchMagnitudo && matchConsiglio;
  });
  

  /**
   * Callback per aggiornare i dati dei consigli.
   * 
   * Questa funzione viene chiamata quando un consiglio viene creato, modificato o eliminato, e ricarica i dati per riflettere le modifiche.
   */
  const handleDataUpdate = () => {
    loadAdvices(); // Ricarica i dati dei consigli
  };

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
            type='number'
            id='search-magnitudo'
            aria-describedby={t('lists-advices.search-magnitudo')}
            placeholder={t('lists-advices.search-magnitudo')}
            value={searchMagnitudo}
            min={2}
            max={10}
            onChange={handleSearchMagnitudo}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type='text'
            id='search-consiglio'
            aria-describedby={t('lists-advices.search-consiglio')}
            placeholder={t('lists-advices.search-consiglio')}
            value={searchConsiglio}
            onChange={handleSearchConsiglio}
            className='mb-4 input__search'
          />
        </Col>
      </Row>

      <Table responsive='sm' className='table__messages'>
        <thead>
          <tr>
            <th>{t('lists-advices.nr')}</th>
            <th className='d-none d-md-table-cell'>{t('lists-advices.id')}</th>
            <th>{t('lists-advices.magnitudo')}</th>
            <th>{t('lists-advices.consigli')}</th>
            <th>{t('lists-advices.sicurezza')}</th>
            <th>{t('lists-advices.creato')}</th>
            <th>{t('lists-advices.action')}</th>
          </tr>
        </thead>
        <tbody>
          {totalAdvices > 0 ? (
            filteredAdvices.map((advice, index) => (
              <tr key={advice._id} className='select__message'>
                <td>{index + 1}</td>
                <td className='d-none d-md-table-cell'>{advice._id}</td>
                <td>ML {advice.magnitudo}</td>
                <td>{advice.consigli}</td>
                <td>{advice.consigliDiSicurezza}</td>
                <td>{formatData(advice.createdAt, 'it')}</td>
                <td className='btn__action'>
                  <div className='btn__wrapper'>
                    <ViewAdvice advice={advice} />
                    <EditAdvice advice={advice} onUpdate={handleDataUpdate} />
                    <DeleteAdvice advice={advice} onUpdate={handleDataUpdate} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='7' className='text-white text-center'>{t('lists-advices.nessun-consiglio')}</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginazione */}
      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
        <div className='my-4'>
          {/* Pulsante per creare una nuova advice */}
          <NewAdvice onUpdate={handleDataUpdate} />
        </div>

        <div className='me-md-5 mb-3 mb-md-0'>
          {/* Selezione del numero di elementi per pagina */}
          <span className='text-white'>{t('lists-advices.messaggi-per-pagina')}</span>
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

export default ListsAdvices;