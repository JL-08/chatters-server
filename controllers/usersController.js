const Topic = require('../models/topicsModel');

exports.getAllUsersInRoom = async (req, res) => {
  const result = await Topic.find({ name: req.params.topicName });

  res.status(200).json({
    status: 'success',
    data: {
      users: result[0].users,
    },
  });
};

exports.addUser = async (req, res) => {
  const user = await Topic.findOneAndUpdate(
    { name: req.body.name },
    {
      $push: {
        users: {
          name: req.body.users.name,
          socketId: req.body.users.id,
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
    { name: req.params.name },
    {
      $pull: {
        users: {
          name: req.body.users.name,
        },
      },
    }
  );

  res.status(200).json({
    status: 'success',
  });
};
