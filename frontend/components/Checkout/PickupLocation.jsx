import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";
import { Octicons } from "@expo/vector-icons";

const PickupLocation = ({ restaurant, supplier }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/pickup.png")}
          style={{ width: 25, height: 25, marginRight: 5 }}
        />
        <Text style={{ fontFamily: "bold", fontSize: 18 }}>Pickup at:</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "start",
          justifyContent: "space-between",
          marginTop: 10,
          gap: 10,
        }}
      >
        <Image
          source={{
            uri: restaurant ? restaurant?.logoUrl?.url : supplier?.logoUrl?.url,
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            borderColor: COLORS.gray2,
            borderWidth: 1,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            width: "70%",
          }}
        >
          <Text style={{ fontFamily: "bold", fontSize: 16, width: "80%" }}>
            {restaurant ? restaurant?.title : supplier?.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
              alignItems: "start",
              width: "80%",
            }}
          >
            <Octicons name="location" size={20} color={COLORS.gray} />
            <Text
              style={{
                fontFamily: "regular",
                color: COLORS.gray,
                fontSize: 14,
                marginLeft: 5,
                marginTop: -3,
              }}
            >
              {restaurant
                ? restaurant?.coords?.address
                : supplier?.coords?.address}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PickupLocation;

const styles = StyleSheet.create({});
