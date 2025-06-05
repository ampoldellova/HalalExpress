import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { COLORS } from "../assets/theme";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GCash from "../assets/gcash.png";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { database } from "../../config/firebase";

const ConfirmPayment = () => {
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigation = useNavigate();
  const { orderId } = useParams();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `https://halalexpress.onrender.com/api/orders/accept-order/${orderId}`
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

  const confirmPayment = async () => {
    setLoading(true);
    try {
      await axios.post(
        `https://halalexpress.onrender.com/api/orders/update-payment/${orderId}`
      );
      // await axios.post(
      //   `https://halalexpress.onrender.com/api/orders/update-payment/${orderId}`
      // );

      const message = {
        _id: new Date().getTime().toString(),
        text: `Your cash on delivery payment has been confirmed. Thank you for your order!`,
        createdAt: new Date(),
        user: {
          _id: orderDetails?.restaurant
            ? orderDetails?.restaurant?._id
            : orderDetails?.supplier?._id,
          name: orderDetails?.restaurant
            ? orderDetails?.restaurant?.title
            : orderDetails?.supplier?.title,
          avatar: orderDetails?.restaurant
            ? orderDetails?.restaurant?.logoUrl?.url
            : orderDetails?.supplier?.logoUrl?.url,
        },
        receiverId: orderDetails?.userId?._id,
        receiverName: orderDetails?.userId?.username,
        receiverAvatar: orderDetails?.userId?.profile?.url,
      };

      await addDoc(collection(database, "chats"), message);
      navigation("/");
      toast.success("Order Payment confirmed!", {
        position: "top-center",
      });
      setLoading(false);
    } catch (error) {
      console.log("Error confirming payment:", error);
      setLoading(false);
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
          loading={loading}
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
          onClick={() => confirmPayment()}
        >
          Confirm Payment
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmPayment;
