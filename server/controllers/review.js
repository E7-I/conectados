import Review from '../models/review.js';

// Crear una nueva reseña
export const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las reseñas
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('serviceId appointmentId professionalId reviewerId');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una reseña
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una reseña
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};