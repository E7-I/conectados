import express from 'express';
import requestController from '../controllers/request.js';

const router = express.Router();

router.post('/createRequest', requestController.newRequest);
router.get('/getRequestByProfessionalId/:professionalId', requestController.getRequestByProfessionalId);
router.get('/getRequestByClientId/:clientId', requestController.getRequestByClientId);
router.put('/changeStatus', requestController.changeStatus);

export default router;