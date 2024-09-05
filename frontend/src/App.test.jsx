import { describe, it, expect, test, beforeAll, afterEach } from 'vitest';
import { waitFor, render, screen, cleanup, fireEvent, within, getAllByRole } from '@testing-library/react';
import '@testing-library/jest-dom';


//import NavbarSafe from './components/common/navbar/NavbarSafe';
import { I18nextProvider } from 'react-i18next';
import i18n from './setupTests/i18nForTest.js';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './modules/AuthProvider';
import HeroSafe from './components/common/hero/HeroSafe';
import FooterSafe from './components/common/footer/FooterSafe';
import BlogPosts from './pages/blog/BlogPosts';
//import Info from './pages/Info/Info';
import PageNotFound from './pages/pageNotfound/PageNotFound';
import About from './pages/about/About.jsx';


afterEach(cleanup);


/* 
  ------------------------------------------------------------
  Test n. 1
  Verifica che il componente Hero venga montato correttamente.
  ------------------------------------------------------------
*/
describe('Test n.1: Test del componente HeroSafe', () => {
  test('Il componente Hero viene montato correttamente e visualizza il testo previsto.', () => {
    // Renderizzo il componente Hero avvolto in in AuthProvider, I18nextProvider e MemoryRouter
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <HeroSafe />
          </AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

    // Trova il testo "Ricevi avvisi sismici e suggerimenti per la sicurezza in tempo reale" nel componente
    const TextHero = screen.getByText(/Ricevi avvisi sismici e suggerimenti per la sicurezza in tempo reale/i);

    // Verifico se l'elemento "Ricevi avvisi sismici e suggerimenti per la sicurezza in tempo reale" è presente nel DOM
    expect(TextHero).toBeInTheDocument();
  });
});


/* 
  --------------------------------------------------------------------------------------
  Test n. 2
  Verifica che i selettori del componente FooterSafe vengano correttamente visualizzati.
  --------------------------------------------------------------------------------------
*/
describe('Test n.2: Test del componente FooterSafe', () => {
  test('I selettori del componente FooterSafe vengono correttamente renderizzati come previsto.', () => {
    // Renderizzo il componente FooterSafe avvolto in AuthProvider, I18nextProvider e MemoryRouter
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <FooterSafe />
          </AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
      
    );

  // Verifica che le sezioni principali siano presenti, specificando il selettore
  expect(screen.getByText('SafeQuake Alert', { selector: 'h5' })).toBeInTheDocument();
  expect(screen.getByText('Contatti', { selector: 'h5' })).toBeInTheDocument();
  expect(screen.getByText('Seguici', { selector: 'h5' })).toBeInTheDocument();
  });
});


