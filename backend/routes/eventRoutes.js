const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { imageUploadMiddleware } = require('../utils/imageUpload');

router.post('/events', imageUploadMiddleware, eventController.createEvent);

module.exports = router;
