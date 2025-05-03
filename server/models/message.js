import { Schema, model } from 'mongoose';

/****************
ESQUEMA PRINCIPAL
****************/
const messageSchema = new Schema({
  // To-Do
});

/***********
SUB-ESQUEMAS
***********/


const Message = model('Message', messageSchema);

export default Message;
