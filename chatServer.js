const express = require("express");

//Sets up Express
const app = express();
// set up socket io
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  socket.on('message', ({name, message}) => {
    io.emit('message', {name, message});
  });
});

http.listen(4000, function(){
  console.log("socket io listening on port 4000");
});