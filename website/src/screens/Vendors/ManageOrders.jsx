import { Box, Typography } from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import PendingOrders from "./PendingOrders";

const ManageOrders = ({ restaurantId }) => {
  const [orderStatus, setOrderStatus] = React.useState("Pending");
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchRestaurantOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(
        `http://localhost:6002/api/orders/store/${restaurantId}/orders`,
        config
      );
      const data = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  React.useEffect(() => {
    fetchRestaurantOrders();
  }, [orders]);

  const pendingOrders =
    orders?.filter((order) => order.orderStatus === "Pending") || [];

  const preparingOrders =
    orders?.filter((order) => order.orderStatus === "Preparing") || [];

  const readyForPickupOrders =
    orders?.filter((order) => order.orderStatus === "Ready for pickup") || [];

  const outForDeliveryOrders =
    orders?.filter((order) => order.orderStatus === "Out for delivery") || [];

  const deliveredOrders =
    orders?.filter((order) => order.orderStatus === "Delivered") || [];

  const completedOrders =
    orders?.filter((order) => order.orderStatus === "Completed") || [];

  const cancelledOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "Cancelled by customer" ||
        order.orderStatus === "Rejected"
    ) || [];

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            color: orderStatus === "Pending" ? COLORS.primary : COLORS.black,
            cursor: "pointer",
          }}
          onClick={() => setOrderStatus("Pending")}
        >
          Pending
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            mx: 3,
          }}
        >
          |
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            my: 3,
            color: orderStatus === "Preparing" ? COLORS.primary : COLORS.black,
            cursor: "pointer",
          }}
          onClick={() => setOrderStatus("Preparing")}
        >
          Preparing
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            mx: 3,
            color: COLORS.black,
          }}
        >
          |
        </Typography>

        <Typography
          onClick={() => setOrderStatus("Ready for pickup")}
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            color:
              orderStatus === "Ready for pickup"
                ? COLORS.primary
                : COLORS.black,
            cursor: "pointer",
          }}
        >
          Ready for Pickup
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            mx: 3,
            color: COLORS.black,
          }}
        >
          |
        </Typography>

        <Typography
          onClick={() => setOrderStatus("Out for delivery")}
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            color:
              orderStatus === "Out for delivery"
                ? COLORS.primary
                : COLORS.black,
            cursor: "pointer",
          }}
        >
          Out for delivery
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            mx: 3,
            color: COLORS.black,
          }}
        >
          |
        </Typography>

        <Typography
          onClick={() => setOrderStatus("Delivered")}
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            color: orderStatus === "Delivered" ? COLORS.primary : COLORS.black,
            cursor: "pointer",
          }}
        >
          Delivered
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            mx: 3,
            color: COLORS.black,
          }}
        >
          |
        </Typography>

        <Typography
          onClick={() => setOrderStatus("Completed")}
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            color: orderStatus === "Completed" ? COLORS.primary : COLORS.black,
            cursor: "pointer",
          }}
        >
          Completed
        </Typography>

        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            mx: 3,
            color: COLORS.black,
          }}
        >
          |
        </Typography>

        <Typography
          onClick={() => setOrderStatus("Cancelled")}
          sx={{
            fontFamily: "regular",
            fontSize: 14,
            color: orderStatus === "Cancelled" ? COLORS.primary : COLORS.black,
            cursor: "pointer",
          }}
        >
          Cancelled
        </Typography>
      </Box>

      {orderStatus === "Pending" && (
        <PendingOrders pendingOrders={pendingOrders} />
      )}
    </Box>
  );
};

export default ManageOrders;
