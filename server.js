const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: './config.env' });

const { formatMessage, addMessage } = require('./utils/messages');
const {
  joinUser,
  removeUser,
  removeTopic,
  getAllUsersInRoom,
  getAllTopics,
} = require('./utils/users');

// Create Server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Setup Routes
const topicsRouter = require('./routes/topicsRoutes');
const usersRouter = require('./routes/usersRoutes');
app.use(express.json());
app.use(cors());
app.use('/api/topic', topicsRouter);
app.use('/api/user', usersRouter);

// Socket.io connections and events
io.on('connection', (socket) => {
  let currentTopic;
  let currentUser;

  socket.on('joinRoom', async ({ name, topic }) => {
    currentTopic = topic;
    currentUser = name;

    // log in DB
    await joinUser(socket.id, name, topic);

    // Join socket in topic
    socket.join(topic);

    // Send a message to user
    socket.emit(
      'message',
      formatMessage('admin', '0', `You have joined in ${topic} room`, false)
    );

    // Send a message to all users in room except the current user
    socket.broadcast
      .to(topic)
      .emit(
        'message',
        formatMessage('admin', '0', `${name} has joined the chat`, false)
      );

    socket.emit('getSocketId', socket.id);

    let allUser = await getAllUsersInRoom(topic);
    io.to(topic).emit('displayParticipants', allUser);

    const topics = await getAllTopics();
    io.emit('displayTopics', topics);
  });

  socket.on('chatMessage', (message) => {
    // const { name, topic } = getCurrentUser(socket.id);
    addMessage(currentUser, socket.id, currentTopic, message);
    io.to(currentTopic).emit(
      'message',
      formatMessage(currentUser, socket.id, message, true)
    );
  });

  socket.on('changeTopic', async (topic, newTopic) => {
    socket.leave(topic);
    await removeUser(topic, socket.id);

    var allUser = await getAllUsersInRoom(topic);

    if (allUser.length > 0) {
      socket.broadcast
        .to(topic)
        .emit(
          'message',
          formatMessage('admin', '0', `${currentUser} has left the chat`, false)
        );

      let users = allUser;
      io.to(topic).emit('displayParticipants', users);
    } else {
      await removeTopic(topic);

      const topics = await getAllTopics();
      io.emit('displayTopics', topics);
    }
  });

  socket.on('disconnect', async () => {
    await removeUser(currentTopic, socket.id);

    var allUser = await getAllUsersInRoom(currentTopic);

    console.log(allUser, allUser.length);
    if (allUser.length > 0) {
      socket.broadcast
        .to(currentTopic)
        .emit(
          'message',
          formatMessage('admin', '0', `${currentUser} has left the chat`, false)
        );

      // Update the list of participants in UI
      let users = allUser;
      io.to(currentTopic).emit('displayParticipants', users);
    } else {
      // Remove the empty room in the list of topics in UI
      await removeTopic(currentTopic);

      const topics = await getAllTopics();
      io.emit('displayTopics', topics);
    }
  });
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('DB connection successful'));

//Listen to server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
