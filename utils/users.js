let user = {};
const axios = require('axios');

const joinUser = async (id, name, topic) => {
  // get the topic in DB
  const res = await axios.get(`http://localhost:8000/api/topic/${topic}`);

  // if topic exists in DB
  // add user to topic users list
  if (res.data.data.topic.length > 0) {
    axios
      .post('http://localhost:8000/api/user', {
        name: topic,
        users: { name: name, socketId: id },
      })
      .catch((err) => console.log(err));

    // if doesnt exist
    // create topic and insert user
  } else {
    axios
      .post('http://localhost:8000/api/topic', {
        name: topic,
        users: { name: name, socketId: id },
      })
      .catch((err) => console.log(err));
  }
};

const getCurrentUser = async (topic, socketId) => {
  const res = await axios
    .get(`http://localhost:8000/api/user/${topic}/${socketId}`)
    .catch((err) => console.log(err));

  return res.data.data;
};

const removeUser = (topic, socketId) => {
  axios
    .delete(`http://localhost:8000/api/user/${topic}/${socketId}`)
    .catch((err) => console.log(err));
};

const removeTopic = (topic) => {
  axios
    .delete(`http://localhost:8000/api/topic/${topic}`)
    .catch((err) => console.log(err));
};

const getAllUsersInRoom = async (topic) => {
  const res = await axios.get(`http://localhost:8000/api/user/${topic}`);
  return res.data.data.users.map((user) => user.name);
};

const getAllTopics = () => {
  const topics = users.map((user) => user.topic);

  // return topics with removed duplicates
  return topics.filter((topic, index) => topics.indexOf(topic) === index);
};

module.exports = {
  joinUser,
  getCurrentUser,
  removeUser,
  removeTopic,
  getAllUsersInRoom,
  getAllTopics,
};
