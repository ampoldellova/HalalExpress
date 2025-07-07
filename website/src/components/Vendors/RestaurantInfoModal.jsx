import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid2,
  Modal,
  Typography,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect } from "react";
import axios from "axios";
import RestaurantMapLocation from "./RestaurantMapLocation";

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
  black: "#242424",
  red: "#e81e4d",
  green: " #00C135",
  lightWhite: "#FAFAFC",
};

const RestaurantInfoModal = ({ open, onClose, restaurantId }) => {
  const [restaurant, setRestaurant] = React.useState(null);

  const getRestaurant = async () => {
    try {
      const response = await axios.get(
        `https://halalexpress.onrender.com/api/restaurant/byId/${restaurantId}`
      );
      setRestaurant(response.data.data);
    } catch (error) {
      console.log("Error fetching restaurant:", error);
    }
  };

  useEffect(() => {
    getRestaurant();
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{ fontSize: 24, fontFamily: "bold" }}>
          {restaurant?.title}
        </Typography>
        <Grid2
          container
          sx={{ flexDirection: "row", alignItems: "center", mt: 3 }}
        >
          <PlaceOutlinedIcon sx={{ fontSize: 28 }} />
          <Typography sx={{ fontSize: 18, fontFamily: "bold" }}>
            Located at:
          </Typography>
        </Grid2>
        <Typography
          sx={{
            fontSize: 14,
            fontFamily: "regular",
            color: COLORS.gray,
            my: 1,
          }}
        >
          {restaurant?.coords?.address}
        </Typography>
        <RestaurantMapLocation coords={restaurant?.coords} />
        <Accordion sx={{ boxShadow: "none", mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0 }}>
            <Grid2
              item
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Grid2
                container
                sx={{ flexDirection: "row", alignItems: "center" }}
              >
                <AccessTimeOutlinedIcon sx={{ fontSize: 28, mr: 1 }} />
                <Typography sx={{ fontSize: 18, fontFamily: "bold" }}>
                  {restaurant?.isAvailable ? "Now Open" : "Closed"}
                </Typography>
              </Grid2>
              <Typography sx={{ fontSize: 18, fontFamily: "medium" }}>
                View More
              </Typography>
            </Grid2>
          </AccordionSummary>
          <AccordionDetails sx={{ flexDirection: "column", p: 0 }}>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Sunday: {restaurant?.hours.sunday.start} -{" "}
              {restaurant?.hours.sunday.end}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Monday: {restaurant?.hours.monday.start} -{" "}
              {restaurant?.hours.monday.end}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Tuesday: {restaurant?.hours.tuesday.start} -{" "}
              {restaurant?.hours.tuesday.end}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Wednesday: {restaurant?.hours.wednesday.start} -{" "}
              {restaurant?.hours.wednesday.end}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Thursday: {restaurant?.hours.thursday.start} -{" "}
              {restaurant?.hours.thursday.end}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Friday: {restaurant?.hours.friday.start} -{" "}
              {restaurant?.hours.friday.end}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontFamily: "regular", color: COLORS.gray }}
            >
              Saturday: {restaurant?.hours.saturday.start} -{" "}
              {restaurant?.hours.saturday.end}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Modal>
  );
};

export default RestaurantInfoModal;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 5,
  width: 500,
  px: 3,
  py: 2,
};
