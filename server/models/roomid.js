const mongoose = require('mongoose');

const roomidSchema = new mongoose.Schema({
    roomid: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    details: {
        type: Object,
        required: true,
    }
});

const roomidCollection = new mongoose.model('roomidcollection', roomidSchema);

module.exports = roomidCollection;