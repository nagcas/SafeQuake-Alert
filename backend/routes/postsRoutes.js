import express from 'express';
import Posts from '../models/posts.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from '../middlewares/authMiddleware.js';


// Creazione di una router Express
const router = express.Router();


/* Gestione delle route per le Posts */

// Definizione di una route GET per ottenere tutte le posts con paginazione e ordinamento
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const posts = await Posts.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await Posts.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per ottenere una singola posts per id specificato
router.get('/:postId', async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.postId);
    if (!posts) {
      return res.status(404).json({ message: 'Post non presente nel database!' });
    };
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route POST per l'inserimento di una nuova post nel database
router.post('/', authMiddleware, cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    const newsData = req.body;
    
    if (req.file) {
      // Cloudinary restituirà direttamente il suo url
      newsData.cover = req.file.path; 
    };

    const newsPost = new Posts(newsData);
    await newsPost.save();
    
    res.status(201).json(newsPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  };
});


// Definizione di una route PATCH per aggiornare una singola post per id specificato
router.patch('/:postId', authMiddleware, cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    // Cerca il post nel database
    const post = await Posts.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non presente nel database!' });
    };

    // Se un file è stato caricato, aggiorna la copertina del post
    if (req.file) {
      post.cover = req.file.path; // URL della copertina aggiornato con l'URL fornito da Cloudinary
    };

    // Aggiorna gli altri campi del post, gestendo il campo `publishedAt` se fornito
    const updateFields = req.body;
    
    // Gestisci il campo publishedAt per evitare problemi di casting
    if (updateFields.publishedAt) {
      const publishedAtDate = new Date(updateFields.publishedAt);
      if (!isNaN(publishedAtDate.getTime())) {
        post.publishedAt = publishedAtDate;
      } else {
        delete updateFields.publishedAt; // Rimuovi publishedAt se il valore non è valido
      };
    };

    // Applica i campi aggiornati al post
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] !== undefined && updateFields[key] !== null) {
        post[key] = updateFields[key];
      };
    });

    // Salva le modifiche nel database
    const updatedPost = await post.save();

    // Invia la risposta con il post aggiornato
    res.json(updatedPost);
  } catch (err) {
    console.error('Errore durante l\'aggiornamento del post:', err);
    res.status(400).json({ message: 'Errore durante l\'aggiornamento del post!' });
  };
});


// Definizione di una route PATCH per aggiornare la singola cover di una post con id specificato
router.patch('/:postId/cover', authMiddleware, cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato!' });
    };

    // Cerca il post nel db
    const newsPost = await Posts.findById(req.params.postId);
    if (!newsPost) {
      return res.status(404).json({ message: 'Post non presente nel database!' });
    };

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    newsPost.cover = req.file.path;

    // Salva le modifiche nel db
    await newsPost.save();


    // Invia la risposta con la cover della post aggiornata
    res.json(newsPost);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della copertina:', error);
    res.status(500).json({ message: 'Errore del server!' });
  };
});

// Definizione di una route DELETE per eliminare un post con id specificato
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    // Trova il post nel database
    const deletePost = await Posts.findByIdAndDelete(req.params.postId);
    if (!deletePost) {
      // Se il post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: 'Post non presente nel database!' });
    };

    // Verifica se esiste una copertura
    if (deletePost.cover) {
      // Estrai public_id da Cloudinary dall'URL della cover
      const publicId = `safeQuake/${deletePost.cover.split('/').pop().split('.')[0]}`;
      console.log('PublicId estratto:', publicId);
      
      // Elimina l'immagine da Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Risultato della cancellazione:', result);
      } catch (cloudinaryError) {
        console.error('Errore di eliminazione Cloudinary:', cloudinaryError);
      };
    };

    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: 'Post e, se presente, cover eliminati correttamente!' });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  };
});


/* Gestione delle route dei commenti */


// Definizione di una route GET per visualizzare tutti i commenti di una post con id specificato
router.get('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const newsPost = await Posts.findById(req.params.postId);
    if(!newsPost) {
      return res.status(404).json({ message: 'Commento non presente nel database!'});
    };
    res.json(newsPost.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route GET per visualizzare tutti i commenti di una post con id specificato con paginazione e ordinamento
router.get('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Verifica se l'ID è un ObjectId valido
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Id post non valido!' });
    };

    // Parametri di paginazione e ordinamento
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const comments = await Posts.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    // Trova il post con l'ID specificato
    const newsPost = await Posts.findById(postId);
    if (!newsPost) {
      return res.status(404).json({ message: 'Post non trovato nel database!' });
    };

    // Risposta JSON con i commenti paginati e ordinati
    res.json({
      comments,
      currentPage: page,
      totalPages: totalPages,
      totalComments: totalComments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Definizione di una route POST per inserire un nuovo commento ad una singola post con id specificato
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    // Trova la news con id
    const newsPost = await Posts.findById(req.params.postId);
    if (!newsPost) {
      return res.status(404).json({ message: 'Post non presente nel database!' });
    };

    // Crea un nuovo commento
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    };

    // Aggiungi il commento al post e salva
    newsPost.comments.push(newComment);
    
    await newsPost.save();

    // Risponde con i commenti aggiornati del post
    res.status(201).json(newComment);

  } catch (err) {
    res.status(400).json({ message: err.message });
  };
});


// Definizione di una route PATCH per modificare un singolo commento 
router.patch('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const newsPost = await Posts.findById(req.params.postId);
    if(!newsPost) {
      return res.status(404).json({ message: 'Post non presente nel database!'});
    };

    const comment = newsPost.comments.id(req.params.commentId);
    if(!comment) {
      return res.status(404).json({ message: 'Commento non presente nel database!'});
    };

    if (req.body.name) comment.name = req.body.name;
    if (req.body.email) comment.email = req.body.email;
    if (req.body.content) comment.content = req.body.content;

    await newsPost.save();
    res.json(comment);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  };
});


// Definizione di una route DELETE per eliminare un singolo commento da un id specificato
router.delete('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const newsPost = await Posts.findById(req.params.postId);
    if(!newsPost) {
      return res.status(404).json({ message: 'Post non presente nel database!'});
    };

    const comment = newsPost.comments.id(req.params.commentId);
    
    if(!comment) {
      return res.status(404).json({ message: 'Commento non presente nel database!' });
    };
    
    // Rimuovi il commento usando il metodo pull
    newsPost.comments.pull({ _id: req.params.commentId });

    await newsPost.save();
    res.json ({ newsPost, message: 'Commento cancellato correttamente!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});


// Middleware per gestire le rotte non trovate
router.use((req, res, next) => {
  //res.status(404).json({ error: 'Risorsa non trovata!', message: 'La risorsa richiesta non è stata trovata!' });
  // Reindirizza alla pagina 404 del frontend
  res.redirect(`${FRONTEND_URL}/404`);
});


// Esportazione del router
export default router;
