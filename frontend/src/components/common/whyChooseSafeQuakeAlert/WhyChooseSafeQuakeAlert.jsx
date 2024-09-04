/*
 * Componente `WhyChooseSafeQuakeAlert`
 *
 * Descrizione:
 * Questo componente presenta i motivi principali per cui gli utenti dovrebbero scegliere "SafeQuake Alert".
 * Utilizza la libreria `AOS` (Animate On Scroll) per aggiungere animazioni al momento dello scorrimento nella vista.
 *
 * Funzionalità:
 * - **Titolo della Sezione:** Mostra un'intestazione centrale che introduce i motivi per scegliere il servizio.
 * - **Schede di Caratteristiche:** Quattro schede che illustrano i principali benefici del servizio, ciascuna con un'icona, un titolo e una breve descrizione.
 *   1. Sicurezza Pubblica
 *   2. Informazione e Educazione
 *   3. Accessibilità Ovunque
 *   4. Personalizzazione Avanzata
 *
 * Utilizzo:
 * - Utilizzato per evidenziare i principali punti di forza del servizio "SafeQuake Alert" e per attrarre nuovi utenti.
 */

import './WhyChooseSafeQuakeAlert.css';

import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';


function WhyChooseSafeQuakeAlert() {

  const { t } = useTranslation('global');

  useEffect(() => {
    Aos.init({
      offset: 200, // Distanza dalla vista quando l'animazione inizia
      duration: 600, // Durata dell'animazione in millisecondi
      easing: 'ease-in-sine', // Tipo di easing per l'animazione
      delay: 100, // Ritardo prima dell'inizio dell'animazione
    });
  }, []);

  return (
    <Container fluid className='why-choose-safequake-alert'>
      {/* Titolo della Sezione */}
      <h2 className='text-center'>{t('why-choose-safe.title')}</h2>

      {/* Schede di Caratteristiche */}
      <Row className='d-flex justify-content-center gap-4'>
        {/* Scheda 1: Sicurezza Pubblica */}
        <Col md={6} className='feature-card shadow' data-aos='fade-down'>
          <div className='icon-container d-flex justify-content-center align-content-center'>
            <i className='bi bi-shield'></i>
          </div>
          <h3>{t('why-choose-safe.title-1')}</h3>
          <p>{t('why-choose-safe.content-1')}</p>
        </Col>

        {/* Scheda 2: Informazione e Educazione */}
        <Col md={6} className='feature-card shadow' data-aos='fade-down'>
          <div className='icon-container d-flex justify-content-center align-content-center'>
            <i className='bi bi-book'></i>
          </div>
          <h3>{t('why-choose-safe.title-2')}</h3>
          <p>{t('why-choose-safe.content-2')}</p>
        </Col>

        {/* Scheda 3: Accessibilità Ovunque */}
        <Col md={6} className='feature-card shadow' data-aos='fade-down'>
          <div className='icon-container d-flex justify-content-center align-content-center'>
            <i className='bi bi-globe'></i>
          </div>
          <h3>{t('why-choose-safe.title-3')}</h3>
          <p>{t('why-choose-safe.content-3')}</p>
        </Col>

        {/* Scheda 4: Personalizzazione Avanzata */}
        <Col md={6} className='feature-card shadow' data-aos='fade-down'>
          <div className='icon-container d-flex justify-content-center align-content-center'>
            <i className='bi bi-gear'></i>
          </div>
          <h3>{t('why-choose-safe.title-4')}</h3>
          <p>{t('why-choose-safe.content-4')}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default WhyChooseSafeQuakeAlert;


