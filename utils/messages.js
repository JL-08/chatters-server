const moment = require('moment');
const axios = require('axios');

const formatMessage = (sentBy, messageText, isCurrentUserMsg) => {
  return {
    sentBy,
    messageText,
    sentAt: moment().format('h:mm a'),
    isCurrentUserMsg,
  };
};

const addMessage = (user, topic, message) => {
  axios
    .patch(`http://localhost:8000/api/topic/${topic}`, {
      sentBy: user,
      messageText: message,
    })
    .catch((err) => console.log(err));
};

module.exports = { formatMessage, addMessage };
