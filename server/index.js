const connectDb = require('./configDatabase/database');
const File=require('./models/file');
const cors = require('cors');
const express = require('express');
const app = express();
connectDb();
const http = require('http');
const { Server } = require('socket.io');
const { handleUpgrade, handleWebSocketConnection, initializeSignalingServer } = require('./stream/streamrtc');
const routes = require('./Routes/routes');
const { handleInput } = require('./gpt-3.5/gptController/inputController.js');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001'
}));

app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});
initializeSignalingServer(io);
io.on('connection', handleWebSocketConnection);

server.on('upgrade', handleUpgrade);

app.post('/input', handleInput);

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});