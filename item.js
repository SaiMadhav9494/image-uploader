const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    description: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    quantity: {
        type: Number,
        unique: false,
        required: false,
    },
    photo: {
        type: String,
        unique: false,
        required: false,
        trim: true
    }
});

module.exports = {
    Item: mongoose.model('Item', ItemSchema)
}