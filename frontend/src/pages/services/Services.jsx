/*
 * Componente Services
 * 
 * Questo componente visualizza una pagina di servizi offerti da SafeQuake Alert, presentando diverse opzioni di servizi in una griglia di card.
 * Ogni card descrive un servizio specifico e include un pulsante per esplorare ulteriormente ogni servizio.
 * 
 */

import './Services.css';

import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import servicesIT from './services-it.json';
import servicesEN from './services-en.json';
import servicesES from './services-es.json';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Services() {

  const { t, i18n } = useTranslation('global');
  const [servicesText, setServicesText] = useState([]);

  const navigate = useNavigate();


  // Aggiorna il contenuto in base alla lingua selezionata
  useEffect(() => {
    if (i18n.resolvedLanguage === 'it') {
      setServicesText(servicesIT);
    } else if (i18n.resolvedLanguage === 'en') {
      setServicesText(servicesEN);
    } else {
      setServicesText(servicesES);
    };
  }, [i18n.resolvedLanguage]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container className='content__services'>
      <h2 className='title__services'>{t('services.title')}</h2>
      <Row className='d-flex justify-content-center'>
        <Col md={12}>
          <Card className='services__card'>
            <Card.Body> 
              <Row>
                {/* Il file json raccoglie tutti i servizi che vengono renderizzati nel componente */}
                {servicesText.map((service, index) => (
                  <Col key={index} md={6} className='mb-4'>
                    <Card className='service__item'>
                      <Card.Body>
                        <h4>{service.title}</h4>
                        <p>{service.content}</p>
                        <Button className='btn__services' onClick={() => handleNavigate(`${service.link}`)}>
                          {t('services.scopri')}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;