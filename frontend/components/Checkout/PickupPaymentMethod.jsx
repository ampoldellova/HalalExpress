import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";
import Divider from "../Divider";

const PickupPaymentMethod = () => {
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Text style={{ fontFamily: "bold", fontSize: 18 }}>Payment Method:</Text>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Image
          source={require("../../assets/images/gcash.png")}
          style={{ width: 27, height: 22, marginLeft: 2.5 }}
        />
        <Text
          style={{
            fontFamily: "medium",
            fontSize: 16,
            marginLeft: 10,
            color: COLORS.black,
          }}
        >
          GCash
        </Text>
      </View>
    </View>
  );
};

export default PickupPaymentMethod;

const styles = StyleSheet.create({});
