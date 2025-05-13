import Appointment from '../models/appoinment.js';

const newAppointment = async (req, res) => {
  try {
    const { 
      clientId, 
      professionalId, 
      requestId, 
      serviceId, 
      startDateTime, 
      endDateTime,
      reason 
    } = req.body;

    // Validate required fields
    /*if (!clientId || !professionalId || !requestId || !serviceId || !startDateTime || !endDateTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }*/

    const appointment = new Appointment({
      clientId,
      professionalId,
      requestId,
      serviceId,
      dateTime: {
        start: new Date(startDateTime),
        end: new Date(endDateTime)
      },
      status: 'agendado',
      history: [{
        dateTimeChange: new Date(),
        reason: reason || "Initial appointment creation"
      }]
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAppointmentByProfessionalId = async (req, res) => {
    try {
        const { professionalId } = req.params;
        const appointments = await Appointment.find({ professionalId });
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ error: 'No appointments found for this professional' });
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const getAppointmentByServicelId = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const appointments = await Appointment.find({ serviceId });
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ error: 'No appointments found for this service' });
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        if (!appointmentId || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default {
    newAppointment,
    getAppointmentByProfessionalId,
    getAppointmentByServicelId,
    changeStatus
};