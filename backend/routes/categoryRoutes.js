const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Preuzimanje svih kategorija
 *     tags: [Kategorije]
 *     responses:
 *       200:
 *         description: Lista svih kategorija
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Kreiranje nove kategorije
 *     tags: [Kategorije]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategorija uspesno kreirana
 */
router.post('/', authMiddleware, categoryController.createCategory);

module.exports = router;
