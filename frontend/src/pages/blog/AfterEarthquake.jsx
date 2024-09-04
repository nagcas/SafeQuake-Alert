/*
 * Il componente AfterEarthquake visualizza un elenco di post del blog filtrati per la categoria "Dopo il terremoto".
 * - Filtra i post passati come props per includere solo quelli appartenenti alla categoria specificata.
 * - Mostra i titoli dei primi 10 post filtrati come link cliccabili che portano alla pagina dei dettagli del post.
 * - Utilizza il componente Link di React Router per la navigazione verso la pagina di dettaglio del post.
 * 
 * Props:
 * - posts: Array di oggetti post, dove ogni oggetto contiene le informazioni del post come id, titolo e categoria.
 */

import { Link } from 'react-router-dom'; // Importa il componente Link per la navigazione tra le pagine
import { useTranslation } from 'react-i18next';

function AfterEarthquake({ posts }) {

  const { t } = useTranslation('global');

  return (
    <>
      {/* Titolo della sezione */}
      <h4 className='text-white content__title__section'>{t('after-earth-quake.title')}</h4>
      <div className='content__category__filter'>
        {/* Filtra e mostra i post appartenenti alla categoria "Dopo il terremoto" */}
        {posts
          .filter((post) => post.category.includes('Dopo il terremoto')) // Filtra i post per categoria
          .slice(0, 10) // Prende solo i primi 10 post filtrati
          .map((post) => (
            <Link 
              key={post._id} // Usa l'id del post come chiave unica
              to={`/detail-post/${post._id}`} // Imposta il percorso per la pagina di dettaglio del post
              className='link__post__filter text-white mt-2' // Classi per lo stile del link
            >
              {post.title} {/* Mostra il titolo del post come testo del link */}
            </Link>
          ))
        }
      </div>
    </>
  );
};

export default AfterEarthquake;
