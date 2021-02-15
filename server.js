const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const {
  joinUser,
  getCurrentUser,
  getDisconnectedUser,
  getAllUsersInRoom,
  getAllTopics,
} = require('./utils/users');

// Create Server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Setup Routes for testing
const router = require('./router');
app.use(router);

// Socket.io connections and events
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ name, topic }) => {
    const currentUser = joinUser(socket.id, name, topic);

    socket.join(currentUser.topic);

    socket.emit(
      'message',
      formatMessage(
        'admin',
        `You have joined in ${currentUser.topic} room`,
        false
      )
    );

    socket.broadcast
      .to(currentUser.topic)
      .emit(
        'message',
        formatMessage('admin', `${currentUser.name} has joined the chat`, false)
      );

    const allUsers = getAllUsersInRoom(currentUser.topic);
    io.to(currentUser.topic).emit('displayParticipants', allUsers);

    const topics = getAllTopics();
    io.emit('displayTopics', topics);
  });

  socket.on('chatMessage', (message) => {
    const { name, topic } = getCurrentUser(socket.id);

    io.to(topic).emit('message', formatMessage(name, message, true));
  });

  socket.on('disconnect', () => {
    const user = getDisconnectedUser(socket.id);

    if (user) {
      const topics = getAllTopics();
      const isTopicExist = topics.find((el) => el === user.topic);

      if (isTopicExist) {
        // Send a message to users in room
        io.to(user.topic).emit(
          'message',
          formatMessage('admin', `${user.name} has left the chat`, false)
        );

        // Update the list of participants in UI
        const allUsers = getAllUsersInRoom(user.topic);

        if (allUsers.length) {
          io.to(user.topic).emit('displayParticipants', allUsers);
        }
      } else {
        // Remove the empty room in the list of topics in UI
        io.emit('displayTopics', topics);
      }
    }
  });
});

//Listen to server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
