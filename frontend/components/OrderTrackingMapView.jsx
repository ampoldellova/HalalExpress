import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { database } from "../config/firebase";
import firestore from "@react-native-firebase/firestore";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { COLORS } from "../styles/theme";
import PlaceMarker from "./PlaceMarker";

const OrderTrackingMapView = ({ order }) => {
  const orderId = order?._id;
  const placeList = order?.deliveryAddress?.coordinates;
  const [mapRegion, setMapRegion] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [riderDetails, setRiderDetails] = useState(null);

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
  );
};

export default OrderTrackingMapView;

const styles = StyleSheet.create({
  mapContainer: {
    height: "30%",
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 15,
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
