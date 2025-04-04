const mongoose = require('mongoose')
const populate = require("mongoose-autopopulate");

const vendorOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        autopopulate: true,
    },
    orderItems: [{
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
    deliveryOption: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
    },
    subTotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderNote: {
        type: String,
        trim: true,
        maxlength: 250,
    }
}, { timestamps: true });

vendorOrderSchema.plugin(populate);
module.exports = mongoose.model('VendorOrder', vendorOrderSchema)