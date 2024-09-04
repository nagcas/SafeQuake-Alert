import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb = callback
    cb(null, 'uploads/'); // gli passo 2 parametri
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

// Crea un'istanza di multifer con la configurazione della storage
const upload = multer({
  storage: storage
});

export default upload;