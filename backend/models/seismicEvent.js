import { Schema, model } from 'mongoose';

// Schema geometria evento sismico
const pointSchema = new Schema (
  {
    // Latitudine
    latitude: {
      type: Number
    },
    // Longitudine
    longitude: {
      type: Number
    },
    // Profondità dell'evento sismico
    depth: {
      type: Number
    }
  },
  {
    timestamps: true,
    _id: true 
  },
);


// Schema Eventi Sismici
const seismicEventSchema = new Schema(
  {
    // Identificativo unico per l'evento sismico
    eventId: {
      type: Number,
      required: true,
    },
    // Momento esatto in cui il sisma è avvenuto
    time: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Campo misura magnitudo
    magType: {
      type: String,
    },
    // Campo intensità del sisma
    magnitude: {
      type: Number,
      required: true,
    },
    // Campo coordinate evento
    geometry: {
      type: [pointSchema],
      required: true,
    },
    // Descrizione della posizione
    place: {
      type: String,
      required: true
    },
    // Distanza dall'utente dal sisma
    proximity: {
      type: String,
      required: true,
    },
    // Collegamento allo schema User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'seismicEvents'
  }
);

// Creazione del modello SeismicEvent basato sullo schema seismicEventSchema
const SeismicEvent = model('SeismicEvent', seismicEventSchema);

// Esportazione del modello SeismicEvent
export default SeismicEvent;
