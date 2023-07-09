const express= require("express")
const dotenv= require('dotenv').config()
const connectDb = require('./configDatabase/database');
const cors = require('cors');
const http= require('http')
const signupController = require('./controllers/signup');
const loginController = require('./controllers/login');
const app= express()
const server= http.createServer(app)
const port= 3000
connectDb()
//routes
app.use('/signup', signupController);
app.use('/login', loginController);
app.use(cors({
    origin: 'http://localhost:3001'
  }));
  
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})