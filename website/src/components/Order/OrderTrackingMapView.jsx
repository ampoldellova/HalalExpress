import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { database } from "../../config/firebase";
import Rider from "../../assets/images/Rider.png";
import Destination from "../../assets/images/location.png";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { COLORS } from "../../styles/theme";
import { Box, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import delivery from "../../assets/anime/delivery.json";
import Lottie from "lottie-react";

const OrderTrackingMapView = ({ order }) => {
  const orderId = order?._id;
  const [coordinates, setCoordinates] = React.useState([]);
  const [riderDetails, setRiderDetails] = React.useState(null);

  React.useEffect(() => {
    if (
      riderDetails?.currentLocation?.latitude &&
      riderDetails?.currentLocation?.longitude &&
      order?.deliveryAddress?.coordinates?.latitude &&
      order?.deliveryAddress?.coordinates?.longitude
    ) {
      fetchDirections(
        riderDetails?.currentLocation?.latitude,
        riderDetails?.currentLocation?.longitude,
        order?.deliveryAddress?.coordinates?.latitude,
        order?.deliveryAddress?.coordinates?.longitude
      );
    }
  }, [riderDetails, order]);

  React.useEffect(() => {
    if (!orderId) return;
    const q = query(
      collection(database, "outForDeliveryOrders"),
      where("orderId", "==", orderId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        setRiderDetails(querySnapshot.docs[0].data());
        console.log("Rider Details: ", querySnapshot.docs[0].data());
      } else {
        setRiderDetails(null);
        console.log("No matching order found.");
      }
    });

    return () => unsubscribe();
  }, [orderId]);

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
      const data = await response.json();

      const coordinates = data.features[0].geometry.coordinates.flatMap(
        (segment) =>
          segment.map((point) => ({
            latitude: point[1],
            longitude: point[0],
          }))
      );

      setCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const center = riderDetails?.currentLocation
    ? {
        lat: riderDetails?.currentLocation?.latitude,
        lng: riderDetails?.currentLocation?.longitude,
      }
    : { lat: 0, lng: 0 };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBb5KicFxg9zwfu05AjPuacFyT0AtwW6sE",
  });

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapTypeId="roadmap"
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
        }}
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

        {order?.deliveryAddress?.coordinates && (
          <Marker
            position={{
              lat: order?.deliveryAddress?.coordinates?.latitude,
              lng: order?.deliveryAddress?.coordinates?.longitude,
            }}
            icon={{
              url: Destination,
              scaledSize: { width: 40, height: 40 },
            }}
          />
        )}

        {coordinates.length > 0 && (
          <Polyline
            path={coordinates.map((coord) => ({
              lat: coord.latitude,
              lng: coord.longitude,
            }))}
            options={{
              strokeColor: COLORS.secondary,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>

      <Typography sx={{ fontFamily: "bold", fontSize: 18, mt: 2 }}>
        Rider Details
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
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <PersonOutlineOutlinedIcon
              sx={{ color: COLORS.gray, fontSize: 25, mr: 1 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 16 }}>
              Rider: {riderDetails?.riderName}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocalPhoneOutlinedIcon
              sx={{ color: COLORS.gray, fontSize: 25, mr: 1 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 16 }}>
              Contact #: {riderDetails?.riderPhone}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DirectionsCarOutlinedIcon
              sx={{ color: COLORS.gray, fontSize: 25, mr: 1 }}
            />
            <Typography sx={{ fontFamily: "regular", fontSize: 16 }}>
              Vehicle: {riderDetails?.selectedVehicle}
            </Typography>
          </Box>

          {riderDetails?.selectedVehicle !== "Bicycle" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NumbersOutlinedIcon
                sx={{ color: COLORS.gray, fontSize: 25, mr: 1 }}
              />
              <Typography sx={{ fontFamily: "regular", fontSize: 16 }}>
                Plate #: {riderDetails?.plateNumber}
              </Typography>
            </Box>
          )}
        </Box>

        <Lottie animationData={delivery} loop={true} style={{ width: 120 }} />
      </Box>
    </>
  ) : (
    <div>Loading Map...</div>
  );
};

export default OrderTrackingMapView;

const containerStyle = {
  width: "auto",
  height: "400px",
  borderRadius: 15,
  overflow: "hidden",
  border: "1px solid #ccc",
};
