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

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
  autoConnect: false,
});

function Chat() {
  const { t } = useTranslation('global');
  const { userLogin } = useContext(Context);
  const [message, setMessage] = useState('');
  const [isConnect, setIsConnect] = useState(false);
  const [userConnect, setUserConnect] = useState('');
  const [messages, setMessages] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setMessages([]);
    
    // Optional: Send a disconnect message if needed
    const newMessage = {
      body: 'Client disconnected',
      from: userLogin?.username || 'user',
    };

    socket.emit('privateMessage', newMessage);
    socket.disconnect(); // Disconnect from server
    setIsConnect(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    if (isConnect) {
      socket.connect();

      if (userLogin?.role === 'admin') {
        socket.emit('registerSafeQuake', userLogin.role); // Register as SafeQuake Alert
      }

      socket.on('privateMessage', (message) => {
        setUserConnect(message.from);
        setMessages((prevMessages) => [message, ...prevMessages]);
      });

      return () => {
        socket.off('privateMessage');
      };
    }
  }, [isConnect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: userLogin?.username || 'user',
      to: 'safequake-alert-id', // ID di SafeQuake Alert
    };

    if (message !== '') {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      socket.emit('privateMessage', newMessage);
    }

    setMessage('');
  };

  return (
    <div className='content__chat'>
      <Button className='btn__chat__con__noi' onClick={handleShow}>
        <i className='bi bi-chat-dots icons__chat'></i><span className='text-warning'>{userConnect}</span>
      </Button>

      <Modal
        className='modal-custom modal-dark'
        aria-label={t('chat.avvia-chat')}
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('chat.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <input 
                  type='text'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('chat.message')}
                  className='form-control mb-2'
                />
                <Col className='d-flex justify-content-end gap-3'>
                  <Button 
                    type='submit'
                    aria-label={t('chat.button-message')} 
                    className='btn__invia__chat'
                  >
                    <i className='bi bi-send'></i>
                  </Button>
                </Col>
              </Col>
              <Col md={4}>
                <div>
                  <p className='text-center'>{t('chat.users')}</p>
                  <span className='text-warning'>
                    {isConnect ? userConnect : ''}
                  </span>
                </div>
              </Col>
            </Row>
          </form>

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
