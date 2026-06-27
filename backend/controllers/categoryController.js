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

// Kreiranje nove kategorije
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description: description || null
    });

    res.status(201).json({ message: 'Kategorija uspešno kreirana', category });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom kreiranja kategorije', error: error.message });
  }
};
