const mongoose = require('mongoose');
const populate = require("mongoose-autopopulate");

const ingredientSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplyCategory',
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    ratingCount: {
        type: String,
        default: 0
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
});

ingredientSchema.plugin(populate);
module.exports = mongoose.model('ingredients', ingredientSchema);
