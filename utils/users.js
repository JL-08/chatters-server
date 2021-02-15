const users = [];

const joinUser = (id, name, topic) => {
  const user = { id, name, topic };
  users.push(user);

  return user;
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

const getAllUsersInRoom = (topic) => {
  return users.filter((user) => user.topic === topic);
};

const getAllTopics = () => {
  const topics = users.map(
    (user) => user.topic.charAt(0).toUpperCase() + user.topic.slice(1)
  );

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
