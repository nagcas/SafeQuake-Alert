/*
 * HeroSafe Component
 *
 * Questo componente crea la sezione hero di una pagina web, che promuove l'iscrizione a un servizio di allerte sismiche in tempo reale.
 * L'elemento centrale del componente è una CTA che cambia dinamicamente a seconda dello stato di autenticazione dell'utente.
 *
 * Importazioni:
 * - `React`, `useContext`: Libreria principale e hook di React per l'accesso al contesto.
 * - `Button`: Componente di pulsante da `React-Bootstrap` per una facile stilizzazione e funzionalità.
 * - `Link`: Componente di routing da `react-router-dom` per la navigazione interna.
 * - `Context`: Contesto dell'applicazione, che fornisce lo stato di autenticazione dell'utente.
 * - `./HeroSafe.css`: Foglio di stile personalizzato per la sezione hero.
 *
 * Stato:
 * - `isLoggedIn`: Variabile proveniente dal contesto che indica se l'utente è autenticato.
 *
 * Struttura del Componente:
 * - Il componente è racchiuso in un `div` con una classe `content__hero__bg` che rappresenta lo sfondo della sezione hero.
 * - All'interno c'è un altro `div` con una classe `content__hero` che contiene:
 *    - Un titolo (`h1`) con il messaggio principale.
 *    - Un sottotitolo (`h3`) che rafforza il messaggio del titolo.
 *    - Un pulsante (`Button`) che funge da call to action (CTA).
 * - Il pulsante cambia dinamicamente il link e il testo a seconda dello stato di autenticazione dell'utente:
 *    - Se l'utente non è autenticato (`!isLoggedIn`), il pulsante indirizza alla pagina di registrazione (`/register`) con il testo "Iscriviti Ora".
 *    - Se l'utente è autenticato, il pulsante indirizza alla dashboard (`/dashboard`) con il testo "Vai alla Dashboard".
 *
 * Accessibilità:
 * - I bottoni sono dotati di attributi `aria-label` per migliorare l'accessibilità e descrivere la loro funzione ai lettori di schermo.
 *
 * Foglio di stile:
 * - Il file CSS `HeroSafe.css` dovrebbe contenere stili personalizzati per il layout e l'estetica della sezione hero, come la gestione dello sfondo, la formattazione del testo, e la stilizzazione dei bottoni.
 */


import './HeroSafe.css';

import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Context } from '../../../modules/Context';
import { useTranslation } from 'react-i18next';


function HeroSafe() {
  
  const { t } = useTranslation('global');

  const { isLoggedIn } = useContext(Context);

  return (
    <div className='content__hero__bg'>
      <div className='content__hero'>
        <h1 className='hero__title'>{t('hero-safe.hero-title')}</h1>
        <h3 className='hero__subtitle'>{t('hero-safe.hero-subtitle')}</h3>
        {!isLoggedIn ? (
          <Button 
            as={Link} 
            to='/register' 
            aria-label={t('hero-safe.Pulsante-iscriviti-ora')}
            className='btn__iscriviti'
          >
            {t('hero-safe.Iscriviti-Ora')}
          </Button>
        ) : (
          <Button
            as={Link}
            to='/dashboard'
            aria-label={t('hero-safe.Pulsante-vai-alla-dashboard')}
            className='btn__iscriviti'
          >
            {t('hero-safe.Vai-alla-Dashboard')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeroSafe;