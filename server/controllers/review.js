import Review from '../models/review.js';

// Crear una nueva reseña
export const createReview = async (req, res) => {
  try {
    const { serviceId, appointmentId, professionalId, reviewerId, stars, comment } = req.body;

    if (!serviceId || !appointmentId || !professionalId || !reviewerId || !stars || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const review = new Review(req.body);
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
    const review = await Review.findById(id).populate('serviceId appointmentId professionalId reviewerId');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener todas las reseñas
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('serviceId appointmentId professionalId reviewerId');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Actualizar una reseña por ID
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
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
    const reviews = await Review.find({ professionalId }).populate('serviceId reviewerId');

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

    // Buscar todas las reseñas asociadas al profesional
    const reviews = await Review.find({ serviceId }).populate('serviceId reviewerId');

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this service' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by professional ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  createReview,
  getReviewById,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewsByProfessionalId,
  getReviewsByServiceId
};