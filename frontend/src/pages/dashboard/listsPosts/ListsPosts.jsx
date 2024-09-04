/*
 * `ListsPosts` è un componente React che gestisce e visualizza una lista di post.
 * 
 * **Funzionalità principali:**
 * 1. **Visualizzazione dei Post:**
 *    - Mostra i post in una tabella con dettagli come ID, titolo, autore, data di pubblicazione e categoria.
 *    - Fornisce azioni per visualizzare, modificare ed eliminare i post.
 * 
 * 2. **Paginazione:**
 *    - Gestisce la paginazione dei post per consentire la navigazione tra le diverse pagine di post.
 *    - Permette di selezionare il numero di post per pagina e di navigare tra le pagine.
 * 
 * 3. **Caricamento Dinamico:**
 *    - Carica i post dall'API con supporto per la paginazione e l'ordinamento.
 *    - Utilizza uno spinner per indicare il caricamento dei dati.
 * 
 * **Proprietà:**
 * - `onLatestPosts` (Function): Una funzione callback che viene chiamata con il numero totale dei post disponibili, utile per aggiornare eventuali indicatori esterni.
 * 
 * **Stato:**
 * - `posts` (Array): Memorizza i post da visualizzare nella tabella.
 * - `isSpinner` (Boolean): Gestisce la visibilità dello spinner di caricamento.
 * - `currentPage` (Number): Numero della pagina corrente nella paginazione.
 * - `totalPages` (Number): Totale delle pagine disponibili per la paginazione.
 * - `limit` (Number): Numero di post visualizzati per pagina.
 */

