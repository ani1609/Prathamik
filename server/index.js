const express= require("express")
const dotenv= require('dotenv').config()
const connectDb = require('./configDatabase/database');
const cors = require('cors');
const http= require('http')
const app= express()
const server= http.createServer(app)
const port= 3000
connectDb()
app.use(cors({
    origin: 'http://localhost:3001'
  }));
  
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})