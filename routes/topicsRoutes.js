const express = require('express');
const topicsController = require('../controllers/topicsController');

const router = express.Router();

router
  .route('/')
  .get(topicsController.getAllTopics)
  .post(topicsController.createTopic);

router
  .route('/:name')
  .get(topicsController.getTopicByName)
  .patch(topicsController.addMessage)
  .delete(topicsController.deleteTopic);

router.route('/:name/messages').get(topicsController.getMessagesFromTopic);

module.exports = router;
