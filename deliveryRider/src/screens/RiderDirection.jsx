import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { database } from "../../config/firebase";
import { COLORS } from "../assets/theme";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import Rider from "../assets/Rider.png";
import Destination from "../assets/location.png";
import Payment from "../assets/payment.png";
import GCash from "../assets/gcash.png";
import { toast } from "react-toastify";

const containerStyle = {
  width: "350px",
  height: "400px",
  borderRadius: "15px",
  borderWidth: "1px",
  borderColor: COLORS.gray2,
  borderStyle: "solid",
};

const RiderDirection = () => {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [riderDetails, setRiderDetails] = useState(null);
  const [deliveredModal, setDeliveredModal] = useState(false);
  const { orderId, riderId } = useParams();
  const navigation = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBb5KicFxg9zwfu05AjPuacFyT0AtwW6sE",
  });

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
        (response?.data?.order?.orderStatus !== "Out for delivery" &&
          response?.data?.order?.orderStatus !== "Delivered")
      ) {
        navigation("/");
        alert(
          "This order is not available for delivery. Please check your orders."
        );
      } else {
        setOrderDetails(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchDirections = async (
    startLat,
    startLng,
    destinationLat,
    destinationLng
  ) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLng}|${destinationLat},${destinationLng}&mode=bicycle&apiKey=7540990e27fa4d198afeb6d69d3c048e`
      );
      console.log("Directions Data:", response);
      const data = await response.json();
      const coordinates = data.features[0].geometry.coordinates.flatMap(
        (segment) =>
          segment.map((point) => ({
            lat: point[1],
            lng: point[0],
          }))
      );

      setCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    const unsub = onSnapshot(
      doc(database, "outForDeliveryOrders", riderId),
      (docSnap) => {
        if (docSnap.exists()) {
          setRiderDetails(docSnap.data());
        }
      }
    );
    return () => unsub();
  }, [orderId, riderId]);

  useEffect(() => {
    if (
      riderDetails?.currentLocation?.latitude &&
      riderDetails?.currentLocation?.longitude &&
      orderDetails?.deliveryAddress?.coordinates?.latitude &&
      orderDetails?.deliveryAddress?.coordinates?.longitude
    ) {
      fetchDirections(
        riderDetails?.currentLocation?.latitude,
        riderDetails?.currentLocation?.longitude,
        orderDetails?.deliveryAddress?.coordinates?.latitude,
        orderDetails?.deliveryAddress?.coordinates?.longitude
      );
    }
  }, [riderDetails, orderDetails]);

  const center = riderDetails?.currentLocation
    ? {
        lat: riderDetails?.currentLocation?.latitude,
        lng: riderDetails?.currentLocation?.longitude,
      }
    : { lat: 0, lng: 0 };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  const OrderArrived = async () => {
    setLoading(true);
    try {
      const watchId = localStorage.getItem("riderWatchId");
      if (watchId) {
        navigator.geolocation.clearWatch(Number(watchId));
        localStorage.removeItem("riderWatchId");
        console.log("Stopped location tracking on delivery.");
      }

      await axios.get(
        `http://localhost:6002/api/orders/arrived-notification/${orderId}`
      );

      const message = {
        _id: new Date().getTime().toString(),
        text:
          orderDetails?.paymentStatus === "Paid"
            ? `The delivery rider has arrived at you location, please claim your order. Thank you for trusting HalalExpress`
            : `The delivery rider has arrived at your location, please claim your order`,
        createdAt: new Date(),
        user: {
          _id: orderDetails?.restaurant
            ? orderDetails?.restaurant?._id
            : orderDetails?.supplier?._id,
          name: orderDetails?.restaurant
            ? orderDetails?.restaurant?.title
            : orderDetails?.supplier?.title,
          avatar: orderDetails?.restaurant
            ? orderDetails?.restaurant?.logoUrl?.url
            : orderDetails?.supplier?.logoUrl?.url,
        },
        receiverId: orderDetails?.userId?._id,
        receiverName: orderDetails?.userId?.username,
        receiverAvatar: orderDetails?.userId?.profile?.url,
      };

      await addDoc(collection(database, "chats"), message);
      toast.success("Order delivered successfully!", {
        position: "top-center",
      });
      if (orderDetails?.paymentStatus === "Paid") {
        await navigation("/");
      } else {
        await navigation(`/confirm-payment/${orderId}`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  const isRiderClose =
    riderDetails?.currentLocation &&
    orderDetails?.deliveryAddress?.coordinates &&
    getDistanceFromLatLonInMeters(
      riderDetails?.currentLocation?.latitude,
      riderDetails?.currentLocation?.longitude,
      orderDetails?.deliveryAddress?.coordinates.latitude,
      orderDetails?.deliveryAddress?.coordinates.longitude
    ) < 300;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "350px" }}>
        <Typography
          sx={{
            fontFamily: "bold",
            textAlign: "center",
            fontSize: 20,
            color: COLORS.primary,
          }}
        >
          📍 Delivery Route 📍
        </Typography>
        <Divider sx={{ width: "350px", my: 1 }} />
        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 12,
            textAlign: "center",
            fontStyle: "italic",
            mb: 1,
          }}
        >
          <b>Note:</b> Don't minimize this page while tracking the destination
          route, as it may cause the map to not update properly.
        </Typography>
        <GoogleMap
          mapContainerStyle={containerStyle}
          mapTypeId="roadmap"
          center={center}
          zoom={15}
        >
          {riderDetails?.currentLocation && (
            <Marker
              position={{
                lat: riderDetails?.currentLocation?.latitude,
                lng: riderDetails?.currentLocation?.longitude,
              }}
              icon={{
                url: Rider,
                scaledSize: { width: 40, height: 40 },
              }}
            />
          )}

          {orderDetails?.deliveryAddress?.coordinates && (
            <Marker
              position={{
                lat: orderDetails?.deliveryAddress?.coordinates?.latitude,
                lng: orderDetails?.deliveryAddress?.coordinates?.longitude,
              }}
              icon={{
                url: Destination,
                scaledSize: { width: 40, height: 40 },
              }}
            />
          )}

          {coordinates.length > 0 && (
            <Polyline
              path={coordinates}
              options={{
                strokeColor: COLORS.secondary,
                strokeWeight: 5,
              }}
            />
          )}
        </GoogleMap>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Box
            component="img"
            src={Destination}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          />
          <Typography
            sx={{
              fontFamily: "bold",
              fontSize: 16,
            }}
          >
            Delivery Details:
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 12,
            ml: 3,
          }}
        >
          Ordered by: {orderDetails?.userId?.username}
        </Typography>
        <Typography
          sx={{
            fontFamily: "regular",
            fontSize: 12,
            ml: 3,
          }}
        >
          Delivery Address: {orderDetails?.deliveryAddress?.address}
        </Typography>

        <Divider sx={{ width: "350px", my: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Box
            component="img"
            src={Payment}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          />
          <Typography
            sx={{
              fontFamily: "bold",
              fontSize: 16,
            }}
          >
            Payment Details:
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            Subtotal:
          </Typography>
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            ₱ {orderDetails?.subTotal}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            Delivery fee:
          </Typography>
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            ₱ {orderDetails?.deliveryFee}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            Payment method:
          </Typography>

          {orderDetails?.paymentMethod === "gcash" ? (
            <Box
              component="img"
              src={GCash}
              sx={{ width: "auto", height: 15 }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: "regular",
                fontSize: 12,
                ml: 3,
              }}
            >
              Cash on delivery
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            Payment status:
          </Typography>
          <Typography
            sx={{
              fontFamily: "regular",
              fontSize: 12,
              ml: 3,
            }}
          >
            {orderDetails?.paymentStatus}{" "}
            {orderDetails?.paymentStatus === "Paid" ? "🟢" : "🟡"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontFamily: "bold",
              fontSize: 16,
              ml: 3,
            }}
          >
            TOTAL:
          </Typography>
          <Typography
            sx={{
              fontFamily: "bold",
              fontSize: 16,
              ml: 3,
            }}
          >
            ₱ {orderDetails?.totalAmount}
          </Typography>
        </Box>

        {isRiderClose && (
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
            onClick={() => {
              setDeliveredModal(true);
            }}
          >
            MARK AS DELIVERED
          </Button>
        )}
      </Box>

      <Modal
        open={deliveredModal}
        onClose={() => {
          setDeliveredModal(false);
        }}
      >
        <Box sx={style}>
          <Typography sx={{ fontFamily: "bold", fontSize: 20 }}>
            Mark as Delivered?
          </Typography>

          <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
            Is this order already delivered? click "Yes" to confirm.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "end" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: COLORS.gray,
                color: COLORS.white,
                fontFamily: "bold",
                "&:hover": {
                  backgroundColor: COLORS.secondary,
                },
              }}
              onClick={async () => {
                setDeliveredModal(false);
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                fontFamily: "bold",
                "&:hover": {
                  backgroundColor: COLORS.secondary,
                },
              }}
              loading={loading}
              onClick={() => {
                OrderArrived();
                setDeliveredModal(false);
              }}
            >
              YES
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default RiderDirection;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  backgroundColor: "white",
  borderRadius: 3,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  p: 2,
};
