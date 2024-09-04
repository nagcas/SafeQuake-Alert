/*
 * Componente `SismicNearby` che mostra gli eventi sismici vicini alla posizione dell'utente e l'ultimo evento sismico registrato.
 * Utilizza `react-bootstrap` per la gestione del layout, delle tabelle e dei modali.
 * Fa uso di variabili di stato per gestire i dati degli eventi sismici, la paginazione e la visualizzazione dei modali.
 *
 * Stato:
 * - `currentPage`: Pagina corrente per la visualizzazione degli eventi sismici.
 * - `totalPages`: Numero totale di pagine per la paginazione.
 * - `limit`: Numero di eventi sismici per pagina.
 * - `isSpinner`: Flag per la visualizzazione di un indicatore di caricamento.
 * - `ultimoEvento`: Ultimo evento sismico registrato.
 * - `calcoloDistanza`: Distanza calcolata tra l'ultimo evento sismico e la posizione dell'utente.
 * - `eventNearbyDB`: Lista degli eventi sismici vicini alla posizione dell'utente.
 * - `showModal`: Flag per la visualizzazione del modale con dettagli degli eventi sismici storici.
 * - `showModalUltimo`: Flag per la visualizzazione del modale con dettagli dell'ultimo evento sismico.
 * - `selectedSismic`: Evento sismico selezionato per visualizzare dettagli nel modale.
 * - `userLogin`: Dati dell'utente loggato.
 * - `dist_util`: Distanza utile per filtrare gli eventi sismici (100 km).
 *
 * Effetti:
 * - Recupera e imposta i dati di `userLogin` e `ultimoEvento` dal localStorage all'inizio.
 * - Carica gli eventi sismici quando `userLogin` e `ultimoEvento` sono disponibili.
 * - Calcola la distanza tra l'ultimo evento sismico e la posizione dell'utente usando `HaversineDistance`.
 *
 * Funzioni:
 * - `getFromLocalStorage`: Funzione per leggere e fare il parsing dei dati dal localStorage.
 * - `formatDateToItalianTime`: Funzione per formattare le date in formato italiano.
 * - `handleShowModal` e `handleShowModalUltimo`: Funzioni per mostrare i modali con dettagli degli eventi sismici.
 *
 * Renderizzazione:
 * - Se l'utente è autenticato e i dati di posizione sono disponibili, visualizza:
 *   - Le coordinate geografiche dell'utente.
 *   - I dettagli dell'ultimo evento sismico in una tabella.
 *   - Gli eventi sismici storici entro 100 km in una tabella con paginazione.
 * - Mostra modali per dettagli aggiuntivi sugli eventi sismici selezionati.
 * - Fornisce un'indicazione visiva di caricamento tramite un `Spinner` quando i dati sono in fase di caricamento.
 * - Se l'utente non è autenticato, visualizza un messaggio di accesso con un link alla pagina di login.
 *
 * Note:
 * - Assicurati che il componente `ViewEventSismicNearby` e `ViewSismicEvent` siano configurati per visualizzare i dettagli degli eventi sismici.
 * - `HaversineDistance` deve essere una funzione che calcola la distanza tra due punti geografici.
 */

