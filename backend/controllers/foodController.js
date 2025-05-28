const Food = require("../models/Foods");
const imageFile = require("../utils/imageFile");

module.exports = {
  getAllFoods: async (req, res) => {
    try {
      const foods = await Food.find()
        .populate("category")
        .populate("restaurant");
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ error: "Error fetching foods" });
      console.log(error);
    }
  },

  addFood: async (req, res) => {
    try {
      req.body.imageUrl = await imageFile.uploadSingle({
        imageFile: req.file,
        request: req,
      });

      req.body.foodTags = JSON.parse(req.body.foodTags);
      req.body.additives = JSON.parse(req.body.additives);

      if (req.body.additives && Array.isArray(req.body.additives)) {
        req.body.additives = req.body.additives.map((additive) => ({
          ...additive,
          price: parseFloat(additive.price),
        }));
      }

      const newFood = new Food(req.body);

      await newFood.save();

      res.status(200).json({
        status: true,
        message: "Food item added successfully",
        data: newFood,
      });
    } catch (error) {
      console.error("Error adding food item:", error);
      res.status(500).json({
        status: false,
        message: "Failed to add food item",
        error: error.message,
      });
    }
  },

  getFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId)
        .populate("category")
        .populate("restaurant");

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food not found" });
      }

      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getFoodByRestaurant: async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
      const foods = await Food.find({ restaurant: restaurantId })
        .populate("category")
        .populate("restaurant");

      if (!foods || foods.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No food items found" });
      }

      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }

      await Food.findByIdAndDelete(foodId);
      res
        .status(200)
        .json({ status: true, message: "Food Item Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  foodAvailability: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ status: false });
      }

      food.isAvailable = !food.isAvailable;

      await food.save();

      res.status(200).json({
        status: true,
        message: "Food availability successfully toggled",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedFood) {
        return res
          .status(404)
          .json({ status: false, message: "Food Item not Updated" });
      }

      res
        .status(200)
        .json({ status: true, message: "Food item successfully updated" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Food item successfully updated" });
    }
  },

  addFoodTag: async (req, res) => {
    const foodId = req.params.id;
    const { tag } = req.body;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not updated" });
      }

      if (food.foodTags.includes(tag)) {
        return res
          .status(400)
          .json({ status: false, message: "Tag already exist" });
      }

      food.foodTags.push(tag);
      await food.save();
      res
        .status(200)
        .json({ status: false, message: "Food tag successfully added" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomFoodByCode: async (req, res) => {
    try {
      const randomFoodItem = await Food.aggregate([
        { $match: { code: req.params.code } },
        { $sample: { size: 5 } },
        { $project: { _id: 0 } },
      ]);

      res.status(200).json(randomFoodItem);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  addFoodType: async (req, res) => {
    const foodId = req.params.id;
    const foodType = req.body.foodType;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ status: false, message: error.message });
      }

      if (food.foodType.includes(foodType)) {
        return res
          .status(400)
          .json({ status: false, message: "Food Type already exist" });
      }

      food.foodType.push(foodType);

      await food.save();
      return res
        .status(200)
        .json({ status: true, message: "Type Added Successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomByCategoryAndCode: async (req, res) => {
    const { category, code } = req.params;

    try {
      let foods = await Food.aggregate([
        { $match: { category: category, code: code } },
        { $sample: { size: 10 } },
      ]);

      if (!foods || foods.length === 0) {
        foods = await Food.aggregate([
          { $match: { code: code } },
          { $sample: { size: 10 } },
        ]);
      } else {
        foods = await Food.aggregate([{ $sample: { size: 10 } }]);
      }

      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
