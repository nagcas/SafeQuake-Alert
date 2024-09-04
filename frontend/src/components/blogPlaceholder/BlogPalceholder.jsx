/*
 * BlogPlaceholder Component
 *
 * Questo componente è progettato per fungere da segnaposto visivo
 * all'interno dell'interfaccia utente, simulando il layout di un post del blog 
 * durante il caricamento dei dati effettivi.
 *
 * Struttura:
 * - Il componente utilizza la griglia di Bootstrap (`Col`, `Row`) per
 *   creare un layout responsive, dove ogni post placeholder occupa una
 *   colonna su schermi di medie dimensioni (`md={4}`) e grandi (`lg={3}`).
 * - `Card` è il contenitore principale, che rappresenta l'intero post placeholder,
 *   con stili specifici importati da `./BlogPlaceholder.css`.
 *
 * Contenuto:
 * - Un'immagine placeholder (`Placeholder` come `Card.Img`) simula il caricamento
 *   dell'immagine del post.
 * - Il corpo del `Card` contiene placeholders per:
 *   - L'intestazione (`Card.Header`) con un'animazione di "glow" per simulare il caricamento del titolo o di altri dettagli.
 *   - Il titolo del post (`Card.Title`), anch'esso rappresentato da un placeholder animato.
 * - Il footer del `Card` include placeholders per la categoria del post e altri dettagli,
 *   con elementi fluttuanti per imitare una struttura di dati reali.
 *
 * Scopo:
 * - Questo componente migliora l'esperienza utente mostrando un layout di caricamento
 *   accattivante, riducendo la percezione dei tempi di attesa mentre i dati vengono recuperati.
 */


import './BlogPlaceholder.css';
import { Card, Col, Placeholder, Row } from 'react-bootstrap';

function BlogPlaceholder() {
  return (
    <Col md={4} lg={3} style={{ marginBottom: 50 }}>
      <Card className='mb-3 content__card__post'>
        <Row>
          <Col md={4}>
            <Placeholder as={Card.Img} className='card__img__post' />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Placeholder as={Card.Header} animation='glow'>
                <Placeholder xs={6} /> <span className='float-end my-2'><Placeholder xs={3} /></span>
              </Placeholder>
              <Card.Title>
                <Placeholder as='span' animation='glow' className='card__title__post'>
                  <Placeholder xs={7} />
                </Placeholder>
              </Card.Title>
            </Card.Body>
            <Card.Footer>
              <Placeholder as='span' animation='glow' className='title__category'>
                <Placeholder xs={4} />
              </Placeholder>
              <Placeholder as='span' animation='glow' className='float-end'>
                <Placeholder xs={5} />
              </Placeholder>
            </Card.Footer>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export default BlogPlaceholder;