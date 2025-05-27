import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import Lottie from "lottie-react";
import mail from "../../assets/anime/mail.json";
import OtpInput from "react-otp-input";
import axios from "axios";
import { toast } from "react-toastify";

const VerificationPage = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { data } = location.state || {};
  const [otp, setOtp] = useState("");

  const verifyUser = async () => {
    setLoading(true);

    try {
      const endpoint = `http://localhost:6002/verify-otp`;
      const verification = {
        email: data.email,
        otp: otp,
      };

      const response = await axios.post(endpoint, verification);

      if (response.status === 201) {
        setLoading(false);
        toast.success(
          "Verification Successful ✅ Your account has been verified successfully."
        );
        navigation("/");
      } else {
        setLoading(false);
        toast.error(
          "Verification Failed",
          response.data.error || "Please try again."
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error ❌", error.message);
    }
  };

  return (
    <Box sx={{ backgroundColor: COLORS.offwhite, height: "100vh" }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Lottie
          animationData={mail}
          loop={true}
          style={{ width: 300, height: 300, marginTop: 200 }}
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
            mb: 4,
            width: 800,
          }}
        >
          We have sent a verification code to your email address. Please enter
          the code to verify your account.
        </Typography>

        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span style={{ width: "20px" }} />}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: "80px",
            height: "100px",
            fontSize: "44px",
            borderRadius: "18px",
            border: `2px solid ${COLORS.primary}`,
            backgroundColor: "transparent",
            color: COLORS.black,
            textAlign: "center",
          }}
        />

        <Button
          variant="contained"
          sx={{
            mt: 8,
            px: 4,
            py: 2,
            fontSize: 20,
            fontFamily: "bold",
            borderRadius: "18px",
            backgroundColor: COLORS.primary,
            width: "200px",
          }}
          onClick={() => verifyUser()}
        >
          {loading ? (
            <CircularProgress size={34} color="white" />
          ) : (
            "V E R I F Y"
          )}
        </Button>
      </Container>
    </Box>
  );
};

export default VerificationPage;
