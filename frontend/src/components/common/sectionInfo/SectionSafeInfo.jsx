/*
 * Componente `SectionSafeInfo`
 *
 * Descrizione:
 * Questo componente visualizza una sezione informativa dell'applicazione "SafeQuake Alert".
 * Utilizza la libreria `AOS` (Animate On Scroll) per aggiungere un'animazione di scorrimento verso l'alto quando l'elemento entra nella vista.
 *
 * Funzionalità:
 * - **Animazione al Scroll:** Inizializza `AOS` per animare l'elemento con un effetto di scorrimento verso l'alto quando diventa visibile.
 * - **Descrizione dell'Applicazione:** Mostra un titolo e una breve descrizione dell'applicazione, evidenziando la sua funzionalità di fornire allerte sismiche e consigli di sicurezza.
 *
 * Utilizzo:
 * - Utilizzato per fornire informazioni introduttive su "SafeQuake Alert" con un effetto visivo accattivante.
 */

import './SectionSafeInfo.css';

import React, { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

function SectionSafeInfo() {

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
    <>
      <div className='content__section__info' data-aos='slide-up' data-testid='page-sectionSafeInfo'>
        <h2 className='fw-bold'>SafeQuake Alert</h2> 
        <p>
          {t('section-safe-info.section-info')}
        </p>
      </div>
    </>
  );
};

export default SectionSafeInfo;
