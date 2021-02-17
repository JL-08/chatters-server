const Topic = require('../models/topicsModel');

exports.getAllUsersInRoom = async (req, res) => {
  res.send('get all users');
};

exports.addUser = async (req, res) => {
  res.send('add user');
};

exports.deleteUser = async (req, res) => {
  res.send('delete user');
};
