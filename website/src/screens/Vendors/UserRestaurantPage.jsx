import { Box, Container, Divider, Switch, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import { toast } from "react-toastify";

const UserRestaurantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state?.restaurant;
  const [isAvailable, setIsAvailable] = React.useState(
    restaurant?.isAvailable || false
  );
  const [deliveryAvailability, setDeliveryAvailability] = React.useState(
    restaurant?.delivery || false
  );
  const [pickupAvailability, setPickupAvailability] = React.useState(
    restaurant?.pickup || false
  );

  const toggleAvailability = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/restaurant/${restaurant?._id}`,
          {},
          config
        );
        setIsAvailable(response.data.isAvailable);
        toast.success(
          `Service availability has been ${
            response.data.isAvailable ? "enabled" : "disabled"
          }`
        );
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error toggling availability:", error);
      toast.error("Failed to update service availability", error);
    }
  };

  const toggleDeliveryAvailability = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/restaurant/delivery/${restaurant?._id}`,
          {},
          config
        );
        setDeliveryAvailability(response.data.delivery);
        toast.success(
          `Delivery availability has been ${
            response.data.delivery ? "enabled" : "disabled"
          }`
        );
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error toggling delivery availability:", error);
      toast.error("Failed to update delivery availability", error);
    }
  };

  const togglePickupAvailability = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/restaurant/pickup/${restaurant?._id}`,
          {},
          config
        );
        setPickupAvailability(response.data.pickup);
        toast.success(
          `Pick-up availability has been ${
            response.data.pickup ? "enabled" : "disabled"
          }`
        );
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error toggling pickup availability:", error);
      toast.error("Failed to update pickup availability", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="img"
          src={restaurant?.imageUrl?.url}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: "18px",
            mt: 5,
          }}
        />

        <Box sx={{ display: "flex", width: "100%" }}>
          <Box
            component="img"
            src={restaurant?.logoUrl?.url}
            sx={{
              width: 120,
              height: 120,
              borderRadius: 99,
              border: "5px solid white",
              mt: -5,
              mr: 2,
            }}
          />

          <Box>
            <Typography sx={{ fontFamily: "bold", fontSize: 18 }}>
              {restaurant?.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <PlaceOutlinedIcon
                sx={{ color: COLORS.gray, fontSize: 20, mr: 0.5 }}
              />
              <Typography
                sx={{ fontFamily: "regular", fontSize: 14, color: COLORS.gray }}
              >
                {restaurant?.coords?.address}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 5, display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontFamily: "bold",
              fontSize: 18,
              mb: 2,
            }}
          >
            Options
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              mb: 1,
            }}
          >
            <RestaurantMenuOutlinedIcon
              sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                Service Availability
              </Typography>
              <Switch checked={isAvailable} onChange={toggleAvailability} />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              mb: 1,
            }}
          >
            <DeliveryDiningIcon
              sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                Delivery Availability
              </Typography>
              <Switch
                checked={deliveryAvailability}
                onChange={toggleDeliveryAvailability}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              mb: 1,
            }}
          >
            <ShoppingBagIcon sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                Pick-Up Availability
              </Typography>
              <Switch
                checked={pickupAvailability}
                onChange={togglePickupAvailability}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UserRestaurantPage;
