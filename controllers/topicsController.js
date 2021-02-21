const Topic = require('../models/topicsModel');

// TODO: change to appropriate status code
exports.getAllTopics = async (req, res) => {
  const topic = await Topic.find();

  res.status(200).json({
    status: 'success',
    results: topic.length,
    data: {
      topic,
    },
  });
};

exports.createTopic = async (req, res) => {
  const newTopic = await Topic.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      topic: newTopic,
    },
  });
};

exports.getTopicByName = async (req, res) => {
  const topic = await Topic.find({ name: req.params.name });

  res.status(200).json({
    status: 'success',
    data: {
      topic,
    },
  });
};

// !works but returns an outdated data
exports.addMessage = async (req, res) => {
  const topics = await Topic.findOneAndUpdate(
    { name: req.params.name },
    {
      $push: {
        messages: {
          sentBy: req.body.sentBy,
          messageText: req.body.messageText,
          sentAt: Date.now(),
        },
      },
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      topics,
    },
  });
};

exports.deleteTopic = async (req, res) => {
  await Topic.deleteOne({ name: req.params.name });

  res.status(200).json({
    status: 'success',
  });
};
