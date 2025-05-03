import { Schema, model } from 'mongoose';

/****************
ESQUEMA PRINCIPAL
****************/
const notificationSchema = new Schema({
  // To-Do
});

/***********
SUB-ESQUEMAS
***********/


const Notification = model('Notification', notificationSchema);

export default Notification;
