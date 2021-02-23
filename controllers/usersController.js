const Topic = require('../models/topicsModel');

exports.getAllUsersInRoom = async (req, res) => {
  const result = await Topic.find({ name: req.params.topicName });

  if (result.length > 0) {
    res.status(200).json({
      status: 'success',
      data: {
        users: result[0].users,
      },
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        users: [],
      },
    });
  }
};

exports.addUser = async (req, res) => {
  const user = await Topic.findOneAndUpdate(
    { name: req.body.name },
    {
      $push: {
        users: {
          name: req.body.users.name,
          socketId: req.body.users.socketId,
        },
      },
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.deleteUser = async (req, res) => {
  await Topic.updateOne(
    { name: req.params.topicName },
    {
      $pull: {
        users: {
          socketId: req.params.socketId,
        },
      },
    }
  );

  res.status(200).json({
    status: 'success',
  });
};

exports.getUserBySocketId = async (req, res) => {
  const result = await Topic.find(
    { name: req.params.topicName },
    { users: { $elemMatch: { socketId: req.params.socketId } } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      topic: req.params.topicName,
      user: result[0].users,
    },
  });
};
