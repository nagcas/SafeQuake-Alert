/*
 * Componente `SismicMap`
 * 
 * Il componente `SismicMap` è progettato per visualizzare una mappa interattiva degli eventi sismici recenti in tempo reale. Utilizza la libreria Leaflet per creare una mappa che mostra i terremoti come cerchi colorati, con dimensioni e colori che riflettono la magnitudo e la profondità degli eventi. Il componente include anche una legenda e un elenco degli eventi più forti dell'anno.
 *
 * Funzionalità principali:
 * - **Visualizzazione Interattiva:** Mostra gli eventi sismici come cerchi sulla mappa. La dimensione e il colore dei cerchi variano in base alla magnitudo dell'evento.
 * - **Aggiornamenti in Tempo Reale:** Carica e aggiorna gli eventi sismici ogni minuto, assicurando che i dati siano sempre aggiornati.
 * - **Selezione Evento:** Permette di selezionare un evento sismico per centrare la mappa su di esso e mostrare dettagli aggiuntivi.
 * - **Legenda:** Fornisce un elenco degli ultimi eventi sismici, consentendo agli utenti di fare clic su un evento per visualizzarlo sulla mappa.
 * - **Visualizzazione degli Eventi Più Forti:** Integra il componente `StrongestEarthquakes` per mostrare i terremoti più forti dell'anno.
 * 
 * - Funzione per aggiornare l'evento sismico più forte.
 */

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import StrongestEarthquakes from './StrongestEarthquakes';
import { useTranslation } from 'react-i18next';


// Funzione per ottenere il raggio del cerchio basato sulla magnitudo dell'evento
const getCircleRadius = (magnitude, isSelected) => {

  // Calcola il raggio base del cerchio in base alla magnitudo
  const baseRadius = Math.min(500, (magnitude / 10) * 500);
  // Se il cerchio è selezionato, aumenta ulteriormente il raggio per evidenziare l'evento
  return isSelected ? baseRadius * 30 : baseRadius;
};

// Componente per aggiornare la vista della mappa quando un evento è selezionato
const UpdateMapView = ({ event }) => {
  const map = useMap();
  useEffect(() => {
    if (event) {
      // Imposta la vista della mappa sul punto dell'evento selezionato
      const { coordinates } = event.geometry;
      map.setView([coordinates[1], coordinates[0]], 10, { animate: true });
    };
  }, [event, map]);
  return null;
};

