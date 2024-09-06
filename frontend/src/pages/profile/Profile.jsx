/*
 * Componente Profile
 * 
 * Il componente `Profile` gestisce e visualizza la pagina del profilo dell'utente autenticato. 
 * Fornisce una panoramica completa delle informazioni dell'utente e delle opzioni per modificarle, 
 * inclusi avatar, dettagli personali, località e preferenze di notifica.
 * 
 * Funzionalità principali:
 * - **Visualizzazione Avatar e Dettagli**: Mostra l'avatar dell'utente e le informazioni di base come nome, cognome e data di creazione dell'account. 
 *   Se l'utente non ha un avatar personalizzato, viene visualizzato un avatar predefinito.
 * - **Aggiornamento Avatar**: Permette all'utente di caricare un nuovo avatar tramite il componente `UpdateAvatar`.
 * - **Eliminazione Profilo**: Offre un'opzione per eliminare il profilo dell'utente attraverso il componente `DeleteProfile`.
 * - **Modifica Profilo**: Consente di aggiornare le informazioni personali tramite il componente `UpdateProfile`.
 * - **Gestione Località**: Permette all'utente di aggiornare la propria località con il componente `UpdateLocation`.
 * - **Preferenze di Notifica**: Fornisce opzioni per gestire le notifiche tramite il componente `UpdateNotifications`.
 * - **Autenticazione**: Il componente verifica se l'utente è autenticato tramite il contesto `Context`. Se l'utente non è autenticato, viene visualizzato un messaggio con un link per effettuare il login.
 * 
 * Il layout del componente è organizzato in due colonne:
 * - La colonna di sinistra contiene l'avatar dell'utente, le informazioni di base e le opzioni per aggiornare l'avatar e eliminare il profilo.
 * - La colonna di destra include una serie di schede (tabs) per accedere alle diverse sezioni di modifica del profilo.
 * 
 * - Restituisce il markup del profilo utente, che include la visualizzazione e le opzioni di modifica del profilo.
 */


import './Profile.css';
import { useContext } from 'react'; 
import { Col, Container, Image, Row, Tab, Tabs } from 'react-bootstrap'; 
import { Context } from '../../modules/Context.jsx'; 
import defaultAvatar from '../../assets/avatar/default-avatar.png'; 
import { Link } from 'react-router-dom';
import formatData from '../../services/formatDate.jsx'; 
import UpdateProfile from './UpdateProfile';
import UpdateLocation from './UpdateLocation';
import UpdateNotifications from './UpdateNotifications';
import UpdateAvatar from './UpdateAvatar';
import DeleteProfile from './DeleteProfile';
import { useTranslation } from 'react-i18next';

function Profile() {

  const { t } = useTranslation('global');
  const { isLoggedIn, userLogin, setUserLogin } = useContext(Context);

  // Funzione per aggiornare il profilo utente
  const updatedUser = (updatedProfile) => {
    setUserLogin(updatedProfile);
  };

  return (
    <Container className='content__profile'>
      {(userLogin && isLoggedIn) ? ( // Condizione per verificare se l'utente è autenticato
        <Row>
          <Col md={4}>
            <div className='content__image'>
              <h5 className='title__image'>{t('profile.avatar')}</h5>
              <div className='content__image__profile'>
                <Image
                  src={userLogin.avatar || defaultAvatar} // Verifica che l'avatar sia un URL o usa l'avatar predefinito
                  alt={userLogin.avatar ? t('profile.image-utente') : t('profile.image-utente-default')}
                  className='img__profile shadow'
                  roundedCircle
                />
                <UpdateAvatar userLogin={userLogin} setUserLogin={updatedUser} />
              </div>
              <p className='text-center'>{userLogin.name} {userLogin.lastname}</p>
              <p className='text-muted text-center'>{t('profile.account')} {formatData(userLogin.createdAt, 'it')}</p>
              <DeleteProfile user={userLogin} />
            </div>
            <div>
              <h5 className='text-white'>{t('profile.personalizza')}</h5>
              <p className='content__informazioni'>
                {t('profile.info-personalizza')}
              </p>
            </div>
          </Col>
          <Col md={8}>
            <Tabs defaultActiveKey='profile' transition={true} id='tab-profile' className='mb-3'>
              <Tab 
                eventKey='profile'
                title={<><i className='bi bi-person'></i> {t('profile.profilo')}</>}
                className='tab__text'
              >
                <UpdateProfile userLogin={userLogin} setUserLogin={setUserLogin} />
              </Tab>
              <Tab 
                eventKey='location'
                title={<><i className='bi bi-geo-alt'></i> {t('profile.località')}</>}
              >
                <UpdateLocation userLogin={userLogin} setUserLogin={setUserLogin} />
              </Tab>
              <Tab 
                eventKey='notifications'
                title={<><i className='bi bi-bell'></i> {t('profile.notifiche')}</>}
              >
                <UpdateNotifications />
              </Tab>
            </Tabs> 
          </Col>
        </Row>
      ) : (
        <Container>
          <h4 className='title__profile__access gap-2'>
            {t('profile.access')}
            <Link to='/login' className='access__profile'>
              {t('profile.login')}
            </Link>
          </h4>  
        </Container>
      )}
    </Container>
  );
}

export default Profile;




