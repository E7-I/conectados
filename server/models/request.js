import { Schema, model } from 'mongoose';

const requestSchema = new Schema({ 
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profesiolanlId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  details: {
    type: detailsSchema,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'aceptado', 'rechazado', 'completado', 'cancelado'],
    default: 'pendiente',
  },
  responseMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/***********
SUB-ESQUEMAS
***********/
const detailsSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  }
}, { _id: false });

const locationSchema = new Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
}, { _id: false });

const Request = model('Request', requestSchema);

export default Request;
