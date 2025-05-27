import React from "react";
import Lottie from "lottie-react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../styles/theme";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F3F4F8",
        flexDirection: "column",
      }}
    >
      <Lottie
        animationData={require("../assets/anime/loading.json")}
        style={{ width: "10%", height: "10%" }}
      />
      <Typography
        sx={{
          bottom: 20,
          fontSize: 24,
          color: COLORS.gray,
          fontFamily: "regular",
          mt: 5,
          textAlign: "center",
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
