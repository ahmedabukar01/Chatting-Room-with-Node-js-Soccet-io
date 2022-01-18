const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folders
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000 || process.env.PORT;

// run when client connects
io.on('connection', socket=>{
    console.log('new ws connection....');

    socket.emit('msg','hey welcome to the home of developers');
})

server.listen(PORT,()=> console.log(`server is running on port: ${PORT}`));