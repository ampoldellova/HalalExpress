import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import pin from "../../assets/images/pin.png";
import Lottie from "lottie-react";
import empty from "../../assets/anime/emptyOrders.json";
import delivery from "../../assets/anime/delivery.json";
import pickup from "../../assets/images/pickup.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import icon from "../../assets/images/icon.png";

const ReadyForPickupOrders = ({ readyForPickupOrders }) => {
  const [loading, setLoading] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

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

  const showOrderQRCode = (order) => {
    setSelectedOrder(order);
    setShowQR(true);
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
                      onClick={() => showOrderQRCode(order)}
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

      <Modal
        open={showQR}
        onClose={() => {
          setSelectedOrder(null);
          setShowQR(false);
        }}
      >
        <Box sx={style}>
          <Box
            sx={{
              width: "100%",
              height: "20px",
              bgcolor: COLORS.primary,
              borderRadius: "8px 8px 0 0",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              p: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: 12,
                textAlign: "center",
                mb: 2,
                fontStyle: "italic",
              }}
            >
              Note: Please present this QR code to the delivery person to accept
              the order.
            </Typography>

            {selectedOrder && (
              <QRCodeSVG
                size={228}
                value={`http://localhost:5173/accept-order/${selectedOrder?._id}`}
                imageSettings={{
                  src: icon,
                  x: undefined,
                  y: undefined,
                  height: 50,
                  width: 50,
                  opacity: 1,
                  excavate: true,
                }}
              />
            )}

            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: 12,
                textAlign: "center",
                my: 2,
              }}
            >
              {`http://localhost:5173/accept-order/${selectedOrder?._id}`}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ReadyForPickupOrders;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  justifyContent: "center",
  borderRadius: 5,
  width: 300,
  overflowY: "auto",
};
