/*
 * Componente `ViewEventSismic`
 * 
 * Questo componente visualizza i dettagli di un evento sismico selezionato all'interno di un modal. Include una descrizione dell'evento e una mappa interattiva che mostra la posizione dell'evento.
 * 
 * selectedSismic - Oggetto contenente i dettagli dell'evento sismico selezionato.
 * setShowModal - Funzione per chiudere il modal corrente.
 * setShowModalUltimo - Funzione per chiudere il modal specifico per l'ultimo evento sismico (opzionale).
 */

import 'leaflet/dist/leaflet.css'; // Importa lo stile di base di Leaflet
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet'; // Importa Leaflet per configurare icone personalizzate

// Configurazione dell'icona personalizzata per il Marker
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Usa un'icona predefinita di Leaflet
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function ViewEventSismic({ selectedSismic, setShowModal, setShowModalUltimo }) {

  const { t } = useTranslation('global');
  
  // Funzione per formattare la data e l'ora nel fuso orario italiano
  const formatDateToItalianTime = (utcDateString) => {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 1);
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

  // Funzione per chiudere il modal
  const handleClose = () => {
    if (setShowModal) {
      setShowModal(false); // Chiude il modal generico
    } else if (setShowModalUltimo) {
      setShowModalUltimo(false); // Chiude il modal specifico per l'ultimo evento sismico
    }
  };

  // Configurazione delle coordinate dell'evento sismico
  const coordinates = selectedSismic ? [selectedSismic.geometry.coordinates[1], selectedSismic.geometry.coordinates[0]] : [0, 0];
  const magnitude = selectedSismic ? selectedSismic.properties.mag : 1;

  return (
    <> 
      <Modal.Header closeButton>
        <Modal.Title>{t('view-sismic.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            {selectedSismic && (
              <div className='p-2'>
                {t('view-sismic.msg-1')} <span className='fw-bold'>{selectedSismic.properties.magType} {magnitude}</span> {t('view-sismic.msg-2')} 
                <span className='fw-bold'> {selectedSismic.properties.place}</span> il <span className='fw-bold'>{formatDateToItalianTime(selectedSismic.properties.time)} </span>
                {t('view-sismic.msg-3')} <span className='fw-bold'> {t('view-sismic.msg-4')} {coordinates[0]}, {t('view-sismic.msg-5')} {coordinates[1]})</span>,{' '}   
                {t('view-sismic.msg-6')}  <span className='fw-bold'> {selectedSismic.geometry.coordinates[2]} Km</span>.
                {t('view-sismic.msg-7')} <span className='fw-bold'> {selectedSismic.properties.author}</span>.
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
                  radius={magnitude * 10000} // Raggio del cerchio basato sulla magnitudo
                  color='red' 
                  fillColor='red'
                  fillOpacity={0.3}
                />
                <Marker position={coordinates} icon={customIcon}>
                  <Popup>
                    {t('view-sismic.magnitudo')} {magnitude}<br />
                    {t('view-sismic.luogo')} {selectedSismic.properties.place}
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
          aria-label={t('view-sismic.button-chiudi')}
          onClick={handleClose}
        >
          {t('view-sismic.chiudi')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ViewEventSismic;
