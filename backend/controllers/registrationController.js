const { Registration, Event, User } = require('../models');

// Prijava na događaj
exports.createRegistration = async (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user.id;

    // Provera da li događaj postoji
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Događaj nije pronađen' });
    }

    // Provera da li je korisnik vec prijavljen
    const existingRegistration = await Registration.findOne({
      where: { user_id, event_id, status: 'active' }
    });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Vec ste prijavljeni na ovaj događaj' });
    }

    // Provera broja prijavljenih
    const registrationsCount = await Registration.count({
      where: { event_id, status: 'active' }
    });
    if (registrationsCount >= event.max_participants) {
      return res.status(400).json({ message: 'Događaj je popunjen' });
    }

    // Kreiranje prijave
    const registration = await Registration.create({
      user_id,
      event_id
    });

    res.status(201).json({ message: 'Uspešno ste se prijavili na događaj', registration });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom prijave', error: error.message });
  }
};

// Otkazivanje prijave
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Prijava nije pronađena' });
    }

    // Provera da li je korisnik vlasnik prijave
    if (registration.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Nemate dozvolu za otkazivanje ove prijave' });
    }

    await registration.update({ status: 'cancelled' });
    res.json({ message: 'Prijava uspešno otkazana' });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom otkazivanja prijave', error: error.message });
  }
};

// Dobavljanje prijava korisnika
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { user_id: req.params.userId, status: 'active' },
      include: [
        { model: Event, as: 'event' }
      ]
    });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom dobavljanja prijava', error: error.message });
  }
};
