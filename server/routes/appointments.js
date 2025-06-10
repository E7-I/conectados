import express from 'express';
import appointmentController from '../controllers/appointments.js';

const router = express.Router();

router.post('/createAppointment', appointmentController.newAppointment);
router.get('/getAppointmentByProfessionalId/:professionalId', appointmentController.getAppointmentByProfessionalId);
router.get('/getAppointmentByServicelId/:serviceId', appointmentController.getAppointmentByServicelId);
router.put('/changeStatus', appointmentController.changeStatus);
router.get('/getAppointmentByClientId/:clientId', appointmentController.getAppointmentByClientId);




export default router
