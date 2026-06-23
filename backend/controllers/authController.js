const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Registracija
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Provera da li vec postoji korisnik sa tim emailom
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email vec postoji' });
    }

    // Hashovanje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kreiranje novog korisnika
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      message: 'Korisnik uspesno kreiran',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom registracije', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Provera da li korisnik postoji
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Pogresni kredencijali' });
    }

    // Provera lozinke
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Pogresni kredencijali' });
    }

    // Kreiranje JWT tokena
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Uspesna prijava',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Greska prilikom prijave', error: error.message });
  }
};

// Logout (samo poruka, frontend brise token)
exports.logout = (req, res) => {
  res.json({ message: 'Uspesna odjava' });
};
