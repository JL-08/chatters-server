const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.route('/').post(usersController.addUser);

router.route('/:topicName').get(usersController.getAllUsersInRoom);

router
  .route('/:topicName/:socketId')
  .get(usersController.getUserBySocketId)
  .delete(usersController.deleteUser);

module.exports = router;
