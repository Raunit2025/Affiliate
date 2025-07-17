const mongoose = require('mongoose');
const { VIEWER_ROLE } = require('../constants/userConstants'); // Import viewer role

const subscriptionSchema = new mongoose.Schema({
    id: { type: String }, // Razorpay subscription ID
    planId: { type: String },
    status: { type: String, default: 'pending' },
    start: { type: Date },
    end: { type: Date },
    lastBillDate: { type: Date },
    nextBillDate: { type: Date },
    paymentsMade: { type: Number },
    paymentsRemaining: { type: Number },
});

const UsersSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    isGoogleUser: { type: Boolean, default: false }, // Changed to Boolean for clarity
    googleId: { type: String, required: false },
    role: { type: String, default: VIEWER_ROLE }, // Corrected: Default role to viewer
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true, default: null }, // Default to null
    credits: { type: Number, default: 0 },
    subscription: { type: subscriptionSchema, default: () => ({}) }
});

module.exports = mongoose.model('users', UsersSchema);