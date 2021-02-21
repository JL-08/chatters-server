const users = [];
const axios = require('axios');

const joinUser = async (id, name, topic) => {
  // get the topic in DB
  const res = await axios.get(`http://localhost:8000/api/topic/${topic}`);

  // if topic exists in DB
  // add user to topic users list
  if (res) {
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

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

const getDisconnectedUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
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
  getDisconnectedUser,
  getAllUsersInRoom,
  getAllTopics,
};
