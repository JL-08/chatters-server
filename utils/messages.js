const moment = require('moment');

const formatMessage = (name, msg, isCurrentUserMsg) => {
  return {
    name,
    msg,
    time: moment().format('h:mm a'),
    isCurrentUserMsg,
  };
};

module.exports = formatMessage;
