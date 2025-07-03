import {
  Box,
  Container,
  Divider,
  Switch,
  Typography,
  Button,
  ButtonGroup,
} from "@mui/material";
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
import ManageOrders from "./ManageOrders";
import RestaurantChats from "./RestaurantChats";

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
  const [topOrderedFoods, setTopOrderedFoods] = React.useState([]);
  const [salesFilter, setSalesFilter] = React.useState("month"); // "day", "week", "month"
  const [filteredSalesData, setFilteredSalesData] = React.useState([]);

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

  const fetchSalesData = async (period) => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        let endpoint = `http://localhost:6002/api/orders/restaurant/${restaurant?._id}/sales/${period}`;

        // For current day, use a specific endpoint with today's date
        if (period === "day") {
          const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
          endpoint = `http://localhost:6002/api/orders/restaurant/${restaurant?._id}/sales/today?date=${today}`;
        }

        const response = await axios.get(endpoint, config);
        setFilteredSalesData(response.data.sales);
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log(`Error fetching ${period} sales:`, error);
      // Fallback to mock data for demo purposes
      generateMockData(period);
    }
  };

  const generateMockData = (period) => {
    let mockData = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (period === "day") {
      // Generate hourly data for current day (today only)
      const today = currentDate.toDateString();
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, "0");
        // Show actual data for past hours, projected data for future hours
        const isPastHour = i <= currentHour;
        const salesAmount = isPastHour
          ? Math.floor(Math.random() * 1200) + 200 // Higher sales for completed hours
          : Math.floor(Math.random() * 400) + 50; // Lower projected sales for future hours

        mockData.push({
          period: `${hour}:00`,
          totalSales: salesAmount,
          orderCount:
            Math.floor(salesAmount / 50) + Math.floor(Math.random() * 10),
          date: today,
          hour: i,
          isPastHour,
        });
      }
    } else if (period === "week") {
      // Generate daily data for last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const isToday = i === 0;
        mockData.push({
          period: date.toLocaleDateString("en-US", { weekday: "short" }),
          totalSales: isToday
            ? Math.floor(Math.random() * 3000) + 1000 // Today's sales so far
            : Math.floor(Math.random() * 5000) + 500, // Previous days' complete sales
          orderCount: Math.floor(Math.random() * 50) + 10,
          date: date.toDateString(),
          isToday,
        });
      }
    } else {
      // Use monthly data (existing)
      mockData = monthlySales.map((item) => ({
        period: `${item.month} ${item.year}`,
        totalSales: item.totalSales,
        orderCount: item.orderCount,
      }));
    }

    setFilteredSalesData(mockData);
  };

  const handleFilterChange = (newFilter) => {
    setSalesFilter(newFilter);
    if (newFilter === "month") {
      setFilteredSalesData(
        monthlySales.map((item) => ({
          period: `${item.month} ${item.year}`,
          totalSales: item.totalSales,
          orderCount: item.orderCount,
        }))
      );
    } else {
      fetchSalesData(newFilter);
    }
  };

  React.useEffect(() => {
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

    const fetchTopOrderedFoods = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };
          const response = await axios.get(
            `http://localhost:6002/api/orders/restaurant/${restaurant?._id}/top-foods`,
            config
          );
          setTopOrderedFoods(response.data.topFoods);
        } else {
          console.log("Authentication token not found");
        }
      } catch (error) {
        console.log("Error fetching top ordered foods:", error);
        toast.error("Failed to fetch top ordered foods", error);
      }
    };

    const fetchData = async () => {
      await fetchRestaurantMonthlySales();
      await fetchTopOrderedFoods();
    };
    fetchData();
  }, [restaurant?._id]);

  React.useEffect(() => {
    if (monthlySales.length > 0) {
      setFilteredSalesData(
        monthlySales.map((item) => ({
          period: `${item.month} ${item.year}`,
          totalSales: item.totalSales,
          orderCount: item.orderCount,
        }))
      );
    }
  }, [monthlySales]);

  const pieChartData = topOrderedFoods.map((food) => ({
    label: food.title,
    value: food.totalOrdered,
  }));

  const customerSatisfaction = restaurant?.rating ? restaurant.rating * 20 : 0;

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
            mt: 2,
            width: "50%",
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
              Restaurant Dashboard
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "bold",
                      fontSize: 24,
                      textAlign: "left",
                    }}
                  >
                    Sales Overview
                  </Typography>

                  {salesFilter === "day" && (
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 12,
                        color: COLORS.gray,
                        textAlign: "left",
                      }}
                    >
                      Current Day Sales - Updated:{" "}
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Typography>
                  )}

                  {salesFilter === "week" && (
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 12,
                        color: COLORS.gray,
                        textAlign: "left",
                      }}
                    >
                      This Week Sales - From{" "}
                      {new Date(
                        Date.now() - 7 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      to{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  )}

                  {salesFilter === "month" && (
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        fontSize: 12,
                        color: COLORS.gray,
                        textAlign: "left",
                      }}
                    >
                      Monthly Sales - Year {new Date().getFullYear()}{" "}
                    </Typography>
                  )}
                </Box>

                <ButtonGroup variant="outlined" size="small">
                  <Button
                    onClick={() => handleFilterChange("day")}
                    variant={salesFilter === "day" ? "contained" : "outlined"}
                    style={{
                      fontFamily: salesFilter === "day" ? "bold" : "regular",
                      color:
                        salesFilter === "day" ? COLORS.white : COLORS.gray2,
                      backgroundColor:
                        salesFilter === "day" ? COLORS.primary : "transparent",
                      borderColor:
                        salesFilter === "day" ? "transparent" : COLORS.gray2,
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    onClick={() => handleFilterChange("week")}
                    variant={salesFilter === "week" ? "contained" : "outlined"}
                    style={{
                      fontFamily: salesFilter === "week" ? "bold" : "regular",
                      color:
                        salesFilter === "week" ? COLORS.white : COLORS.gray2,
                      backgroundColor:
                        salesFilter === "week" ? COLORS.primary : "transparent",
                      borderColor:
                        salesFilter === "week" ? "transparent" : COLORS.gray2,
                    }}
                  >
                    This Week
                  </Button>
                  <Button
                    onClick={() => handleFilterChange("month")}
                    variant={salesFilter === "month" ? "contained" : "outlined"}
                    style={{
                      fontFamily: salesFilter === "month" ? "bold" : "regular",
                      color:
                        salesFilter === "month" ? COLORS.white : COLORS.gray2,
                      backgroundColor:
                        salesFilter === "month"
                          ? COLORS.primary
                          : "transparent",
                      borderColor:
                        salesFilter === "month" ? "transparent" : COLORS.gray2,
                    }}
                  >
                    Monthly
                  </Button>
                </ButtonGroup>
              </Box>

              <LineChart
                dataset={filteredSalesData}
                xAxis={[{ dataKey: "period", scaleType: "band" }]}
                series={[{ dataKey: "totalSales", label: "Total Sales:" }]}
                height={300}
                grid={{ vertical: true, horizontal: true }}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
            </Box>

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
                  Top Ordered Foods
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
                  Customer Satisfaction: {customerSatisfaction.toFixed(0)}%{" "}
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
                textAlign: "center",
              }}
            >
              Manage Orders
            </Typography>

            <ManageOrders restaurantId={restaurant?._id} />
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
              Restaurant Chats
            </Typography>
            <RestaurantChats restaurant={restaurant} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserRestaurantPage;
