const mongoose = require('mongoose');
const { VIEWER_ROLE } = require('../constants/userConstants'); // Import viewer role

const subscriptionSchema = new mongoose.Schema({
    id: { type: String }, // Razorpay subscription ID
    planId: { type: String },
    status: { type: String },
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
    isGoogleUser: { type: Boolean, default: false },
    googleId: { type: String, required: false },
    role: { type: String, default: VIEWER_ROLE },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true, default: null },
    credits: { type: Number, default: 0 },
    subscription: { type: subscriptionSchema, default: () => ({}) },
    // New fields for password reset
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('users', UsersSchema);
