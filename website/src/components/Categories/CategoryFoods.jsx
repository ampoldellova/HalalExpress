import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid2,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import RestaurantFoodModal from "../Foods/RestaurantFoodModal";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import empty from "../../assets/images/empty.png";
import { toast } from "react-toastify";

const COLORS = {
  primary: "#30b9b2",
  primary1: "#00fff53c",
  secondary: "#ffa44f",
  secondary1: "#ffe5db",
  tertiary: "#0078a6",
  gray: "#83829A",
  gray2: "#C1C0C8",
  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#000000",
  red: "#e81e4d",
  green: " #00C135",
  lightWhite: "#FAFAFC",
};

const CategoryFoods = ({ foods }) => {
  const [openFoodModal, setOpenFoodModal] = useState(false);
  const [foodId, setFoodId] = useState(null);

  const handleConfirmClearCart = async (cartItem, config) => {
    try {
      await axios.delete(`https://halalexpress.onrender.com/api/cart/clear-cart`, config);
      await axios.post(`https://halalexpress.onrender.com/api/cart/`, cartItem, config);
      toast.success("Item added to cart ");
    } catch (error) {
      console.error("Error clearing cart or adding food:", error);
      toast.error("Failed to clear cart or add food");
    }
  };

  const addItemToCart = async (food) => {
    const cartItem = {
      foodId: food?._id,
      restaurantId: food?.restaurant?._id,
      additives: [],
      instructions: "",
      quantity: 1,
      totalPrice: food?.price,
    };

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to add items to the cart.");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await axios.post(
        `https://halalexpress.onrender.com/api/cart/`,
        cartItem,
        config
      );

      if (response.data.cartConflict) {
        const confirmed = window.confirm(
          "Food from different restaurants cannot exist in the same cart. Do you want to clear your cart to add this food?"
        );
        if (confirmed) {
          handleConfirmClearCart(cartItem, config);
        }
      } else {
        toast.success("Item added to cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid2
        container
        spacing={3}
        sx={{ flexDirection: "row", justifyContent: "center", mt: 2 }}
      >
        {foods.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box component="img" src={empty} sx={{ height: 200, width: 200 }} />
            <Typography
              sx={{
                fontFamily: "regular",
                color: COLORS.gray,
                fontSize: 18,
                mt: 2,
              }}
            >
              No products found.
            </Typography>
          </Box>
        ) : (
          <>
            {foods.map((food) => (
              <Card
                sx={{
                  boxShadow: "none",
                  cursor: "pointer",
                  borderRadius: 5,
                  width: 500,
                  borderColor: COLORS.gray2,
                  borderWidth: 1,
                  borderStyle: "solid",
                  padding: 2,
                }}
              >
                <Grid2
                  container
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  onClick={() => {
                    setOpenFoodModal(true);
                    setFoodId(food?._id);
                  }}
                >
                  <CardMedia
                    component="img"
                    image={food?.imageUrl?.url}
                    sx={{
                      height: 140,
                      width: 150,
                      borderRadius: 3,
                      objectFit: "cover",
                    }}
                  />
                  <Grid2 sx={{ flexDirection: "column", ml: 2, width: 300 }}>
                    <Typography
                      sx={{
                        fontFamily: "bold",
                        fontSize: 18,
                      }}
                    >
                      {food?.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 18,
                        my: 1,
                      }}
                    >
                      ₱ {food?.price}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 14,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: COLORS.gray,
                      }}
                    >
                      {food?.description}
                    </Typography>
                  </Grid2>
                </Grid2>

                <IconButton
                  size="medium"
                  sx={{
                    zIndex: 1,
                    position: "absolute",
                    backgroundColor: "white",
                    mt: -6,
                    ml: 1,
                    "&:hover": {
                      backgroundColor: COLORS.primary,
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    addItemToCart(food);
                  }}
                >
                  <AddOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Card>
            ))}
          </>
        )}
      </Grid2>

      <RestaurantFoodModal
        open={openFoodModal}
        onClose={() => setOpenFoodModal(false)}
        foodId={foodId}
      />
    </>
  );
};

export default CategoryFoods;
