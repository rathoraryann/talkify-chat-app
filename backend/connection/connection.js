const mongoose = require('mongoose');

const connection = async() =>{
    mongoose.connect(process.env.MONGO_URI)
}

module.exports = connection;