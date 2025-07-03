import { Schema, model } from 'mongoose';


/***********
SUB-ESQUEMAS
***********/
const locationSchema = new Schema({
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
}, { _id: false });

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


const requestSchema = new Schema({ 
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  professionalId: {
    type: Number,
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

const RequestModel = model('Requestmodel', requestSchema);

export default RequestModel;
