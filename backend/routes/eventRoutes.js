const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Preuzimanje svih dogadjaja
 *     tags: [Dogadjaji]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtriranje po kategoriji
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pretraga po nazivu dogadjaja
 *     responses:
 *       200:
 *         description: Lista svih dogadjaja
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Preuzimanje dogadjaja po ID-u
 *     tags: [Dogadjaji]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dogadjaja
 *     responses:
 *       200:
 *         description: Detalji dogadjaja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Dogadjaj nije pronadjen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Kreiranje novog dogadjaja
 *     tags: [Dogadjaji]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - capacity
 *               - categoryId
 *               - locationId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Naziv dogadjaja
 *                 example: Koncert u parku
 *               description:
 *                 type: string
 *                 description: Opis dogadjaja
 *                 example: Uzivajte u muzici na otvorenom
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Datum odrzavanja
 *                 example: 2026-07-15T19:00:00Z
 *               capacity:
 *                 type: integer
 *                 description: Maksimalan broj polaznika
 *                 example: 100
 *               imageUrl:
 *                 type: string
 *                 description: URL slike dogadjaja
 *                 example: https://example.com/slika.jpg
 *               categoryId:
 *                 type: integer
 *                 description: ID kategorije
 *                 example: 1
 *               locationId:
 *                 type: integer
 *                 description: ID lokacije
 *                 example: 1
 *     responses:
 *       201:
 *         description: Dogadjaj uspesno kreiran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Neautorizovan pristup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Azuriranje dogadjaja
 *     tags: [Dogadjaji]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dogadjaja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               locationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Dogadjaj uspesno azuriran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Dogadjaj nije pronadjen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authMiddleware, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Brisanje dogadjaja
 *     tags: [Dogadjaji]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dogadjaja
 *     responses:
 *       200:
 *         description: Dogadjaj uspesno obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dogadjaj obrisan
 *       404:
 *         description: Dogadjaj nije pronadjen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, eventController.deleteEvent);

/**
 * @swagger
 * /api/events/{id}/registrations:
 *   get:
 *     summary: Preuzimanje prijava za dogadjaj
 *     tags: [Dogadjaji]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dogadjaja
 *     responses:
 *       200:
 *         description: Lista prijava
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       404:
 *         description: Dogadjaj nije pronadjen
 */
router.get('/:id/registrations', authMiddleware, eventController.getEventRegistrations);

module.exports = router;
