/*
 * `News` Component (Componente al momento non utilizzato)
 *
 * Questo componente recupera e visualizza le ultime notizie riguardanti eventi sismici, vulcanici e geologici in Italia.
 * Utilizza l'API di notizie (NewsAPI) per ottenere articoli rilevanti e mostra un massimo di 4 articoli in una griglia
 * responsive. Include animazioni di scroll con la libreria AOS per migliorare l'esperienza utente.
 *
 * - **Stato `articles`**: Memorizza gli articoli delle notizie recuperati dall'API.
 * - **Effetti**:
 *   - `useEffect` per inizializzare AOS con opzioni di offset, durata, easing e delay.
 *   - `useEffect` per effettuare una richiesta GET all'API di notizie e gestire la risposta.
 *
 * - **Rendering**:
 *   - Mostra un titolo e un sottotitolo informativo per la sezione delle notizie.
 *   - Visualizza gli articoli in una griglia responsive usando il layout di Bootstrap.
 *   - Ogni articolo è mostrato in una card che include un'immagine, data di pubblicazione, titolo, descrizione e un link
 *     per leggere l'articolo completo.
 *
 * - **Gestione Errori**: Stampa errori nella console in caso di problemi durante la richiesta all'API.
 *
 * **Dependencies**:
 * - `react`: Per la creazione e gestione dei componenti.
 * - `react-bootstrap`: Per i componenti di interfaccia utente come `Card`, `Col`, `Row`, e `Container`.
 * - `aos`: Per le animazioni di scroll.
 * - `formatDate`: Per formattare le date degli articoli in base al locale italiano.
 */

import { Link } from 'react-router-dom';
import './News.css';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import formatData from '../../services/formatDate';
import CoverDefault from '../../assets/images/javier-miranda-Jn2EaLLYZfY-unsplash.jpg'; // Importa un'immagine di copertura predefinita per i post del blog
import { fetchWithAuth } from '../../services/fetchWithAuth';
import { useTranslation } from 'react-i18next';

function News() {

  const { t } = useTranslation('global'); 

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Stato per memorizzare gli articoli delle notizie
  const [articles, setArticles] = useState([]);
  const [limit, setLimit] = useState(4); // Numero di post per pagina

  useEffect(() => {
    // Inizializzazione della libreria AOS per animazioni
    Aos.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  useEffect(() => {
    // Funzione per recuperare gli articoli delle notizie
    const fetchArticles = async () => {
      try {
        // Effettua la richiesta GET all'API
        const response = await fetch(`${API_URL}/api/posts?limit=${limit}&sort=createdAt&sortDirection=desc`);
        
        // Verifica se la risposta è andata a buon fine
        if (!response.ok) {
          throw new Error(`${t('news.error-response')} ${response.status}`);
        };

        // Converte la risposta in JSON
        const data = await response.json();
        setArticles(data.posts || []); // Assicurati che il campo sia corretto
        // console.log(data);
      } catch (error) {
        // Gestisce eventuali errori nella richiesta
        console.error(t('news.error'), error.message);
      };
    };

    fetchArticles(); // Richiama la funzione per ottenere gli articoli
  }, [API_URL, limit, t]);

  return (
    <Container fluid className='content__news'>
      <h4 className='title__news fw-bold'>{t('news.title-news')}</h4>
      <h5 className='subtitle__news'>{t('news.subtitle-news')}</h5>
      <Row className='mt-4'>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Col key={article._id} sm={12} md={3} className='mb-4 d-flex'>
              <Card className='content__card' data-aos='zoom-in-down'>
                <Card.Img
                  className='card__img__post'
                  src={article.cover ? article.cover : CoverDefault} 
                  alt={article.cover ? article.title : t('blog-posts.image')}  
                />
                <Card.Body className='d-flex flex-column'>
                  <Card.Text className='text-muted text__date'>{formatData(article.createdAt, 'it')}</Card.Text>
                  <Card.Title className='fw-bold title__article'>{article.title}</Card.Title>
                  <Card.Text className='content__text__article'>
                    {article.description}
                  </Card.Text>
                  <Card.Footer className='mt-auto'>
                    <Link 
                      to={`/detail-post/${article._id}`} 
                      className='link__article'
                    >
                      {t('news.read-article')}
                    </Link>
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className='text-center'>
            <p>{t('news.no-articles')}</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default News;


