const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folders
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000 || process.env.PORT;

// variables
const botName = 'chatcode';

// run when client connects
io.on('connection', socket=>{
    console.log('new ws connection....');
    
    // join user
    socket.on('joinRoom', ({username,room})=>{
        const user = userJoin(socket.id, username,room);

        socket.join(user.room);

         // welcome current user
        socket.emit('msg', formatMessages(botName,`hey ${username} welcome to the home of developers`));

        // boardcast when a user connects
        socket.broadcast.to(user.room).emit('msg', formatMessages(botName,`${username} has joined the chat`));
    })

    // listen chat message
    socket.on('chatMessage', msg=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('msg', formatMessages(user.username, msg))
    })
     // runs when the client disconnects
     socket.on('disconnect', ()=>{
         const user = getCurrentUser(socket.id);

        io.to(user.room).emit('msg', formatMessages(botName,`${user.username} has left the chat`));
    })
})

server.listen(PORT,()=> console.log(`server is running on port: ${PORT}`));