import React from "react";
import Lottie from "lottie-react";
import deliveryAnimation from "../assets/delivery.json";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { COLORS } from "../assets/theme";
import EventNoteIcon from "@mui/icons-material/EventNote";

const HomeScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",

        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "350px" }}>
        <Lottie
          animationData={deliveryAnimation}
          loop={true}
          style={{ width: 350, height: 250 }}
        />
        <Typography
          sx={{
            fontFamily: "bold",
            color: COLORS.primary,
            fontSize: 30,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          HALALEXPRESS DELIVERY
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeScreen;
