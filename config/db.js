const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbName = "fooddb"
const url = `${process.env.MONGO_URI}/${dbName}`

const connectDB = async () => {
    try {
        const con = mongoose.connect(url, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        return con
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