import './SismicNearby.css';
import { Container, Modal, Pagination, Spinner, Table } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import HaversineDistance from '../../modules/HaversineDistance';
import { fetchWithAuth } from '../../services/fetchWithAuth.jsx';
import ViewEventSismicNearby from './ViewSismicEventNearby';
import ViewSismicEvent from '../dashboard/listsSismicEvents/ViewSismicEvent';
import { Context } from '../../modules/Context.jsx';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function SismicNearby() {

  const { t } = useTranslation('global');

  const { isLoggedIn } = useContext(Context);

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalEventi, setTotalEventi] = useState('');

  const [isSpinner, setIsSpinner] = useState(false);
  const [ultimoEvento, setUltimoEvento] = useState(null);
  const [calcoloDistanza, setCalcoloDistanza] = useState('');
  const [eventNearbyDB, setEventNearbyDB] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUltimo, setShowModalUltimo] = useState(false);
  const [selectedSismic, setSelectedSismic] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const dist_util = 100;

  // URL dell'API di backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Funzione per leggere dati dal localStorage
  const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(`Errore nel parsing di ${key}:`, error);
      };
    };
    return null;
  };

  // Inizializza gli stati
  useEffect(() => {
    setUserLogin(getFromLocalStorage('userLogin'));
    setUltimoEvento(getFromLocalStorage('lastNotifiedEvent'));
    
  }, []);

  useEffect(() => {
    if (ultimoEvento) {
      // console.log('Ultimo evento sismico registrato:', ultimoEvento);
    };
  }, [ultimoEvento]);

  // Carica eventi sismici quando userLogin e ultimoEvento sono disponibili
  useEffect(() => {
    if (userLogin && ultimoEvento) {
      const distanza = HaversineDistance(ultimoEvento, userLogin);
      setCalcoloDistanza(distanza);

      if (userLogin.place && userLogin.place[0] && userLogin.place[0].latitude && userLogin.place[0].longitude) {
        const loadEventSismicUser = async () => {
          setIsSpinner(true);
          try { 
            const response = await fetchWithAuth(`${API_URL}/api/seismicEvents/${userLogin._id}/seismicEvent?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
            
            if (response.seismicEvents) {
              setEventNearbyDB(response.seismicEvents);
              setTotalPages(response.totalPages);
              setTotalEventi(response.totalSeismicEvents);
            } else {
              console.log('Nessun evento sismico registrato!');
            };
          } catch (error) {
            console.error('Errore nel caricamento dei dati sismici dell\'utente:', error);
          } finally {
            setIsSpinner(false);
          };
        };
        
        loadEventSismicUser();
      } else {
        console.log('Devi aggiornare la tua posizione');
      };
    };
  }, [userLogin, ultimoEvento, currentPage, limit]);

  // Gestione della visibilità dei modali
  const handleShowModal = (sismic) => {
    setSelectedSismic(sismic);
    setShowModal(true);
  };

  const handleShowModalUltimo = (sismic) => {
    setSelectedSismic(sismic);
    setShowModalUltimo(true);
  };

  // formatta la data dell'evento sismico
  const formatDateToItalianTime = (utcDateString) => {
    const date = new Date(utcDateString);
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

  return (
    <Container fluid className='content__sismic__nearby'>
      {(userLogin && isLoggedIn) ? ( // Mostra il profilo solo se l'utente è autenticato
        <>
          {(userLogin || ultimoEvento) && (
            <>
              {userLogin.place[0].latitude || userLogin.place[0].longitude ? (
              <div className='view__coordinate'>
                <h5 className='mb-4'>{t('sismic-nearby.coordinate')} <span className='fw-bold'>{userLogin.username}</span></h5>
                <p className='coordinate'>{t('sismic-nearby.latitudine')} {userLogin.place[0].latitude}</p>
                <p className='coordinate'>{t('sismic-nearby.longitudine')} {userLogin.place[0].longitude}</p>
              </div>
              ) : (
                <div className='content__title__position'>
                  <h4 className='text-center'>{t('sismic-nearby.avviso')}</h4>
                </div>
              )}
              <h2 className='title__ultimo__evento my-4 text-white text-center'>{t('sismic-nearby.ultimo-evento')}</h2>
              <Table responsive='sm' className='table__sismics'>
                <thead>
                  <tr>
                    <th>{t('sismic-nearby.data')}</th>
                    <th className='d-none d-md-table-cell'>{t('sismic-nearby.autore')}</th>
                    <th className='d-none d-md-table-cell'>{t('sismic-nearby.tipo')}</th>
                    <th>{t('sismic-nearby.magnitude')}</th>
                    <th>{t('sismic-nearby.luogo')}</th>
                    <th>{t('sismic-nearby.profondità')}</th>
                    <th className='d-none d-md-table-cell'>{t('sismic-nearby.coordinata')}</th>
                    <th>{t('sismic-nearby.distanza')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr onClick={() => handleShowModalUltimo(ultimoEvento)} className='select__event'>
                    <td key={ultimoEvento.properties.eventId}>{formatDateToItalianTime(ultimoEvento.properties.time)}</td>
                    <td className='d-none d-md-table-cell'>{ultimoEvento.properties.author}</td>
                    <td className='d-none d-md-table-cell'>{ultimoEvento.properties.type}</td>
                    <td>{ultimoEvento.properties.magType} {ultimoEvento.properties.mag}</td>
                    <td>{ultimoEvento.properties.place}</td>
                    <td>{ultimoEvento.geometry.coordinates[2]}</td>
                    <td className='d-none d-md-table-cell'>{ultimoEvento.geometry.coordinates[1]}, {ultimoEvento.geometry.coordinates[0]}</td>
                    <td>{calcoloDistanza ? calcoloDistanza : 'Non definita!'}</td>
                  </tr>
                </tbody>
              </Table>
              <h2 className='title__ultimo__evento my-4 text-white text-center'>{t('sismic-nearby.storico')}</h2>
              {isSpinner &&
                <div className='d-flex justify-content-center my-4'>
                  <Spinner animation='grow' role='status' className='text-white'></Spinner>
                </div>
              }
              <Table responsive='sm' className='table__sismics'>
                <thead>
                  <tr>
                    <th>{t('sismic-nearby.nr-1')}</th>
                    <th>{t('sismic-nearby.data-1')}</th>
                    <th>{t('sismic-nearby.magnitudo-1')}</th>
                    <th>{t('sismic-nearby.luogo-1')}</th>
                    <th className='d-none d-md-table-cell'>{t('sismic-nearby.coordinata-1')}</th>
                    <th>{t('sismic-nearby.profondità-1')}</th>
                    <th>{t('sismic-nearby.distanza-1')}</th>
                  </tr>
                </thead>
                <tbody>
                  {eventNearbyDB.length > 0 ? (
                    eventNearbyDB.map((sismic, index) => (
                      <tr key={index} onClick={() => handleShowModal(sismic)} className='select__event'>
                        <td>{index + 1}</td>
                        <td>{formatDateToItalianTime(sismic.time)}</td>
                        <td>{sismic.magType} {sismic.magnitude}</td>
                        <td>{sismic.place}</td>
                        <td className='d-none d-md-table-cell'>{sismic.geometry[0].latitude}, {sismic.geometry[0].longitude}</td>
                        <td>{sismic.geometry[0].depth}</td>
                        <td>{sismic.proximity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='7' className='text-white text-center'>{t('sismic-nearby.no-evento')}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
    
              <div className='p-4 my-4'>
                <p className='text-white text-center'>
                {t('sismic-nearby.info')}
                </p>
              </div>
    
              <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
                {/* Selezione del numero di elementi per pagina */}
                <div className='mb-3 mb-md-0 me-md-5'>
                  <span className='text-white'>{t('sismic-nearby.paginazione')}</span>
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
                <Pagination className='d-flex justify-content-center align-items-center flex-wrap mb-0'>
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

    
              {/* Modal per gli eventi sismici nello storico */}
              <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <ViewEventSismicNearby selectedSismic={selectedSismic} setShowModal={setShowModal} />
              </Modal>
    
              {/* Modal per l'ultimo evento sismico */}
              <Modal size='lg' show={showModalUltimo} onHide={() => setShowModalUltimo(false)}>
                <ViewSismicEvent selectedSismic={selectedSismic} setShowModalUltimo={setShowModalUltimo} />
              </Modal>
    
              <Container>
                <div className='info__simic__nearby'>
                  <h3 className='my-4'>{t('sismic-nearby.info-descrizione')}</h3>
    
                  <p>{t('sismic-nearby.info-descrizione-1')} <span className='fw-bold'>SismicNearby</span> {t('sismic-nearby.info-descrizione-2')}</p>
    
                  <h4>{t('sismic-nearby.info-descrizione-3')}</h4>
    
                  <h4>{t('sismic-nearby.info-descrizione-4')}</h4>
                  <p>{t('sismic-nearby.info-descrizione-5')}</p>
    
                  <h4>{t('sismic-nearby.info-descrizione-6')}</h4>
                  <p>{t('sismic-nearby.info-descrizione-7')}</p>
    
                  <h4>{t('sismic-nearby.info-descrizione-8')}</h4>
                  <p>{t('sismic-nearby.info-descrizione-9')} <code>HaversineDistance</code>, {t('sismic-nearby.info-descrizione-10')}</p>
    
                  <h4>{t('sismic-nearby.info-descrizione-11')}</h4>
                  <p>{t('sismic-nearby.info-descrizione-12')}</p>
                </div>
              </Container>
            </>
          )}
        </>
      ) : (
        <Container>
          <h4 className='title__nearby__access gap-2'>
            {t('sismic-nearby.access')}
            <Link to='/login' className='access__nearby'>
              {t('sismic-nearby.login')}
            </Link>
          </h4>
        </Container> // Messaggio di accesso per utenti non autenticato
      )}
    </Container>
  );
};

export default SismicNearby;
