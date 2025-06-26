const mongoose = require("mongoose")

const linkSchema = new mongoose.Schema({
    campaignTitle: {
        type: String,
        required: true
    },
    campaignUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    clickCount: {
        type: Number,
        default: 0
    },
    user
})