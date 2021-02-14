const users = [];

const joinUser = (id, name, topic) => {
  const user = { id, name, topic };
  users.push(user);

  return user;
};

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

const getDeactiveUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getAllUsersInRoom = (topic) => {
  return users.filter((user) => user.topic === topic);
};

module.exports = {
  joinUser,
  getCurrentUser,
  getDeactiveUser,
  getAllUsersInRoom,
};
