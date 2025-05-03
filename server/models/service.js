import { Schema, model } from 'mongoose';

const serviceSchema = new Schema({
  professionalid: {
    type: Number,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  video: {
    type: String,
  },
  categories: {
    type: [String],
    enum: [
      'Belleza',
      'Construcción',
      'Gasfitería',
      'Jardinería',
      'Electricidad',
      'Gastronomía',
      'Limpieza',
      'Otro',
    ],
    required: true,
  },
  price: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  timesDone: {
    type: Number,
    default: 0,
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

const Service = model('Service', serviceSchema);

export default Service;
