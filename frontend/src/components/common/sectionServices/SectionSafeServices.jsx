/*
 * Componente `SectionSafeServices`
 *
 * Descrizione:
 * Questo componente visualizza due sezioni principali di servizi offerti dall'applicazione "SafeQuake Alert".
 * Utilizza la libreria `AOS` (Animate On Scroll) per aggiungere animazioni al momento dello scorrimento nella vista.
 *
 * Funzionalità:
 * - **Sezione dei Servizi:** Mostra tre servizi principali dell'applicazione in una griglia. Ogni servizio è rappresentato da un'icona e una breve descrizione.
 *   1. Notifiche Immediate
 *   2. Mappa Interattiva
 *   3. Aggiornamenti e Notizie
 * - **Sezione Dettagliata:** Presenta due carte con informazioni dettagliate sui servizi aggiuntivi dell'applicazione:
 *   1. Consigli Personalizzati (con un'immagine di supporto)
 *   2. Chat in Tempo Reale (con un'altra immagine di supporto)
 *
 * Utilizzo:
 * - Utilizzato per fornire una panoramica dei principali servizi dell'applicazione e per descrivere in dettaglio le funzionalità avanzate.
 */

import './SectionSafeServices.css';

import React, { useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Aos from 'aos';
import 'aos/dist/aos.css';
import cardImage__1 from '../../../assets/images/mika-baumeister-oZogEz5VXeQ-unsplash.jpg';
import cardImage__2 from '../../../assets/images/viralyft-WcB22amJWco-unsplash.jpg';
import { useTranslation } from 'react-i18next';


function SectionSafeServices() {

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
    <Container fluid>
      {/* Sezione dei Servizi Principali */}
      <Row className='d-flex justify-content-center content__safe__services__one gap-4' data-aos='fade-down'>
        <Col md={12} lg={3} className='content__services__safe__one shadow'>
          <div className='d-flex justify-content-center align-content-center content__services__icons'>
          <i className='bi bi-telegram'></i>
          </div>
          <h2>{t('section-safe-services.services-title-bot-telegram')}</h2>
          <p>
            {t('section-safe-services.services-subtitle-bot-telegram')}
          </p>
        </Col>
        <Col md={12} lg={3} className='content__services__safe__one shadow'>
          <div className='d-flex justify-content-center align-content-center content__services__icons'>
            <i className='bi bi-bell'></i>
          </div>
          <h2>{t('section-safe-services.services-title-1')}</h2>
          <p>
            {t('section-safe-services.services-subtitle-1')}
          </p>
        </Col>
        <Col md={12} lg={3} className='content__services__safe__one shadow'>
          <div className='d-flex justify-content-center align-content-center content__services__icons'>
            <i className='bi bi-globe-europe-africa'></i>
          </div>
          <h2>{t('section-safe-services.services-title-2')}</h2>
          <p>
          {t('section-safe-services.services-subtitle-2')}
          </p>
        </Col>
        <Col md={12} lg={3} className='content__services__safe__one shadow'>
          <div className='d-flex justify-content-center align-content-center content__services__icons'>
            <i className='bi bi-newspaper'></i>
          </div>
          <h2>{t('section-safe-services.services-title-3')}</h2>
          <p>
          {t('section-safe-services.services-subtitle-3')}
          </p>
        </Col>
      </Row>

      {/* Sezione Dettagliata con Immagini e Descrizioni */}
      <Row className='content__safe__services__two'>
        <Col md={12} data-aos='zoom-in'>
          <Card className='d-flex flex-column flex-md-row-reverse align-items-center content__services__two'>
            <Card.Img className='image__card__services' src={cardImage__1} />
            <Card.Body className='d-flex flex-column align-content-center'>
              <Card.Title className='card__title__services'>{t('section-safe-services.content-title-1')}</Card.Title>
              <Card.Text className='card__text'>
                {t('section-safe-services.content-1')}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} data-aos='zoom-in'>
          <Card className='d-flex flex-column flex-sm-row align-items-center content__services__two'>
            <Card.Img className='image__card__services' src={cardImage__2} />
            <Card.Body className='d-flex flex-column align-content-center'>
              <Card.Title className='card__title__services'>{t('section-safe-services.content-title-2')}</Card.Title>
              <Card.Text className='card__text'>
                {t('section-safe-services.content-2')}
              </Card.Text>
            </Card.Body>  
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SectionSafeServices;
