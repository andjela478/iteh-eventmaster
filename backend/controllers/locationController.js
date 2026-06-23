const { Location } = require('../models');

// Dobavljanje svih lokacija
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom dobavljanja lokacija', error: error.message });
  }
};
