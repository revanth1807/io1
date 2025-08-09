const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users={}
app.get('/', (req, res) => {
    res.render('a');
});

app.set('view engine','ejs');

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message',(from,name,msg) => {
        console.log(`Message for ${name}: ${msg}`);
    if (users[name]) {
        io.to(users[name]).emit('chat message', from ,msg);
    } else {
        console.log(`User "${name}" not found or not connected.`);
    }
    });
    socket.on('register',(uname)=>{
        console.log(uname);
        users[uname]=socket.id;
        socket.username = uname; 
    })
    socket.on('disconnect', () => {
       if (socket.username) {
        delete users[socket.username];
    }
    console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
