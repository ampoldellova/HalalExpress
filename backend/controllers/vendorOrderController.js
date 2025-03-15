const VendorOrder = require('../models/VendorOrder')
const VendorCart = require('../models/VendorCart')

module.exports = {
    checkoutOrder: async (req, res) => {
        const userId = req.user.id;
        const {
            restaurant,
            orderItems,
            deliveryOption,
            deliveryAddress,
            subTotal,
            deliveryFee,
            totalAmount,
            paymentId,
            paymentMethod,
            paymentStatus,
            orderStatus,
            orderNote
        } = req.body;

        try {
            const vendorCart = await VendorCart.findOne({ userId }).populate('cartItems.productId');

            if (!vendorCart) {
                return res.status(404).json({ status: false, message: 'Vendor Cart not found' });
            }

            const newOrder = new VendorOrder({
                userId,
                supplier: restaurant,
                orderItems,
                deliveryOption,
                deliveryAddress,
                subTotal,
                deliveryFee,
                totalAmount,
                paymentId,
                paymentMethod,
                paymentStatus,
                orderStatus,
                orderNote,
            });

            await newOrder.save();

            vendorCart.cartItems = [];
            vendorCart.totalAmount = 0;
            await vendorCart.save();

            res.status(200).json({ status: true, message: 'Order placed successfully', order: newOrder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getVendorOrders: async (req, res) => {
        const userId = req.user.id;

        try {
            const vendorOrders = await VendorOrder.find({ userId }).sort({ createdAt: -1 });

            if (!vendorOrders) {
                return res.status(404).json({ status: false, message: 'No order found' });
            }

            res.status(200).json({ status: true, vendorOrders });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, message: error.message });
        }
    },
};