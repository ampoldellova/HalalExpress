const mongoose = require('mongoose')
const populate = require("mongoose-autopopulate");

const vendorCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true,
    },
    cartItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ingredients',
            autopopulate: true,
        },
        instructions: {
            type: String,
            trim: true,
            maxlength: 250,
        },
        quantity: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number,
            required: true
        },
    }],
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

vendorCartSchema.plugin(populate);
module.exports = mongoose.model('VendorCart', vendorCartSchema)