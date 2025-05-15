import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { doc, onSnapshot } from "firebase/firestore";
import { database } from "../../config/firebase";
import { COLORS } from "../assets/theme";
import { Box, Divider, Typography } from "@mui/material";

const containerStyle = {
  width: "350px",
  height: "400px",
  borderRadius: "15px",
  borderWidth: "1px",
  borderColor: COLORS.gray2,
  borderStyle: "solid",
};

const RiderDirection = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [riderDetails, setRiderDetails] = useState(null);
  const { orderId, riderId } = useParams();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBb5KicFxg9zwfu05AjPuacFyT0AtwW6sE",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6002/api/orders/accept-order/${orderId}`
      );
      setOrderDetails(response.data.order);
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

  // Fetch order details and rider details
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Box component="img" src={logo} sx={{ height: 100, width: 100 }} /> */}

      <Typography
        sx={{
          fontFamily: "bold",
          textAlign: "center",
          fontSize: 20,
          color: COLORS.primary,
        }}
      >
        Destination Route
      </Typography>
      <Divider sx={{ width: "350px", my: 1, mb: 2 }} />
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
            label="Rider"
          />
        )}

        {orderDetails?.deliveryAddress?.coordinates && (
          <Marker
            position={{
              lat: orderDetails?.deliveryAddress?.coordinates?.latitude,
              lng: orderDetails?.deliveryAddress?.coordinates?.longitude,
            }}
            label="Destination"
          />
        )}

        {coordinates.length > 0 && (
          <Polyline
            path={coordinates}
            options={{
              strokeColor: COLORS.primary,
              strokeOpacity: 1,
              strokeWeight: 7,
            }}
          />
        )}
      </GoogleMap>
    </Box>
  );
};

export default RiderDirection;
