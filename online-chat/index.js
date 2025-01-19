const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
let users = [];
io.on('connection', (socket) => {
    console.log('foydalanuvchi ulandi', socket.id);
    socket.on('userLogin', (username) => {
        users.push({ id: socket.id, username });
        io.emit('updateUsers', users);
        console.log(`${username} tizimga kirdi`);
    });
    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
        console.log(`Xabar: ${data.sender} - ${data.message}`);
    });
    socket.on('disconnect', () => {
        users = users.filter((user) => user.id !== socket.id);
        io.emit('updateUsers', users);
        console.log('foydalanuvchi chiqdi', socket.id);
    });
});
server.listen(3000, () => {
    console.log(`Server http://localhost:${3000} ishlayapti`);
});