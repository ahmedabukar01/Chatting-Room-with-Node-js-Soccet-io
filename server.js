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

    // welcome current user
    socket.emit('msg','hey welcome to the home of developers');

    // boardcast when a user connects
    socket.broadcast.emit('msg','A user has joined the chat');

    // runs when the client disconnects
    socket.on('disconnect', ()=>{
        io.emit('msg','A user has left the chat');
    })

    // listen chat message
    socket.on('chatMessage', msg=>{
        io.emit('msg', msg)
    })
})

server.listen(PORT,()=> console.log(`server is running on port: ${PORT}`));