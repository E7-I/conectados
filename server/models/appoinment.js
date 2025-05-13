import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
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
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  dateTime: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['agendado', 'concretado', 're-agendando', 'cancelado'],
    default: 'agendado',
  },
  history: [
    {
      dateTimeChange: {
        type: Date,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
