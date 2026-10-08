const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware); // All image endpoints require authentication

router.post('/generate', imageController.createGeneration);
router.get('/', imageController.getUserGenerations);
router.get('/:id', imageController.getGenerationById);
router.delete('/:id', imageController.deleteGeneration);

module.exports = router;

