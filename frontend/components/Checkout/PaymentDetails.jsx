import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";
import Divider from "../Divider";

const PaymentDetails = ({
  cart,
  selectedDeliveryOption,
  distanceTime,
  deliveryFee,
}) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "regular",
            fontSize: 14,
            color: COLORS.gray,
          }}
        >
          Subtotal:
        </Text>
        <Text
          style={{
            fontFamily: "regular",
            fontSize: 14,
            color: COLORS.gray,
          }}
        >
          ₱ {cart?.totalAmount.toFixed(2)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "regular",
            fontSize: 14,
            color: COLORS.gray,
          }}
        >
          Delivery Fee:
        </Text>
        <Text
          style={{
            fontFamily: "regular",
            fontSize: 14,
            color: COLORS.gray,
          }}
        >
          ₱{" "}
          {selectedDeliveryOption === "standard" ? distanceTime.finalPrice : 0}
        </Text>
      </View>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontFamily: "bold", fontSize: 24 }}>Total:</Text>
        <Text style={{ fontFamily: "bold", fontSize: 24 }}>
          ₱{" "}
          {(
            parseFloat(cart?.totalAmount.toFixed(2)) + parseFloat(deliveryFee)
          ).toFixed(2)}
        </Text>
      </View>
    </>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({});
