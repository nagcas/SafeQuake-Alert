/*
 * CommentList Component
 *
 * Questo componente gestisce e visualizza l'elenco dei commenti in un'area specifica
 * all'interno dell'interfaccia utente. Utilizza i componenti di React-Bootstrap
 * per strutturare e stilizzare l'area dei commenti e integra le funzionalità
 * per creare, modificare ed eliminare commenti.
 *
 * Importazioni:
 * - `Badge`, `Col`, `Container`, `ListGroup`, `Row` da 'react-bootstrap': Questi componenti sono utilizzati per creare un layout responsive e per stilizzare l'area dei commenti.
 * - `CreateComment`, `DeleteComment`, `EditComment`: Componenti specifici per gestire le operazioni di creazione, eliminazione e modifica dei commenti.
 * - `Context`: Contesto che gestisce lo stato dell'autenticazione e delle informazioni dell'utente.
 * - `formatData`: Servizio per formattare le date in modo leggibile.
 *
 * Stato e Effetti:
 * - `sortedComments`: Stato che contiene l'elenco dei commenti ordinati per data di creazione (dal più recente al meno recente).
 * - `useEffect`: Ogni volta che l'elenco dei commenti viene aggiornato, i commenti vengono rielaborati e ordinati.
 *
 * Layout:
 * - `Container`: Contenitore principale per l'area dei commenti.
 * - `Row` e `Col`: Strutturano l'area dei commenti in una griglia, con tre sezioni principali:
 *   - Informazioni sull'autore del commento (nome, email e data di creazione).
 *   - Contenuto del commento.
 *   - Azioni disponibili (modifica o eliminazione) se l'utente è l'autore del commento o un amministratore.
 * - `ListGroup.Item`: Rappresenta ogni singolo commento come un elemento della lista.
 *
 * Funzionalità:
 * - Se l'utente corrente è l'autore del commento, o se ha il ruolo di amministratore,
 *   vengono mostrate le opzioni per modificare o eliminare il commento.
 * - Se non ci sono commenti disponibili, viene mostrato un messaggio che indica l'assenza di commenti.
 *
 * Scopo:
 * - Il componente `CommentList` è progettato per offrire una gestione completa dei commenti
 *   all'interno di un'applicazione web, fornendo un'interfaccia intuitiva e responsive
 *   per gli utenti, con controlli di accesso basati sul ruolo e sulla proprietà dei commenti.
 */


import './CommentArea.css'; // Importa il file CSS per la sezione dei commenti
import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap'; // Importa componenti di React-Bootstrap
import CreateComment from './CreateComment'; // Importa il componente per creare un commento
import DeleteComment from './DeleteComment'; // Importa il componente per eliminare un commento
import EditComment from './EditComment'; // Importa il componente per modificare un commento
import { Context } from '../../modules/Context.jsx'; // Importa il contesto per la gestione dell'autenticazione
import { useContext, useEffect, useState } from 'react'; // Importa l'hook useContext di React
import formatData from '../../services/formatDate.jsx'; // Importa il servizio per formattare le date
import { useTranslation } from 'react-i18next';

function CommentList({ id, comments, updateComments }) {

  const { t } = useTranslation('global');

  const { userLogin } = useContext(Context); // Recupera l'autore loggato dal contesto

  // Stato per i commenti ordinati
   const [sortedComments, setSortedComments] = useState([]);

   // Effetto per ordinare i commenti ogni volta che cambiano
   useEffect(() => {
    // Ordina i commenti per data (dal più recente al meno recente)
     const sorted = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
     setSortedComments(sorted);
   }, [updateComments]);

   
  return (
    <Container className='content__area'>
      {/* Contenitore principale per l'area dei commenti */}
      <div className='d-flex justify-content-between align-items-center my-4'>
        {/* Intestazione dell'area dei commenti */}
        <h4 className='content__title'>
          <Badge size={'sm'} bg='secondary'>Nr. {sortedComments.length} {t('comment-list.commenti')}</Badge>
          {/* Badge che mostra il numero di commenti */}
        </h4>
        <CreateComment id={id} updateComments={updateComments} />
        {/* Componente per creare un nuovo commento */}
      </div>
      <Row>
        {sortedComments.length > 0 ? sortedComments.map((comment, index) => (
          <ListGroup.Item key={index} className='d-flex justify-content-between align-items-center content__comments'>
            {/* Lista dei commenti */}
            <Col md={2}>
              {/* Colonna per le informazioni sull'autore del commento */}
              <div className='d-flex flex-column'>
                <div className='d-flex flex-column comment__user'>
                  <span className='fw-bold'>{comment.name} </span>
                  <span>({comment.email})</span>
                </div>
                <small className='text-muted'>{formatData(comment.createdAt, 'it')}</small>
              </div>
            </Col>
            <Col md={8}>
              {/* Colonna per il contenuto del commento */}
              <div className='flex-grow-1 mx-3'>
                <span className='comment__content'>{comment.content}</span>
              </div>
            </Col>
            <Col md={2}>
              {(comment.email === userLogin.email) ? (
                <div className='d-flex justify-content-end align-items-center gap-2'>
                  {/* Opzioni per modificare o eliminare il commento se l'utente è l'autore */}
                  <EditComment id={id} comment={comment} commentId={comment._id} updateComments={updateComments} />
                  <DeleteComment id={id} commentId={comment._id} updateComments={updateComments} />
                </div>
              ) : (
                (userLogin.role === 'admin') && (
                  <div className='d-flex justify-content-end align-items-center gap-2'>
                    {/* Opzioni per eliminare il commento se l'utente è amministratore */}
                    <DeleteComment id={id} commentId={comment._id} updateComments={updateComments} />
                </div>
                )
              )}
            </Col>
          </ListGroup.Item>
        )) : <div className='text-center text-dark fs-5 content__comments'>{t('comment-list.no-commenti')}</div>}
        {/* Messaggio di assenza di commenti */}
      </Row>
    </Container>
  );
}

export default CommentList; // Esporta il componente CommentList per l'uso in altri file

