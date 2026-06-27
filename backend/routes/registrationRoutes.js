const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Prijava korisnika na dogadjaj
 *     tags: [Prijave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: integer
 *                 description: ID dogadjaja
 *                 example: 1
 *     responses:
 *       201:
 *         description: Uspesna prijava na dogadjaj
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Vec ste prijavljeni na ovaj dogadjaj
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, registrationController.createRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Otkazivanje prijave na dogadjaj
 *     tags: [Prijave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID prijave
 *     responses:
 *       200:
 *         description: Prijava uspesno otkazana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Prijava otkazana
 *       404:
 *         description: Prijava nije pronadjena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, registrationController.cancelRegistration);

/**
 * @swagger
 * /api/registrations/user/{userId}:
 *   get:
 *     summary: Preuzimanje svih prijava korisnika
 *     tags: [Prijave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID korisnika
 *     responses:
 *       200:
 *         description: Lista prijava korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 */
router.get('/user/:userId', authMiddleware, registrationController.getUserRegistrations);

module.exports = router;
