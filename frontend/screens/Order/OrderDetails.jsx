import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import { COLORS } from "../../styles/theme";
import Octicons from "@expo/vector-icons/Octicons";

const OrderDetails = () => {
  const route = useRoute();
  const { order } = route.params;
  const navigation = useNavigation();
  console.log(order);
  return (
    <View>
      <View style={{ marginHorizontal: 20 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={styles.heading}>Order Details</Text>
        <View
          style={{
            borderColor: COLORS.gray2,
            borderRadius: 15,
            padding: 10,
            marginTop: 10,
            backgroundColor: COLORS.white,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: order?.restaurant?.logoUrl?.url }}
              style={{
                height: 60,
                width: 60,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                {order?.restaurant?.title}
              </Text>
              <Text
                style={{
                  color: COLORS.gray,
                  fontSize: 12,
                  fontFamily: "regular",
                }}
              >
                Ordered on:{" "}
                {new Date(order?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(order?.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
              <Text
                style={{
                  color: COLORS.gray,
                  fontSize: 12,
                  fontFamily: "regular",
                }}
              >
                Order #: {order?._id}
              </Text>
              <Text
                style={{
                  color: COLORS.gray,
                  fontSize: 12,
                  fontFamily: "regular",
                }}
              >
                Order for:{" "}
                {order?.deliveryOption === "standard" ? "Delivery" : "Pickup"}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", width: "100%" }}>
            <Octicons name="location" size={20} color={COLORS.gray} />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "regular", color: COLORS.gray }}>
                Order from:
              </Text>
              <Text style={{ fontFamily: "medium" }}>
                {order?.restaurant?.coords?.address}
              </Text>
            </View>
          </View>

          {order.deliveryOption === "standard" && (
            <View
              style={{ marginTop: 20, flexDirection: "row", width: "100%" }}
            >
              <Octicons name="location" size={20} color={COLORS.gray} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontFamily: "regular", color: COLORS.gray }}>
                  To be delivered at:
                </Text>
                <Text style={{ fontFamily: "medium", width: "80%" }}>
                  {order?.deliveryAddress}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            borderColor: COLORS.gray2,
            borderRadius: 15,
            padding: 10,
            marginTop: 10,
            backgroundColor: COLORS.white,
          }}
        >
          <Text style={{ fontFamily: "bold", fontSize: 18 }}>
            Order Summary
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});
