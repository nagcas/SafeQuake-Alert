/*
 * Il componente BlogPosts gestisce la visualizzazione dei post del blog con paginazione e caricamento dinamico.
 * - Carica i post dal server con paginazione e ordinamento.
 * - Mostra un'animazione di caricamento mentre i dati sono in fase di recupero.
 * - Visualizza i post del blog all'interno di una griglia di card con immagine, titolo, autore, data e categoria.
 * - Fornisce un'interfaccia per navigare tra le pagine dei post e per selezionare il numero di post per pagina.
 * - Mostra placeholder mentre i dati sono in fase di caricamento e altre sezioni laterali con contenuti aggiuntivi.
 * 
 * Utilizza:
 * - React e hook di stato ed effetto.
 * - Bootstrap per la progettazione dell'interfaccia utente.
 * - React Router per la navigazione.
 */

import './BlogPosts.css'; // Importa il file CSS specifico per lo stile dei post del blog
import { useEffect, useState } from 'react'; // Importa gli hook di React per la gestione dello stato e degli effetti collaterali
import { Card, CardFooter, CardHeader, Col, Container, Form, Pagination, Row, Spinner } from 'react-bootstrap'; // Importa componenti di Bootstrap per la creazione dell'interfaccia utente
import { Link } from 'react-router-dom'; // Importa il componente Link per la navigazione tra le pagine
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Importa una funzione per eseguire richieste HTTP con autenticazione
import CoverDefault from '../../assets/images/javier-miranda-Jn2EaLLYZfY-unsplash.jpg'; // Importa un'immagine di copertura predefinita per i post del blog
import formatData from '../../services/formatDate.jsx'; // Importa una funzione per formattare le date
import Prevention from './Prevention'; // Importa il componente per la sezione "Prevention" nella colonna laterale
import Behavior from './Behavior'; // Importa il componente per la sezione "Behavior" nella colonna laterale
import SeismicNews from './SeismicNews'; // Importa il componente per la sezione "SeismicNews" nella colonna laterale
import Comprehend from './Comprehend'; // Importa il componente per la sezione "Comprehend" nella colonna laterale
import AfterEarthquake from './AfterEarthquake'; // Importa il componente per la sezione "AfterEarthquake" nella colonna laterale
import Technology from './Technology'; // Importa il componente per la sezione "Technology" nella colonna laterale
import BlogPlaceholder from '../../components/blogPlaceholder/BlogPalceholder'; // Importa il componente placeholder per la visualizzazione durante il caricamento
import { useTranslation } from 'react-i18next';


// Componente di placeholder per simulare il contenuto mentre i dati sono in fase di caricamento
const SectionPlaceholder = () => (
  <div className="section-placeholder mb-4 p-3 bg-light">
    <div className="placeholder-title bg-secondary mb-2" style={{ height: '20px', width: '50%' }}></div>
    <div className="placeholder-content bg-secondary" style={{ height: '15px', width: '80%' }}></div>
    <div className="placeholder-content bg-secondary" style={{ height: '15px', width: '60%' }}></div>
  </div>
);

