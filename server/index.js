const express= require("express")
const dotenv= require('dotenv')
const cors = require('cors');
const http= require('http')
const app= express()
const server= http.createServer(app)
const port= 3000
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})