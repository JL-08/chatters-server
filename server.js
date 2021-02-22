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
  getCurrentUser,
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
      formatMessage('admin', `You have joined in ${topic} room`, false)
    );

    // Send a message to all users in room except the current user
    socket.broadcast
      .to(topic)
      .emit(
        'message',
        formatMessage('admin', `${name} has joined the chat`, false)
      );

    let allUser = await getAllUsersInRoom(topic);
    io.to(topic).emit('displayParticipants', allUser);

    // const topics = getAllTopics();
    // io.emit('displayTopics', topics);
  });

  socket.on('chatMessage', (message) => {
    // const { name, topic } = getCurrentUser(socket.id);
    addMessage(currentUser, currentTopic, message);
    io.to(currentTopic).emit(
      'message',
      formatMessage(currentUser, message, true)
    );
  });

  socket.on('disconnect', async () => {
    await removeUser(currentTopic, socket.id);

    var allUser = await getAllUsersInRoom(currentTopic);

    console.log(allUser, allUser.length);
    if (allUser.length > 0) {
      // Send a message to users in room
      io.to(currentTopic).emit(
        'message',
        formatMessage('admin', `${currentUser} has left the chat`, false)
      );

      // Update the list of participants in UI
      let users = allUser;
      io.to(currentTopic).emit('displayParticipants', users);
    } else {
      // Remove the empty room in the list of topics in UI
      await removeTopic(currentTopic);
      // io.emit('displayTopics', topics);
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
