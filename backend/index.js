const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connection/connection')
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const { errorHandler, notFound } = require("./middlewares/errorMiddleware")
const path = require('path')

const app = express();

// CORS enables the backend to respond to requests from the frontend, even though they originate from different origins(ports)
app.use(cors());

app.use(express.json());

// Allows to load env variables from .env file
dotenv.config();

// Connect Backend to mongoDB
connectDB();


// -------Routes-------
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/message", messageRoutes)

// ---------------------------------deployment-------------------------------------------
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"))
})


// ---------------------------------deployment-------------------------------------------


// -------Error handling middlewares-----------
app.use(errorHandler)
app.use(notFound)

const PORT = process.env.PORT;



//  a method used to start the server and make it listen for incoming client requests on a specified port.
const server = app.listen(PORT, () => {
    console.log("server started!");
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (recievedNewMessage) => {
        var chat = recievedNewMessage.chat;

        if (!chat.users) return console.log("chat.user not defined");

        chat.users.forEach((user) => {
            if (user._id == recievedNewMessage.sender._id) return;

            socket.in(user._id).emit("msgRecieved", recievedNewMessage)

        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})