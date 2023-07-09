const { Server } = require('socket.io');
const { User } = require('../models/user');
let io;
const participants = new Map();
const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';
let drawingData = [];

function initializeSignalingServer(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST']
    }
  });
  io.on('connection', handleWebSocketConnection);
}

function handleWebSocketConnection(socket) {
  console.log(`User Connected: ${socket.id}`);

  // const {id} = socket.handshake.query;

  // socket.join(id);

  // socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
  //   console.log(data);
  //   io.in(id).emit(NEW_CHAT_MESSAGE_EVENT, data);
  // });

  socket.on('join', (roomName) => {
    socket.join(roomName);
  });

  socket.on("send_value", (data) => {
    socket.broadcast.to(data.roomid).emit("ide_value", data.value);
  });

  socket.on("send_file", (data) => {
    socket.broadcast.to(data.roomid).emit("ide_file", data.value);
  });

  socket.on("send_index", (data) => {
    socket.broadcast.to(data.roomid).emit("ide_index", data.value);
  });

  socket.on("delete_file", (data) => {
    socket.broadcast.to(data.roomid).emit("new_file", data.value);
  });

  socket.on("chat_message", async (data) => {
    const id = data.roomid;
    const userID = data.user;
    const user = await User.findOne({ _id: userID });
    data = {
      ...data,
      profile: user
    }

    socket.emit("new_message", data);
    socket.broadcast.to(id).emit("new_message", data);
  });

  socket.on("bot_message", (data) => {
    socket.broadcast.to(data.roomid).emit("bot_message", data);
  });

  socket.on("output", (data) => {
    socket.broadcast.to(data.roomid).emit("output", data.value);
  });

  socket.on("input", (data) => {
    socket.broadcast.to(data.roomid).emit("input", data.value);
  });

  socket.on('canvas-data', (data) => {
    socket.broadcast.to(data.roomid).emit('canvas-data', data.value);
  })

  socket.on('ide-show', (data) => {
    socket.broadcast.to(data.roomid).emit('ide-show', data.value);
  })

  socket.on('wb-show', (data) => {
    socket.broadcast.to(data.roomid).emit('wb-show', data.value);
  })

  socket.on('screen-show', (data) => {
    socket.broadcast.to(data.roomid).emit('screen-show', data.value);
  })

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
}

function handleUpgrade(request, socket, head) {
  io.engine.handleUpgrade(request, socket, head, (socket) => {
    io.emit('connection', socket);
    handleWebSocketConnection(socket);
  });
}

module.exports = {
  initializeSignalingServer,
  handleWebSocketConnection,
  handleUpgrade
};