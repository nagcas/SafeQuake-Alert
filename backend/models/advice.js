import { Schema, model } from 'mongoose';

// Schema Consigli
const adviceSchema = new Schema(
  {
    magnitudo: {
      type: String
    },
    consigli: {
      type: String
    },
    avvisiDiReplica: {
      type: String
    },
    possibileImpatto: {
      type: String
    },
    duranteIlTerremoto: {
      type: String
    },
    dopoIlTerremoto: {
      type: String
    },
    consigliDiSicurezza: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: 'advices'
  }
);

// Creazione del modello Advice basato sullo schema adviceSchema
const Advice = model('Advice', adviceSchema);

// Esportazione del modello Advice
export default Advice;
