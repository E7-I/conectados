import User from '../models/user.js'; // Importa el modelo de usuarios
import Review from '../models/review.js';
import mongoose from 'mongoose';

// Crear una nueva reseña
export const createReview = async (req, res) => {
  try {
    const { serviceId, appointmentId, professionalId, reviewerId, stars, comment } = req.body;

    // Verificar que todos los campos requeridos estén presentes
    if (!serviceId || !appointmentId || !professionalId || !reviewerId || !stars || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verificar que el professionalId exista en la colección de usuarios
    const professional = await User.findOne({ id: professionalId }); // Buscar por `id` (Number)
    if (!professional) {
      return res.status(400).json({ error: 'Professional not found' });
    }

    // Verificar que el reviewerId exista en la colección de usuarios
    const reviewer = await User.findOne({ id: reviewerId }); // Buscar por `id` (Number)
    if (!reviewer) {
      return res.status(400).json({ error: 'Reviewer not found' });
    }

    // Validar que las estrellas estén dentro del rango permitido
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    // Validar que el comentario no exceda el límite de caracteres
    if (comment.length > 500) {
      return res.status(400).json({ error: 'Comment exceeds maximum length of 500 characters' });
    }

    // Crear y guardar la reseña
    const review = new Review({
      serviceId,
      appointmentId,
      professionalId,
      reviewerId,
      stars,
      comment,
    });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener una reseña por ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate('serviceId appointmentId');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Actualizar una reseña por ID
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { stars, comment } = req.body;

    // Validar que las estrellas estén dentro del rango permitido
    if (stars !== undefined && (stars < 1 || stars > 5)) {
      return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    // Validar que el comentario no exceda el límite de caracteres
    if (comment !== undefined && comment.length > 500) {
      return res.status(400).json({ error: 'Comment exceeds maximum length of 500 characters' });
    }

    // Intentar actualizar la reseña
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Eliminar una reseña por ID
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReviewsByProfessionalId = async (req, res) => {
  try {
    const { professionalId } = req.params;

    // Buscar todas las reseñas asociadas al profesional
    const reviews = await Review.find({ professionalId: Number(professionalId) }).populate('serviceId');
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this professional' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by professional ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReviewsByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Validar que el _id del servicio sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: 'Invalid serviceId format' });
    }

    // Buscar todas las reseñas asociadas al servicio utilizando _id
    const reviews = await Review.find({ serviceId: serviceId }).populate('serviceId reviewerId');

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this service' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by service ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByProfessionalId,
  getReviewsByServiceId
};