// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    transactions: [{ type: Object }],
    items: [{ type: Object }]
});

module.exports = mongoose.model('User', userSchema);
