/*
 * `Dashboard` è un componente React che funge da cruscotto principale dell'applicazione.
 * 
 * Mostra una panoramica delle informazioni principali per gli utenti autenticati e offre
 * un'interfaccia per gestire e visualizzare diverse categorie di dati.
 * 
 * Funzionalità principali:
 * - Visualizzazione di statistiche e informazioni recenti come eventi sismici, numero di utenti, posts e messaggi.
 * - Offerta di schede per la gestione di utenti, posts e messaggi.
 * - Visualizzazione di eventi sismici recenti e forti su una mappa.
 * - Condizioni di accesso basate sul ruolo dell'utente.
 * 
 * - Elemento che rappresenta la dashboard.
 */

import './Dashboard.css';

import { useContext, useState } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ListsUsers from './listsUsers/ListsUsers';
import ListsPosts from './listsPosts/ListsPosts';
import ListsSismicEvents from './listsSismicEvents/ListsSismicEvents';
import SismicMap from './sismicMap/SismicMap';
import ListsMessages from './listsMessages/ListsMessages';
import ListsAdvices from './ListsAdvices/ListsAdvices';
import { Context } from '../../modules/Context';
import { useNotification } from '../../modules/NotificationContext';
import { useTranslation } from 'react-i18next';
import ListsTelegramId from './listTelegramId/ListsTelegramId';


function Dashboard() {

  const { t } = useTranslation('global');

  // Recupera il contesto dell'autenticazione e del login dell'utente
  const { isLoggedIn, userLogin } = useContext(Context);

  // Stati per memorizzare i dati recenti
  const [latestUsers, setLatestUsers] = useState(null);
  const [latestSismicEvent, setLatestSismicEvent] = useState(null);
  const [latestSismicEventHigh, setLatestSismicEventHigh] = useState(null);
  const [latestContacts, setLatestContacts] = useState(null);
  const [latestPosts, setLatestPosts] = useState(null);

  return (
    <Container fluid className='content__dashboard'>
      {isLoggedIn ? (
        <>
          {userLogin && userLogin.role === 'admin' && (
            <>
              {/* Sezione di statistiche con cards */}
              <Row className='d-flex justify-content-center'>
                {/* Card per l'ultimo evento sismico */}
                <Col md={12} lg={2}>
                  <div className='content__last__event'>
                    <div className='icons__last__event'>
                      <i className='bi bi-activity icons'></i>
                    </div>
                    <h4 className='title__last__event'>{t('dashboard.title-last-event')}</h4>
                    <h5 className='info'>
                      {latestSismicEvent ? (
                        <>
                          {latestSismicEvent.properties.place}
                          <br />
                          Mag. {latestSismicEvent.properties.mag}
                        </>
                      ) : (
                        t('dashboard.nessun-evento-recente')
                      )}
                    </h5>
                  </div>
                </Col>
                {/* Card per l'evento sismico più forte */}
                <Col md={12} lg={2}>
                  <div className='content__high__event'>
                    <div className='icons__high__event'>
                      <i className='bi bi-lightning-charge icons'></i>
                    </div>
                    <h4 className='title__high__event'>{t('dashboard.title-high-event')}</h4>
                    <h5 className='info'>
                      {latestSismicEventHigh ? (
                        <>
                          {latestSismicEventHigh.properties.place} 
                          <br />
                          Mag. {latestSismicEventHigh.properties.mag}
                        </>
                      ) : (
                        t('dashboard.nessun-evento-recente')
                      )}
                    </h5>
                  </div>
                </Col>
                {/* Card per il numero totale degli utenti registrati */}
                <Col md={12} lg={2}>
                  <div className='content__registered__users'>
                    <div className='icons__registered__users'>
                      <i className='bi bi-person icons'></i>
                    </div>
                    <h4 className='title__registered__users'>{t('dashboard.title-registered-users')}</h4>
                    <h5 className='info'>
                      {latestUsers ? latestUsers + ' ' + t('dashboard.users') : ' ' + t('dashboard.no-utente')}
                    </h5>
                  </div>
                </Col>
                {/* Card per il numero totale dei posts pubblicati */}
                <Col md={12} lg={2}>
                  <div className='content__published__posts'>
                    <div className='icons__published__posts'>
                      <i className='bi bi-file-text icons'></i>
                    </div>
                    <h4 className='title__published__posts'>{t('dashboard.title-published-posts')}</h4>
                    <h5 className='info'>
                      {latestPosts ? latestPosts + ' ' + t('dashboard.posts') : ' ' + t('dashboard.no-posts')}
                    </h5>
                  </div>
                </Col>
                {/* Card per il numero totale dei messaggi ricevuti */}
                <Col md={12} lg={2}>
                  <div className='content__messages'>
                    <div className='icons__messages'>
                      <i className='bi bi-envelope icons'></i>
                    </div>
                    <h4 className='title__messages'>{t('dashboard.title-messages')}</h4>
                    <h5 className='info'>
                      {latestContacts ? latestContacts + ' ' + t('dashboard.messaggi') : ' ' + t('dashboard.no-messaggi')}
                    </h5>
                  </div>
                </Col>
              </Row>

              {/* Tabs per la gestione degli utenti, posts e messaggi */}
              <Row className='content__list__posts mb-5'>
                <Col md={12}>
                  <Tabs
                    defaultActiveKey='dashboard-utenti'
                    transition={true}
                    id='tab-profile'
                    className='mb-3'
                    justify
                  >
                    <Tab 
                      eventKey='dashboard-utenti'
                      title={<><i className='bi bi-person'></i> {t('dashboard.elenco-utenti')}</>} 
                      className='tab__text'
                    >
                      <ListsUsers onLatestUsers={setLatestUsers} />
                    </Tab>
                    <Tab 
                      eventKey='dashboard-posts'
                      title={<><i className='bi bi-file-text'></i> {t('dashboard.elenco-posts')}</>}
                    >
                      <ListsPosts onLatestPosts={setLatestPosts} userLogin={userLogin} />
                    </Tab>
                    <Tab 
                      eventKey='dashboard-messages'
                      title={<><i className='bi bi-envelope'></i> {t('dashboard.elenco-messaggi')}</>}
                    >
                      <ListsMessages onLatestContacts={setLatestContacts} />
                    </Tab>
                    <Tab 
                      eventKey='dashboard-advices'
                      title={<><i className='bi bi-lightbulb'></i> {t('dashboard.elenco-advices')}</>}
                    >
                      <ListsAdvices />
                    </Tab>
                    <Tab 
                      eventKey='dashboard-id-telegram'
                      title={<><i className='bi bi-lightbulb'></i> {t('dashboard.elenco-id-telegram')}</>}
                    >
                      <ListsTelegramId />
                    </Tab>
                  </Tabs> 
                </Col>
              </Row>
            </>
          )}

          {/* Componente per visualizzare gli eventi sismici recenti */}
          <Row>
            <Col md={12}>
              <ListsSismicEvents onLatestSismicEvent={setLatestSismicEvent} userLogin={userLogin} />
            </Col>
          </Row>

          {/* Componente per visualizzare gli eventi sismici su mappa */}
          <Row className='mb-5'>
            <Col md={12}>
              <SismicMap setLatestSismicEventHigh={setLatestSismicEventHigh} />
            </Col>
          </Row>
        </>
      ) : (
        <Container>
          <h4 className='title__login__dashboard gap-2'>
            {t('dashboard.msg-login')} 
            <Link to='/login' className='access__dashboard'> {t('dashboard.login')}</Link>
          </h4>
        </Container>
      )}
    </Container>
  );
}

export default Dashboard;

