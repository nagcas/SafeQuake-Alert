/*
 * Componente `ListsSismicEvents`
 * 
 * Questo componente visualizza un elenco di eventi sismici recenti, aggiornati in tempo reale. Gli utenti possono applicare filtri per l'intervallo di tempo e la magnitudo, cercare eventi per località, e navigare tra le pagine dei risultati. Il componente include anche notifiche per nuovi eventi sismici significativi.
 * 
 * Funzionalità:
 * - Visualizzazione di eventi sismici con dettagli come data, ora, magnitudo, luogo, e profondità.
 * - Filtri per selezionare eventi in base a giorni e magnitudo.
 * - Paginazione per navigare tra i risultati.
 * - Notifiche in tempo reale per eventi sismici nuovi e significativi.
 * - Modal per visualizzare i dettagli di un evento sismico selezionato.
 * 
 * onLatestSismicEvent - Callback chiamata con il nuovo evento sismico più recente.
 * userLogin - Informazioni sull'utente loggato.
 */

import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, FloatingLabel, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import ViewSismicEvent from './ViewSismicEvent';
import { useNotification } from '../../../modules/NotificationContext.jsx';
import { verifyDistance } from '../../sismicNearby/VerifyDistance.jsx';
import { Context } from '../../../modules/Context.jsx';
import GraficBar from '../../../components/graphs/GraficBar';
import GraficLine from '../../../components/graphs/GraficLine';
import { useTranslation } from 'react-i18next';
import InfoSismic from './InfoSismic';


