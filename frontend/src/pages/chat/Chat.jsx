/*
 * Il componente Chat gestisce una semplice chat in tempo reale utilizzando Socket.io 
 * per la comunicazione con un server WebSocket. Il componente permette agli utenti 
 * di connettersi a un server di chat, inviare messaggi e riceverli in tempo reale.
 * L'utente può aprire la chat con un pulsante, inviare messaggi e visualizzare i messaggi ricevuti. 
 * Viene anche gestita la connessione e la disconnessione dal server, che invia notifiche automatiche 
 * al server quando l'utente si connette o si disconnette. Il componente fa uso di React Hooks 
 * (useState, useEffect) per gestire lo stato locale e ascoltare eventi del socket.
 */


import './Chat.css';
import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Context } from '../../modules/Context.jsx';
import { useTranslation } from 'react-i18next';

// Inizializzazione dinamica della connessione socket al server WebSocket
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
  autoConnect: false, // Connessione automatica disabilitata fino a quando non viene richiesta
});

function Chat() {
  const { t } = useTranslation('global');
  const { userLogin } = useContext(Context); // Recupera i dati di login dal contesto globale

  // Stati locali per la gestione della chat
  const [message, setMessage] = useState('');
  const [isConnect, setIsConnect] = useState(false);
  const [userConnect, setUserConnect] = useState('');
  const [messages, setMessages] = useState([]);
  const [show, setShow] = useState(false); // Gestisce la visibilità della finestra modale della chat

  // Funzione per chiudere la chat e disconnettersi dal server
  const handleClose = () => {
    setShow(false); // Nasconde la finestra modale
    setMessages([]); // Reset dei messaggi visualizzati

    if (isConnect) {
      const newMessage = {
        body: 'disconnesso',
        from: userLogin?.role === 'admin' ? 'SafeQuake Alert' : (userLogin?.username || 'user'),
      };
      
      socket.emit('message', newMessage); // Invia il messaggio di disconnessione al server
      socket.disconnect(); // Disconnette il socket
      setIsConnect(false); // Aggiorna lo stato di connessione
      setUserConnect(''); // Resetta il nome dell'utente connesso
    }
  };

  // Funzione per aprire la chat e connettersi al server
  const handleShow = () => {
    setShow(true); // Mostra la finestra modale
    if (!isConnect) {
      socket.connect(); // Connette il socket solo se non è già connesso
      setIsConnect(true); // Imposta lo stato di connessione a "vero"
      
      const newMessage = {
        body: t('chat.connesso'),
        from: userLogin?.role === 'admin' ? 'SafeQuake Alert' : (userLogin?.username || 'user'),
      };

      socket.emit('message', newMessage); // Invia il messaggio di connessione al server
    }
  };

  // Funzione per gestire l'invio di un nuovo messaggio
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form

    const newMessage = {
      body: message,
      from: userLogin?.role === 'admin' ? 'SafeQuake Alert' : (userLogin?.username || 'user'),
    };

    if (message !== '') {
      setMessages((prevMessages) => [newMessage, ...prevMessages]); // Aggiorna la lista di messaggi
      socket.emit('message', newMessage); // Invia il nuovo messaggio al server
    }

    setMessage(''); // Resetta il campo di input del messaggio
  };

  // Effetto per la gestione della connessione al socket e per ricevere i messaggi
  useEffect(() => {
    if (isConnect) {
      socket.connect(); // Connette il socket solo quando la chat è aperta

      // Funzione per gestire la ricezione di un nuovo messaggio dal server
      const receiveMessage = (message) => {
        setUserConnect(message.from); // Aggiorna lo stato con il nome dell'utente che ha inviato il messaggio
        setMessages((prevMessages) => [message, ...prevMessages]); // Aggiunge il messaggio alla lista
      };

      socket.on('message', receiveMessage); // Ascolta l'evento 'message' del socket

      // Log di debug per controllare lo stato della connessione
      socket.on('connect', () => {
        console.log('Connesso al server WebSocket');
      });

      socket.on('disconnect', () => {
        console.log('Disconnesso dal server WebSocket');
      });

      socket.on('connect_error', (error) => {
        console.error('Errore di connessione al server WebSocket:', error);
      });

      // Cleanup per disconnettere il socket quando il componente viene smontato
      return () => {
        socket.off('message', receiveMessage);
        socket.disconnect();
      };
    }
  }, [isConnect]); // L'effetto viene eseguito solo quando cambia lo stato di connessione

  // Funzione per resettare la chat
  const handleResetChat = () => {
    setMessages([]); // Pulisce tutti i messaggi visualizzati
  };

  return (
    <div className='content__chat'>
      {/* Pulsante per aprire la finestra di chat */}
      <Button className='btn__chat__con__noi' onClick={handleShow}>
        <i className='bi bi-chat-dots icons__chat'></i><span className='text-warning'>{userConnect}</span>
      </Button>

      {/* Finestra modale per la chat */}
      <Modal
        className='modal-custom modal-dark'
        aria-label={t('chat.avvia-chat')}
        show={show}
        onHide={handleClose} // Chiude la finestra quando viene cliccato il pulsante di chiusura
        backdrop='static' // Previene la chiusura cliccando all'esterno
        keyboard={false} // Previene la chiusura con il tasto ESC
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('chat.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form per l'invio di un nuovo messaggio */}
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <input 
                  type='text'
                  value={message} // Collega il valore dell'input allo stato locale
                  onChange={(e) => setMessage(e.target.value)} // Aggiorna lo stato quando l'utente digita un messaggio
                  placeholder={t('chat.message')}
                  className='form-control mb-2'
                />
              <Col className='d-flex justify-content-end gap-3'>
                {/* Pulsante per inviare il messaggio */}
                <Button 
                  type='submit'
                  aria-label={t('chat.button-message')} 
                  className='btn__invia__chat'
                >
                  <i className='bi bi-send'></i>
                </Button>
                {/* Pulsante per resettare la chat */}
                <Button 
                  className='btn__cancel__chat'
                  aria-label={t('chat.button-cancel')}
                  onClick={handleResetChat}
                >
                  <i className='bi bi-x-circle'></i>
                </Button>
              </Col>
              </Col>
              <Col md={4}>
                {/* Sezione per mostrare l'utente connesso */}
                <div>
                  <p className='text-center'>{t('chat.users')}</p>
                  <span className='text-warning'>
                    {isConnect ? userConnect : ''}
                  </span>
                </div>
              </Col>
            </Row>
          </form>

          {/* Visualizzazione dei messaggi ricevuti */}
          {messages.map((msg, index) => (
            <div key={index} className='mt-4'>
              <p className='text-white text__message'>
                <span className='fw-bold'>{msg.from}:</span> {msg.body}
              </p>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Chat;
