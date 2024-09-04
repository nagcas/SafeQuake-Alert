/*
 * Componente `Info` che visualizza informazioni dettagliate sui terremoti.
 * Utilizza `react-bootstrap` per la struttura e la stilizzazione del layout.
 *
 * Struttura:
 * - `Container`: Un contenitore centrale per la sezione delle informazioni.
 * - `h2`: Titolo della sezione che introduce le informazioni sui terremoti.
 * - `Row`: Contenitore per allineare le schede (cards) orizzontalmente.
 * - `Col`: Colonne all'interno del `Row` per la disposizione delle schede.
 * - `Card`: Componenti di `react-bootstrap` usati per visualizzare le informazioni in formato scheda.
 *
 * Ogni scheda (`Card`) contiene:
 * - `Card.Body`: Corpo della scheda con il contenuto informativo.
 * - `h4`: Titolo della scheda con il tema specifico.
 * - `p`: Paragrafo con la descrizione dettagliata dell'argomento trattato.
 *
 * Le informazioni sono suddivise in schede con i seguenti argomenti:
 * 1. Cosa sono i terremoti?
 * 2. Le cause dei terremoti
 * 3. Come si misurano i terremoti?
 * 4. Tipi di onde sismiche
 * 5. Previsione dei terremoti: è possibile?
 * 6. Effetti dei terremoti sull'ambiente
 * 7. Tecnologie per la protezione sismica
 * 8. Cosa fare durante un terremoto
 * 9. Monitoraggio sismico in tempo reale
 * 10. Storia dei principali terremoti in Italia
 * 11. Terremoti e tsunami: la connessione
 * 12. La rete sismica globale
 * 13. Il ruolo degli istituti di geofisica e vulcanologia
 * 14. La preparazione alle emergenze sismiche
 * 15. Educazione sismica: informare e proteggere
 * 16. La liquefazione del suolo durante i terremoti
 * 17. L'influenza del cambiamento climatico sui terremoti
 * 18. Sismicità indotta dall'uomo
 * 19. Innovazioni nella ricerca sismologica
 * 20. La resilienza urbana ai terremoti
 *
 * Nota: Ogni scheda presenta una breve spiegazione dell'argomento con l'obiettivo di educare il pubblico 
 * sui vari aspetti dei terremoti e delle loro implicazioni.
 */

import './Info.css';

import { Card, Col, Container, Row } from 'react-bootstrap';
import infoDataIT from './info-it.json';
import infoDataEN from './info-en.json';
import infoDataES from './info-es.json';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


function Info() {

  const { t, i18n } = useTranslation('global');
  const [infoText, setInfoText] = useState([]);

  // console.log('lingua selezionata', i18n.resolvedLanguage);

  // Aggiorna il contenuto in base alla lingua selezionata
  useEffect(() => {
    if (i18n.resolvedLanguage === 'it') {
      setInfoText(infoDataIT);
    } else if (i18n.resolvedLanguage === 'en') {
      setInfoText(infoDataEN);
    } else {
      setInfoText(infoDataES);
    };
  }, [i18n.resolvedLanguage]);

  return (
    <Container className='content__info__util'>
      <h2 className='title__info__util'>{t('info.title')}</h2>
      <Row className='d-flex justify-content-center'>
        <Col md={12}>
          <Card className='info__card__util'>
            <Card.Body>
              <Row>
                {/* Il file json raccoglie tutte le info che vengono renderizzate nel componente */}
                {infoText.map((info, index) => (
                  <Col key={index}md={6} className='mb-4'>
                    <Card className='info__item__util'>
                      <Card.Body>
                        <h4 
                          className='info__item__title'
                        >
                          {info.title}
                        </h4>
                        <p>
                          {info.content}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>   
        </Col>
      </Row>
    </Container>
  );
};

export default Info;