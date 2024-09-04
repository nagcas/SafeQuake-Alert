/*
 * Componente `DetailNews` (componente al momento non utilizzato)
 * 
 * Il componente `DetailNews` visualizza i dettagli di una notizia specifica basata su un titolo fornito tramite URL. Utilizza l'API di News per recuperare le informazioni e mostra il contenuto dell'articolo selezionato.
 * 
 * Funzionalità principali:
 * 
 * 1. **Recupero Articolo**:
 *    - Utilizza il titolo dell'articolo ottenuto tramite i parametri dell'URL per cercare l'articolo corrispondente nell'API di News.
 *    - L'API di News viene interrogata con una query predefinita che cerca articoli relativi a terremoti, vulcani e geologia in Italia.
 * 
 * 2. **Visualizzazione Articolo**:
 *    - Mostra i dettagli dell'articolo, inclusi l'immagine di copertura, il titolo, l'autore, la data di pubblicazione e il contenuto dell'articolo.
 *    - Se l'immagine di copertura non è disponibile, viene mostrata un'immagine di fallback.
 *    - Fornisce un link per leggere l'articolo completo e un link per tornare alla home page.
 * 
 * 3. **Gestione Stato**:
 *    - **Stato Articolo**: Gestisce lo stato dell'articolo tramite la variabile `article`. Se l'articolo non è ancora stato caricato, mostra uno spinner di caricamento.
 * 
 * Parametri del Componente:
 * 
 * - **`title`**: Titolo dell'articolo passato come parametro URL, utilizzato per cercare l'articolo specifico nell'API di News.
 * 
 * Stato e Funzioni:
 * 
 * - **Stato**:
 *   - `article`: Oggetto che contiene i dettagli dell'articolo trovato. Inizialmente impostato su `null` fino a quando l'articolo non è caricato.
 * 
 * - **Funzioni**:
 *   - `loadArticle`: Funzione asincrona che effettua una richiesta all'API di News per recuperare gli articoli e trova quello che corrisponde al titolo fornito. Imposta lo stato dell'articolo trovato o gestisce eventuali errori.
 * 
 * Uso e Integrazione:
 * 
 * Il componente `DetailNews` è ideale per applicazioni di news o articoli che necessitano di visualizzare i dettagli di un articolo specifico basato su un titolo dinamico. La gestione dello stato di caricamento e dei fallback per contenuti mancanti garantisce una buona esperienza utente.
 */

import './DetailNews.css';

import { useEffect, useState } from 'react';
import { Container, Image, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import formatData from '../../services/formatDate';
import { useTranslation } from 'react-i18next';

function DetailNews() {

  const { t } = useTranslation('global');

  const { title } = useParams(); // Ottieni il titolo dall'URL
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const NEWS_API = import.meta.env.VITE_NEWS_API_KEY;
    const NEWS_URL = `https://newsapi.org/v2/everything?q=(terremoto OR terremoti OR sismico OR sismologia OR vulcano OR vulcani OR vulcanologia OR geologia OR eruzione) AND Italia AND (studio OR ricerca OR monitoraggio OR scientifico)&language=it&apiKey=${NEWS_API}&pageSize=4&sortBy=relevancy`;

    const loadArticle = async () => {      
      try {
        const response = await fetch(NEWS_URL);
        const data = await response.json();

        // Trova l'articolo con il titolo corrispondente
        const foundArticle = data.articles.find(article => 
          article.title.toLowerCase() === decodeURIComponent(title.toLowerCase())
        );

        if (foundArticle) {
          setArticle(foundArticle); // Imposta l'articolo trovato
        } else {
          console.error(t('detail-news.error'));
        };
      } catch (error) {
        console.error(t('detail-news.error-message'), error.message);
      };
    };

    loadArticle();
  }, [title]);

  // Controlla se `article` è ancora null e mostra uno spinner con un messaggio
  if (!article) {
    return 
      (
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>{t('detail-news.caricamento')}</span>
        </Spinner>
      );
  };

  return (
    <>
      <div className='news__details__root'>
        <Container>
          <Image
            className='news__details__cover'
            src={article.urlToImage || '/default-image.jpg'} // Usa un'immagine di fallback se `urlToImage` è null
            alt={t('detail-news.image-articolo')}
            fluid
          />
          <h4 className='news__details__title'>{article.title}</h4>

          <div className='news__details__container'>
            <div className='news__details__author'>
              {article.author || t('detail-news.autore-sconosciuto')} {/* Controllo per autore */}
            </div>
            <div className='news__details__info'>
              {formatData(article.publishedAt, 'it')}
            </div>
          </div>

          <div className='content__article'>
            {article.content || t('detail-news.contenuto-non-disponibile')} {/* Controllo per contenuto */}
          </div>
          <a 
            className='float-start link__article__detail' 
            href={article.url} 
            target='_blank' rel='noopener noreferrer'
          >
            {t('detail-news.leggi-articolo')}
          </a>
          <Link to='/' className='float-end link__article__detail'>{t('detail-news.vai-a-home')}</Link>
        </Container>
      </div>
    </>
  );
}

export default DetailNews;

