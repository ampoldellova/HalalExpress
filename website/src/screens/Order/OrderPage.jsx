import { Box, Button, Container, Rating, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emptyOrder from "../../assets/images/emptyOrder.png";
import Loader from "../../components/Loader";

const COLORS = {
  primary: "#30b9b2",
  primary1: "#00fff53c",
  secondary: "#ffa44f",
  secondary1: "#ffe5db",
  tertiary: "#0078a6",
  gray: "#83829A",
  gray2: "#C1C0C8",
  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#000000",
  red: "#e81e4d",
  green: " #00C135",
  lightWhite: "#FAFAFC",
};

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [orderType, setOrderType] = React.useState("Active");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          "http://localhost:6002/api/orders/",
          config
        );
        setOrders(response.data.orders);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        toast.error("You must be logged in to view your orders");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "Pending" ||
        order.orderStatus === "Preparing" ||
        order.orderStatus === "Ready for pickup" ||
        order.orderStatus === "Out for delivery"
    ) || [];
  const pastOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "Delivered" || order.orderStatus === "Completed"
    ) || [];
  const cancelledOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "Cancelled by customer" ||
        order.orderStatus === "Rejected"
    ) || [];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {orders.length === 0 ? (
            <Container
              maxWidth="sm"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <Box
                component="img"
                src={emptyOrder}
                sx={{ width: 500, height: "auto" }}
              />
              <Typography
                sx={{
                  fontFamily: "regular",
                  fontSize: 16,
                  my: 3,
                  textAlign: "center",
                  color: COLORS.gray,
                  width: 400,
                }}
              >
                You havent made a single order yet. Go to home page to start
                browsing.
              </Typography>

              <Button
                variant="contained"
                sx={{
                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                  fontFamily: "bold",
                  borderRadius: 5,
                  fontSize: 16,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: COLORS.secondary,
                    boxShadow: "none",
                  },
                }}
                onClick={() => navigate("/")}
              >
                Browse Items
              </Button>
            </Container>
          ) : (
            <Box sx={{ height: "100vh" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 3,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 24,
                    color:
                      orderType === "Active" ? COLORS.primary : COLORS.black,
                    cursor: "pointer",
                  }}
                  onClick={() => setOrderType("Active")}
                >
                  Active Orders
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 24,
                    mx: 3,
                  }}
                >
                  |
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 24,
                    my: 3,
                    color:
                      orderType === "Previous" ? COLORS.primary : COLORS.black,
                    cursor: "pointer",
                  }}
                  onClick={() => setOrderType("Previous")}
                >
                  Past Orders
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 24,
                    mx: 3,
                    color: COLORS.black,
                  }}
                >
                  |
                </Typography>

                <Typography
                  onClick={() => setOrderType("Cancelled")}
                  sx={{
                    fontFamily: "regular",
                    fontSize: 24,
                    color:
                      orderType === "Cancelled" ? COLORS.primary : COLORS.black,
                    cursor: "pointer",
                  }}
                >
                  Cancelled Orders
                </Typography>
              </Box>

              {orderType === "Active" && (
                <>
                  {pendingOrders.length === 0 ? (
                    <Container
                      maxWidth="sm"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                      }}
                    >
                      <Box
                        component="img"
                        src={emptyOrder}
                        sx={{ width: 500, height: "auto" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "regular",
                          fontSize: 16,
                          my: 3,
                          textAlign: "center",
                          color: COLORS.gray,
                          width: 400,
                        }}
                      >
                        You have no active orders at the moment. Please check
                        back later or browse items to place a new order.
                      </Typography>
                    </Container>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "90vh",
                        overflowY: "auto",
                      }}
                    >
                      {pendingOrders.map((order) => (
                        <Box
                          key={order?._id}
                          onClick={() => {
                            navigate(`/order-detail/${order?._id}`, {
                              state: { order },
                            });
                          }}
                          sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 5,
                            bgcolor: COLORS.offwhite,
                            cursor: "pointer",
                            width: "500px",
                          }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <Box
                              component="img"
                              src={
                                order?.supplier
                                  ? order?.supplier?.logoUrl?.url
                                  : order?.restaurant?.logoUrl?.url
                              }
                              sx={{
                                height: 80,
                                width: 80,
                                objectFit: "cover",
                                borderRadius: 3,
                              }}
                            />
                            <Box sx={{ ml: 2, width: 800 }}>
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
                                    fontSize: 20,
                                    mb: 1,
                                  }}
                                >
                                  {order?.supplier
                                    ? order?.supplier?.title
                                    : order?.restaurant?.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "bold",
                                    fontSize: 20,
                                    mb: 1,
                                  }}
                                >
                                  ₱ {order?.totalAmount.toFixed(2)}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  fontFamily: "regular",
                                  color: COLORS.gray,
                                  fontSize: 14,
                                }}
                              >
                                Ordered #: {order._id}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "regular",
                                    color: COLORS.gray,
                                    fontSize: 14,
                                    mr: 1,
                                  }}
                                >
                                  Ordered Status:
                                </Typography>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      bgcolor:
                                        order?.orderStatus === "Pending"
                                          ? COLORS.gray2
                                          : order?.orderStatus === "Preparing"
                                          ? COLORS.secondary
                                          : order?.orderStatus ===
                                            "Ready for pickup"
                                          ? COLORS.tertiary
                                          : COLORS.primary,
                                      width: 14,
                                      height: 14,
                                      borderRadius: 99,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontFamily: "bold",
                                      color: COLORS.black,
                                      fontSize: 14,
                                      ml: 0.5,
                                    }}
                                  >
                                    {order?.orderStatus}
                                  </Typography>
                                </Box>
                              </Box>
                              {order?.orderItems.map((item) => (
                                <Typography
                                  key={item?._id}
                                  sx={{
                                    fontFamily: "regular",
                                    fontSize: 16,
                                    ml: 1,
                                  }}
                                >
                                  {item?.quantity}x{" "}
                                  {item?.productId
                                    ? item?.productId?.title
                                    : item?.foodId?.title}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}

              {orderType === "Previous" && (
                <>
                  {pastOrders.length === 0 ? (
                    <Container
                      maxWidth="sm"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80vh",
                      }}
                    >
                      <Box
                        component="img"
                        src={emptyOrder}
                        sx={{ width: 500, height: "auto" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "regular",
                          fontSize: 16,
                          my: 3,
                          textAlign: "center",
                          color: COLORS.gray,
                          width: 400,
                        }}
                      >
                        You have no past orders. Please check back later or
                        browse items to place a new order.
                      </Typography>
                    </Container>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        height: "90vh",
                        overflowY: "auto",
                      }}
                    >
                      {pastOrders.map((order) => (
                        <Box
                          key={order?._id}
                          onClick={() => {
                            navigate(`/order-detail/${order?._id}`, {
                              state: { order },
                            });
                          }}
                          sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 5,
                            bgcolor: COLORS.offwhite,
                            cursor: "pointer",
                            width: "500px",
                          }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <Box
                              component="img"
                              src={
                                order?.supplier
                                  ? order?.supplier?.logoUrl?.url
                                  : order?.restaurant?.logoUrl?.url
                              }
                              sx={{
                                height: 80,
                                width: 80,
                                objectFit: "cover",
                                borderRadius: 3,
                              }}
                            />
                            <Box sx={{ ml: 2, width: 800 }}>
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
                                    fontSize: 20,
                                    mb: 1,
                                  }}
                                >
                                  {order?.supplier
                                    ? order?.supplier?.title
                                    : order?.restaurant?.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "bold",
                                    fontSize: 20,
                                    mb: 1,
                                  }}
                                >
                                  ₱ {order?.totalAmount.toFixed(2)}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  fontFamily: "regular",
                                  color: COLORS.gray,
                                  fontSize: 14,
                                }}
                              >
                                Ordered #: {order._id}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "regular",
                                    color: COLORS.gray,
                                    fontSize: 14,
                                    mr: 1,
                                  }}
                                >
                                  Ordered Status:
                                </Typography>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      bgcolor:
                                        order?.orderStatus === "Pending"
                                          ? COLORS.gray2
                                          : order?.orderStatus === "Preparing"
                                          ? COLORS.secondary
                                          : order?.orderStatus ===
                                            "Ready for pickup"
                                          ? COLORS.tertiary
                                          : COLORS.primary,
                                      width: 14,
                                      height: 14,
                                      borderRadius: 99,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontFamily: "bold",
                                      color: COLORS.black,
                                      fontSize: 14,
                                      ml: 0.5,
                                    }}
                                  >
                                    {order?.orderStatus}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "regular",
                                    color: COLORS.gray,
                                    fontSize: 14,
                                    mr: 0.5,
                                  }}
                                >
                                  Rating:
                                </Typography>

                                {order?.rating?.stars ? (
                                  <Rating
                                    readOnly
                                    value={order?.rating.stars}
                                    sx={{
                                      fontSize: 16,
                                      "& .MuiRating-iconFilled": {
                                        color: COLORS.primary,
                                      },
                                      "& .MuiRating-iconEmpty": {
                                        color: COLORS.gray2,
                                      },
                                    }}
                                  />
                                ) : (
                                  <Typography
                                    sx={{
                                      fontFamily: "bold",
                                      color: COLORS.black,
                                      fontSize: 14,
                                    }}
                                  >
                                    🟡 Pending
                                  </Typography>
                                )}
                              </Box>

                              {order?.orderItems.map((item) => (
                                <Typography
                                  key={item?._id}
                                  sx={{
                                    fontFamily: "regular",
                                    fontSize: 16,
                                    ml: 1,
                                  }}
                                >
                                  {item?.quantity}x{" "}
                                  {item?.productId
                                    ? item?.productId?.title
                                    : item?.foodId?.title}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}

              {orderType === "Cancelled" && (
                <>
                  {cancelledOrders.length === 0 ? (
                    <Container
                      maxWidth="sm"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "90vh",
                        overflowY: "auto",
                      }}
                    >
                      <Box
                        component="img"
                        src={emptyOrder}
                        sx={{ width: 500, height: "auto" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "regular",
                          fontSize: 16,
                          my: 3,
                          textAlign: "center",
                          color: COLORS.gray,
                          width: 400,
                        }}
                      >
                        You have no cancelled orders. Please check back later or
                        browse items to place a new order.
                      </Typography>
                    </Container>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cancelledOrders.map((order) => (
                        <Box
                          key={order?._id}
                          onClick={() => {
                            navigate(`/order-detail/${order?._id}`, {
                              state: { order },
                            });
                          }}
                          sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 5,
                            bgcolor: COLORS.offwhite,
                            cursor: "pointer",
                            width: "500px",
                          }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <Box
                              component="img"
                              src={
                                order?.supplier
                                  ? order?.supplier?.logoUrl?.url
                                  : order?.restaurant?.logoUrl?.url
                              }
                              sx={{
                                height: 80,
                                width: 80,
                                objectFit: "cover",
                                borderRadius: 3,
                              }}
                            />
                            <Box sx={{ ml: 2, width: 800 }}>
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
                                    fontSize: 20,
                                    mb: 1,
                                  }}
                                >
                                  {order?.supplier
                                    ? order?.supplier?.title
                                    : order?.restaurant?.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "bold",
                                    fontSize: 20,
                                    mb: 1,
                                  }}
                                >
                                  ₱ {order?.totalAmount.toFixed(2)}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  fontFamily: "regular",
                                  color: COLORS.gray,
                                  fontSize: 14,
                                }}
                              >
                                Ordered #: {order._id}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "regular",
                                    color: COLORS.gray,
                                    fontSize: 14,
                                    mr: 1,
                                  }}
                                >
                                  Ordered Status:
                                </Typography>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      bgcolor:
                                        order?.orderStatus === "Pending"
                                          ? COLORS.gray2
                                          : order?.orderStatus === "Preparing"
                                          ? COLORS.secondary
                                          : order?.orderStatus ===
                                            "Ready for pickup"
                                          ? COLORS.tertiary
                                          : order?.orderStatus ===
                                            "Cancelled by customer"
                                          ? COLORS.gray2
                                          : COLORS.primary,
                                      width: 14,
                                      height: 14,
                                      borderRadius: 99,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontFamily: "bold",
                                      color: COLORS.black,
                                      fontSize: 14,
                                      ml: 0.5,
                                    }}
                                  >
                                    {order?.orderStatus}
                                  </Typography>
                                </Box>
                              </Box>
                              {order?.orderItems.map((item) => (
                                <Typography
                                  key={item?._id}
                                  sx={{
                                    fontFamily: "regular",
                                    fontSize: 16,
                                    ml: 1,
                                  }}
                                >
                                  {item?.quantity}x{" "}
                                  {item?.productId
                                    ? item?.productId?.title
                                    : item?.foodId?.title}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default OrderPage;
