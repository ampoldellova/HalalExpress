const SupplyCategory = require('../models/SupplyCategory');

module.exports = {
    createSupplyCategory: async (req, res) => {
        const newSupplyCategory = new SupplyCategory(req.body)

        try {
            await newSupplyCategory.save()

            res.status(201).json({ status: true, message: "Supply Category saved Successfully" })
        } catch (error) {
            res.status(500).json({ status: true, message: error.message })
        }
    },

    getSupplyCategories: async (req, res) => {
        try {
            const supplyCategories = await SupplyCategory.find({}, { _v: 0 })
            res.status(200).json(supplyCategories)
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    // updateCategory: async (req, res) => {
    //     const categoryId = req.params.id;

    //     const { title, value, imageUrl } = req.body;

    //     try {
    //         const updatedCategory = await Category.findByIdAndUpdate(categoryId,
    //             {
    //                 title: title,
    //                 value: value,
    //                 imageUrl: imageUrl
    //             }, { new: true });

    //         if (!updatedCategory) {
    //             return res.status(404).json({ status: false, message: "Category not found" });
    //         }

    //         res.status(200).json({ status: true, message: 'Category successfully updated' })

    //     } catch (error) {
    //         res.status(500).json({ status: false, message: error.message })
    //     }

    // },

    // deleteCategory: async (req, res) => {
    //     const categoryId = req.params.id;

    //     try {
    //         const category = await Category.findById(categoryId);

    //         if (!category) {
    //             return res.status(404).json({ status: false, message: "Category not found" })
    //         }

    //         await Category.findByIdAndDelete(categoryId)

    //         res.status(200).json({ status: true, message: "Category successfully deleted" })
    //     } catch (error) {
    //         res.status(500).json({ status: true, message: error.message })
    //     }
    // },


    // patchCategoryImage: async (req, res) => {
    //     const categoryId = req.params.id;
    //     const imageUrl = req.body;

    //     try {
    //         const existingCategory = await Category.findById(categoryId);

    //         const updatedCategory = new Category({
    //             title: existingCategory.title,
    //             value: existingCategory.value,
    //             imageUrl: imageUrl
    //         });

    //         await updatedCategory.save();

    //         res.status(200).json({ status: true, message: "Category image updated successfully" });

    //     } catch (error) {
    //         res.status(500).json({ status: false, message: error.message })
    //     }
    // },

    // getRandomCategories: async (req, res) => {
    //     try {
    //         let categories = await Category.aggregate([
    //             { $match: { value: { $ne: 'more' } } },
    //             { $sample: { size: 7 } }
    //         ]);

    //         const moreCategory = await Category.findOne({ value: "more" });

    //         if (moreCategory) {
    //             categories.push(moreCategory)
    //         }

    //         res.status(200).json(categories)

    //     } catch (error) {
    //         res.status(500).json({ status: false, message: error.message })
    //     }
    // }
};