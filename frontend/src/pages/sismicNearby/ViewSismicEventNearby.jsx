/*
 * Componente ViewEventSismicNearby
 * 
 * Questo componente visualizza i dettagli di un evento sismico selezionato all'interno di una finestra modale.
 * Mostra informazioni come magnitudo, luogo, data e ora, coordinate geografiche, profondità e distanza dalla posizione dell'utente.
 * Inoltre, visualizza una mappa con un cerchio che indica l'area dell'evento e un marker per la posizione esatta.
 * 
 */


import 'leaflet/dist/leaflet.css'; // Importa lo stile di base di Leaflet

import { Button, Col, Modal, Row } from 'react-bootstrap';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';

function ViewEventSismicNearby({ selectedSismic, setShowModal }) {

  const { t } = useTranslation('global');
  
  /**
   * Funzione per formattare la data e l'ora nel fuso orario italiano.
   * Aggiunge 2 ore alla data UTC per adattarsi all'orario dell'Europa/Roma.
  */
  const formatDateToItalianTime = (utcDateString) => {
    const date = new Date(utcDateString);
    // Aggiungi 2 ore per l'orario italiano (CET/CEST)
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

  // Configurazione delle coordinate dell'evento sismico
  const coordinates = selectedSismic ? [selectedSismic.geometry[0].latitude, selectedSismic.geometry[0].longitude] : [0, 0];
  const magnitude = selectedSismic ? selectedSismic.magnitude : 1;

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('view-sismic-event-nearby.title')}Dettagli Evento Sismico</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            {selectedSismic && (
              <div className='p-2'>
                {t('view-sismic-event-nearby.msg-1')} <span className='fw-bold'>ML {selectedSismic.magnitude}</span> {t('view-sismic-event-nearby.msg-2')} 
                <span className='fw-bold'> {selectedSismic.place}</span> {t('view-sismic-event-nearby.msg-3')} <span className='fw-bold'>{formatDateToItalianTime(selectedSismic.time)} </span>
                {t('view-sismic-event-nearby.msg-4')} <span className='fw-bold'>{t('view-sismic-event-nearby.msg-5')} {selectedSismic.geometry[0].latitude} {t('view-sismic-event-nearby.msg-6')} {selectedSismic.geometry[0].longitude}</span>  
                {t('view-sismic-event-nearby.msg-7')} <span className='fw-bold'>{selectedSismic.geometry[0].depth} Km</span>.
                {t('view-sismic-event-nearby.msg-8')} <span className='fw-bold'>{selectedSismic.proximity}</span>.
              </div>
            )}
          </Col>
          <Col md={12} className='mt-4'>
            {selectedSismic && (
              <MapContainer 
                center={coordinates} 
                zoom={8} 
                scrollWheelZoom={false}
                style={{ height: '400px', width: '100%' }} // Dimensioni della mappa
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Circle 
                  center={coordinates} 
                  radius={magnitude * 10000} 
                  color='red' 
                />
                <Marker position={coordinates}>
                  <Popup>
                  {t('view-sismic-event-nearby.magnitudo')} {magnitude}<br />{t('view-sismic-event-nearby.luogo')} {selectedSismic.place}
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          className='btn__cancel'
          aria-label={t('view-sismic-event-nearby.button-chiudi')}
          onClick={() => setShowModal(false)}
        >
          {t('view-sismic-event-nearby.chiudi')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ViewEventSismicNearby;


