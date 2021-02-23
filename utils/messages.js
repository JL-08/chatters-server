const moment = require('moment');
const axios = require('axios');

const formatMessage = (sentBy, socketId, messageText, isCurrentUserMsg) => {
  return {
    sentBy,
    socketId,
    messageText,
    sentAt: moment().format('h:mm a'),
    isCurrentUserMsg,
  };
};

const addMessage = (user, socketId, topic, message) => {
  axios
    .patch(`http://localhost:8000/api/topic/${topic}`, {
      sentBy: user,
      socketId,
      messageText: message,
    })
    .catch((err) => console.log(err));
};

module.exports = { formatMessage, addMessage };
