import { Box, Typography } from "@mui/material";
import React from "react";
import { COLORS } from "../../styles/theme";
import PendingOrders from "./PendingOrders";
import Lottie from "lottie-react";
import PreparingOrders from "./PreparingOrders";
import ReadyForPickupOrders from "./ReadyForPickupOrders";
import OutForDeliveryOrders from "./OutForDeliveryOrders";
import DeliveredOrders from "./DeliveredOrders";
import CompletedOrders from "./CompletedOrders";
import CancelledOrders from "./CancelledOrders";

const ManageOrders = ({ storeId }) => {
  const [orderStatus, setOrderStatus] = React.useState("Pending");
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchStoreOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(
        `http://localhost:6002/api/orders/store/${storeId}/orders`,
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
    fetchStoreOrders();
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

      {loading ? (
        <Box
          sx={{
            width: "100%",
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Lottie
            animationData={require("../../assets/anime/loading.json")}
            style={{ width: "10%", height: "10%" }}
          />
          <Typography
            sx={{
              bottom: 20,
              fontSize: 24,
              color: COLORS.gray,
              fontFamily: "regular",
              mt: 5,
              textAlign: "center",
            }}
          >
            Loading...
          </Typography>
        </Box>
      ) : (
        <>
          {orderStatus === "Pending" && (
            <PendingOrders pendingOrders={pendingOrders} />
          )}

          {orderStatus === "Preparing" && (
            <PreparingOrders preparingOrders={preparingOrders} />
          )}

          {orderStatus === "Ready for pickup" && (
            <ReadyForPickupOrders readyForPickupOrders={readyForPickupOrders} />
          )}

          {orderStatus === "Out for delivery" && (
            <OutForDeliveryOrders outForDeliveryOrders={outForDeliveryOrders} />
          )}

          {orderStatus === "Delivered" && (
            <DeliveredOrders deliveredOrders={deliveredOrders} />
          )}

          {orderStatus === "Completed" && (
            <CompletedOrders completedOrders={completedOrders} />
          )}

          {orderStatus === "Cancelled" && (
            <CancelledOrders cancelledOrders={cancelledOrders} />
          )}
        </>
      )}
    </Box>
  );
};

export default ManageOrders;
