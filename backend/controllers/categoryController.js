const { Category } = require('../models');

// Dobavljanje svih kategorija
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom dobavljanja kategorija', error: error.message });
  }
};
