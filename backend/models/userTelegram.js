import { Schema, model } from 'mongoose';


// Schema Utente Telegram id
const userTelegram = new Schema(
  {
    idTelegram: {
      type: Number,
    }  
  },
  {
    timestamps: true,
    collection: 'usersTelegram'
  }
);


// Creazione del modello UserTelegram basato sullo schema uTelegram
const UserTelegram = model('UserTelegram', userTelegram);

// Esportazione del modello UserTelegram
export default UserTelegram;