const express = require("express")
const http = require("http")
const app = express()
const socketio = require("socket.io")
const { generateMessage, generateLocation } = require(__dirname + "/utils/messages.js")
const { addUser, removeUser, getUser, getUsersInRoom } = require(__dirname+"/utils/users.js")

const server = http.createServer(app)
const io = socketio(server)

const port = 5000 || process.env.PORT;

app.use(express.static("public"));


io.on("connection", function (socket) {
    socket.on("join", function ({ username, room }, callback) {

        const { error, user } = addUser({ id: socket.id, username, room });
        
        if (error){
            return callback(error);
        }
        
        socket.join(user.room);

        //server sends message to a new client
        socket.emit("message", generateMessage("Admin","Welcome!"));

        //server sends message to everyone except the one who joined
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin",`${username} has joined!`));

        io.to(room).emit("roomData", {
            room: room,
            users: getUsersInRoom(room)
        });

        callback();
    });

    //receives message from a client
    socket.on("sendMessage", function (message, callback) {
        const user = getUser(socket.id);

        //sends message to all the clients
        io.to(user.room).emit("message", generateMessage(user.username,message));
        callback();
    });


    //recieves location from a client
    socket.on("sendLocation", function (coordiantes, callback) {
        const user = getUser(socket.id);

        //sends location to all the clients
        io.to(user.room).emit("locationMessage", generateLocation(user.username,`https://google.com/maps?q=${coordiantes.latitude},${coordiantes.longitude}`));
        callback();
    });
    

    //sends message to everyone, when someone leaves
    socket.on("disconnect", function () {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
        
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
    
});

server.listen(port, function (req, res) {
    console.log(`server started at port : ${port}`);
});