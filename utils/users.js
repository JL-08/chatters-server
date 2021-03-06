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

const removeUser = async (topic, socketId) => {
  await axios
    .delete(`http://localhost:8000/api/user/${topic}/${socketId}`)
    .catch((err) => console.log(err));
};

const removeTopic = async (topic) => {
  await axios
    .delete(`http://localhost:8000/api/topic/${topic}`)
    .catch((err) => console.log(err));
};

const getAllUsersInRoom = async (topic) => {
  const res = await axios.get(`http://localhost:8000/api/user/${topic}`);

  if (res.data.data.users) {
    return res.data.data.users.map((user) => user.name);
  } else {
    return [];
  }
};

const getAllTopics = async () => {
  const res = await axios.get(`http://localhost:8000/api/topic`);
  return res.data.data.topics;
};

module.exports = {
  joinUser,
  removeUser,
  removeTopic,
  getAllUsersInRoom,
  getAllTopics,
};
