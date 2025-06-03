import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import gcash from "../../assets/images/gcash1.png";
import pin from "../../assets/images/pin.png";
import Lottie from "lottie-react";
import empty from "../../assets/anime/emptyOrders.json";
import AddAddressMapDisplay from "../../components/Users/AddAddressMapDisplay";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { createRefund } from "../../hook/paymongoService";
import { toast } from "react-toastify";
import { database } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import note from "../../assets/images/note.png";

const DeliveredOrders = ({ deliveredOrders }) => {
  return (
    <>
      {deliveredOrders.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "80vh",
            mt: 1,
            border: `1px solid ${COLORS.gray2}`,
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              alignItems: "start",
              gap: 2,
              p: 2,
            }}
          >
            {deliveredOrders.map((order) => (
              <Box
                key={order._id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  position: "relative",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "20px",
                    bgcolor: COLORS.primary,
                    borderRadius: "8px 8px 0 0",
                  }}
                />

                <Box
                  component="img"
                  src={pin}
                  sx={{
                    position: "absolute",
                    objectFit: "contain",
                    marginLeft: "10px",
                    right: 10,
                    top: 0,
                    width: 50,
                    height: 50,
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "flex-start", p: 1 }}>
                  <Box
                    component="img"
                    src={order?.userId?.profile?.url}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: 99,
                    }}
                  />

                  <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "bold",
                        fontSize: 16,
                      }}
                    >
                      Order #: {order?._id}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "bold",
                        fontSize: 14,
                        color: COLORS.gray,
                      }}
                    >
                      Customer: {order?.userId?.username}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 14,
                        color: COLORS.gray,
                      }}
                    >
                      Delivery option:{" "}
                      {order?.deliveryOption === "standard"
                        ? "For Delivery"
                        : "For Pickup"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontFamily: "regular",
                          fontSize: 14,
                          color: COLORS.gray,
                        }}
                      >
                        Payment Method:
                      </Typography>

                      {order?.paymentMethod === "gcash" ? (
                        <Box
                          component="img"
                          src={gcash}
                          sx={{
                            height: 14,
                            ml: 1,
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            fontFamily: "regular",
                            fontSize: 14,
                            color: COLORS.gray,
                          }}
                        >
                          Cash on Delivery
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 14,
                        color: COLORS.gray,
                      }}
                    >
                      Payment Status:{" "}
                      {order?.paymentStatus === "Paid"
                        ? "🟢 Paid"
                        : "🟡 Pending"}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 14,
                        color: COLORS.gray,
                      }}
                    >
                      Ordered on:{" "}
                      {new Date(order?.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(order?.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "80vh",
            mt: 1,
            border: `1px solid ${COLORS.gray2}`,
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Lottie
            animationData={empty}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
          <Typography
            sx={{
              fontFamily: "regular",
              color: COLORS.gray,
              fontSize: 16,
            }}
          >
            No orders found.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default DeliveredOrders;
