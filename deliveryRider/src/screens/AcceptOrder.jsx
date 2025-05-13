import React, { useEffect, useState } from "react";
import { Badge, Box, Button, Card, Divider, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { COLORS } from "../assets/theme";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import SellIcon from "@mui/icons-material/Sell";
import CallIcon from "@mui/icons-material/Call";
import { database } from "../../config/firebase";
import { doc, setDoc } from "@firebase/firestore";

const AcceptOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useParams();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `https://halalexpress.onrender.com/api/orders/accept-order/${orderId}`
      );
      console.log("Order Details:", response.data);

      setOrderDetails(response.data.order);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const trackRiderLocation = (riderId) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Update Firestore with the rider's current location
          await setDoc(doc(database, "riders", riderId), {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          });
          console.log("Location updated:", { latitude, longitude });
        } catch (error) {
          console.error("Error updating location in Firestore:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(`Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // Stop tracking after a certain time (optional)
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      console.log("Stopped watching location.");
    }, 60000); // Stop after 1 minute
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
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          mb: 1,
        }}
      >
        <Box
          component="img"
          src={logo}
          sx={{ height: 100, width: 100, mr: 1 }}
        />

        <Typography
          sx={{ fontFamily: "bold", color: COLORS.primary, fontSize: 20 }}
        >
          HALALEXPRESS
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontFamily: "bold", mb: 1 }}>
          Order: {orderDetails?._id}
        </Typography>

        <Divider />

        {orderDetails?.orderItems?.map((item) => (
          <Box sx={{ display: "flex", mt: 2 }}>
            <Box
              component="img"
              sx={{
                height: "100px",
                width: "100px",
                borderRadius: 3,
                mr: 2,
              }}
              src={
                item?.foodId
                  ? item?.foodId?.imageUrl?.url
                  : item?.productId?.imageUrl?.url
              }
            />

            <Box
              sx={{ display: "flex", flexDirection: "column", width: "200px" }}
            >
              <Typography sx={{ fontFamily: "regular" }}>
                {item?.foodId ? item?.foodId?.title : item?.productId.title}
              </Typography>
              {item?.foodId && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    overflow: "hidden",
                    maxWidth: "100%",
                  }}
                >
                  {item?.additives?.map((additive, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "regular",
                        fontSize: 12,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {additive?.title}
                      {index !== item?.additives?.length - 1 && " |"}{" "}
                    </Typography>
                  ))}
                </Box>
              )}
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Quantity: {item?.quantity}
              </Typography>
              <Typography sx={{ fontFamily: "regular" }}>
                ₱ {item?.totalPrice}
              </Typography>
            </Box>
          </Box>
        ))}

        <Typography sx={{ fontFamily: "bold", mt: 3 }}>
          Customer Details:
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <Box sx={{ maxWidth: "315px" }}>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <PersonIcon sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15 }} />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Customer: {orderDetails?.userId?.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <CallIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Contact: {orderDetails?.userId?.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <LocationOnIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Delivery Address: {orderDetails?.deliveryAddress?.address}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ fontFamily: "bold", mt: 3 }}>
          Payment Details:
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <Box sx={{ maxWidth: "315px" }}>
          <Box sx={{ display: "flex", alignItems: "start", mt: 1 }}>
            <PaymentIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Payment Method: {orderDetails?.paymentMethod}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <MonitorHeartIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center ",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Payment Status: {orderDetails?.paymentStatus}
              </Typography>
              <Box
                sx={{
                  backgroundColor:
                    orderDetails?.paymentStatus === "Paid"
                      ? COLORS.green
                      : COLORS.secondary,
                  height: "10px",
                  width: "10px",
                  ml: 0.5,
                  borderRadius: 99,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <SellIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Subtotal:
              </Typography>
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                ₱ {orderDetails?.subTotal}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <DeliveryDiningIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Delivery Fee:
              </Typography>
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                ₱ {orderDetails?.deliveryFee}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography sx={{ fontFamily: "bold", fontSize: 16 }}>
              TOTAL:
            </Typography>
            <Typography sx={{ fontFamily: "bold", fontSize: 16 }}>
              ₱ {orderDetails?.totalAmount}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: COLORS.primary,
          color: COLORS.white,
          width: "315px",
          fontFamily: "bold",
          mt: 2,
          "&:hover": {
            backgroundColor: COLORS.secondary,
          },
        }}
        onClick={() => trackRiderLocation(orderDetails?.userId?._id)}
      >
        Accept Order
      </Button>
    </Box>
  );
};

export default AcceptOrder;
