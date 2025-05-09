import React, { useEffect, useState } from "react";
import { Box, Button, Card, Divider, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { COLORS } from "../assets/theme";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AcceptOrder = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useParams();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.254.114:6002/api/orders/accept-order/${orderId}`
      );
      console.log("Order Details:", response.data);

      setOrderDetails(response.data.order);
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

        <Box sx={{ maxWidth: "315px" }}>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <PersonIcon sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15 }} />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Customer: {orderDetails?.userId?.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <LocationOnIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Delivery Address: {orderDetails?.deliveryAddress?.address}
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
        onClick={() => {}}
      >
        Accept Order
      </Button>
    </Box>
  );
};

export default AcceptOrder;
