const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router
  .route('/')
  .get(usersController.getAllUsersInRoom)
  .post(usersController.addUser);

router.route('/:id').delete(usersController.deleteUser);

module.exports = router;
