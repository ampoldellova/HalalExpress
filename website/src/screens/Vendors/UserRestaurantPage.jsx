import { Box, Container, Divider, Switch, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { COLORS } from "../../styles/theme";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MessageIcon from "@mui/icons-material/Message";
import axios from "axios";
import { toast } from "react-toastify";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart, PieChart } from "@mui/x-charts";

const UserRestaurantPage = () => {
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  const [options, setOptions] = React.useState("dashboard");
  const [isAvailable, setIsAvailable] = React.useState(
    restaurant?.isAvailable || false
  );
  const [deliveryAvailability, setDeliveryAvailability] = React.useState(
    restaurant?.delivery || false
  );
  const [pickupAvailability, setPickupAvailability] = React.useState(
    restaurant?.pickup || false
  );
  const [monthlySales, setMonthlySales] = React.useState([]);

  const toggleAvailability = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/restaurant/${restaurant?._id}`,
          {},
          config
        );
        setIsAvailable(response.data.isAvailable);
        toast.success(
          `Service availability has been ${
            response.data.isAvailable ? "enabled" : "disabled"
          }`
        );
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error toggling availability:", error);
      toast.error("Failed to update service availability", error);
    }
  };

  const toggleDeliveryAvailability = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/restaurant/delivery/${restaurant?._id}`,
          {},
          config
        );
        setDeliveryAvailability(response.data.delivery);
        toast.success(
          `Delivery availability has been ${
            response.data.delivery ? "enabled" : "disabled"
          }`
        );
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error toggling delivery availability:", error);
      toast.error("Failed to update delivery availability", error);
    }
  };

  const togglePickupAvailability = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `http://localhost:6002/api/restaurant/pickup/${restaurant?._id}`,
          {},
          config
        );
        setPickupAvailability(response.data.pickup);
        toast.success(
          `Pick-up availability has been ${
            response.data.pickup ? "enabled" : "disabled"
          }`
        );
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error toggling pickup availability:", error);
      toast.error("Failed to update pickup availability", error);
    }
  };

  const fetchRestaurantMonthlySales = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.get(
          `http://localhost:6002/api/orders/restaurant/${restaurant?._id}/monthly-sales`,
          config
        );
        setMonthlySales(response.data.sales);
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error fetching monthly sales:", error);
      toast.error("Failed to fetch monthly sales data", error);
    }
  };

  React.useEffect(() => {
    fetchRestaurantMonthlySales();
  }, [restaurant?._id]);

  const chartData = monthlySales.map((item) => ({
    month: `${item.month} ${item.year}`,
    totalSales: item.totalSales,
    orderCount: item.orderCount,
  }));

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ display: "flex", flexDirection: "row", mt: 5, height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            component="img"
            src={restaurant?.imageUrl?.url}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: "18px",
            }}
          />

          <Box sx={{ display: "flex", width: "100%" }}>
            <Box
              component="img"
              src={restaurant?.logoUrl?.url}
              sx={{
                width: 120,
                height: 120,
                borderRadius: 99,
                border: "5px solid white",
                mt: -5,
                mr: 2,
              }}
            />

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontFamily: "bold", fontSize: 18 }}>
                {restaurant?.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <PlaceOutlinedIcon
                  sx={{ color: COLORS.gray, fontSize: 20, mr: 0.5 }}
                />
                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 14,
                    color: COLORS.gray,
                  }}
                >
                  {restaurant?.coords?.address}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: "bold",
                fontSize: 18,
                mb: 2,
              }}
            >
              Options
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                mb: 1,
              }}
            >
              <RestaurantMenuOutlinedIcon
                sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                  Service Availability
                </Typography>
                <Switch checked={isAvailable} onChange={toggleAvailability} />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                mb: 1,
              }}
            >
              <DeliveryDiningIcon
                sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                  Delivery Availability
                </Typography>
                <Switch
                  checked={deliveryAvailability}
                  onChange={toggleDeliveryAvailability}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                mb: 1,
              }}
            >
              <ShoppingBagIcon
                sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                  Pick-Up Availability
                </Typography>
                <Switch
                  checked={pickupAvailability}
                  onChange={togglePickupAvailability}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                mb: 2,
                cursor: "pointer",
                backgroundColor:
                  options === "dashboard" ? COLORS.offwhite : "transparent",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: COLORS.offwhite,
                  borderRadius: "8px",
                },
              }}
              onClick={() => setOptions("dashboard")}
            >
              <DashboardIcon sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                  Dashboard
                </Typography>
                <KeyboardArrowRightIcon
                  sx={{ color: COLORS.gray, fontSize: 30, ml: 1 }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                mb: 2,
                cursor: "pointer",
                backgroundColor:
                  options === "manage" ? COLORS.offwhite : "transparent",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: COLORS.offwhite,
                  borderRadius: "8px",
                },
              }}
              onClick={() => setOptions("manage")}
            >
              <FastfoodIcon sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                  Manage Orders
                </Typography>
                <KeyboardArrowRightIcon
                  sx={{ color: COLORS.gray, fontSize: 30, ml: 1 }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                mb: 2,
                cursor: "pointer",
                backgroundColor:
                  options === "chats" ? COLORS.offwhite : "transparent",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: COLORS.offwhite,
                  borderRadius: "8px",
                },
              }}
              onClick={() => setOptions("chats")}
            >
              <MessageIcon sx={{ color: COLORS.gray, fontSize: 30, mr: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontFamily: "regular", fontSize: 18 }}>
                  Chats
                </Typography>
                <KeyboardArrowRightIcon
                  sx={{ color: COLORS.gray, fontSize: 30, ml: 1 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />

        {options === "dashboard" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "bold",
                fontSize: 24,
                mb: 2,
                textAlign: "center",
              }}
            >
              Dashboard
            </Typography>

            <LineChart
              dataset={chartData}
              xAxis={[{ dataKey: "month", scaleType: "band" }]}
              series={[{ dataKey: "totalSales", label: "Total Sales:" }]}
              height={300}
              grid={{ vertical: true, horizontal: true }}
            />

            <PieChart
              series={[
                {
                  data: [
                    { value: 10, label: "series A" },
                    { value: 15, label: "series B" },
                    { value: 20, label: "series C" },
                  ],

                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -45,
                  endAngle: 225,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={350}
              height={350}
              margin={{ left: -30 }}
            />

            <BarChart
              xAxis={[
                { data: ["group A", "group B", "group C"], scaleType: "band" },
              ]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              height={300}
            />
          </Box>
        )}

        {options === "manage" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "bold",
                fontSize: 24,
                mb: 2,
                textAlign: "center",
              }}
            >
              Manage Orders
            </Typography>
            {/* Chat component can be added here */}
          </Box>
        )}

        {options === "chats" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "bold",
                fontSize: 24,
                mb: 2,
                textAlign: "center",
              }}
            >
              Chats
            </Typography>
            {/* Chat component can be added here */}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserRestaurantPage;

export const dataset = [
  { x: 1, y: 2 },
  { x: 2, y: 5.5 },
  { x: 3, y: 2 },
  { x: 5, y: 8.5 },
  { x: 8, y: 1.5 },
  { x: 10, y: 5 },
];
