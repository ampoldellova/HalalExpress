import { Box, Typography } from "@mui/material";
import React from "react";
import { COLORS } from "../styles/theme";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: COLORS.primary,
        height: 100,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 5,
      }}
    >
      <Typography
        sx={{
          color: COLORS.white,
          fontFamily: "bold",
          fontSize: 20,
        }}
      >
        © 2025 HalalExpress. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
