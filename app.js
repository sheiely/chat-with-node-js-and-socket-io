const express = require('express');
const app = express();

const http = require('http');

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server);
var users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        if(typeof socket.username !== "undefined"){
          
            users.splice(findUserIndex(socket.username), 1);
            console.log('user disconnected: '+socket.username);
            console.log(users);
            io.emit('user disconnected', socket.username);
        }else{
            console.log('user undeffined disconnected');
        }
        
        
    });
    socket.on('chat message', (msg) => {
        console.log(socket.username+": "+msg);
        var index = findUserIndex(socket.username);
        var msgTrated = {
            msg: msg,
            username: socket.username,
            color: users[index].color
        }
        io.emit('chat message', msgTrated);
    });
    socket.on('add user', function(user){
        
        socket.username = user.username;
        users.push(user);
        console.log(users);
        console.log(socket.username + " was joined");
        io.emit('user connected', socket.username);
    });
});





server.listen('8081',function(){
    console.log('servidor na porta 8081');
});



//functions
function findUserIndex(username){
    var obj = users.find(function(user){
        return user.username == username;
    });
    var index = users.indexOf(obj);
    return index;
}




