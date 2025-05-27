import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SIZES, COLORS } from "../../styles/theme";
import { useRoute } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import { RatingInput } from "react-native-stock-star-rating";
import GoogleApiServices from "../../hook/GoogleApiServices";
import { UserLocationContext } from "../../contexts/UserLocationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import RestaurantPage from "../../navigations/RestaurantPage";

const Restaurant = ({ navigation }) => {
  const route = useRoute();
  const item = route.params;
  const [distanceTime, setDistanceTime] = useState({});
  const { location, setLocation } = useContext(UserLocationContext);

  useEffect(() => {
    GoogleApiServices.calculateDistanceAndTime(
      item?.coords?.latitude,
      item?.coords?.longitude,
      location?.coords?.latitude,
      location?.coords?.longitude
    ).then((result) => {
      if (result) {
        setDistanceTime(result);
      }
    });
  }, []);

  const totalTime =
    distanceTime.duration + GoogleApiServices.extractNumbers(item.time)[0];

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backbtn}
        >
          <Entypo name="chevron-small-left" size={30} color="white" />
        </TouchableOpacity>

        <Image
          source={{ uri: item.imageUrl.url }}
          style={{
            height: SIZES.height / 4,
            width: SIZES.width,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        />

        <View style={styles.rating}>
          <View pointerEvents="none" style={styles.innerRating}>
            <RatingInput rating={Number(item.rating)} size={22} />
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8, marginHorizontal: 8, marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ flexDirection: "row" }}>
            {item.pickup ? (
              <View
                style={{
                  backgroundColor: COLORS.tertiary,
                  borderRadius: 15,
                  justifyContent: "center",
                  height: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "regular",
                    marginHorizontal: 5,
                    fontSize: 12,
                  }}
                >
                  📦 Pick-Up
                </Text>
              </View>
            ) : (
              <></>
            )}
            {item.delivery ? (
              <View
                style={{
                  backgroundColor: COLORS.tertiary,
                  borderRadius: 15,
                  justifyContent: "center",
                  height: 20,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "regular",
                    marginHorizontal: 5,
                    fontSize: 12,
                  }}
                >
                  🛵 Delivery
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { color: COLORS.gray }]}>Distance:</Text>
          <Text style={[styles.small, { fontFamily: "regular" }]}>
            {(distanceTime.distance / 1000).toFixed(1)} km
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { color: COLORS.gray }]}>
            Preparation and Delivery Time:
          </Text>
          <Text style={[styles.small, { fontFamily: "regular" }]}>
            {totalTime.toFixed(0)} mins
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.small, { color: COLORS.gray }]}>Cost:</Text>
          <Text style={[styles.small, { fontFamily: "regular" }]}>
            {distanceTime.finalPrice}
          </Text>
        </View>
      </View>
      <View style={{ height: SIZES.height / 1.4 }}>
        <RestaurantPage item={item} />
      </View>
    </SafeAreaView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  backbtn: {
    marginLeft: 12,
    alignItems: "center",
    zIndex: 999,
    position: "absolute",
    top: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 99,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    color: COLORS.black,
    width: 200,
  },
  small: {
    fontSize: 13,
    fontFamily: "medium",
    color: COLORS.black,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white,
  },
  rating: {
    height: 50,
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    backgroundColor: "#00fff",
    zIndex: 999,
    bottom: 5,
    borderRadius: 15,
  },
  innerRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  ratingBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    padding: 6,
  },
});
