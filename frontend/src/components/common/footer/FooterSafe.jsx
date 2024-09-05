/*
 * FooterSafe Component
 *
 * Questo componente crea il footer di un sito web o applicazione denominata "SafeQuake Alert". 
 * Il footer contiene tre sezioni principali: informazioni sull'app, contatti e collegamenti ai social media. 
 * Inoltre, include un testo di copyright e un'attribuzione dell'autore.
 *
 * Importazioni:
 * - `React`: Libreria principale per la costruzione di componenti UI.
 * - `Container`, `Row`, `Col`: Componenti di layout di `React-Bootstrap` utilizzati per creare una struttura a griglia responsiva.
 * - `./FooterSafe.css`: Foglio di stile personalizzato per il componente FooterSafe.
 *
 * Stato:
 * - `currentYear`: Variabile che contiene l'anno corrente, utilizzato per visualizzare l'anno dinamicamente nel testo di copyright.
 *
 * Struttura del componente:
 * - Il componente è racchiuso in un tag `<footer>` con una classe `footer` definita nel foglio di stile `FooterSafe.css`.
 * - Utilizza un `<Container>` per contenere l'intero layout, suddiviso in due righe (`Row`).
 * - La prima riga (`Row`) contiene tre colonne (`Col`):
 *    - Colonna 1: Descrizione dell'app "SafeQuake Alert" con un titolo e un breve paragrafo.
 *    - Colonna 2: Informazioni di contatto con titolo, email e numero di telefono.
 *    - Colonna 3: Collegamenti ai social media con icone che rimandano a Facebook, Twitter, e LinkedIn.
 * - La seconda riga (`Row`) contiene il testo di copyright e un'attribuzione dell'autore.
 *
 * Accessibilità:
 * - I collegamenti ai social media utilizzano gli attributi `target='_blank'` e `rel='noopener noreferrer'` per garantire la sicurezza e l'apertura dei link in nuove schede.
 *
 * Foglio di stile:
 * - Il file CSS `FooterSafe.css` dovrebbe contenere stili personalizzati per il componente, come il layout delle icone sociali e la formattazione del testo.
 */


import './FooterSafe.css';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function FooterSafe() {

  const { t } = useTranslation('global');

  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <Container>
        <Row className='d-flex justify-content-center align-items-center'>
          <Col md={3} className='text-center'>
            <Link to='/' className='logo-link'>
              <h5>SafeQuake Alert</h5>
            </Link>
            <p>{t('footer-safe.Proteggere-le-persone-con-allerte-sismiche-tempestive-e-informazioni-educative')}</p>
          </Col>
          <Col md={3} className='text-center'>
            <Link to='/contacts' className='contacts-link'>
              <h5>{t('footer-safe.Contatti')}</h5>
            </Link>
            <p>Email: info@safequakealert.com</p>
            <p>{t('footer-safe.Telefono')}: +39 123 456 789</p>
          </Col>
          <Col md={3} className='text-center'>
            <Link to='/about' className='about-link'>
              <h5>{t('footer-safe.About')}About</h5>
            </Link>
              <p>{t('footer-safe.About-text')}</p>
          </Col>
          <Col md={3} className='text-center mb-3'>
            <h5>{t('footer-safe.Seguici')}</h5>
            <div className='social-icons'>
              <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer' data-testid='facebook-link'>
                <i className='bi bi-facebook'></i>
              </a>
              <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer' data-testid='twitter-link'>
                <i className='bi bi-twitter'></i>
              </a>
              <a href='https://www.linkedin.com/in/gianluca-chiaravalloti-5694081a2/' target='_blank' rel='noopener noreferrer' data-testid='linkedin-link'>
                <i className='bi bi-linkedin'></i>
              </a>
              <a href='https://github.com/nagcas' target='_blank' rel='noopener noreferrer' data-testid='github-link'>
                <i className='bi bi-github'></i>
              </a>
            </div>
          </Col>
        </Row>
        <Row className='mt-4 border__top'>
          <Col className='text-center mt-4'>
            <p>&copy; {currentYear} SafeQuake Alert.</p>
            <p>by Gianluca Chiaravalloti</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterSafe;
