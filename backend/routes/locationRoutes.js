const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Preuzimanje svih lokacija
 *     tags: [Lokacije]
 *     responses:
 *       200:
 *         description: Lista svih lokacija
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
router.get('/', locationController.getAllLocations);

module.exports = router;
