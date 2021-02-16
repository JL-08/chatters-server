const Topic = require('../models/topicsModel');

exports.getAllTopics = async (req, res) => {
  const topics = await Topic.find();

  res.status(200).json({
    status: 'success',
    results: topics.length,
    data: {
      topics,
    },
  });
};

exports.createTopic = (req, res) => {
  res.send('create topics');
};
