import { Box, Container, Divider, Switch, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
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
import { GaugeContainer, useGaugeState } from "@mui/x-charts/Gauge";
import { LineChart, PieChart } from "@mui/x-charts";
import gauge from "../../assets/images/gaugeChart.png";

const UserStorePage = () => {
  const location = useLocation();
  const store = location.state?.store;
  const [options, setOptions] = React.useState("dashboard");
  const [isAvailable, setIsAvailable] = React.useState(
    store?.isAvailable || false
  );
  const [deliveryAvailability, setDeliveryAvailability] = React.useState(
    store?.delivery || false
  );
  const [pickupAvailability, setPickupAvailability] = React.useState(
    store?.pickup || false
  );
  const [monthlySales, setMonthlySales] = React.useState([]);
  const [topOrderedItems, setTopOrderedItems] = React.useState([]);

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
          `http://localhost:6002/api/supplier/${store?._id}`,
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
          `http://localhost:6002/api/supplier/delivery/${store?._id}`,
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
          `http://localhost:6002/api/supplier/pickup/${store?._id}`,
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
          `http://localhost:6002/api/orders/store/${store?._id}/monthly-sales`,
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

  const fetchTopOrderedItems = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.get(
          `http://localhost:6002/api/orders/store/${store?._id}/top-items`,
          config
        );
        setTopOrderedItems(response.data.topItems);
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error fetching top ordered items:", error);
      toast.error("Failed to fetch top ordered items", error);
    }
  };

  React.useEffect(() => {
    fetchRestaurantMonthlySales();
    fetchTopOrderedItems();
  }, [store?._id]);

  const lineChartData = monthlySales.map((item) => ({
    month: `${item.month} ${item.year}`,
    totalSales: item.totalSales,
    orderCount: item.orderCount,
  }));

  const pieChartData = topOrderedItems.map((item) => ({
    label: item.title,
    value: item.totalOrdered,
  }));

  const customerSatisfaction = store?.rating ? store.rating * 20 : 0;

  function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
    if (valueAngle === null) {
      return null;
    }

    const target = {
      x: cx + outerRadius * Math.sin(valueAngle),
      y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="red" />
        <path
          d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
          stroke="red"
          strokeWidth={3}
        />
      </g>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ display: "flex", flexDirection: "row", mt: 5 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
            mt: 2,
          }}
        >
          <Box
            component="img"
            src={store?.imageUrl?.url}
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
              src={store?.logoUrl?.url}
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
                {store?.title}
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
                  {store?.coords?.address}
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
              width: "100%",
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
              Supplier Dashboard
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: 2,
                border: "1px solid",
                borderColor: COLORS.gray2,
                borderRadius: "15px",
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "bold",
                  fontSize: 24,
                  textAlign: "left",
                }}
              >
                Monthly Sales
              </Typography>

              <LineChart
                dataset={lineChartData}
                xAxis={[{ dataKey: "month", scaleType: "band" }]}
                series={[{ dataKey: "totalSales", label: "Total Sales:" }]}
                height={300}
                grid={{ vertical: true, horizontal: true }}
                slotProps={{
                  legend: { hidden: true },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                    border: "1px solid",
                    borderColor: COLORS.gray2,
                    borderRadius: "15px",
                    p: 2,
                    width: "48%",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "bold",
                      fontSize: 24,
                      textAlign: "left",
                    }}
                  >
                    Top Ordered Products
                  </Typography>

                  <PieChart
                    series={[
                      {
                        data: pieChartData,
                        innerRadius: 30,
                        outerRadius: 80,
                        paddingAngle: 5,
                        cornerRadius: 10,
                      },
                    ]}
                    height={300}
                    slotProps={{
                      legend: {
                        labelStyle: {
                          fontFamily: "regular",
                          fontSize: 12,
                          width: 100,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                    border: "1px solid",
                    borderColor: COLORS.gray2,
                    borderRadius: "15px",
                    p: 2,
                    width: "48%",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "bold",
                      fontSize: 24,
                      textAlign: "left",
                    }}
                  >
                    Customer Satisfaction: {customerSatisfaction.toFixed(2)}%{" "}
                    {customerSatisfaction >= 80
                      ? "😃"
                      : customerSatisfaction >= 60
                      ? "🙂"
                      : customerSatisfaction >= 40
                      ? "😐"
                      : customerSatisfaction >= 20
                      ? "🙁"
                      : "😢"}
                  </Typography>

                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={gauge}
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        objectFit: "cover",
                        top: 0,
                        left: 0,
                        zIndex: -1,
                      }}
                    />
                    <GaugeContainer
                      height={300}
                      startAngle={-90}
                      endAngle={90}
                      value={customerSatisfaction}
                    >
                      <GaugePointer />
                    </GaugeContainer>
                  </Box>
                </Box>
              </Box>
            </Box>
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

export default UserStorePage;
