require('dotenv').config()
require("express-async-errors");
const express = require('express');
const { connectDB, connectDBOnline } = require('./config/db');
const errorHandler = require("./middleware/errorhandler");
//const dotenv = require('dotenv');
const cookieParser = require("cookie-parser")
const { notFoundPage } = require('./middleware/notFoundPages');
const path = require('path');


//dotenv.config();

const app = express();


app.use('/upload', express.static(path.join(__dirname, "upload")))


// Init Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser())


const cors = require("cors");
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/adminauth', require('./routes/adminAuth'));
app.use('/api/menu', require('./routes/menus'));
app.use('/api/order', require('./routes/orders'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/payment', require('./routes/payments'));
// Other routes here...

const PORT = process.env.PORT || 5000;

app.use(notFoundPage);
app.use(errorHandler);

let server;
let dbConnection;

async function starter() {
    try {
        //dbConnection = await connectDB();
        dbConnection  = await connectDBOnline();
        if (dbConnection) {
            console.log('Connected to the database successfully...');
        }
        server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error.message);
        process.exit(1); // Exit with a failure code
    }
}

starter();

function gracefulShutdown(signal) {
    console.log(`Received ${signal}. Gracefully shutting down...`);
    server.close(() => {
        console.log('Closed out remaining connections.');
        if (dbConnection) {
            dbConnection.disconnect().then(() => {
                console.log('Disconnected from the database.');
                process.exit(0); // Exit with a success code
            });
        } else {
            process.exit(0); // Exit with a success code
        }
    });

    // If the server hasn't finished in 10 seconds, forcefully shut down
    setTimeout(() => {
        console.error('Forcing shutdown due to timeout.');
        process.exit(1); // Exit with a failure code
    }, 10000);
}

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);



module.exports = app;