// Funzione per formattare la data e l'ora nel fuso orario italiano
const formatDateToItalianTime = (utcDateString) => {
  const date = new Date(utcDateString);
  // Aggiungi 2 ore per convertire da UTC a ora italiana
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

// Componente della legenda per visualizzare gli ultimi 20 eventi sismici
const Legend = React.memo(({ sismics, onSelectEvent, t }) => (
  <div className='legend'>
    <h4>{t('sismic-map.title')}</h4>
    <ul>
      {sismics.slice(0, 20).map((sismic) => (
        <li key={`${sismic.properties.time}-${sismic.properties.place}`} onClick={() => onSelectEvent(sismic)}>
          {sismic.properties.place} - {t('sismic-map.magnitudo')} {sismic.properties.mag} - {t('sismic-map.data')} {formatDateToItalianTime(sismic.properties.time)}
        </li>
      ))}
    </ul>
  </div>
));

function SismicMap({ setLatestSismicEventHigh }) {

  const { t } = useTranslation('global');

  const [sismics, setSismics] = useState([]); // Stato per gli eventi sismici da visualizzare
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento sismico attualmente selezionato
  const [totalEvent, setTotalEvent] = useState(0); // Numero totale di eventi sismici
  const [previousSismics, setPreviousSismics] = useState([]); // Stato per gli eventi sismici precedenti per il confronto
  const [lastNotifiedEventId, setLastNotifiedEventId] = useState(null); // ID dell'ultimo evento notificato
  const [isSpinner, setIsSpinner] = useState(false); // Stato per mostrare o nascondere il caricamento

  // Funzione per caricare gli eventi sismici dall'API
  const loadSismicEvents = useCallback(async () => {
    setIsSpinner(true); // Mostra il caricamento
    try {
      const today = new Date().toISOString().split('T')[0];

      // URL dell'API per ottenere gli eventi sismici da INGV
      const API_URL_INGV = `https://webservices.ingv.it/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=${today}&minmagnitude=0.3&minlatitude=35.3&maxlatitude=47.5&minlongitude=6.4&maxlongitude=18.3`;

      const response = await fetch(`${API_URL_INGV}`);
      const data = await response.json();

      setIsSpinner(false); // Nascondi il caricamento

      if (data && Array.isArray(data.features)) {
        // Filtra gli eventi sismici per la regione desiderata
        const filteredSismics = data.features.filter(sismic => 
          sismic.geometry.coordinates[1] >= 35.3 && sismic.geometry.coordinates[1] <= 47.5 &&
          sismic.geometry.coordinates[0] >= 6.4 && sismic.geometry.coordinates[0] <= 18.3
        );

        // Ordina gli eventi per data e limita a 1000 eventi
        const sortedEvents = filteredSismics
          .sort((a, b) => new Date(b.properties.time) - new Date(a.properties.time))
          .slice(0, 5000);

        // Verifica se gli eventi sono cambiati rispetto ai precedenti
        if (!arraysEqual(sortedEvents, previousSismics)) {
          setSismics(sortedEvents);
          setPreviousSismics(sortedEvents);
          setTotalEvent(filteredSismics.length);
        }
      }
    } catch (error) {
      console.error(t('sismic-map.error'), error);
    }
  }, [previousSismics, lastNotifiedEventId]);

  // Carica gli eventi sismici inizialmente ogni 30 secondi
  useEffect(() => {
    loadSismicEvents();
    const interval = setInterval(() => {
      loadSismicEvents();
    }, 30000); // Controlla ogni 30 secondi
    return () => clearInterval(interval);
  }, [loadSismicEvents]);

  // Funzione per confrontare due array di eventi sismici
  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => {
      return value.properties.eventId === arr2[index].properties.eventId;
    });
  };

  // Gestisce la selezione di un evento sismico
  const handleSelectEvent = (sismic) => {
    setSelectedEvent(sismic);
  };

  // Crea i cerchi sulla mappa per ogni evento sismico
  const sismaCircles = useMemo(() =>
    sismics.map((sismic, index) => {
      const isSelected = selectedEvent && sismic.properties.eventId === selectedEvent.properties.eventId;
      return (
        <Circle
          key={index}
          center={[sismic.geometry.coordinates[1], sismic.geometry.coordinates[0]]}
          radius={getCircleRadius(sismic.properties.mag, isSelected)}
          color={isSelected ? 'red' : 'red'}
          fillColor={isSelected ? 'blue' : 'blue'}
          fillOpacity={isSelected ? 1.5 : 0.4}
          weight={isSelected ? 5 : 1}
        >
          <Popup>
            <span className='fw-bold'>{t('sismic-map.evento')}</span> {sismic.properties.eventId}<br />
            <span className='fw-bold'>{t('sismic-map.luogo')}</span> {sismic.properties.place}<br />
            <span className='fw-bold'>{t('sismic-map.magnitudo')}</span> {sismic.properties.mag}<br />
            <span className='fw-bold'>{t('sismic-map.profondità')}</span> {sismic.geometry.coordinates[2]} km<br />
            <span className='fw-bold'>{t('sismic-map.data')}</span> {formatDateToItalianTime(sismic.properties.time)}
          </Popup>
        </Circle>
      );
    }),
    [sismics, selectedEvent]
  );

  return (
    <>
      {isSpinner && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'></Spinner>
        </div>
      )}
      <h2 className='title__map__sismic mb-4'>
        {t('sismic-map.msg-1')}<br />
        {t('sismic-map.msg-2')} {totalEvent}
      </h2>
      <Row>
        <Col md='12'>
          <MapContainer center={[41.8719, 12.5674]} zoom={6} style={{ height: '800px', width: '100%' }} className='map__sismic'>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {sismaCircles}
            {selectedEvent && <UpdateMapView event={selectedEvent} />}
          </MapContainer>
        </Col>
        <h2 className='title__map__sismic mb-4'>
        {t('sismic-map.legenda')}
        </h2>
        <Col md='6'>
          <Legend sismics={sismics} onSelectEvent={handleSelectEvent} t={t} />
        </Col>
        <Col md='6'>
          <StrongestEarthquakes setLatestSismicEventHigh={setLatestSismicEventHigh} />
        </Col>
      </Row>
      <Container>
        <div className='info__dashboard'>
          <h3 className='my-4'>{t('sismic-map.info-1')}</h3>
          <h3>{t('sismic-map.info-2')}</h3>
          <p>{t('sismic-map.info-3')}</p>

          <h3>{t('sismic-map.info-4')}</h3>
          <p>{t('sismic-map.info-5')}</p>

          <h3>{t('sismic-map.info-6')}</h3>
          <p>{t('sismic-map.info-7')}</p>
        </div>
      </Container>
    </>
  );
}

export default SismicMap;

