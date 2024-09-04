/*
 * `StrongestEarthquakes` è un componente React che visualizza i terremoti più forti dell'anno corrente.
 * 
 * Il componente:
 * - Recupera i dati sismici dell'anno corrente da un'API esterna.
 * - Filtra i terremoti con magnitudo compresa tra 2.8 e 6.
 * - Ordina i terremoti per magnitudo in ordine decrescente e seleziona i primi 20.
 * - Passa il terremoto più forte alla funzione di callback `setLatestSismicEventHigh`.
 * - Mostra una lista dei terremoti più forti con dettagli come luogo, magnitudo e data/ora in formato italiano.
 * 
 * props - Le proprietà passate al componente.
 * props.setLatestSismicEventHigh - Funzione di callback per aggiornare l'evento sismico più forte.
 * 
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const StrongestEarthquakes = React.memo(({ setLatestSismicEventHigh }) => {

  const { t } = useTranslation('global');

  const [sismics, setSismics] = useState([]);
  const today = new Date().toISOString().split('T')[0]; // Data di oggi
  const startOfYear = `${new Date().getFullYear()}-01-01`; // Inizio dell'anno

  // Funzione per formattare la data in formato italiano
  const formatDateToItalianTime = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  useEffect(() => {
    // URL dell'API per ottenere gli eventi sismici da INGV
    const API_URL_INGV = `https://webservices.ingv.it/fdsnws/event/1/query?format=geojson&starttime=${startOfYear}&endtime=${today}&minmagnitude=0.3&minlatitude=35.3&maxlatitude=47.5&minlongitude=6.4&maxlongitude=18.3`;

    const fetchSismics = async () => {
      try {
        const response = await fetch(`${API_URL_INGV}`);
        const data = await response.json();
        setSismics(data.features);
      } catch (error) {
        console.error(t('stronest-earth-quakes.error'), error);
      };
    };

    fetchSismics();
  }, [startOfYear, today]);

  const strongestSismics = useMemo(() => {
    // Filtra per eventi con magnitudo tra 2.8 e 6
    const filteredSismics = sismics.filter(sismic => 
      sismic.properties.mag >= 2.8 && sismic.properties.mag <= 6
    );
    // Ordina per magnitudo decrescente e prendi i primi 20
    return filteredSismics.sort((a, b) => b.properties.mag - a.properties.mag).slice(0, 20);
  }, [sismics]);

  useEffect(() => {
    if (strongestSismics.length > 0) {
      setLatestSismicEventHigh(strongestSismics[0]);
    };
  }, [strongestSismics, setLatestSismicEventHigh]);

  return (
    <div className='strongest__earthquakes'>
      <h4>{t('stronest-earth-quakes.title')} {new Date().getFullYear()}</h4>
      <ul>
        {strongestSismics.length > 0 ? (
          strongestSismics.map((sismic, index) => (
            <li key={index}>
              {sismic.properties.place} - {t('stronest-earth-quakes.magnitudo')} {sismic.properties.mag} - {t('stronest-earth-quakes.data')} {formatDateToItalianTime(sismic.properties.time)}
            </li>
          ))
        ) : (
          <li>{t('stronest-earth-quakes.nessun-evento')}</li>
        )}
      </ul>
    </div>
  );
});

export default StrongestEarthquakes;



