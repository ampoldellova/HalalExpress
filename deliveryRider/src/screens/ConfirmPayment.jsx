import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { COLORS } from "../assets/theme";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GCash from "../assets/gcash.png";

const ConfirmPayment = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigation = useNavigate();
  const { orderId } = useParams();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6002/api/orders/accept-order/${orderId}`
      );

      if (
        response?.data?.order?.orderStatus === "Delivered" &&
        response?.data?.order?.paymentStatus === "Pending"
      ) {
        setOrderDetails(response.data.order);
      } else {
        navigation("/");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ width: "350px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            component="img"
            src={logo}
            sx={{ width: "80px", height: "80px" }}
          />
          <Typography
            sx={{
              fontFamily: "semibold",
              textAlign: "center",
              fontSize: "20px",
              mt: 2,
            }}
          >
            Payment Confirmation
          </Typography>
          <Box
            sx={{
              p: 1,
              mt: 1,
              width: "auto",
              borderRadius: "10px",
              backgroundColor: COLORS.offwhite,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ReceiptLongOutlinedIcon
              sx={{
                fontSize: "15px",
                mr: 0.5,
              }}
            />
            <Typography
              sx={{
                fontFamily: "semibold",
                textAlign: "center",
                fontSize: "10px",
              }}
            >
              Order #: {orderDetails?._id}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: "12px",
            textAlign: "left",
            mt: 3,
          }}
        >
          Payment Details
        </Typography>
        <Box
          sx={{
            backgroundColor: COLORS.offwhite,
            borderRadius: "10px",
            mt: 1,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              Payment Method:
            </Typography>

            {orderDetails?.paymentMethod === "cod" ? (
              <Typography
                sx={{
                  fontFamily: "regular",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                Cash On Delivery
              </Typography>
            ) : (
              <Box
                component="img"
                src={GCash}
                sx={{ width: "auto", height: "20px" }}
              />
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              Subtotal:
            </Typography>
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: "12px",
                textAlign: "right",
              }}
            >
              Php.{orderDetails?.totalAmount}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              Delivery Fee:
            </Typography>
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: "12px",
                textAlign: "right",
              }}
            >
              Php.{orderDetails?.deliveryFee}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "bold",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              Total Amount:
            </Typography>
            <Typography
              sx={{
                fontFamily: "bold",
                fontSize: "12px",
                textAlign: "right",
              }}
            >
              Php.{orderDetails?.totalAmount}
            </Typography>
          </Box>
        </Box>

        <Button
          sx={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontFamily: "bold",
            "&:hover": {
              backgroundColor: COLORS.secondary,
            },
            mt: 2,
            width: "100%",
          }}
        >
          Confirm Payment
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmPayment;
