/*
 * Componente della pagina principale dell'applicazione.
 * 
 * Questo componente rende la struttura principale della pagina Home, inclusi vari
 * sotto-componenti che forniscono informazioni, servizi, e altre funzionalità chiave.
 * 
 * - **HeroSafe**: Sezione di apertura con un'intestazione accattivante e informativa.
 * - **SectionSafeInfo**: Sezione che fornisce informazioni generali su SafeQuake Alert.
 * - **SectionSafeServices**: Sezione che elenca i servizi offerti da SafeQuake Alert.
 * - **WhyChooseSafeQuakeAlert**: Sezione che spiega perché scegliere SafeQuake Alert.
 * - **News**: Sezione che mostra le ultime notizie e aggiornamenti.
 * - **FooterSafe**: Sezione del piè di pagina con informazioni di contatto e link utili.
 */

import './Home.css';

import HeroSafe from '../components/common/hero/HeroSafe';
import SectionSafeInfo from '../components/common/sectionInfo/SectionSafeInfo';
import SectionSafeServices from '../components/common/sectionServices/SectionSafeServices';
import WhyChooseSafeQuakeAlert from '../components/common/whyChooseSafeQuakeAlert/WhyChooseSafeQuakeAlert';
import News from '../components/news/News';


function Home() {

  return (
    <div className='content__home'>
      <HeroSafe />
      <SectionSafeInfo />
      <SectionSafeServices />
      <WhyChooseSafeQuakeAlert />
      <News />
    </div>
  );
}

export default Home;

