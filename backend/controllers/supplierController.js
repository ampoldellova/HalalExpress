const Supplier = require('../models/Supplier');
const imageFile = require('../utils/imageFile')

module.exports = {
    addSupplier: async (req, res) => {
        const newSupplier = new Supplier(req.body)

        try {
            await newSupplier.save()
            res.status(201).json({ status: true, message: "Supplier Created Successfully" })
        } catch (error) {
            res.status(500).json({ status: false, message: "Error Creating supplier", error: error.message })
        }
    },

    getSupplierStoreByOwner: async (req, res) => {
        const { ownerId } = req.params;
        try {
            const supplierStores = await Supplier.find({ owner: ownerId });

            if (!supplierStores.length) {
                return res.status(404).json({ status: false, message: "No Store of Supplier found for this owner" });
            }

            res.status(200).json({ status: true, data: supplierStores });
        } catch (error) {
            res.status(500).json({ status: false, message: "Error fetching Store by owner", error: error.message });
        }
    },

    getAllSuppliers: async (req, res) => {
        try {
            const suppliers = await Supplier.find();
            res.status(200).json(suppliers);
        } catch (error) {
            res.status(500).json({ error: "Error fetching suppliers" });
        }
    },

    serviceAvailability: async (req, res) => {
        const supplierId = req.params.id;

        try {
            const supplier = await Supplier.findById(supplierId)

            if (!supplier) {
                return res.status(403).json({ status: false, message: "supplier not found" })
            }

            supplier.isAvailable = !supplier.isAvailable
            await supplier.save()
            res.status(200).json({ status: true, message: "Availability Successfully Toggled", isAvailable: supplier.isAvailable })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    pickupAvailability: async (req, res) => {
        const supplierId = req.params.id;

        try {
            const supplier = await Supplier.findById(supplierId)

            if (!supplier) {
                return res.status(403).json({ status: false, message: "supplier not found" })
            }

            supplier.pickup = !supplier.pickup
            await supplier.save()
            res.status(200).json({ status: true, message: "Availability for Pick-Up Successfully Toggled", pickup: supplier.pickup })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    deliveryAvailability: async (req, res) => {
        const supplierId = req.params.id;

        try {
            const supplier = await Supplier.findById(supplierId)

            if (!supplier) {
                return res.status(403).json({ status: false, message: "supplier not found" })
            }

            supplier.delivery = !supplier.delivery
            await supplier.save()
            res.status(200).json({ status: true, message: "Availability for Delivery Successfully Toggled", delivery: supplier.delivery })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    editSupplierDetails: async (req, res) => {
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

                await Supplier.findByIdAndUpdate(
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
                res.status(201).json({ success: true, message: "Supplier Details Updated" });
            } else {
                await Supplier.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(201).json({ success: true, message: "Supplier Details Updated" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error", error: err });
        }
    },
}