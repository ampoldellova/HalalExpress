const mongoose = require('mongoose');
const populate = require("mongoose-autopopulate");

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    foodTags: {
        type: Array,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        // autopopulate: true,
    },
    code: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        // autopopulate: { select: 'title' },
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
    additives: [{
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
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

foodSchema.plugin(populate);
module.exports = mongoose.model('Food', foodSchema);
