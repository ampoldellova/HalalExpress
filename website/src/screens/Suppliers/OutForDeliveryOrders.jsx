import { Box, Typography } from "@mui/material";
import { COLORS } from "../../styles/theme";
import pin from "../../assets/images/pin.png";
import Lottie from "lottie-react";
import empty from "../../assets/anime/emptyOrders.json";
import delivery from "../../assets/anime/delivery.json";
import pickup from "../../assets/images/pickup.png";

const OutForDeliveryOrders = ({ outForDeliveryOrders }) => {
  return (
    <>
      {outForDeliveryOrders.length > 0 ? (
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
            {outForDeliveryOrders.map((order) => (
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
                            height: 57,
                            objectFit: "contain",
                            mr: 2,
                          }}
                        />
                      )}
                    </Box>
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

export default OutForDeliveryOrders;
