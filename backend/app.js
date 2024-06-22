// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
        authSource: "admin" // Usually, admin is used as the authentication database
    },
    user: config.mongoUser,
    pass: config.mongoPassword
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