function BlogPosts() {

  const { t } = useTranslation('global');
  
  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Stato per memorizzare i post, lo stato di caricamento e la paginazione
  const [posts, setPosts] = useState([]); // Memorizza i post del blog
  const [isLoading, setIsLoading] = useState(true); // Indica se i dati sono in fase di caricamento

  const [search, setSearch] = useState('');

  // Stati per la paginazione
  const [currentPage, setCurrentPage] = useState(1); // Memorizza la pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Memorizza il numero totale di pagine
  const [limit, setLimit] = useState(24); // Numero di post per pagina

  // Funzione per caricare i post dal server
  const loadPosts = async () => {
    setIsLoading(true); // Imposta lo stato di caricamento su true
    try {
      // Esegui una richiesta per ottenere i post con paginazione e ordinamento
      const response = await fetchWithAuth(`${API_URL}/api/posts?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
      
      // Verifica se la risposta è un array di post e aggiorna lo stato
      if (response && Array.isArray(response.posts)) {
        setPosts(response.posts); // Aggiorna lo stato dei post
        setTotalPages(response.totalPages); // Aggiorna il numero totale di pagine
      } else {
        console.error(t('blog-posts.error-response'), response); // Logga un errore se la risposta non è valida
      };
    } catch (error) {
      console.error(t('blog-posts.error-posts'), error); // Logga eventuali errori di caricamento
    } finally {
      setIsLoading(false); // Imposta lo stato di caricamento su false una volta completato il caricamento
    };
  };

  // Effetto collaterale per caricare i post quando il componente viene montato o gli stati di paginazione cambiano
  useEffect(() => {
    loadPosts(); // Carica i post quando il componente viene montato o gli stati di paginazione cambiano
  }, [currentPage, limit]);

  // Crea i placeholder per il caricamento
  const placeholders = Array.from({ length: limit }, (_, i) => (
    <BlogPlaceholder key={i} />
  ));

  // Funzioni per aggiornare i campi di ricerca
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());


  // Funzione per filtrare i titoli e i tags
  const filtered = posts.filter((post) => {
    // Filtra per titolo o tags
    const match = post.title.toLowerCase().includes(search) ||  post.tags.some(tag => tag.toLowerCase().includes(search));
    
    return match;
  });

  return (
    <>
      {/* Mostra uno spinner di caricamento se i dati sono in fase di caricamento */}
      {isLoading && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'></Spinner>
        </div>
      )}
      <Container className='content__blog'>
        <h2 className='title__blog__posts mb-5'>{t('blog-posts.title')}</h2>
        <Row>
          {/* Mostra i post o i placeholder durante il caricamento */}
          {isLoading
            ? placeholders
            : posts.length > 0 && (
              <Col md={8}>
                {filtered.map((post) => (
                  <Card 
                    data-testid={`card-post-${post._id}`} // Aggiunto un data-testid con post._id unico
                    key={post._id} 
                    className='mb-3 content__card__post'
                  >
                    <Row>
                      <Col md={4}>
                        <Card.Img
                          data-testid={'card-img'}
                          className='card__img__post'
                          src={post.cover ? post.cover : CoverDefault} 
                          alt={post.cover ? post.title : t('blog-posts.image')}
                        />
                      </Col>
                      <Col md={8}>
                        <Card.Body>
                          <CardHeader>
                            <div>
                              {post.author}<br />
                              <span>{t('blog-posts.tags')} {post.tags.join(' - ')}</span>
                              <span className='float-end'>{formatData(post.createdAt, 'it')}</span>
                            </div>
                          </CardHeader>
                          <Card.Title>
                            <p className='card__title__post'>{post.title}</p>
                          </Card.Title>
                            {post.description}
                        </Card.Body>
                        <Card.Footer>
                          <span className='title__category'>{t('blog-posts.categoria')} {post.category}</span>
                          <Link 
                            to={`/detail-post/${post._id}`}
                            className='link__post'
                          >
                            {t('blog-posts.leggi')}
                          </Link>
                        </Card.Footer>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Col>
            )
          }
          <Col md={4}>
            {/* Serach per titolo */}
            <Form.Control
              type='text'
              id='search-titolo-tags'
              aria-describedby={t('blog-posts.ricerca-titolo-tags')}
              placeholder={t('blog-posts.ricerca-titolo-tags')}
              value={search}
              onChange={handleSearch}
              className='mb-4 input__search__titolo'
            />
            {isLoading ? (
              <>
                {/* Placeholder per la sezione laterale durante il caricamento */}
                <SectionPlaceholder />
                <SectionPlaceholder />
                <SectionPlaceholder />
                <SectionPlaceholder />
                <SectionPlaceholder />
                <SectionPlaceholder />
              </>
            ) : (
              <>
                {/* Sezioni laterali con contenuti aggiuntivi */}
                <Prevention posts={posts} />
                <Behavior posts={posts} />
                <SeismicNews posts={posts} />
                <Comprehend posts={posts} />
                <AfterEarthquake posts={posts} />
                <Technology posts={posts} />
              </>
            )}
          </Col>
        </Row>

        {/* Paginazione per navigare tra le pagine dei post */}
        <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
          <div className='me-md-5 mb-3 mb-md-0'>
            {/* Selezione del numero di elementi per pagina */}
            <span className='text-white'>{t('blog-posts.pagination')}</span>
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
 
          <Pagination className='d-flex flex-wrap justify-content-center align-items-center mb-0'>
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

      </Container>
    </>
  );
}

export default BlogPosts;



