const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    transactions: [{ type: Object }],
    items: [{ access_token: String, item_id: String }],
    linkToken: { type: String },
    accessToken: { type: String }  
});

module.exports = mongoose.model('User', userSchema);
