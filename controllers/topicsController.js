const Topic = require('../models/topicsModel');

// TODO: change to appropriate status code

exports.getAllTopics = async (req, res) => {
  const topics = await Topic.find().limit(10);

  res.status(200).json({
    status: 'success',
    results: topics.length,
    data: {
      topics,
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

exports.addMessage = async (req, res) => {
  const topics = await Topic.findOneAndUpdate(
    { name: req.params.name },
    {
      $push: {
        messages: {
          sentBy: req.body.sentBy,
          socketId: req.body.socketId,
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

exports.getMessagesFromTopic = async (req, res) => {
  const messages = await Topic.find(
    { name: req.params.name },
    { messages: 1 }
  ).limit(50);

  res.status(200).json({
    status: 'success',
    data: messages,
  });
};
