const { Event, Category, Location, User, Registration } = require('../models');

// Dobavljanje svih događaja
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' },
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }
      ]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom dobavljanja događaja', error: error.message });
  }
};

// Dobavljanje jednog događaja
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Location, as: 'location' },
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        { model: Registration, as: 'registrations' }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: 'Događaj nije pronađen' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom dobavljanja događaja', error: error.message });
  }
};

// Kreiranje događaja
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, max_participants, category_id, location_id } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      max_participants,
      category_id,
      location_id,
      organizer_id: req.user.id
    });

    res.status(201).json({ message: 'Događaj uspešno kreiran', event });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom kreiranja događaja', error: error.message });
  }
};

// Ažuriranje događaja
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Događaj nije pronađen' });
    }

    // Provera da li je korisnik vlasnik događaja
    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Nemate dozvolu za izmenu ovog događaja' });
    }

    const { title, description, date, max_participants, category_id, location_id } = req.body;

    await event.update({
      title,
      description,
      date,
      max_participants,
      category_id,
      location_id
    });

    res.json({ message: 'Događaj uspešno ažuriran', event });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom ažuriranja događaja', error: error.message });
  }
};

// Brisanje događaja
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Događaj nije pronađen' });
    }

    // Provera da li je korisnik vlasnik događaja
    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Nemate dozvolu za brisanje ovog događaja' });
    }

    await event.destroy();
    res.json({ message: 'Događaj uspešno obrisan' });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom brisanja događaja', error: error.message });
  }
};
