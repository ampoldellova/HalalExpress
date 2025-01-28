const mongoose = require('mongoose')
const populate = require("mongoose-autopopulate");

const restaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    hours: {
        sunday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
        monday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
        tuesday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
        wednesday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
        thursday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
        friday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
        saturday: {
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        },
    },
    time: {
        type: String,
        required: true,
    },
    imageUrl: {
        public_id: {
            type: String,
            default: 'HalalExpress/Profile/profile_nsvdbb'
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dwkmutbz3/image/upload/v1736011952/HalalExpress/Profile/profile_nsvdbb.png'
        },
    },
    pickup: {
        type: Boolean,
        required: false,
        default: true
    },
    delivery: {
        type: Boolean,
        required: false,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        required: false,
    },
    logoUrl: {
        public_id: {
            type: String,
            default: 'HalalExpress/Profile/profile_nsvdbb'
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dwkmutbz3/image/upload/v1736011952/HalalExpress/Profile/profile_nsvdbb.png'
        },
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingCount: {
        type: String
    },
    coords: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
    }
}, { timestamps: true });

restaurantSchema.plugin(populate);
module.exports = mongoose.model('Restaurant', restaurantSchema)