function ListsSismicEvents({ onLatestSismicEvent, userLogin }) {

  const { t, i18n } = useTranslation('global');

  const { isLoggedIn } = useContext(Context);

  const [totalSismics, setTotalSimics] = useState([]);
  const [sismics, setSismics] = useState([]);
  const [isSpinner, setIsSpinner] = useState(false);
  const [selectedDays, setSelectedDays] = useState('1');
  const [selectedMag, setSelectedMag] = useState('0.3');
  const [showModal, setShowModal] = useState(false);
  const [selectedSismic, setSelectedSismic] = useState(null);
  const [search, setSearch] = useState('');

   // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);

  // Hook per le notifiche
  const { notify } = useNotification(); // Usa il contesto delle notifiche

  // Stato per memorizzare l'ID dell'ultimo evento notificato
  const [lastNotifiedEventId, setLastNotifiedEventId] = useState(
    localStorage.getItem('lastNotifiedEventId') || null
  );

  const [lastNotifiedEvent, setLastNotifiedEvent] = useState(
    JSON.parse(localStorage.getItem('lastNotifiedEvent')) || null
  );

  // Effetto per caricare gli eventi sismici e impostare un intervallo di aggiornamento
  useEffect(() => {
    const loadSismicEvents = async () => {
      const today = new Date();
      let startDate = new Date();

      switch (selectedDays) {
        case '2':
          startDate.setDate(today.getDate() - 30);
          break;
        case '3':
          startDate.setDate(today.getDate() - 90);
          break;
        case '4':
          startDate.setDate(today.getDate() - 365);
          break;
        default:
          startDate.setDate(today.getDate() - 7);
      };

      // Formatta le date per l'API
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedToday = today.toISOString().split('T')[0];

      // URL dell'API per ottenere gli eventi sismici da INGV
      const API_URL_INGV = `https://webservices.ingv.it/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&endtime=${formattedToday}&minmagnitude=${selectedMag}&minlatitude=35.3&maxlatitude=47.5&minlongitude=6.4&maxlongitude=18.3`;

      setIsSpinner(true);

      try {
        const response = await fetch(`${API_URL_INGV}`);
        const data = await response.json();

        setTotalSimics(data.features);

        if (data && Array.isArray(data.features)) {
          // Ordina gli eventi sismici per data decrescente
          const sortedSismics = data.features.sort((a, b) => {
            return new Date(b.properties.time) - new Date(a.properties.time);
          });

          setSismics(sortedSismics);

          if (sortedSismics.length > 0) {
            const latestEvent = sortedSismics[0];

            // Notifica solo se è un nuovo evento sismico
            if (latestEvent.id !== lastNotifiedEventId) {

              // Notifica ultimo evento sisma
              notify(latestEvent, userLogin, t, i18n);
              
              setLastNotifiedEventId(latestEvent.id);
              localStorage.setItem('lastNotifiedEventId', latestEvent.id);

              // Memorizza i dettagli dell'ultimo evento
              setLastNotifiedEvent(latestEvent);
              localStorage.setItem('lastNotifiedEvent', JSON.stringify(latestEvent));

              // Richiamo la funzione verifyDistance: 
              // Verifico la distanza, se inferiore a 100 km, viene registrata come evento sismico nel sistema nearby 
              // Inoltre invia una botifica personale con il relativo consiglio al telegram con id
              // console.log('verifico la distanza');
              verifyDistance();

              if (onLatestSismicEvent) {
                await onLatestSismicEvent(latestEvent);
              };
            };

            setTotalPages(Math.ceil(sortedSismics.length / limit));
          };
        } else {
          console.error(t('lists-sismic.error-data'), data);
        };
      } catch (error) {
        console.error(t('lists-sismic.error'), error);
      } finally {
        setIsSpinner(false);
      };
    };

    loadSismicEvents();

    // Imposta un intervallo per aggiornare i dati ogni 30 secondi
    const interval = setInterval(() => {
      loadSismicEvents();
    }, 30000); // Aggiorna ogni 30 secondi

    return () => clearInterval(interval);
  }, [selectedDays, selectedMag, limit]);

  // Funzione per formattare la data e l'ora nel fuso orario italiano
  const formatDateToItalianTime = (utcDateString) => {
    const date = new Date(utcDateString);
    // Aggiungi due ore
    date.setHours(date.getHours() + 2);

    return date.toLocaleString('it-IT', { 
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Funzione per mostrare il modal con i dettagli dell'evento selezionato
  const handleShowModal = (sismic) => {
    setSelectedSismic(sismic);
    setShowModal(true);
  };

  // Paginazione
  const indexOfLastSismic = currentPage * limit;
  const indexOfFirstSismic = indexOfLastSismic - limit;
  const currentSismics = sismics.slice(indexOfFirstSismic, indexOfLastSismic);

  // Funzione per gestire la modifica del campo di ricerca
  const handleSearch = (e) => {
    setSearch(e.target.value); // Aggiorna lo stato della ricerca con il valore immesso.
  };

  return (
    <>
      {isSpinner && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'></Spinner>
        </div>
      )}
      <h2 className='title__list__sismic mb-4'>{t('lists-sismic.title')}</h2>
      <Row className='d-flex justify-content-center align-content-center'>
        <Col md={3}>
          <h4 className='filter__lists__sismics'>{t('lists-sismic.filtri')}</h4>
        </Col>
        <Col md={3}>
          <Form.Select
            aria-label={t('lists-sismic.seleziona-giorni')}
            className='select__days custom__select'
            value={selectedDays}
            onChange={(e) => setSelectedDays(e.target.value)}
          >
            <option value='1'>{t('lists-sismic.7giorni')}</option>
            <option value='2'>{t('lists-sismic.30giorni')}</option>
            <option value='3'>{t('lists-sismic.90giorni')}</option>
            <option value='4'>{t('lists-sismic.365giorni')}</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            aria-label={t('lists-sismic.seleziona-magnitudo')}
            className='select__magnitudo custom__select'
            value={selectedMag}
            onChange={(e) => setSelectedMag(e.target.value)}
          >
            <option value='0.3'>{t('lists-sismic.magnitudo-0')}</option>
            <option value='1.0'>{t('lists-sismic.magnitudo-1')}</option>
            <option value='2.0'>{t('lists-sismic.magnitudo-2')}</option>
            <option value='3.0'>{t('lists-sismic.magnitudo-3')}</option>
            <option value='4.0'>{t('lists-sismic.magnitudo-4')}</option>
            <option value='5.0'>{t('lists-sismic.magnitudo-5')}</option>
          </Form.Select>
        </Col>
        <Col md={3}>
            <Form.Control
            type='text'
            id='search-località'
            aria-describedby={t('lists-sismic.località')}
            placeholder={t('lists-sismic.località')}
            value={search}
            onChange={handleSearch}
            className='mb-4 input__search'
          />
        </Col>
      </Row>
      <Table responsive='sm' className='table__sismics'>
        <thead>
          <tr>
            <th>{t('lists-sismic.nr')}</th>
            <th>{t('lists-sismic.ora')} <InfoSismic /></th>
            <th className='d-none d-md-table-cell'>{t('lists-sismic.autore')}</th>
            <th className='d-none d-md-table-cell'>{t('lists-sismic.tipo')} <InfoSismic /></th>
            <th>{t('lists-sismic.magnitudo')} <InfoSismic /></th>
            <th>{t('lists-sismic.luogo')} <InfoSismic /></th>
            <th>{t('lists-sismic.profondità')} <InfoSismic /></th>
            <th className='d-none d-md-table-cell'>{t('lists-sismic.coordinata')} <InfoSismic /></th>
          </tr>
        </thead>
        <tbody>
          {currentSismics.filter((sismic) => sismic.properties.place.toLowerCase().includes(search.toLowerCase())
          )
            .map((sismic, index) => (
            <tr key={index} onClick={() => handleShowModal(sismic)} className='select__event'>
              <td>{indexOfFirstSismic + index + 1}</td>
              <td>{formatDateToItalianTime(sismic.properties.time)}</td>
              <td className='d-none d-md-table-cell'>{sismic.properties.author}</td>
              <td className='d-none d-md-table-cell'>{sismic.properties.type}</td>
              <td>{sismic.properties.magType} {sismic.properties.mag}</td>
              <td>{sismic.properties.place}</td>
              <td>{sismic.geometry.coordinates[2]}</td>
              <td className='d-none d-md-table-cell'>{sismic.geometry.coordinates[1]}, {sismic.geometry.coordinates[0]}</td>
            </tr>
          )
          )}
        </tbody>
      </Table>

      <div className='p-4 my-4'>
        <p className='text-white text-center'>
        {t('lists-sismic.info')}
        </p>
      </div>

      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
        <div className='mb-3 mb-md-0 me-md-5'>
          <span className='text-white'>{t('lists-sismic.paginazione')}</span>
          <select
            className='ms-2 p-1 custom__select'
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Paginazione */}
        <Pagination className='d-flex flex-wrap justify-content-center align-items-center mb-0'>
          <Pagination.First
            className='btn__pagination'
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            className='btn__pagination'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              className='btn__pagination'
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            className='btn__pagination'
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            className='btn__pagination'
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>


      {/* Rappresentazione su grafici degli eventi sismici */}
      {/* <Row>
        <Col>
          <GraficBar totalSismics={totalSismics} />
        </Col>
        <Col>
          <GraficLine totalSismics={totalSismics} />
        </Col>
      </Row> */}

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <ViewSismicEvent selectedSismic={selectedSismic} setShowModal={setShowModal} />
      </Modal>
      <Container>
        <div className='info__dashboard'>
          <h3 className='my-4'>{t('lists-sismic.descrizione-sismic-1')}</h3>

          <h3>{t('lists-sismic.descrizione-sismic-2')}</h3>
          <p>{t('lists-sismic.descrizione-sismic-3')}</p>

          <h3>{t('lists-sismic.descrizione-sismic-4')}</h3>
          <p>{t('lists-sismic.descrizione-sismic-5')}</p>

          <h3>{t('lists-sismic.descrizione-sismic-6')}</h3>
          <p>{t('lists-sismic.descrizione-sismic-7')}</p>

          <h3>{t('lists-sismic.descrizione-sismic-8')}</h3>
          <p>{t('lists-sismic.descrizione-sismic-9')}</p>
        </div>
      </Container>
    </>
  );
};

export default ListsSismicEvents;
