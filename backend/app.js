// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const bcrypt = require('bcrypt');
const plaid = require('plaid');
const User = require('./models/User');  // Adjust the path as necessary

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
        authSource: "admin"
    },
    user: config.mongoUser,
    pass: config.mongoPassword
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Plaid Client setup
const client = new plaid.Client({
    clientID: config.plaidClientID,
    secret: config.plaidSecret,
    env: plaid.environments[config.plaidEnv]
});

// Routes

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: `User created with ID: ${newUser._id}` });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        res.send({ id: user._id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/create_link_token', async (req, res) => {
    const { uid } = req.body;
    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const linkTokenResponse = await client.createLinkToken({
            user: {
                client_user_id: user._id.toString()
            },
            client_name: 'Your App Name',
            products: ['transactions'],
            country_codes: ['US'],
            language: 'en'
        });

        res.json({ link_token: linkTokenResponse.link_token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/get_access_token', async (req, res) => {
    const { public_token, uid } = req.body;
    try {
        const tokenResponse = await client.exchangePublicToken(public_token);
        const { access_token, item_id } = tokenResponse;

        await User.findByIdAndUpdate(uid, { $addToSet: { items: { access_token, item_id } } });

        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const transactionsResponse = await client.getTransactions(access_token, thirtyDaysAgo, today);

        await User.findByIdAndUpdate(uid, { $addToSet: { transactions: { $each: transactionsResponse.transactions } } });

        res.send({ transactions: transactionsResponse.transactions });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
