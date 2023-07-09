const { Server } = require('socket.io');
let io;
const participants = new Map();
let streamCode;

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

  socket.on("send_value", (data) => {
    socket.broadcast.emit("ide_value", data);
  });

  socket.on("send_file", (data) => {
    socket.broadcast.emit("ide_file", data);
  });

  socket.on('disconnect', () => {
    handleParticipantLeave(socket);
  });
}
function handleParticipantJoin(socket, streamCode) {
  const participantId = generateParticipantId();

  // Store the participant and their stream code
  participants.set(participantId, socket);

  // Send the participant ID to the client
  socket.emit('participantId', participantId);

  // Broadcast the participant join event to all other participants
  socket.broadcast.emit('participantJoin', participantId, streamCode);
}

function handleParticipantLeave(socket) {
  const participantId = getParticipantIdBySocket(socket);

  if (participantId) {
    // Remove the participant from the map
    participants.delete(participantId);

    // Broadcast the participant leave event to all other participants
    socket.broadcast.emit('participantLeave', participantId);
  }
}

function handleUpgrade(request, socket, head) {
  io.engine.handleUpgrade(request, socket, head, (socket) => {
    io.emit('connection', socket);
    handleWebSocketConnection(socket);
  });
}
function generateParticipantId() {
  return Math.random().toString(36).substr(2, 9);
}

function getParticipantIdBySocket(socket) {
  for (const [participantId, participantSocket] of participants.entries()) {
    if (participantSocket === socket) {
      return participantId;
    }
  }
  return null;
}

module.exports = {
  initializeSignalingServer,
  handleWebSocketConnection,
  handleUpgrade,
  handleParticipantJoin,
  handleParticipantLeave,
  generateParticipantId,
  participants,
};