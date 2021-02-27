const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log(conn);
    } catch (error) {
        console.log('DB_ERROR = ', error)
    }


}

module.exports = connectDB;