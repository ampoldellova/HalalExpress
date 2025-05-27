import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import Lottie from "lottie-react";
import mail from "../../assets/anime/mail.json";

const VerificationPage = () => {
  const location = useLocation();
  const { data } = location.state || {};

  console.log("VerificationPage data:", data);

  return (
    <Box sx={{ backgroundColor: COLORS.offwhite, height: "100vh" }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Lottie
          animationData={mail}
          loop={true}
          style={{ width: 300, height: 300 }}
        />

        <Typography
          sx={{
            fontFamily: "bold",
            fontSize: 44,
            textAlign: "center",
            mt: 2,
          }}
        >
          Verification Code
        </Typography>
        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 24,
            textAlign: "center",
            color: COLORS.gray,
            mt: 2,
            width: 800,
          }}
        >
          We have sent a verification code to your email address. Please enter
          the code to verify your account.
        </Typography>
      </Container>
    </Box>
  );
};

export default VerificationPage;
