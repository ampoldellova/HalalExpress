import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { COLORS } from "../assets/theme";
import PersonIcon from "@mui/icons-material/Person";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import SellIcon from "@mui/icons-material/Sell";
import CallIcon from "@mui/icons-material/Call";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import CarCrashOutlinedIcon from "@mui/icons-material/CarCrashOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../../config/firebase";

const AcceptOrder = () => {
  const [openRiderForm, setOpenRiderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [riderName, setRiderName] = useState("");
  const [riderNameError, setRiderNameError] = useState(false);
  const [riderPhone, setRiderPhone] = useState("");
  const [riderPhoneError, setRiderPhoneError] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedVehicleError, setSelectedVehicleError] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");
  const [plateNumberError, setPlateNumberError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const navigation = useNavigate();

  const philPhoneRegex = /^(09\d{9}|(\+639)\d{9})$/;

  const vehicleTypes = [
    { id: 1, name: "Bicycle" },
    { id: 2, name: "Motorcycle" },
    { id: 3, name: "Car" },
    { id: 4, name: "Truck" },
    { id: 5, name: "Van" },
  ];

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6002/api/orders/accept-order/${orderId}`
      );
      // const response = await axios.get(
      //   `https://halalexpress.onrender.com/api/orders/accept-order/${orderId}`
      // );
      if (
        response?.data?.order?.deliveryOption !== "standard" ||
        response?.data?.order?.orderStatus !== "Ready for pickup"
      ) {
        alert(
          "This order is not available for delivery. Please check your orders."
        );
        navigation("/");
      } else {
        setOrderDetails(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const submitRiderDetails = async () => {
    setLoading(true);
    setRiderNameError(false);
    setRiderPhoneError(false);
    setSelectedVehicleError(false);
    setPlateNumberError(false);

    if (riderName === "") {
      setRiderNameError(true);
      setLoading(false);
      return;
    }
    if (riderPhone === "") {
      setRiderPhoneError(true);
      setLoading(false);
      return;
    }

    if (!philPhoneRegex.test(riderPhone)) {
      setRiderPhoneError(true);
      setLoading(false);
      return;
    }

    if (selectedVehicle === "") {
      setSelectedVehicleError(true);
      setLoading(false);
      return;
    }

    if (selectedVehicle !== "Bicycle" && plateNumber === "") {
      setPlateNumberError(true);
      setLoading(false);
      return;
    }

    try {
      if (navigator.geolocation) {
        const riderId = Math.random().toString(36).substring(2, 10);

        try {
          await axios.post(
            `http://localhost:6002/api/orders/mark-as-out-for-delivery/${orderId}`
          );
        } catch (error) {
          navigation("/");
          alert("This order is already out for delivery.");
          console.log("Error", error);
          return;
        }

        const watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              await setDoc(doc(database, "outForDeliveryOrders", riderId), {
                riderId,
                riderName,
                riderPhone,
                selectedVehicle,
                plateNumber: selectedVehicle !== "Bicycle" ? plateNumber : "",
                orderId,
                timestamp: new Date().toISOString(),
                currentLocation: {},
              });
            } catch (error) {
              console.error("Error saving rider details:", error);
            }

            try {
              await setDoc(
                doc(database, "outForDeliveryOrders", riderId),
                {
                  currentLocation: {
                    latitude,
                    longitude,
                  },
                  timestamp: new Date().toISOString(),
                },
                { merge: true }
              );
              console.log("Rider location updated in Firestore:", {
                latitude,
                longitude,
              });

              navigation(`/directions/${orderId}/${riderId}`);
            } catch (error) {
              console.error("Error updating rider location:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            alert(`Error: ${error.message}`);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );

        const intervalId = setInterval(async () => {
          try {
            if (orderDetails?.orderStatus === "Delivered") {
              navigator.geolocation.clearWatch(watchId);
              clearInterval(intervalId);
              console.log(
                "Stopped watching location because order is delivered."
              );
            }
          } catch (error) {
            console.error("Error checking order status:", error);
          }
        }, 3000);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error submitting rider details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          mb: 1,
        }}
      >
        <Box
          component="img"
          src={logo}
          sx={{ height: 100, width: 100, mr: 1 }}
        />

        <Typography
          sx={{ fontFamily: "bold", color: COLORS.primary, fontSize: 20 }}
        >
          HALALEXPRESS
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontFamily: "bold", mb: 1 }}>
          Order: {orderDetails?._id}
        </Typography>

        <Divider />

        {orderDetails?.orderItems?.map((item) => (
          <Box sx={{ display: "flex", mt: 2 }}>
            <Box
              component="img"
              sx={{
                height: "100px",
                width: "100px",
                borderRadius: 3,
                mr: 2,
              }}
              src={
                item?.foodId
                  ? item?.foodId?.imageUrl?.url
                  : item?.productId?.imageUrl?.url
              }
            />

            <Box
              sx={{ display: "flex", flexDirection: "column", width: "200px" }}
            >
              <Typography sx={{ fontFamily: "regular" }}>
                {item?.foodId ? item?.foodId?.title : item?.productId.title}
              </Typography>
              {item?.foodId && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    overflow: "hidden",
                    maxWidth: "100%",
                  }}
                >
                  {item?.additives?.map((additive, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "regular",
                        fontSize: 12,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {additive?.title}
                      {index !== item?.additives?.length - 1 && " |"}{" "}
                    </Typography>
                  ))}
                </Box>
              )}
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Quantity: {item?.quantity}
              </Typography>
              <Typography sx={{ fontFamily: "regular" }}>
                ₱ {item?.totalPrice}
              </Typography>
            </Box>
          </Box>
        ))}

        <Typography sx={{ fontFamily: "bold", mt: 3 }}>
          Customer Details:
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <Box sx={{ maxWidth: "315px" }}>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <PersonIcon sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15 }} />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Customer: {orderDetails?.userId?.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <CallIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Contact: {orderDetails?.userId?.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <LocationOnIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Delivery Address: {orderDetails?.deliveryAddress?.address}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ fontFamily: "bold", mt: 3 }}>
          Payment Details:
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <Box sx={{ maxWidth: "315px" }}>
          <Box sx={{ display: "flex", alignItems: "start", mt: 1 }}>
            <PaymentIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
              Payment Method:{" "}
              {orderDetails?.paymentMethod === "cod"
                ? "Cash On Delivery"
                : "GCash"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <MonitorHeartIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center ",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Payment Status: {orderDetails?.paymentStatus}
              </Typography>
              <Box
                sx={{
                  backgroundColor:
                    orderDetails?.paymentStatus === "Paid"
                      ? COLORS.green
                      : COLORS.secondary,
                  height: "10px",
                  width: "10px",
                  ml: 0.5,
                  borderRadius: 99,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start" }}>
            <SellIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Subtotal:
              </Typography>
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                ₱ {orderDetails?.subTotal}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <DeliveryDiningIcon
              sx={{ color: COLORS.primary, mr: 0.5, fontSize: 15, mt: 0.2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                Delivery Fee:
              </Typography>
              <Typography sx={{ fontFamily: "regular", fontSize: 12 }}>
                ₱ {orderDetails?.deliveryFee}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography sx={{ fontFamily: "bold", fontSize: 16 }}>
              TOTAL:
            </Typography>
            <Typography sx={{ fontFamily: "bold", fontSize: 16 }}>
              ₱ {orderDetails?.totalAmount}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: COLORS.primary,
          color: COLORS.white,
          width: "315px",
          fontFamily: "bold",
          mt: 2,
          "&:hover": {
            backgroundColor: COLORS.secondary,
          },
        }}
        onClick={() => setOpenRiderForm(true)}
      >
        Accept Order
      </Button>

      <Modal
        open={openRiderForm}
        onClose={() => {
          setOpenRiderForm(false);
          setRiderName("");
          setRiderPhone("");
          setPlateNumber("");
          setSelectedVehicle("");
          setRiderNameError(false);
          setRiderPhoneError(false);
          setSelectedVehicleError(false);
          setPlateNumberError(false);
        }}
      >
        <Box sx={style}>
          <Typography
            sx={{
              fontFamily: "bold",
              color: COLORS.primary,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            RIDER INFORMATION
          </Typography>
          <Divider />

          {riderNameError && (
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: 8,
                color: COLORS.red,
                mb: -2,
                ml: 2,
              }}
            >
              *Please enter your full name
            </Typography>
          )}
          <TextField
            placeholder="Enter full name"
            variant="outlined"
            name="email"
            autoComplete="off"
            value={riderName}
            onChange={(e) => setRiderName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person2OutlinedIcon sx={{ color: COLORS.gray }} />
                </InputAdornment>
              ),
              sx: {
                "& input": {
                  fontFamily: "regular",
                  fontSize: 12,
                  "&::placeholder": {
                    fontFamily: "regular",
                    fontSize: 12,
                  },
                },
              },
            }}
            InputLabelProps={{
              shrink: false,
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                bgcolor: COLORS.offwhite,
                borderRadius: 8,
                "& fieldset": {
                  borderColor: riderNameError
                    ? COLORS.secondary
                    : COLORS.offwhite,
                },
                "&:hover fieldset": {
                  borderColor: COLORS.secondary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "regular",
                fontSize: 12,
              },
            }}
          />

          {riderPhoneError && (
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: 8,
                color: COLORS.red,
                mb: -2,
                ml: 2,
              }}
            >
              {riderPhone === ""
                ? "*Please enter your phone number"
                : "*Please input a valid Philippine phone number"}
            </Typography>
          )}
          <TextField
            placeholder="Enter phone number"
            variant="outlined"
            name="email"
            autoComplete="off"
            value={riderPhone}
            onChange={(e) => {
              setRiderPhone(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalPhoneOutlinedIcon sx={{ color: COLORS.gray }} />
                </InputAdornment>
              ),
              sx: {
                "& input": {
                  fontFamily: "regular",
                  fontSize: 12,
                  "&::placeholder": {
                    fontFamily: "regular",
                    fontSize: 12,
                  },
                },
              },
            }}
            InputLabelProps={{
              shrink: false,
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                bgcolor: COLORS.offwhite,
                borderRadius: 8,
                "& fieldset": {
                  borderColor: riderPhoneError
                    ? COLORS.secondary
                    : COLORS.offwhite,
                },
                "&:hover fieldset": {
                  borderColor: COLORS.secondary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.secondary,
                },
              },
              "& .MuiInputLabel-root": {
                fontFamily: "regular",
                fontSize: 12,
              },
            }}
          />

          {selectedVehicleError && (
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: 8,
                color: COLORS.red,
                mb: -2,
                ml: 2,
              }}
            >
              *Please select your vehicle type
            </Typography>
          )}
          <Select
            displayEmpty
            variant="outlined"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            sx={{
              width: "100%",
              bgcolor: COLORS.offwhite,
              borderRadius: 8,
              fontFamily: "regular",
              fontSize: 12,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: selectedVehicleError
                  ? COLORS.secondary
                  : COLORS.offwhite,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.secondary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.secondary,
              },
              "& .MuiSelect-select": {
                fontFamily: "regular",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: "2px",
              },
            }}
            renderValue={(selected) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CarCrashOutlinedIcon sx={{ color: COLORS.gray }} />
                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 12,
                  }}
                >
                  {selected || "Select Vehicle Type"}
                </Typography>
              </Box>
            )}
          >
            {vehicleTypes.map((vehicle) => (
              <MenuItem
                key={vehicle.id}
                value={vehicle.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "regular",
                  fontSize: 12,
                }}
              >
                {vehicle.name}
              </MenuItem>
            ))}
          </Select>

          {selectedVehicle !== "Bicycle" && (
            <>
              {plateNumberError && (
                <Typography
                  sx={{
                    fontFamily: "regular",
                    fontSize: 8,
                    color: COLORS.red,
                    mb: -2,
                    ml: 2,
                  }}
                >
                  *Please enter your plate number
                </Typography>
              )}
              <TextField
                placeholder="Enter plate number"
                variant="outlined"
                name="email"
                autoComplete="off"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersOutlinedIcon sx={{ color: COLORS.gray }} />
                    </InputAdornment>
                  ),
                  sx: {
                    "& input": {
                      fontFamily: "regular",
                      fontSize: 12,

                      "&::placeholder": {
                        fontFamily: "regular",
                        fontSize: 12,
                      },
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: false,
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: COLORS.offwhite,
                    borderRadius: 8,
                    "& fieldset": {
                      borderColor: plateNumberError
                        ? COLORS.secondary
                        : COLORS.offwhite,
                    },
                    "&:hover fieldset": {
                      borderColor: COLORS.secondary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: COLORS.secondary,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "regular",
                    fontSize: 12,
                  },
                }}
              />
            </>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              width: "100%",
              fontFamily: "bold",
              mt: 2,
              "&:hover": {
                backgroundColor: COLORS.secondary,
              },
            }}
            loading={loading}
            onClick={() => {
              submitRiderDetails();
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AcceptOrder;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  backgroundColor: "white",
  borderRadius: 3,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  p: 4,
};
