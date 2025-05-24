import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import firestore from "@react-native-firebase/firestore";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { COLORS, SIZES } from "../styles/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LottieView from "lottie-react-native";

const OrderTrackingMapView = ({ order }) => {
  const orderId = order?._id;
  const placeList = order?.deliveryAddress?.coordinates;
  const [mapRegion, setMapRegion] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [riderDetails, setRiderDetails] = useState(null);
  const animation = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (
        riderDetails?.currentLocation?.latitude != null &&
        riderDetails?.currentLocation?.longitude != null
      ) {
        setMapRegion({
          latitude: riderDetails.currentLocation.latitude,
          longitude: riderDetails.currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        fetchDirections(
          riderDetails.currentLocation.latitude,
          riderDetails.currentLocation.longitude,
          order?.deliveryAddress?.coordinates?.latitude,
          order?.deliveryAddress?.coordinates?.longitude
        );
      }
    }, [riderDetails, coordinates])
  );

  useEffect(() => {
    if (!orderId) return;
    const q = firestore()
      .collection("outForDeliveryOrders")
      .where("orderId", "==", orderId);

    const unsubscribe = q.onSnapshot((querySnapshot) => {
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

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        marginTop: 10,
      }}
    >
      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
          >
            <Marker title="Rider" coordinate={mapRegion}>
              <Image
                source={require("../assets/images/Rider.png")}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </Marker>

            {placeList && (
              <Marker
                title={"Destination"}
                coordinate={{
                  latitude: placeList.latitude,
                  longitude: placeList.longitude,
                  latitudeDelta: 0.003,
                  longitudeDelta: 0.01,
                }}
              >
                <Image
                  source={require("../assets/images/location.png")}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </Marker>
            )}

            <Polyline
              coordinates={coordinates}
              strokeColor={COLORS.secondary}
              strokeWidth={5}
            />
          </MapView>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "bold",
              fontSize: 18,
            }}
          >
            Rider Details
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="user" size={12} color="black" />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
                marginLeft: 5,
              }}
            >
              Rider: {riderDetails?.riderName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="phone" size={12} color="black" />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
                marginLeft: 5,
              }}
            >
              Contact #: {riderDetails?.riderPhone}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="car" size={12} color="black" />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
                marginLeft: 5,
              }}
            >
              Vehicle Type: {riderDetails?.selectedVehicle}
            </Text>
          </View>

          {riderDetails?.selectedVehicle !== "Bicycle" && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="drivers-license-o" size={12} color="black" />
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 12,
                  marginLeft: 5,
                }}
              >
                Plate #: {riderDetails?.plateNumber}
              </Text>
            </View>
          )}
        </View>

        <LottieView
          autoPlay
          ref={animation}
          style={{ width: 100, height: 100 }}
          source={require("../assets/anime/delivery.json")}
        />
      </View>
    </View>
  );
};

export default OrderTrackingMapView;

const styles = StyleSheet.create({
  mapContainer: {
    height: SIZES.height / 3,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  customMarker: {
    height: "auto",
    width: "auto",
  },
  markerText: {
    fontSize: 30,
  },
});
