const Ingredient = require("../models/Ingredients");
const imageFile = require("../utils/imageFile");

module.exports = {
  getAllIngredients: async (req, res) => {
    try {
      const ingredients = await Ingredient.find()
        .populate("category")
        .populate("supplier");
      res.status(200).json(ingredients);
    } catch (error) {
      res.status(500).json({ error: "Error fetching ingredients" });
      console.log(error);
    }
  },

  addIngredient: async (req, res) => {
    try {
      req.body.imageUrl = await imageFile.uploadSingle({
        imageFile: req.file,
        request: req,
      });

      const newProduct = new Ingredient(req.body);

      await newProduct.save();

      res.status(200).json({
        status: true,
        message: "Product item added successfully",
        data: newProduct,
      });
    } catch (error) {
      console.error("Error adding Product:", error);
      res.status(500).json({
        status: false,
        message: "Failed to add Product",
        error: error.message,
      });
    }
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await Ingredient.findById(productId)
        .populate("category")
        .populate("supplier");

      if (!product) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getIngredientBySupplier: async (req, res) => {
    const supplierId = req.params.supplierId;

    try {
      const ingredients = await Ingredient.find({ supplier: supplierId })
        .populate("category")
        .populate("supplier");

      if (!ingredients || ingredients.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No ingredients found" });
      }

      res.status(200).json(ingredients);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  ingredientAvailability: async (req, res) => {
    const ingredientId = req.params.id;

    try {
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        return res.status(404).json({ status: false });
      }

      ingredient.isAvailable = !ingredient.isAvailable;

      await ingredient.save();

      res.status(200).json({
        status: true,
        message: "Product availability successfully toggled",
        isAvailable: ingredient.isAvailable,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Product availability failed to toggled",
      });
    }
  },

  deleteIngredientById: async (req, res) => {
    const ingredientId = req.params.id;

    try {
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found" });
      }

      await Ingredient.findByIdAndDelete(ingredientId);
      res
        .status(200)
        .json({ status: true, message: "Product Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
