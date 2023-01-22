const express = require("express")
const http = require("http")
const app = express()
const socketio = require("socket.io")
const { generateMessage, generateLocation } = require(__dirname + "/utils/messages.js")

const server = http.createServer(app)
const io = socketio(server)

const port = 5000 || process.env.PORT;

app.use(express.static("public"));


io.on("connection", function (socket) {
    console.log("new websocket connection!");

    //server sends message to new client
    socket.emit("message", generateMessage("Welcome!"));
    
    //server sends message to everyone except the one who joined
    socket.broadcast.emit("message", generateMessage("A new user has joined!"));

    //receives message from a client
    socket.on("sendMessage", function (message,callback) {
        //sends message to all the clients
        io.emit("message", generateMessage(message));
        callback();
    });


    //recieves location from a client
    socket.on("sendLocation", function (coordiantes,callback) {
        //sends location to all the clients
        io.emit("locationMessage", generateLocation(`https://google.com/maps?q=${coordiantes.latitude},${coordiantes.longitude}`));
        callback();
    });
    




    //sends message to everyone, when someone leaves
    socket.on("disconnect", function () {
        io.emit("message", generateMessage("A user has left!"));
    });
    
});

server.listen(port, function (req, res) {
    console.log(`server started at port : ${port}`);
});