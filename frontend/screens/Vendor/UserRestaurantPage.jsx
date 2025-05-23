import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import { COLORS, SIZES } from "../../styles/theme";
import ServiceAvailability from "../../components/Vendor/ServiceAvailability";
import DeliveryAvailability from "../../components/Vendor/DeliveryAvailability";
import PickupAvailability from "../../components/Vendor/PickupAvailability";
import Divider from "../../components/Divider";
import ManageFoodButton from "../../components/Vendor/ManageFoodButton";
import AddFoodButton from "../../components/Foods/AddFoodButton";
import EditRestaurantButton from "../../components/Vendor/EditRestaurantButton";
import Foundation from "@expo/vector-icons/Foundation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const UserRestaurantPage = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const item = router.params;

  return (
    <View style={{ marginHorizontal: 20, marginTop: 15 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backbtn}
        >
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Restaurant Page</Text>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() =>
            navigation.navigate("restaurant-chat-list", {
              restaurant: item,
            })
          }
        >
          <MaterialCommunityIcons
            name="message-reply-text"
            size={24}
            color={COLORS.secondary}
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        <Image
          source={{
            uri: item.imageUrl.url,
          }}
          style={styles.imageUrl}
        />
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("manage-orders-page", item)}
        >
          <Foundation name="clipboard-notes" size={16} color={COLORS.white} />
          <Text style={styles.editTxt}>Manage Orders</Text>
        </TouchableOpacity>
        <Image
          style={styles.logoUrl}
          source={{
            uri: item.logoUrl.url,
          }}
        />
      </View>
      <View style={styles.imageContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.address}>{item.coords.address}</Text>
        </View>
      </View>
      <Text style={styles.options}>Options</Text>
      <ServiceAvailability availability={item.isAvailable} id={item._id} />
      <DeliveryAvailability availability={item.delivery} id={item._id} />
      <PickupAvailability availability={item.pickup} id={item._id} />
      <Divider />
      <ManageFoodButton restaurantId={item._id} />
      <AddFoodButton restaurantId={item._id} />
      <EditRestaurantButton details={item} address={item.coords.address} />
    </View>
  );
};

export default UserRestaurantPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
  imageContainer: {
    position: "abosolute",
    marginTop: 10,
  },
  imageUrl: {
    height: SIZES.height / 5.8,
    width: SIZES.width - 38,
    borderRadius: 15,
  },
  editBtn: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    bottom: 10,
    right: 5,
    borderRadius: 10,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editTxt: {
    textAlign: "center",
    fontFamily: "medium",
    color: "white",
    fontSize: 14,
    marginLeft: 5,
  },
  logoUrl: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 99,
    marginLeft: 10,
    bottom: -80,
    backgroundColor: COLORS.offwhite,
    borderColor: COLORS.offwhite,
    borderWidth: 3,
  },
  wrapper: {
    width: SIZES.width - 38 - 120,
  },
  title: {
    fontFamily: "medium",
    fontSize: 16,
    left: 120,
    marginTop: 5,
  },
  address: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
    left: 120,
  },
  options: {
    fontFamily: "bold",
    fontSize: 18,
    marginTop: 35,
  },
});
