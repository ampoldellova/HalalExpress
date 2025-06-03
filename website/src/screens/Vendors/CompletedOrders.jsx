import { Box, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import gcash from "../../assets/images/gcash1.png";
import pin from "../../assets/images/pin.png";
import Lottie from "lottie-react";
import empty from "../../assets/anime/emptyOrders.json";
import AddAddressMapDisplay from "../../components/Users/AddAddressMapDisplay";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { toast } from "react-toastify";
import note from "../../assets/images/note.png";

const CompletedOrders = ({ completedOrders }) => {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  return (
    <>
      {completedOrders.length > 0 ? (
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
          {!selectedOrder && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                p: 2,
              }}
            >
              {completedOrders.map((order) => (
                <Box
                  key={order._id}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transform: "scale(1.02)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                  onClick={() => openOrderDetails(order)}
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
                      sx={{ display: "flex", flexDirection: "column", ml: 1 }}
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
                        {new Date(order?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(order?.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {selectedOrder && (
            <Box
              sx={{
                bgcolor: COLORS.offwhite,
                height: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
                overflowY: "auto",
                position: "relative",
              }}
            >
              <IconButton
                size="large"
                onClick={() => setSelectedOrder(null)}
                sx={{
                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                  position: "absolute",
                  left: 20,
                  mt: 2,
                  "&:hover": { bgcolor: COLORS.secondary },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <Typography
                sx={{
                  fontFamily: "bold",
                  fontSize: 18,
                  mt: 2,
                }}
              >
                Order #: {selectedOrder?._id}
              </Typography>

              {selectedOrder?.deliveryOption === "standard" && (
                <Box
                  sx={{
                    bgcolor: COLORS.white,
                    p: 2,
                    width: 500,
                    borderRadius: 5,
                  }}
                >
                  <Typography sx={{ fontFamily: "bold", fontSize: 18 }}>
                    Delivery Address:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "regular",
                      fontSize: 14,
                      color: COLORS.gray,
                    }}
                  >
                    {selectedOrder?.deliveryAddress?.address}
                  </Typography>

                  {selectedOrder?.deliveryAddress?.coordinates && (
                    <AddAddressMapDisplay
                      region={selectedOrder?.deliveryAddress?.coordinates}
                    />
                  )}
                </Box>
              )}

              <Box
                sx={{
                  bgcolor: COLORS.white,
                  p: 2,
                  width: 500,
                  borderRadius: 5,
                }}
              >
                <Typography sx={{ fontFamily: "bold", fontSize: 18, mb: 2 }}>
                  Order Summary
                </Typography>

                {selectedOrder?.orderItems?.map((order) => (
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
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
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

                      <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                        ₱ {order?.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    Delivery option:
                  </Typography>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    {selectedOrder?.deliveryOption === "standard"
                      ? "For Delivery"
                      : "For Pickup"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    Payment method:
                  </Typography>
                  {selectedOrder?.paymentMethod === "gcash" ? (
                    <Box
                      component="img"
                      src={gcash}
                      sx={{
                        height: 18,
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

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    Payment status:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "regular",
                      fontSize: 14,
                      bgcolor:
                        selectedOrder?.paymentStatus === "Paid"
                          ? COLORS.primary
                          : COLORS.secondary,
                      color: COLORS.white,
                      px: 2,
                      borderRadius: 3,
                    }}
                  >
                    {selectedOrder?.paymentStatus}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    Subtotal:
                  </Typography>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    ₱ {selectedOrder?.subTotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    Delivery Fee:
                  </Typography>
                  <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                    ₱ {selectedOrder?.deliveryFee.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: "bold", fontSize: 24 }}>
                    Total:
                  </Typography>
                  <Typography sx={{ fontFamily: "bold", fontSize: 24 }}>
                    ₱ {selectedOrder?.totalAmount.toFixed(2)}
                  </Typography>
                </Box>

                {selectedOrder?.orderNote && (
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                      Order note:
                    </Typography>
                    <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                      {selectedOrder?.orderNote}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
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

export default CompletedOrders;