/* 
  ---------------------------------------------------------------------------------
  Test n. 3
  Eseguo una chiamat fetch al database dei post per verificare il conteggio totale.
  ---------------------------------------------------------------------------------
*/
describe('Test n.3: Test del componente BlogPosts', () => {
  test('Il numero di post nel database corrisponde al numero delle cards renderizzate.', async () => {
    // Simula una chiamata API per ottenere i post
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/posts`);
    const posts = await response.json();

    // Calcola il numero di post ricevuti
    const totalPosts = posts.totalPosts;

    // Renderizza il componente BlogPosts
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <BlogPosts />
          </AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

    // Trova tutte le card renderizzate
    const nElementi = await screen.findAllByTestId('card-img');

    // Verifica che il numero di card corrisponda al numero di post
    expect(nElementi).toHaveLength(totalPosts);
  });
});



/* 
  --------------------------------------------------------------------------------
  Test n. 4
  Verifico che il filtraggio dei post tramite la search si comporti come previsto.
  --------------------------------------------------------------------------------
*/

describe('Test n.4: Test del componente BlogPosts', () => {
  // Primo test su "search posts"
  test('Il filtraggio dei posts si comporta come previsto. (primo post)', async () => {
    // Renderizzo il componente App, simulando il rendering dell'applicazione principale.
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <BlogPosts />
          </AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

    // Cerco l'input di ricerca tramite il suo placeholder
    const searchInput = screen.getByPlaceholderText(/Ricerca per titolo o tags/i);

    // Simulo un evento di cambio valore sull'input di ricerca
    fireEvent.change(searchInput, { target: { value: 'onde sismiche' } });

    // Cerco tutti gli elementi "card-post" filtrati dopo l'input di ricerca
    const filteredPosts = await screen.findAllByTestId('card-post-66ce3539a92c0799373a72db');

    // Verifico che ci sia un solo elemento "card-post" filtrato
    expect(filteredPosts).toHaveLength(1);

    // Verifico che l'elemento "card-post" contenga il testo corretto. Uso "within" per limitare la ricerca solo all'interno della card.
    const postCard = filteredPosts[0]; // Seleziono il primo (e unico) post filtrato.
    expect(within(postCard).getByText('Le onde sismiche: Cosa Sono e Quanti Tipi Esistono')).toBeInTheDocument();
  });
});


/* 
  --------------------------------------------------------------------------------
  Test n. 5
  Verifico che il filtraggio dei post tramite la search si comporti come previsto.
  --------------------------------------------------------------------------------
*/

describe('Test n.5: Test del componente BlogPosts', () => {
  // Secondo test su "search posts"
  test('Il filtraggio dei posts si comporta come previsto. (altro post)', async () => {
    // Renderizzo il componente App, simulando il rendering dell'applicazione principale.
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <BlogPosts />
          </AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

    // Cerco l'input di ricerca tramite il suo placeholder
    const searchInput = screen.getByPlaceholderText(/Ricerca per titolo o tags/i);

    // Simulo un evento di cambio valore sull'input di ricerca
    fireEvent.change(searchInput, { target: { value: 'previsione' } });

    // Cerco tutti gli elementi "card-post" filtrati dopo l'input di ricerca
    const filteredPosts = await screen.findAllByTestId('card-post-66bcb6297da9659a05a2b188');

    // Verifico che ci sia un solo elemento "card-post" filtrato
    expect(filteredPosts).toHaveLength(1);

    // Verifico che l'elemento "card-post" contenga il testo corretto. Uso "within" per limitare la ricerca solo all'interno della card.
    const postCard = filteredPosts[0]; // Seleziono il primo (e unico) post filtrato.
    expect(within(postCard).getByText('Previsione dei terremoti: è possibile?')).toBeInTheDocument();
  });
});


/* 
  --------------------------------------------------------------------------------
  Test n. 6
  Verifico che il filtraggio dei post tramite la search si comporti come previsto.
  --------------------------------------------------------------------------------
*/

describe('Test n.6: Test del componente FooterSafe', () => {

  test('Verifica che i link dei social abbiano l\'href corretto', () => {
    // Renderizza il componente FooterSafe
    render(
      <MemoryRouter>
        <FooterSafe />
      </MemoryRouter>
    );
    
    // Verifica che il link di Facebook punti all'URL corretto
    const facebookLink = screen.getByTestId('facebook-link');
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com');

    // Verifica che il link di Twitter punti all'URL corretto
    const twitterLink = screen.getByTestId('twitter-link');
    expect(twitterLink).toHaveAttribute('href', 'https://www.twitter.com');

    // Verifica che il link di LinkedIn punti all'URL corretto
    const linkedinLink = screen.getByTestId('linkedin-link');
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/gianluca-chiaravalloti-5694081a2/');

    // Verifica che il link di GitHub punti all'URL corretto
    const githubLink = screen.getByTestId('github-link');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/nagcas');
  });
});


/* 
  --------------------------------------------------------------------------------
  Test n. 7
  Test del componente PageNotFound.
  --------------------------------------------------------------------------------
*/

describe('Test n.7: Test del componente PageNotFound', () => {
  
  test('Rende il messaggio "404" e i contenuti della pagina Not Found', () => {
    // Render del componente PageNotFound all'interno di MemoryRouter e I18nextProvider per il supporto alla traduzione
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    // Verifica che il titolo 404 sia presente
    expect(screen.getByText('404')).toBeInTheDocument();

    // Verifica che il messaggio tradotto "opps" sia presente
    expect(screen.getByText(/Oops! Qualcosa è andato storto./i)).toBeInTheDocument();

    // Verifica che il messaggio tradotto "msg" sia presente
    expect(screen.getByText(/La pagina che stai cercando non è stata trovata./i)).toBeInTheDocument();

    // Verifica che il link alla home esista e punti all'URL corretto
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});





 




