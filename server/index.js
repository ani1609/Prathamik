require('dotenv').config();
const connectDb = require('./configDatabase/database');
const signupController = require('./controllers/signup');
const loginController = require('./controllers/login');
const cors = require('cors');
const express = require('express');
const { createRoomId , verifyOwner , getAdminDetails } = require('./controllers/roomid');


const app = express();

connectDb();

app.use('/uploads', express.static('uploads'));

const multer = require('multer');
const path = require('path');
const { User } = require('./models/user');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const http = require('http');
const { Server } = require('socket.io');
const { handleUpgrade, handleWebSocketConnection, initializeSignalingServer } = require('./stream/streamrtc');
const routes = require('./Routes/routes');
const { handleInput } = require('./gpt-3.5/gptController/inputController.js');
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001'
}));

//routes
app.use('/signup', signupController);
app.use('/login', loginController);

app.post('/create/roomid', createRoomId);
app.post('/verify/owner', verifyOwner);
app.post('/get/admin/details', getAdminDetails);

// Handle the image upload
app.post('/', upload.single('image'), async (req, res) =>
{
  const { userId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findOne({ _id: userId });
    console.log(user);

    if (!user) {
      return res.status(404).send('User not found');
    }

    User.updateOne({ _id: userId }, { $set: { profileImage: req.file.filename } });

    await user.save();


    res.send(req.file.filename);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

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