import { useEffect, useState } from 'react';
import { Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { fetchWithAuth } from '../../../services/fetchWithAuth.jsx';
import formatData from '../../../services/formatDate.jsx';
import ViewPost from './ViewPost';
import EditPost from './EditPost';
import DeletePost from './DeletePost';
import NewPost from './NewPost';
import TelegramPost from './TelegramPost';
import { useTranslation } from 'react-i18next';


function ListsPosts({ onLatestPosts, userLogin }) {

  const { t } = useTranslation('global');

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const [posts, setPosts] = useState([]); // Stato per memorizzare i post da visualizzare
  const [isSpinner, setIsSpinner] = useState(true); // Stato per gestire la visualizzazione dello spinner di caricamento
  const [totalPosts, setTotalPosts] = useState('');

  // Stati per le ricerche
  const [searchTitolo, setSearchTitolo] = useState('');
  const [searchData, setSearchData] = useState('');
  const [searchInviato, setSearchInviato] = useState('');

  // Stati per la gestione della paginazione
  const [currentPage, setCurrentPage] = useState(1); // Numero della pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Totale delle pagine
  const [limit, setLimit] = useState(16); // Limite di post per pagina

  /**
   * Funzione per caricare i post dall'API.
   * 
   * Questa funzione effettua una chiamata all'API per recuperare i post basati sulla pagina corrente, il limite di post per pagina e l'ordinamento.
   * Aggiorna lo stato con i post ricevuti e altre informazioni come il numero totale di pagine e post.
   */
  const loadPosts = async () => {
    setIsSpinner(true); // Mostra lo spinner di caricamento
    try {
      // Effettua la chiamata all'API con parametri per paginazione e ordinamento
      const response = await fetchWithAuth(`${API_URL}/api/posts?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
      
      if (response && Array.isArray(response.posts)) {
        // Aggiorna lo stato con i dati ricevuti
        setPosts(response.posts);
        setTotalPosts(response.totalPosts);
        setIsSpinner(false); // Nasconde lo spinner di caricamento
        setTotalPages(response.totalPages); // Imposta il numero totale di pagine
        await onLatestPosts(response.totalPosts); // Notifica il numero totale di post disponibili
      } else {
        console.error(t('lists-posts.error'), response);
      }
    } catch (error) {
      console.error(t('lists-posts.error-post'), error);
    };
  };

  // Effetto per caricare i post all'inizio e ogni volta che cambia la pagina o il limite
  useEffect(() => {
    loadPosts();
  }, [onLatestPosts, currentPage, limit]);

  /**
   * Callback per aggiornare i dati dei post.
   * 
   * Questa funzione viene chiamata quando un post viene creato, modificato o eliminato, e ricarica i dati per riflettere le modifiche.
   */
  const handleDataUpdate = () => {
    loadPosts(); // Ricarica i dati dei post
  };

  const handleSearchTitolo = (e) => setSearchTitolo(e.target.value.toLowerCase());
  const handleSearchData = (e) => setSearchData(e.target.value);
  const handleSearchInviato = (e) => setSearchInviato(e.target.value);

  // Funzione per filtrare i post
  const filteredPosts = posts.filter((post) => {
    // Filtra per titolo
    const matchTitolo = post.title.toLowerCase().includes(searchTitolo);
    // Filtra per data
    const matchData = post.createdAt.includes(searchData);
    // Filtra per stato di risposta (inviata o non inviata)
    const matchInviato = searchInviato === '' || 
      (searchInviato === '1' && post.telegram) || 
      (searchInviato === '2' && !post.telegram);
    
    return matchTitolo && matchData && matchInviato;
  });

  return (
    <>
      {isSpinner && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'></Spinner> {/* Mostra lo spinner durante il caricamento */}
        </div>
      )}
      <Row className='d-flex justify-content-center'>
        <Col md={4}>
          <Form.Control
            type='text'
            id='search-titolo'
            aria-describedby={t('lists-posts.ricerca-titolo')}
            placeholder={t('lists-posts.ricerca-titolo')}
            value={searchTitolo}
            onChange={handleSearchTitolo}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type='date'
            id='search-data'
            aria-describedby={t('lists-posts.ricerca-data')}
            placeholder={t('lists-posts.ricerca-data')}
            value={searchData}
            onChange={handleSearchData}
            className='mb-4 input__search'
          />
        </Col>
        <Col md={4}>
          <Form.Select
            id='search-inviato'
            aria-label={t('lists-posts.ricerca-inviato')}
            value={searchInviato}
            onChange={handleSearchInviato}
            className='mb-4 custom__select'
          >
            <option value=''>{t('lists-posts.tutti')}</option>
            <option value='1'>{t('lists-posts.inviato')}</option>
            <option value='2'>{t('lists-posts.non-inviato')}</option>
          </Form.Select>
        </Col>
      </Row>
      <Table responsive='sm' className='table__posts'>
        <thead>
          <tr>
            <th>{t('lists-posts.nr')}</th>
            <th className='d-none d-md-table-cell'>{t('lists-posts.id')}</th>
            <th>{t('lists-posts.titolo')}</th>
            <th>{t('lists-posts.autore')}</th>
            <th>{t('lists-posts.data')}</th>
            <th>{t('lists-posts.categoria')}</th>
            <th>{t('lists-posts.telegram')}</th>
            <th>{t('lists-posts.action')}</th>
          </tr>
        </thead>
        <tbody>
          {totalPosts > 0 ? (
            filteredPosts.map((post, index) => (
                <tr key={post._id} className='select__posts'>
                  <td>{index + 1}</td>
                  <td className='d-none d-md-table-cell'>{post._id}</td>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{formatData(post.publishedAt, 'it')}</td>
                  <td>{post.category}</td>
                  <td>{post.telegram ? t('lists-posts.inviato') : t('lists-posts.non-inviato')}</td>
                  <td className='btn__action'>
                    <div className='btn__wrapper'>
                      <TelegramPost post={post} onUpdate={handleDataUpdate} /> {/* Invio a Telegram Bot */}
                      <ViewPost post={post} /> {/* Visualizza dettagli del post */}
                      <EditPost post={post} onUpdate={handleDataUpdate} /> {/* Modifica il post */}
                      <DeletePost post={post} onUpdate={handleDataUpdate} /> {/* Elimina il post */}
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan='8' className='text-white text-center'>{t('lists-posts.no-posts')}</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Componente per la paginazione */}
      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
        {/* Pulsante per creare un nuovo post */}
        <div className='my-4'>
          <NewPost onUpdate={handleDataUpdate} />
        </div>

        {/* Selezione del numero di post per pagina */}
        <div className='mb-3 mb-md-0 me-md-5'>
          <span className='text-white'>{t('lists-posts.paginazione')}</span>
          <select
            className='ms-2 p-1 custom__select'
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))} // Aggiorna il numero di post per pagina
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
          </select>
        </div>

        {/* Controlli di navigazione per le pagine */}
        <Pagination className='d-flex justify-content-center align-items-center flex-wrap mb-0'>
          <Pagination.First
            className='btn__pagination'
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1} // Disabilitato se già sulla prima pagina
          />
          <Pagination.Prev
            className='btn__pagination'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1} // Disabilitato se già sulla prima pagina
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              className='btn__pagination'
              key={index + 1}
              active={index + 1 === currentPage} // Evidenzia la pagina corrente
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            className='btn__pagination'
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages} // Disabilitato se già sull'ultima pagina
          />
          <Pagination.Last
            className='btn__pagination'
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages} // Disabilitato se già sull'ultima pagina
          />
        </Pagination>
      </div>

    </>
  );
}

export default ListsPosts;

