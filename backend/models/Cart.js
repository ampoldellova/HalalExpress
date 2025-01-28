const mongoose = require('mongoose')
const populate = require("mongoose-autopopulate");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        autopopulate: true,
    },
    additives: {
        type: [],
        default: ''
    },
    instructions: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
}, { timestamps: true });

cartSchema.plugin(populate);
module.exports = mongoose.model('Cart', cartSchema)