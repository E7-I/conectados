import express from 'express';
import reviewController from '../controllers/review.js';

const router = express.Router();

router.post('/createReview', reviewController.createReview);
router.get('/getReview/:id', reviewController.getReviewById);
router.put('/updateReview/:id', reviewController.updateReview);
router.delete('/deleteReview/:id', reviewController.deleteReview);
router.get('/getReviewsByProfessionalId/:professionalId', reviewController.getReviewsByProfessionalId);
router.get('/getReviewsByServiceId/:serviceId', reviewController.getReviewsByServiceId);

export default router;