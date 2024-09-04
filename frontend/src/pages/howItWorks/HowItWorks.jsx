/*
 * Componente React per visualizzare la sezione "Come funziona" del sito.
 * 
 * Questo componente fornisce informazioni su come utilizzare il sito o servizio. 
 * La visualizzazione del contenuto varia a seconda dello stato di autenticazione dell'utente.
 * Se l'utente è autenticato, viene mostrata una serie di istruzioni dettagliate; 
 * se non lo è, viene visualizzato un messaggio con un link per accedere al sistema.
 * 
 * Utilizza React Bootstrap per la struttura della pagina e la gestione dei contenuti.
 * 
 * Stati e variabili:
 * - `t`: funzione di traduzione fornita da `react-i18next` per la localizzazione del contenuto.
 * - `userLogin`: valore dal contesto che rappresenta le informazioni dell'utente autenticato.
 * - `isLoggedIn`: booleano dal contesto che indica se l'utente è autenticato o meno.
 * 
 * Render:
 * - Se l'utente è autenticato (`userLogin` e `isLoggedIn` sono veri):
 *   - Mostra vari paragrafi e liste con istruzioni su come utilizzare il servizio.
 *   - I testi sono tradotti in base alla lingua corrente, utilizzando la funzione `t` per la localizzazione.
 *   - Le parti del testo vengono evidenziate con classi CSS per formattare le parti importanti.
 * 
 * - Se l'utente non è autenticato:
 *   - Mostra un messaggio che invita l'utente a effettuare l'accesso.
 *   - Fornisce un link per la pagina di login.
 * 
 * Utilizza:
 * - `useContext` di React per accedere ai dati di autenticazione tramite il contesto `Context`.
 * - `Link` di `react-router-dom` per navigare verso la pagina di login.
 * - `Container` di React Bootstrap per la disposizione dei contenuti.
 * - `useTranslation` di `react-i18next` per la traduzione del testo.
 * 
 * Stili:
 * - Importa il file CSS `HowItWorks.css` per lo stile specifico del componente.
 */


// Importa il file di stile per il componente howItWorks
import './HowItWorks.css';

// Importa i componenti necessari da React e React Router
import { useContext } from 'react';
import { Context } from '../../modules/Context.jsx';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


function HowItWorks() {

  const { t } = useTranslation('global');

  // Ottieni userLogin e isLoggedIn dal contesto
  const { userLogin, isLoggedIn } = useContext(Context);

  return (
    <Container className='content__how__it__works'>
      {(userLogin && isLoggedIn) ? (
        // Se l'utente è autenticato, visualizza il contenuto relativo ai consigli
        <>
          <h2 className='text-center mb-4'>{t('how-it-works.text-1')}</h2>
      
          <p><span className='fw-bold'>{t('how-it-works.text-2')}</span>{t('how-it-works.text-2')} </p>
      
          <h2 className='mb-4'>{t('how-it-works.text-3')}</h2>
          <ol>
              <li><span className='fw-bold'>{t('how-it-works.text-4')}</span>{t('how-it-works.text-5')} </li>
              <li><span className='fw-bold'>{t('how-it-works.text-6')}</span>{t('how-it-works.text-7')}  <span className='fw-bold'>{t('how-it-works.text-8')}</span>{t('how-it-works.text-9')}</li>
          </ol>
      
          <div className='important-note'>
              <p><span className='fw-bold'>{t('how-it-works.text-10')}</span>{t('how-it-works.text-11')}  <span className='fw-bold'>{t('how-it-works.text-12')}</span>{t('how-it-works.text-13')} <span className='fw-bold'>{t('how-it-works.text-14')}</span>{t('how-it-works.text-15')}</p>
          </div>
      
          <ol start='3'>
              <li><span className='fw-bold'>{t('how-it-works.text-16')}</span>{t('how-it-works.text-17')}  <span className='fw-bold'>{t('how-it-works.text-18')}</span>{t('how-it-works.text-19')}</li>
          </ol>
      
          <p>{t('how-it-works.text-20')} <span className='fw-bold'>{t('how-it-works.text-21')}</span>{t('how-it-works.text-22')}  <span className='fw-bold'>{t('how-it-works.text-23')}</span>{t('how-it-works.text-24')}</p>
      
          <h2 className='mb-4'>{t('how-it-works.text-25')}</h2>
          <ul>
              <li><span className='fw-bold'>{t('how-it-works.text-26')}</span>{t('how-it-works.text-27')} </li>
              <li><span className='fw-bold'>{t('how-it-works.text-28')}</span>{t('how-it-works.text-29')} </li>
              <li><span className='fw-bold'>{t('how-it-works.text-30')}</span>{t('how-it-works.text-31')} </li>
              <li><span className='fw-bold'>{t('how-it-works.text-32')}</span>{t('how-it-works.text-34')} </li>
              <li><span className='fw-bold'>{t('how-it-works.text-35')}</span>{t('how-it-works.text-36')} </li>
          </ul>
      
          <h2 className='mb-4'>{t('how-it-works.text-37')}</h2>
          <ol>
              <li>{t('how-it-works.text-38')}</li>
              <li>{t('how-it-works.text-39')} <span className='fw-bold'>{t('how-it-works.text-40')}</span>.</li>
              <li>{t('how-it-works.text-41')} <span className='fw-bold'>{t('how-it-works.text-42')}</span>{t('how-it-works.text-43')} </li>
              <li>{t('how-it-works.text-44')}</li>
              <li>{t('how-it-works.text-45')}</li>
          </ol>
        </>
      ) : (
        // Se l'utente non è autenticato, mostra un messaggio e un link per il login
        <Container>
          <h4 className='title__content__how__it__works__access gap-2'>
          {t('how-it-works.accedere')}accedere
            <Link to='/login' className='access__content__how__it__works'>{t('how-it-works.login')}login</Link>
          </h4>
        </Container>
      )}
    </Container>
  );
}

export default HowItWorks;
