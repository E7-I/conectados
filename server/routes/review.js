import express from 'express';
import { createReview, getReviews, updateReview, deleteReview } from '../controllers/review.js';

const router = express.Router();

// Crear una nueva reseña
router.post('/', createReview);

// Obtener todas las reseñas
router.get('/', getReviews);

// Actualizar una reseña por ID
router.put('/:id', updateReview);

// Eliminar una reseña por ID
router.delete('/:id', deleteReview);

export default router;