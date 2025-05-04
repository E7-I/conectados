import express from 'express'
import userController from '../controllers/services.js'

const router = express.Router()

router.post('/createService', userController.newService)
router.get('/getService/:id', userController.getServiceId)
router.get('/getServicesProfessionalId/:professionalid', userController.getServiceProfessionalId)
router.get('/getAllServices', userController.getAllServices)
router.put('/updateService/:id', userController.updateService)
router.put('/addRating/:id', userController.addRating)

export default router
