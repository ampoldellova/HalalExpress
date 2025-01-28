const Restaurant = require('../models/Restaurant');
const imageFile = require('../utils/imageFile')

module.exports = {
    getAllRestaurants: async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            res.status(200).json(restaurants);
        } catch (error) {
            res.status(500).json({ error: "Error fetching restaurants" });
        }
    },

    addRestaurant: async (req, res) => {
        const newRestaurant = new Restaurant(req.body)

        try {
            await newRestaurant.save()
            res.status(201).json({ status: true, message: "Restaurant Created Successfully" })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Creating Restaurant", error: error.message })
        }
    },

    serviceAvailability: async (req, res) => {
        const restaurantId = req.params.id;

        try {
            const restaurant = await Restaurant.findById(restaurantId)

            if (!restaurant) {
                return res.status(403).json({ status: false, message: "Restaurant not found" })
            }

            restaurant.isAvailable = !restaurant.isAvailable
            await restaurant.save()
            res.status(200).json({ status: true, message: "Availability Successfully Toggled", isAvailable: restaurant.isAvailable })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Toggling Restaurant" })
        }
    },

    pickupAvailability: async (req, res) => {
        const restaurantId = req.params.id;

        try {
            const restaurant = await Restaurant.findById(restaurantId)

            if (!restaurant) {
                return res.status(403).json({ status: false, message: "Restaurant not found" })
            }

            restaurant.pickup = !restaurant.pickup
            await restaurant.save()
            res.status(200).json({ status: true, message: "Availability for Pick-Up Successfully Toggled", pickup: restaurant.pickup })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Toggling Restaurant's Pickup" })
        }
    },

    deliveryAvailability: async (req, res) => {
        const restaurantId = req.params.id;

        try {
            const restaurant = await Restaurant.findById(restaurantId)

            if (!restaurant) {
                return res.status(403).json({ status: false, message: "Restaurant not found" })
            }

            restaurant.delivery = !restaurant.delivery
            await restaurant.save()
            res.status(200).json({ status: true, message: "Availability for Delivery Successfully Toggled", delivery: restaurant.delivery })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Toggling Restaurant's Delivery" })
        }
    },

    deleteRestaurant: async (req, res) => {
        const restaurantId = req.params.id;

        try {
            const restaurant = await Restaurant.findById(restaurantId)

            if (!restaurant) {
                return res.status(403).json({ status: false, message: "Restaurant not found" })
            }

            await Restaurant.findByIdAndDelete(restaurantId)
            res.status(200).json({ status: true, message: "Restaurant Successfully Deleted" })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Deleting Restaurant" })
        }
    },

    getRestaurant: async (req, res) => {
        const restaurantId = req.params.id

        try {
            const restaurant = await Restaurant.findById(restaurantId)

            if (!restaurant) {
                return res.status(404).json({ status: false, message: "Restaurant not found" })
            }

            res.status(200).json({ data: restaurant })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Retrieving Restaurant" })
        }
    },

    getRandomRestaurants: async (req, res) => {
        try {
            let randomRestaurant = [];

            if (req.params.code) {
                randomRestaurant = await Restaurant.aggregate([
                    { $match: { code: req.params.code } },
                    { $sample: { size: 5 } },
                    { $project: { _v: 0 } }
                ])
            }

            if (!randomRestaurant.length) {
                randomRestaurant = await Restaurant.aggregate([
                    { $sample: { size: 5 } },
                    { $project: { _v: 0 } }
                ])
            }

            if (randomRestaurant.length) {
                res.status(200).json(randomRestaurant)
            }

        } catch (error) {
            res.status(500).json({ status: false, message: "Error Finding Restaurants" })
        }
    },

    getRestaurantsByOwner: async (req, res) => {
        const { ownerId } = req.params;
        try {
            const restaurants = await Restaurant.find({ owner: ownerId });

            if (!restaurants.length) {
                return res.status(404).json({ status: false, message: "No restaurants found for this owner" });
            }

            res.status(200).json({ status: true, data: restaurants });
        } catch (error) {
            res.status(500).json({ status: false, message: "Error fetching restaurants by owner", error: error.message });
        }
    },

    editRestaurantDetails: async (req, res) => {
        try {
            if (req.files) {
                if (req.files.logoUrl) {
                    req.body.logoUrl = await imageFile.uploadSingle({
                        imageFile: req.files.logoUrl[0], // Correctly pass file object
                        request: req,
                    });
                }

                if (req.files.imageUrl) {
                    req.body.imageUrl = await imageFile.uploadSingle({
                        imageFile: req.files.imageUrl[0], // Correctly pass file object
                        request: req,
                    });
                }

                await Restaurant.findByIdAndUpdate(
                    req.params.id,
                    {
                        imageUrl: req.body.imageUrl,
                        logoUrl: req.body.logoUrl,
                        title: req.body.title,
                        time: req.body.time,
                        code: req.body.code,
                        coords: req.body.coords,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                res.status(201).json({ success: true, message: "Restaurant Details Updated" });
            } else {
                await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(201).json({ success: true, message: "Restaurant Details Updated" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error", error: err });
        }
    },


}