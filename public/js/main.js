const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io();

// Get username and room from url using 'qs cdn' liberary;
const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

// rooms and user info
socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outputName(users)
})

// join chat room
socket.emit('joinRoom', {username, room});

// message from the server
socket.on('msg',message=>{
    console.log(message);
    outputMessage(message);

    // scroll chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// message submit 
chatForm.addEventListener('submit', e=>{
    e.preventDefault();
    
    // get message text
    const msg = e.target.elements.msg.value;

    // emit message to server
    socket.emit('chatMessage',msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// display message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

// add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// add users to DOM
function outputName(users){
    userList.innerHTML = `
        ${users.map(user=> `<li>${user.username}</li>`).join('')}
    `
}