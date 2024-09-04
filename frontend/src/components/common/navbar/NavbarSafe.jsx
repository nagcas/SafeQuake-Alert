/*
 * NavbarSafe Component
 *
 * Questo componente crea una barra di navigazione reattiva per l'applicazione SafeQuake Alert, fornendo un layout intuitivo per desktop e mobile.
 *
 * Importazioni:
 * - `React`: Libreria principale di React.
 * - `useContext`: Hook di React per l'accesso al contesto.
 * - `Container`, `Image`, `Nav`, `Navbar`, `Offcanvas`: Componenti di React-Bootstrap per creare una barra di navigazione.
 * - `NavLink`: Componente di routing da `react-router-dom` per navigazione interna e gestione delle classi attive.
 * - `LoggedIn`: Componente personalizzato per mostrare lo stato di autenticazione dell'utente.
 * - `Logo`: Importa un'immagine per il logo dell'applicazione.
 * - `./NavbarSafe.css`: Foglio di stile personalizzato per la barra di navigazione.
 *
 * Funzionalità Principali:
 * - La barra di navigazione è reattiva e utilizza il componente `Offcanvas` di React-Bootstrap per creare un menu a comparsa sui dispositivi mobili.
 * - `Navbar.Brand`: Visualizza il nome dell'applicazione "SafeQuake Alert".
 * - `Navbar.Toggle`: Un pulsante per attivare il menu offcanvas sui dispositivi mobili.
 * - `Navbar.Offcanvas`: Contenitore del menu che appare lateralmente sui dispositivi mobili.
 * - `NavLink`: Utilizzato per creare link di navigazione che si attivano automaticamente quando la pagina corrente corrisponde al percorso del link.
 * - `LoggedIn`: Un componente che gestisce e mostra informazioni di autenticazione.
 * - Il componente utilizza classi CSS personalizzate definite in `NavbarSafe.css` per gestire l'aspetto e lo stile della barra di navigazione.
 */


import './NavbarSafe.css';
//import Logo from '../../../assets/images/Logo_SafeSquake_Alert.png';
import Italia from '../../../assets/bandiere/icons8-italia-100.png';
import GranBretagna from '../../../assets/bandiere/icons8-gran-bretagna-100.png';
import Spagna from '../../../assets/bandiere/icons8-spagna-2-100.png';

import React from 'react';
import { Container, Dropdown, Image, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import LoggedIn from '../../loggedIn/LoggedIn';
import { useTranslation } from 'react-i18next';


function NavbarSafe() {

  const { t, i18n } = useTranslation('global');

  return (
    <Navbar expand='lg' className='navbar-dark mb-4 fixed-top p-4 menu__navbar'>
      <Container fluid>
        {/* Logo SafeQuake Alert */}
        <Navbar.Brand className='fs-2'>
          <Link to='/' className='Logo'>SafeQuake Alert</Link>
          </Navbar.Brand>
        {/* Toggle Btn */}
        <Navbar.Toggle 
          aria-controls='offcanvasNavbar-expand-lg' 
          className='shadow-none border-0'
        />
        {/* Sidebar */}
        <Navbar.Offcanvas
          id='offcanvasNavbar-expand-lg'
          aria-labelledby='offcanvasNavbarLabel-expand-lg'
          placement='start'
          className='sidebar'
        >
          {/* Sidebar header */}
          <Offcanvas.Header 
            className='text-white border-bottom close__white'
            closeButton
          >
            <Offcanvas.Title id='offcanvasNavbarLabel-expand-lg'>
              SafeQuake Alert
            </Offcanvas.Title>
          </Offcanvas.Header>
          {/* Sidebar body */}
          <Offcanvas.Body className='d-flex flex-column flex-lg-row p-4 p-lg-0'>
            <Nav className='d-flex justify-content-center align-items-center flex-grow-1 pe-3'>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/'
              >
                {t('navbar-safe.Home')}
              </NavLink>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/services'
              >
                {t('navbar-safe.Servizi')}
              </NavLink>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/blog-posts'
              >
                {t('navbar-safe.Blog')}
              </NavLink>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/info'
              >
                {t('navbar-safe.Info')}
              </NavLink>
              <NavLink
                data-testid="eventi-sismici" 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/event-sismic'
              >
                {t('navbar-safe.Eventi-Sismici')}
              </NavLink>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/sismic-map'
              >
                {t('navbar-safe.Mappa-Sismica')}
                </NavLink>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                } 
                to='/contacts'
              >
                {t('navbar-safe.Contatti')}
              </NavLink>
              <NavLink 
                className={({ isActive }) => 
                  isActive ? 'mx-2 menu__navbar__link nav__menu active' : 'mx-2 menu__navbar__link nav__menu'
                }
                data-testid={'page-about'}
                to='/about'
              >
                {t('navbar-safe.About')}
              </NavLink>
            </Nav>
            <div className='d-flex flex-column flex-md-row flex-lg-row justify-content-center align-items-center gap-3'>
              <Dropdown className='d-block'>
                <Dropdown.Toggle className='bg-transparent border-0 custom-dropdown-toggle' variant='light' id='dropdown-basic'>
                  <span className='text-white'>
                    {i18n.language === 'it' && (
                      <Image
                        className='image__bandiera'
                        src={Italia}
                        alt='Image Italia'
                      />
                    )}
                    {i18n.language === 'en' && (
                      <Image
                        className='image__bandiera'
                        src={GranBretagna}
                        alt='Image Gran Bretagna'
                      />
                    )}
                    {i18n.language === 'es' && (
                      <Image
                        className='image__bandiera'
                        src={Spagna}
                        alt='Image Spagna'
                      />
                    )}
                  </span> 
                </Dropdown.Toggle>
                <Dropdown.Menu className='mx-2 drop__menu'>
                  <Dropdown.Item onClick={() => i18n.changeLanguage('it')}>
                    <Image
                      className='image__bandiera'
                      src={Italia}
                      alt='Image Italia'
                    />
                    {' '}{t('navbar-safe.Italiano')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => i18n.changeLanguage('en')}>
                    <Image
                      className='image__bandiera'
                      src={GranBretagna}
                      alt='Image Gran Bretagna'
                    />
                    {' '}{t('navbar-safe.Inglese')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => i18n.changeLanguage('es')}>
                    <Image
                      className='image__bandiera'
                      src={Spagna}
                      alt='Image Spagna'
                    />
                    {' '}{t('navbar-safe.Spagnolo')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            <LoggedIn />
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavbarSafe;
