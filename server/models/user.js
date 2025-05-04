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
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
}, { _id: false });

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
})

const User = model('User', userSchema)

export default User