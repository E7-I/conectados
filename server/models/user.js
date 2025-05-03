import { Schema, model } from 'mongoose';

/****************
ESQUEMA PRINCIPAL
****************/
const userSchema = new Schema({
  _id: { // RUT
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
    required: true,
  },
  profile: {
    type: ProfileSchema,
    default: {},
  },
  location: {
    type: LocationSchema,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

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

const User = model('User', userSchema);

export default User;
