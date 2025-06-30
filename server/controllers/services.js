import Service from '../models/service.js'

const newService = async (req, res) => {
	try {
		const {
			professionalid,
			title,
			description,
			images,
			video,
			categories,
			price
		} = req.body;
		
		if (!professionalid || !title || !description || !categories || !price?.min || !price?.max) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		
		const service = new Service({
			professionalid,
			title,
			description,
			images,
			video,
			categories,
			price
		});
		
		const savedService = await service.save();
		res.status(201).json(savedService);
	} catch (error) {
		console.error('Error creating service:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

const getServiceId = async (req, res) => {
	try {
		const { id } = req.params;
		const service = await Service.findById(id);
		if (!service) {
			return res.status(404).json({ error: 'Service not found' });
		}
		res.status(200).json(service);
	} catch (error) {
		console.error('Error fetching service:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

const getServiceProfessionalId = async (req, res) => {
	try {
		const { professionalid } = req.params;
		const services = await Service.find({ professionalid });
		if (!services || services.length === 0) {
			return res.status(404).json({ error: 'No services found for this professional' });
		}
		res.status(200).json(services);
	} catch (error) {
		console.error('Error fetching services:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

const getAllServices = async (req, res) => {
	try {
		const services = await Service.find();
		res.status(200).json(services);
	} catch (error) {
		console.error('Error fetching services:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

const updateService = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });
		if (!updatedService) {
			return res.status(404).json({ error: 'Service not found' });
		}
		res.status(200).json(updatedService);
	} catch (error) {
		console.error('Error updating service:', error);
		res.status(500).json({ error: 'Server error' });
	}
}

const addRating = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating } = req.body;
		const service = await Service.findById(id);
		if (!service) {
			return res.status(404).json({ error: 'Service not found' });
		}
		service.averageRating = (service.averageRating * service.timesDone + rating) / (service.timesDone + 1);
		service.timesDone += 1;
		await service.save();
		res.status(200).json(service);
	} catch (error) {
		console.error('Error updating rating:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

const getFilteredServices = async (req, res) => {
	try {
		const { minPrice, maxPrice, category, minRating } = req.query;
		
		const filters = {};
		
		if (minPrice || maxPrice) {
			filters['price.min'] = { ...(minPrice && { $gte: Number(minPrice) }) };
			filters['price.max'] = { ...(maxPrice && { $lte: Number(maxPrice) }) };
		}
		
		if (category) {
			filters.categories = category;
		}
		
		if (minRating) {
			filters.averageRating = { $gte: Number(minRating) };
		}
		
		if (req.query.search) {
			const regex = new RegExp(req.query.search, 'i');
			filters.$or = [
				{ title: regex },
				{ description: regex }
			];
		}
		
		
		const services = await Service.find(filters);
		res.json(services);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching services' });
	}
};

export default {
	newService,
	getServiceId,
	getAllServices,
	getServiceProfessionalId,
	updateService,
	addRating,
	getFilteredServices
};
