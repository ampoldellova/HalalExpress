import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import pin from "../../assets/images/pin.png";
import Lottie from "lottie-react";
import empty from "../../assets/anime/emptyOrders.json";
import delivery from "../../assets/anime/delivery.json";
import pickup from "../../assets/images/pickup.png";
import gcash from "../../assets/images/gcash.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import note from "../../assets/images/note.png";
import axios from "axios";
import { toast } from "react-toastify";

const ReadyForPickupOrders = ({ readyForPickupOrders }) => {
  const [loading, setLoading] = React.useState(false);

  const markOrderAsCompleted = async (orderId) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      await axios.post(
        `http://localhost:6002/api/orders/mark-as-completed`,
        { orderId },
        config
      );

      setLoading(false);
      toast.success("Order marked as completed successfully!");
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to mark order as completed."
      );
    }
  };
  return (
    <>
      {readyForPickupOrders.length > 0 ? (
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
            {readyForPickupOrders.map((order) => (
              <Box
                key={order._id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  position: "relative",
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

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: 1,
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "bold",
                        fontSize: 16,
                      }}
                    >
                      Order #: {order?._id}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Box>
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
                      </Box>

                      {order?.deliveryOption === "standard" && (
                        <Lottie
                          animationData={delivery}
                          loop={true}
                          style={{ width: 80 }}
                        />
                      )}

                      {order?.deliveryOption === "pickup" && (
                        <Box
                          component="img"
                          src={pickup}
                          sx={{
                            width: 50,
                            objectFit: "contain",
                            mr: 2,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                {order?.deliveryOption === "standard" && (
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      sx={{
                        bgcolor: COLORS.primary,
                        color: COLORS.white,
                        fontFamily: "bold",
                        borderRadius: 3,
                      }}
                      startIcon={<CheckCircleIcon />}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          sx={{ color: COLORS.white }}
                        />
                      ) : (
                        "DELIVER ORDER"
                      )}
                    </Button>
                  </Box>
                )}

                {order?.deliveryOption === "pickup" && (
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      sx={{
                        bgcolor: COLORS.primary,
                        color: COLORS.white,
                        fontFamily: "bold",
                        borderRadius: 3,
                      }}
                      startIcon={<CheckCircleIcon />}
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Is this order already received by the customer?"
                        );
                        if (confirmed) {
                          markOrderAsCompleted(order._id);
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          sx={{ color: COLORS.white }}
                        />
                      ) : (
                        "ORDER RECEIVED ?"
                      )}
                    </Button>
                  </Box>
                )}
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

export default ReadyForPickupOrders;
