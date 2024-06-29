const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Import body-parser
const mongoose = require('mongoose'); // Import mongoose
const config = require('./config'); // Import config
const cors = require('cors'); // Import cors
const bcrypt = require('bcrypt'); // Import bcrypt
const User = require('./models/User'); // Import User model
const Transaction = require('./models/Transaction'); // Import Transaction model
const { Configuration: PlaidConfiguration, PlaidApi, PlaidEnvironments } = require('plaid'); // Import Plaid SDK
const OpenAIApi = require('openai'); // Import OpenAI SDK

const app = express(); // Create express app
const port = 3001; // Define port

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: { authSource: "admin" },
    user: config.mongoUser,
    pass: config.mongoPassword
});

const db = mongoose.connection; // Get DB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Log connection errors

// Configure Plaid client
const configuration = new PlaidConfiguration({
    basePath: PlaidEnvironments[config.plaidEnv],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': config.plaidClientID,
            'PLAID-SECRET': config.plaidSecret,
        },
    },
});
const client = new PlaidApi(configuration); // Create Plaid API client

const openai = new OpenAIApi({ apiKey: config.openaiApiKey }); // Configure OpenAI client

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const newUser = new User({ email, password: hashedPassword }); // Create new user
        await newUser.save(); // Save user to DB
        res.send({ id: newUser._id }); // Send user ID
        console.log(`User ${email} Registered with ID: ${newUser._id}`);
    } catch (error) {
        res.status(400).send({ error: error.message }); // Send error response
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); // Find user by email
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Invalid email or password' }); // Invalid credentials
        }
        res.send({ id: user._id }); // Send user ID
        console.log(`User ${email} Logged in with ID: ${user._id}`);
    } catch (error) {
        res.status(400).send({ error: error.message }); // Send error response
    }
});

// Create link token endpoint
app.post('/create_link_token', async (req, res) => {
    const { uid } = req.body;
    try {
        const user = await User.findById(uid); // Find user by ID
        if (!user) return res.status(404).send({ error: 'User not found' });

        if (user.linkToken) {
            console.log('Returning existing link token');
            return res.json({ link_token: user.linkToken }); // Return existing link token
        }

        const request = {
            user: { client_user_id: user._id.toString() },
            client_name: 'Your App Name',
            products: ['transactions'],
            country_codes: ['US'],
            language: 'en',
        };

        console.log('Creating link token with request:', request);
        const response = await client.linkTokenCreate(request); // Create link token
        console.log('Link token created:', response.data.link_token);

        user.linkToken = response.data.link_token; // Save link token to user
        await user.save();

        res.json({ link_token: response.data.link_token }); // Send link token
    } catch (error) {
        console.error('Error creating link token:', error);
        res.status(500).send({ error: error.message }); // Send error response
    }
});

// Get access token endpoint
app.post('/get_access_token', async (req, res) => {
    const { public_token, uid } = req.body;
    try {
        const user = await User.findById(uid); // Find user by ID
        if (!user) return res.status(404).send({ error: 'User not found' });

        let access_token;
        let item_id;
        console.log('Begin!');

        if (user.accessToken) {
            console.log('Returning existing access token');
            access_token = user.accessToken; // Return existing access token
        } else {
            const tokenResponse = await client.itemPublicTokenExchange({ public_token }); // Exchange public token
            access_token = tokenResponse.data.access_token;
            item_id = tokenResponse.data.item_id;

            user.accessToken = access_token; // Save access token to user
            user.items.push({ access_token, item_id }); // Save item ID to user
            await user.save();
        }

        res.send({ access_token }); // Send access token
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).send({ error: error.message }); // Send error response
    }
});

// Get transactions endpoint
app.post('/get_transactions', async (req, res) => {
    const { uid } = req.body;
    console.log('retrieving transactions');
    try {
        const user = await User.findById(uid); // Find user by ID
        if (!user) return res.status(404).send({ error: 'User not found' });

        console.log(`for user: ${uid}`);
        const access_token = user.accessToken; // Get access token from user
        if (!access_token) return res.status(400).send({ error: 'Access token not found' });

        console.log(`access token: ${user.accessToken}`);

        const today = new Date().toISOString().split('T')[0]; // Get today's date
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]; // Get date 30 days ago
        const transactionsResponse = await client.transactionsGet({
            access_token,
            start_date: thirtyDaysAgo,
            end_date: today,
        });

        const transactions = transactionsResponse.data.transactions; // Get transactions from response

        await Transaction.deleteMany({ userId: uid }); // Delete existing transactions for user

        const transactionDocs = transactions.map(transaction => ({ // Map transactions to documents
            userId: uid,
            name: transaction.name,
            date: transaction.date,
            amount: transaction.amount,
            category: transaction.category,
        }));

        await Transaction.insertMany(transactionDocs); // Insert new transactions

        res.send({ transactions }); // Send transactions
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send({ error: error.message }); // Send error response
    }
});

// Categorize transactions endpoint
app.post('/categorize_transactions', async (req, res) => {
    const { uid } = req.body;
    console.log(`Categorizing transactions for user: ${uid}`);
    try {
        const transactions = await Transaction.find({ userId: uid }); // Find transactions for user
        if (transactions.length === 0) return res.status(404).send({ error: 'No transactions found for this user.' });

        const prompt = `Categorize the following transactions into general categories and subcategories (if applicable) 
        and return the result as a JSON object, format it as such, the categories are the objects, each category contains 
        the transactions within:\n\n${JSON.stringify(transactions)}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant designed to categorize transactions into categories, and sub categories." },
                { role: "user", content: prompt },
            ],
            temperature: 0,
            response_format: { type: "json_object" },
        });
        const message = completion.choices[0].message.content;

        let categorizedTransactions;
        try {
            categorizedTransactions = JSON.parse(message.trim()); // Parse JSON response
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).send({ error: 'Error parsing response from OpenAI' }); // Send error response
        }

        res.send({ categorizedTransactions }); // Send categorized transactions
    } catch (error) {
        console.error('Error categorizing transactions:', error);
        res.status(500).send({ error: error.message }); // Send error response
    }
});

// Check access token endpoint
app.post('/check_access_token', async (req, res) => {
    const { uid } = req.body;
    try {
        const user = await User.findById(uid); // Find user by ID
        if (!user) return res.status(404).send({ error: 'User not found' });
        const hasAccessToken = !!user.accessToken; // Check if user has access token
        res.send({ hasAccessToken }); // Send access token status
    } catch (error) {
        console.error('Error checking access token:', error);
        res.status(500).send({ error: error.message }); // Send error response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log server start
});