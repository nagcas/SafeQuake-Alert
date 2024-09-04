/*
 * `ListsComments` è un componente React che gestisce e visualizza una lista di commenti con funzionalità di paginazione.
 * 
 * Questo componente mostra una tabella dei commenti con colonne per l'id, il nome, l'email, la data del commento e le azioni disponibili.
 * Include anche una sezione di paginazione che consente di navigare tra le pagine di commenti e un selettore per il numero di commenti per pagina.
 * 
 * - **Spinner**: Visualizza uno spinner di caricamento quando `isSpinner` è vero.
 * - **Tabella**: Mostra i commenti con colonne per id, nome, email, data e azioni (visualizza, modifica, elimina).
 * - **Paginazione**: Permette di navigare tra le pagine di commenti con pulsanti per la prima pagina, pagina precedente, pagine numerate, pagina successiva e ultima pagina.
 * - **Selettore di commenti per pagina**: Permette di selezionare il numero di commenti da visualizzare per pagina (8, 16 o 24).
 */

import { useState } from 'react';
import { Button, Pagination, Spinner, Table } from 'react-bootstrap';


function ListsComments() {

  // Stato per gestire la visualizzazione dello spinner di caricamento
  const [isSpinner, setIsSpinner] = useState(false);

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState(1); // Pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Totale delle pagine
  const [limit, setLimit] = useState(16); // Numero di commenti per pagina

  return (
    <>
      {/* Condizione per mostrare lo spinner di caricamento */}
      {isSpinner && (
        <div className='d-flex justify-content-center my-4'>
          <Spinner animation='grow' role='status' className='text-white'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Tabella dei commenti */}
      <Table responsive='sm' className='table__comments'>
        <thead>
          <tr>
            <th>id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Data Commento</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {/* Riga di esempio per mostrare il formato dei commenti */}
          <tr className='select__comment'>
            <td>1</td>
            <td>Gianluca</td>
            <td>studio.nagcas@outlook.it</td>
            <td>31/07/2024</td>
            <td className='btn__action'>
              <div className='btn__wrapper'>
                {/* Pulsante per visualizzare i dettagli del commento */}
                <Button variant='primary'>
                  <i className='bi bi-binoculars-fill'></i>
                </Button>
                {/* Pulsante per modificare il commento */}
                <Button variant='warning'>
                  <i className='bi bi-pencil-square'></i>
                </Button>
                {/* Pulsante per eliminare il commento */}
                <Button variant='danger'>
                  <i className='bi bi-trash'></i>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>

      {/* Paginazione per navigare tra le pagine dei commenti */}
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-center flex-wrap'>
        <Pagination className='d-flex flex-wrap justify-content-center mb-3 mb-md-0'>
          <Pagination.First
            className='btn-pagination'
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />

          <Pagination.Prev
            className='btn-pagination'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />

          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              className='btn-pagination'
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            className='btn-pagination'
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />

          <Pagination.Last
            className='btn-pagination'
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>

        {/* Selezione del numero di elementi per pagina */}
        <div className='my-3 my-md-0'>
          <span className='text-white'>Commenti per pagina:</span>
          <select
            className='ms-2 p-1 custom__select'
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default ListsComments;
