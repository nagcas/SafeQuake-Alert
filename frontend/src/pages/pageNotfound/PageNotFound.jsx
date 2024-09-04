/*
 * Componente React per visualizzare una pagina di errore 404 (Pagina non trovata).
 * 
 * Questo componente viene visualizzato quando l'utente tenta di accedere a una pagina 
 * che non esiste o non è disponibile. Fornisce un messaggio di errore e suggerisce 
 * alcuni motivi comuni per cui si potrebbe verificare un errore 404.
 * 
 * Utilizza React Bootstrap per la struttura della pagina e la gestione dei contenuti.
 * 
 * Variabili e stati:
 * - `t`: funzione di traduzione fornita da `react-i18next` per localizzare il contenuto.
 * 
 * Render:
 * - Mostra un'intestazione con il codice di stato "404".
 * - Visualizza un messaggio di errore e una spiegazione che potrebbe aiutare l'utente a capire
 *   il motivo dell'errore.
 * - Fornisce un elenco di possibili cause dell'errore 404, utilizzando la traduzione per 
 *   ciascun elemento dell'elenco.
 * - Include un link che rimanda alla home page del sito, permettendo all'utente di tornare 
 *   alla pagina principale.
 * 
 * Utilizza:
 * - `Container` di React Bootstrap per la disposizione e il layout del contenuto.
 * - `Link` di `react-router-dom` per navigare verso la home page.
 * - `useTranslation` di `react-i18next` per la traduzione del testo.
 * 
 * Stili:
 * - Importa il file CSS `PageNotFound.css` per lo stile specifico della pagina 404.
 */


import './PageNotFound.css';

import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function PageNotFound() {

  const { t } = useTranslation('global');

  return (
    <>
    <Container className='page__not__found'>
      <div className='content'>
        <h1>404</h1>
        <h4>{t('not-found.opps')}</h4>
        <p>{t('not-found.msg')}</p>
        <p>{t('not-found.cause')}</p>
        <ul>
          <li><span className='fw-bold'>{t('not-found.url-1')}</span> {t('not-found.url-2')}</li>
          <li><span className='fw-bold'>{t('not-found.pagina-1')}</span> {t('not-found.pagina-2')}</li>
          <li><span className='fw-bold'>{t('not-found.collegamento-1')}</span> {t('not-found.collegamento-2')}</li>
          <li><span className='fw-bold'>{t('not-found.server-1')}</span> {t('not-found.server-2')}</li>
          <li><span className='fw-bold'>{t('not-found.configurazione-1')}</span> {t('not-found.configurazione-2')}</li>
          <li><span className='fw-bold'>{t('not-found.problema-interno-1')}</span> {t('not-found.problema-interno-2')}</li>
          <li><span className='fw-bold'>{t('not-found.problema-temporaneo-1')}</span> {t('not-found.problema-temporaneo-2')}</li>
          <li><span className='fw-bold'>{t('not-found.accesso-negato-1')}</span> {t('not-found.accesso-negato-2')}</li>
        </ul>
        <Link to='/' className='home'>{t('not-found.home')}</Link>
      </div>
    </Container>
  </>
  );
};

export default PageNotFound;