const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.route('/').post(usersController.addUser);

router
  .route('/:name')
  .delete(usersController.deleteUser)
  .get(usersController.getAllUsersInRoom);

module.exports = router;
