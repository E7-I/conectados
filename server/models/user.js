import { Schema, model } from 'mongoose'

/***********
SUB-ESQUEMAS
***********/
const ContactInfoSchema = new Schema({
  type: {
    type: String,
    enum: ['email', 'phone', 'linkedin', 'whatsapp', 'website', 'other'],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, { _id: false });

const ProfileSchema = new Schema({
  bio: {
    type: String,
    default: '',
  },
  photoUrl: {
    type: String,
    default: '',
  },
  contactInfo: {
    type: [ContactInfoSchema],
    default: [],
  },
}, { _id: false });

const LocationSchema = new Schema({
  address: {
    type: String
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
}, { _id: false });

const availabilitySchema = new Schema({
  dayOfWeek: {
    type: String,
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  },
  startHour: {
    type: String,
    required: true,
  },
  endHour: {
    type: String,
    required: true,
  },
}, { _id: false })

const certificationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  }
}, { _id: false })

/****************
ESQUEMA PRINCIPAL
****************/
const userSchema = new Schema({
  id: { // RUT
    type: Number,
    required: true,
    unique: true,
    immutable: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'professional', 'administrator'],
    default: 'client',
  },
  profile: {
    type: ProfileSchema,
    default: {},
  },
  location: {
    type: LocationSchema,
    default: {
      address: '',
      lat: 0,
      lng: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  professionalData: {
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        default: [],
      }
    ],
    availability: {
      type: [availabilitySchema],
      default: [],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        default: [],
      }
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    certifications: [
      {
        type: certificationSchema,
        default: [],
      }
    ],
  }
})

const User = model('User', userSchema)

export default User