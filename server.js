const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folders
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000 || process.env.PORT;

// variables
const botName = 'chatcode';
const userName = '';

// run when client connects
io.on('connection', socket=>{
    console.log('new ws connection....');
    
    // join user
    socket.on('joinRoom', ({username,room})=>{
         // welcome current user
        socket.emit('msg', formatMessages(botName,'hey welcome to the home of developers'));

        // boardcast when a user connects
        socket.broadcast.emit('msg', formatMessages(botName,'A user has joined the chat'));
    })

    // listen chat message
    socket.on('chatMessage', msg=>{
        io.emit('msg', formatMessages('USER', msg))
    })
     // runs when the client disconnects
     socket.on('disconnect', ()=>{
        io.emit('msg', formatMessages(botName,'A user has left the chat'));
    })
})

server.listen(PORT,()=> console.log(`server is running on port: ${PORT}`));