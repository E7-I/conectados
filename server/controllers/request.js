import requestModel from '../models/request.js';


const newRequest = async (req, res) => {
  try {
    const {
      clientId,
      professionalId,
      serviceId,
      details,
      responseMessage,
    } = req.body;

    const request = new requestModel({
      clientId,
      professionalId,
      serviceId,
      details,
      responseMessage,
    });

    const savedRequest = await request.save();

    res.status(201).json({
      message: 'Request created successfully',
      request: savedRequest,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      message: 'Failed to create request',
      error: error.message,
    });
  }
};


const getRequestByProfessionalId = async (req, res) => {
  try {
    const { professionalId } = req.params;

    const requests = await RequestModel.find({ professionalId });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No requests found for this professional.' });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests.', error: error.message });
  }
};

const getRequestByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const requests = await RequestModel.find({ clientId });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No requests found for this professional.' });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests.', error: error.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request.', error: error.message });
  }
};


export default {
    newRequest,
    getRequestByProfessionalId,
    getRequestByClientId,
    changeStatus
}