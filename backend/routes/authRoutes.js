const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registracija novog korisnika
 *     tags: [Autentifikacija]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Ime i prezime korisnika
 *                 example: Marko Markovic
 *               email:
 *                 type: string
 *                 description: Email adresa
 *                 example: marko@example.com
 *               password:
 *                 type: string
 *                 description: Lozinka (minimum 6 karaktera)
 *                 example: sifra123
 *               role:
 *                 type: string
 *                 enum: [user, organizer]
 *                 description: Uloga korisnika
 *                 example: user
 *     responses:
 *       201:
 *         description: Korisnik uspesno registrovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Korisnik uspesno kreiran
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Greska pri validaciji podataka
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Autentifikacija]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email adresa
 *                 example: marko@example.com
 *               password:
 *                 type: string
 *                 description: Lozinka
 *                 example: sifra123
 *     responses:
 *       200:
 *         description: Uspesna prijava
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Prijava uspesna
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Pogresni kredencijali
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjava korisnika
 *     tags: [Autentifikacija]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uspesna odjava
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Odjava uspesna
 */
router.post('/logout', authController.logout);

module.exports = router;
