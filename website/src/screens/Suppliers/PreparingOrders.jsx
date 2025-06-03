import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import pin from "../../assets/images/pin.png";
import Lottie from "lottie-react";
import empty from "../../assets/anime/emptyOrders.json";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import note from "../../assets/images/note.png";
import axios from "axios";
import { toast } from "react-toastify";

const PreparingOrders = ({ preparingOrders }) => {
  const [loading, setLoading] = React.useState(false);

  const markOrderAsReady = async (orderId) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      await axios.post(
        `http://localhost:6002/api/orders/mark-as-ready`,
        { orderId },
        config
      );

      setLoading(false);
      toast.success("Order marked as ready successfully!");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {preparingOrders.length > 0 ? (
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
            {preparingOrders.map((order) => (
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: 1,
                  }}
                >
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

                    <Typography
                      sx={{
                        fontFamily: "bold",
                        fontSize: 14,
                        color: COLORS.gray,
                        mb: 2,
                      }}
                    >
                      Customer: {order?.userId?.username}
                    </Typography>

                    {order?.orderItems?.map((order) => (
                      <Box sx={{ display: "flex", mb: 2 }} key={order._id}>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={
                              order?.foodId
                                ? order?.foodId?.imageUrl?.url
                                : order?.productId?.imageUrl?.url
                            }
                            sx={{
                              width: 50,
                              height: 50,
                              mr: 1,
                              borderRadius: 3,
                              objectFit: "cover",
                            }}
                          />

                          {order?.instructions && (
                            <Box
                              component="img"
                              src={note}
                              sx={{
                                width: 25,
                                height: 25,
                                position: "absolute",
                                right: 0,
                                top: -10,
                                cursor: "pointer",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                              onClick={() => {
                                toast.info(order?.instructions);
                              }}
                            />
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              sx={{ fontFamily: "regular", fontSize: 14 }}
                            >
                              {order?.quantity}x{" "}
                              {order?.foodId
                                ? order?.foodId?.title
                                : order?.productId?.title}
                            </Typography>

                            {order?.foodId && (
                              <>
                                {order?.additives?.length > 0 ? (
                                  <>
                                    {order?.additives?.map((additive) => (
                                      <Typography
                                        key={additive._id}
                                        sx={{
                                          fontFamily: "regular",
                                          fontSize: 12,
                                          color: COLORS.gray,
                                          ml: 1,
                                        }}
                                      >
                                        + {additive.title}
                                      </Typography>
                                    ))}
                                  </>
                                ) : (
                                  <Typography
                                    sx={{
                                      fontFamily: "regular",
                                      fontSize: 12,
                                      color: COLORS.gray,
                                    }}
                                  >
                                    - No Additives
                                  </Typography>
                                )}
                              </>
                            )}
                          </Box>

                          <Typography
                            sx={{ fontFamily: "regular", fontSize: 14 }}
                          >
                            ₱ {order?.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

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
                        "Are you sure you want to mark this order as ready?"
                      );
                      if (confirmed) {
                        markOrderAsReady(order._id);
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{ color: COLORS.white }}
                      />
                    ) : (
                      "MARK ORDER AS READY"
                    )}
                  </Button>
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

export default PreparingOrders;
