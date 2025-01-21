const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connection/connection')
const userRoutes = require("./routes/userRoutes")

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

const PORT = process.env.PORT;

//  a method in Express used to define a route handler for HTTP GET requests
app.get('/', (req, res) => {
    res.send('app is running! ');
})


//  a method used to start the server and make it listen for incoming client requests on a specified port.
app.listen(PORT, () => {
    console.log("server started!");
})