import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


// Schema Località
const placeSchema = new Schema(
  {
    region: {
      type: String,
      default: ''
    },
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    cap: {
      type: String,
      match: /^[0-9]{5}$/,
      default: ''
    },
    latitude: { 
      type: Number, 
      default: null 
    },
    longitude: { 
      type: Number, 
      default: null 
    }
  },
  {
    timestamps: true,
    _id: true
  }
);


// Schema Notifiche
const notificationsSchema = new Schema(
  {
    push: {
      type: Boolean,
      default: false
    },
    telegram: {
      type: Boolean,
      default: false
    },
    userTelegram: {
      type: String,
      default: ''
    },
    userIdTelegram: {
      type: Number
    }
  },
  {
    timestamps: true,
    _id: true
  }
);

// Schema Utente
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      lowercase: true
    },
    birthdate: {
      type: Date,
      min: '1900-01-01',
    },
    gender: {
      type: String
    },
    phone: {
      type: String,
      match: /^\+[1-9]\d{1,14}$/
    },
    favoriteLanguage: {
      type: String
    },
    avatar: {
      type: String
    },
    password: {
      type: String
    },
    place: {
      type: [placeSchema],
      default: []
    },
    notifications: {
      type: [notificationsSchema],
      default: []
    },
    terms: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    googleId: { 
      type: String 
    },
    SeismicEvents: [{
      type: Schema.Types.ObjectId,
      ref: 'SeismicEvent'
    }],
    advices: [{
      type: Schema.Types.ObjectId,
      ref: 'Advice'
    }]
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Metodo per confrontare la password fornita con quella memorizzata
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware pre-save per hashing della password prima di salvare il documento
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Creazione del modello User basato sullo schema userSchema
const User = model('User', userSchema);

// Esportazione del modello User
export default User;
