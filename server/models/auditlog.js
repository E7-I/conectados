import { Schema, model } from 'mongoose';

/****************
ESQUEMA PRINCIPAL
****************/
const auditlogSchema = new Schema({
  // To-Do
});

/***********
SUB-ESQUEMAS
***********/


const AuditLog = model('AuditLog', auditlogSchema);

export default AuditLog;
