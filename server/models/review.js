import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    //ref: 'Service',
    required: true,
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    //ref: 'Appointment', 
    required: true,
  },
  professionalId: {
    type: Number,
    //ref: 'User',
    required: true,
  },
  reviewerId: {
    type: Number,
    //ref: 'User',
    required: true,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  response: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = model('Review', reviewSchema);

export default Review;
