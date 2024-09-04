import { Schema, model } from 'mongoose';


// Schema contacts
const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      lowercase: true
    },
    object: {
      type: String
    },
    request: {
      type: String
    },
    response: {
      type: String
    },
    terms: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    collection: 'contacts'
  }
);


// Creazione del modello contatti basato sullo schema contactsSchema
const Contact = model('Contact', contactsSchema);

// Esportazione del modello User
export default Contact;