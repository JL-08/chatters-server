const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A topic must have a name'],
    unique: true,
    trim: true,
    maxLength: [
      16,
      'A topic name should be less than or equal to 10 characters long',
    ],
    minLength: [
      2,
      'A topic name should be greater than or equal to 2 characters long',
    ],
  },
  users: [
    {
      name: {
        type: String,
      },
      socketId: {
        type: String,
      },
    },
  ],
  messages: [
    {
      sentBy: {
        type: String,
      },
      socketId: {
        type: String,
      },
      messageText: {
        type: String,
      },
      sentAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const Topic = mongoose.model('Topic', topicsSchema);

module.exports = Topic;
