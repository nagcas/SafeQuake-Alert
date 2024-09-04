/*
 * Componente `DetailPost`
 * 
 * Il componente `DetailPost` visualizza i dettagli di un post del blog selezionato, inclusi titolo, autore, categoria, data di creazione, contenuto e commenti associati. Gestisce anche lo stato di caricamento e fornisce un'interfaccia per l'interazione dell'utente con i commenti.
 * 
 * Funzionalità principali:
 * 
 * 1. **Recupero dei Dati**:
 *    - Utilizza l'ID del post ottenuto tramite i parametri dell'URL per recuperare i dettagli del post e i commenti associati dall'API.
 *    - La funzione `fetchPost` esegue una chiamata API autenticata per ottenere i dati del post e aggiorna lo stato del componente con le informazioni ricevute.
 * 
 * 2. **Visualizzazione**:
 *    - Mostra un'immagine di copertura per il post, con un'immagine di fallback se non è disponibile una copertura specifica.
 *    - Visualizza il titolo, autore, categoria e data di creazione del post.
 *    - Mostra il contenuto del post come HTML, per supportare il rich text formatting.
 * 
 * 3. **Gestione Commenti**:
 *    - Mostra una lista di commenti tramite il componente `CommentList`, se l'utente è autenticato.
 *    - Se l'utente non è autenticato, visualizza un messaggio di avviso con link per registrarsi o effettuare il login.
 * 
 * 4. **Stato e Funzioni**:
 *    - **Stato**:
 *      - `post`: Oggetto che contiene i dettagli del post.
 *      - `comments`: Array di commenti associati al post.
 *      - `loading`: Booleano che indica se i dati sono ancora in fase di caricamento.
 * 
 *    - **Funzioni**:
 *      - `fetchPost`: Funzione asincrona per caricare i dati del post e dei commenti, gestendo lo stato di caricamento e eventuali errori.
 *      - `updateComments`: Funzione per aggiornare la lista dei commenti quando nuovi commenti vengono aggiunti.
 * 
 * 5. **Gestione dello Stato di Caricamento**:
 *    - Mostra uno spinner di caricamento fino a quando i dati non sono completamente recuperati.
 * 
 * Uso e Integrazione:
 * 
 * Il componente `DetailPost` è adatto per applicazioni di blogging o contenuti simili dove è necessario visualizzare dettagli specifici di un post e gestire interazioni come la visualizzazione e l'aggiunta di commenti. La gestione dello stato di caricamento e dei fallback per contenuti mancanti garantisce una buona esperienza utente.
 */

import './DetailPost.css'; // Importa gli stili per il componente Blog.

import React, { useContext, useCallback, useEffect, useState } from 'react'; // Importa hook React necessari.
import { Alert, Container, Image, Spinner } from 'react-bootstrap'; // Importa componenti di Bootstrap.
import { Link, useParams } from 'react-router-dom'; // Importa hook per il routing.
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx'; // Importa la funzione per le chiamate API con autenticazione.
import { Context } from '../../modules/Context.jsx'; // Importa il contesto per lo stato di autenticazione.
import formatData from '../../services/formatDate.jsx'; // Importa la funzione per formattare le date.
import CoverDefault from '../../assets/images/javier-miranda-Jn2EaLLYZfY-unsplash.jpg'; // Importa l'immagine di default per il blog.
import CommentList from '../../components/commentArea/CommentList';
import { useTranslation } from 'react-i18next';

function DetailPost() {

  const { t } = useTranslation('global');

  // Ottiene lo stato di autenticazione dal contesto.
  const { isLoggedIn } = useContext(Context);

  // Ottiene l'ID del blog dalla URL.
  const { id } = useParams();

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  

  // Stati per il blog, i commenti e il caricamento.
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funzione per caricare i dati del blog e dei commenti.
  const fetchPost = useCallback(async () => {
    setLoading(true); // Imposta lo stato di caricamento su vero.
    try {
      // Effettua una chiamata API per ottenere i dati del blog.
      const response = await fetchWithAuth(`${API_URL}/api/posts/${id}`);
      // Imposta i dati del blog e i commenti nello stato.
      setPost(response);
      setComments(response.comments || []); // Imposta i commenti, o un array vuoto se non ci sono commenti.
    } catch (error) {
      // Gestisce eventuali errori di caricamento.
      console.error(t('detail-post.error'), error);
    } finally {
      // Imposta lo stato di caricamento su falso dopo il caricamento.
      setLoading(false);
    };
  }, [API_URL, id]);

  // Effetto per caricare i dati del blog quando il componente viene montato.
  useEffect(() => {
    fetchPost(); // Chiama la funzione per caricare i dati del blog.
  }, [fetchPost]); // Ricarica i dati quando cambia fetchBlog.

  // Funzione per aggiornare i commenti.
  const updateComments = (newComments) => {
    fetchPost();
    //setComments(newComments); // Aggiorna lo stato dei commenti.
  };

  // Mostra uno spinner di caricamento mentre i dati sono in fase di recupero.
  if (loading) {
    return (
      <div className='text-center'>
        <Spinner animation='border' variant='secondary' className='mx-5' /> {/* Spinner di Bootstrap */}
      </div>
    );
  }

  return (
    <div className='post__details__root'>
      <Container>
        {/* Immagine di copertura del blog */}
        <Image
          className='post__details__cover shadow'
          src={post.cover ? post.cover : CoverDefault} // Mostra l'immagine di default se blog.cover non esiste.
          alt={post.cover ? post.title : t('detail-post.copertina-default')} // Imposta l'attributo alt in base alla presenza della cover
          fluid
        />
        <h1 className='post__details__title'>{post.title}</h1> {/* Titolo del blog */}
        <div className='post__details__container'>
          <p className='post__details__author'>{post.author}</p>
          <p className='post__details__category'>{post.category}</p>
          <div className='post__details__info'> 
            {formatData(post.createdAt, 'it')} 
          </div>
        </div>
        <div className='content__description'>
          {post.description}
        </div>
        
        <div className='content__post' dangerouslySetInnerHTML={{ __html: post.content }}></div> {/* Contenuto del post */}
        {isLoggedIn ? (
          <CommentList id={post._id} comments={comments} updateComments={updateComments} />
        ) : (
          <Alert className='mt-4 text-center' variant='light'>
            {t('detail-post.commento')} {' '} 
            <Link to='/register' className='link-register'>
            {t('detail-post.registrati')}{' '}
            </Link> 
            {t('detail-post.vai')}{' '} 
            <Link to='/login' className='link-login'>
            {t('detail-post.login')}{' '}
            </Link>
          </Alert> 
        )}
        <Link to='/blog-posts' className='float-end link__article__detail'>{t('detail-post.vai-ai-posts')}</Link>
      </Container>
    </div>
  );
};

export default DetailPost; // Esporta il componente Blog.