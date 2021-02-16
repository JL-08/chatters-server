const express = require('express');
const topicsController = require('../controllers/topicsController');

const router = express.Router();

router
  .route('/')
  .get(topicsController.getAllTopics)
  .post(topicsController.createTopic);

module.exports = router;
