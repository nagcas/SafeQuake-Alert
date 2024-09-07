/*
 * Componente About
 * 
 * Questo componente presenta una panoramica dettagliata dell'applicazione "SafeQuake Alert".
 * 
 * Funzionalità:
 * - Mostra informazioni sul progetto, gli obiettivi, le funzionalità principali, le tecnologie utilizzate e i benefici.
 * - Fornisce dettagli su come utilizzare l'app e la motivazione alla base della scelta del progetto.
 * - Utilizza il layout di bootstrap per una visualizzazione responsive e ben strutturata.
 * 
 * Struttura:
 * - `Container`: Racchiude tutto il contenuto del componente.
 * - `Row`: Allinea i componenti `Card` in una griglia responsive.
 * - `Col`: Contiene il `Card` e gestisce la larghezza e l'allineamento.
 * - `Card`: Mostra il contenuto del progetto, diviso in sezioni con titoli e paragrafi.
 * 
 */

// Importa il file di stile per il componente About
import './About.css';

// Importa i componenti necessari da react-bootstrap per la struttura del layout
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'


function About() {

  const { t } = useTranslation('global');

  return (
    <Container className='content__about'>
      <Row className='d-flex justify-content-center'>
        <Col md={12}>
          <Card className='content__card'>
            <Card.Body>
              <h2>{t('about.title-about')}</h2>
              <p>
              <span className='fw-bold'>SafeQuake Alert</span> {t('about.object')}
              </p>
              <h3>{t('about.obiettivo')}</h3>
              <p>
                {t('about.paragrafo-2')}
              </p>
              <h3>{t('about.funzionalità')}</h3>
              <ul>
                <li><span className='fw-bold'>{t('about.registrazione')}</span> {t('about.registrazione-1')}</li>
                <li><span className='fw-bold'>{t('about.dashboard')}</span> {t('about.dashboard-1')}</li>
                <li><span className='fw-bold'>{t('about.sistema')}</span> {t('about.sistema-1')}</li>
                <li><span className='fw-bold'>{t('about.integrazione')}</span> {t('about.integrazione-1')}</li>
                <li><span className='fw-bold'>{t('about.chat')}</span> {t('about.chat-1')} </li>
              </ul>
              <h3>{t('about.tecnologie')}</h3>
              <ul>
                <li><span className='fw-bold'>{t('about.frontend')}</span> {t('about.frontend-1')}</li>
                <li><span className='fw-bold'>{t('about.backend')}</span> {t('about.backend-1')}</li>
                <li><span className='fw-bold'>{t('about.database')}</span> {t('about.database-1')}</li>
                <li><span className='fw-bold'>{t('about.notifiche')}</span> {t('about.notifiche-1')}</li>
                <li><span className='fw-bold'>{t('about.chat-2')}</span> {t('about.chat-3')}</li>
                <li><span className='fw-bold'>{t('about.news')}</span> {t('about.news-1')}</li>
                <li><span className='fw-bold'>{t('about.articoli')}</span> {t('about.articoli-1')}</li>
              </ul>
              <h3>{t('about.benefici')}</h3>
              <ul>
                <li><span className='fw-bold'>{t('about.sicurezza')}</span> {t('about.sicurezza-1')}</li>
                <li><span className='fw-bold'>{t('about.educazione')}</span> {t('about.educazione-1')}</li>
                <li><span className='fw-bold'>{t('about.aggiornamenti')}</span> {t('about.aggiornamenti-1')}</li>
                <li><span className='fw-bold'>{t('about.accessibilità')}</span> {t('about.accessibilità-1')}</li>
              </ul>
              <h3>{t('about.motivazioni')}</h3>
              <p>
                {t('about.progetto')}
              </p>
              <h3>{t('about.utilizzo')}</h3>
              <ol>
                <li>{t('about.registrati')}</li>
                <li>{t('about.accedi')}</li>
                <li>{t('about.configura')}</li>
                <li>{t('about.consulta')}</li>
                <li>{t('about.utilizza')}</li>
              </ol>
              <h3>{t('about.conclusione')}</h3>
              <p>
                {t('about.innovativo')}
              </p>
            </Card.Body>
            <Card.Footer>
              {t('about.staff')} SafeQuake Alert by Gianluca Chiaravalloti
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
