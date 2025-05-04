import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import Divider from "../Divider";

const PaymentMethod = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedDeliveryOption,
  setPaymentMethodError,
  paymentMethodError,
}) => {
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Text style={{ fontFamily: "bold", fontSize: 18 }}>Payment Method</Text>

      <Divider />

      <TouchableOpacity
        onPress={() => {
          selectedPaymentMethod === null
            ? setPaymentMethodError(false)
            : setSelectedPaymentMethod("cod");
          selectedPaymentMethod === "cod"
            ? setSelectedPaymentMethod(null)
            : setSelectedPaymentMethod("cod");
        }}
        style={{
          marginTop: 10,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          borderColor:
            selectedPaymentMethod === "cod" ? COLORS.primary : COLORS.gray2,
          opacity: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 30,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/COD.png")}
                style={{ width: 20, height: 20, marginLeft: 2.5 }}
              />
              <Text
                style={{
                  fontFamily: "medium",
                  fontSize: 16,
                  marginLeft: 10,
                  color: COLORS.black,
                }}
              >
                Cash On Delivery
              </Text>
            </View>
          </View>
        </View>

        {selectedPaymentMethod === "cod" && (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 12,
              color: COLORS.gray,
            }}
          >
            Consider payment upon ordering for contactless delivery. You can't
            pay by card to the rider upon delivery.
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          selectedPaymentMethod === null
            ? setPaymentMethodError(false)
            : setSelectedPaymentMethod("gcash");
          selectedPaymentMethod === "gcash"
            ? setSelectedPaymentMethod(null)
            : setSelectedPaymentMethod("gcash");
        }}
        style={{
          marginTop: 10,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          borderColor:
            selectedPaymentMethod === "gcash" ? COLORS.primary : COLORS.gray2,
          opacity: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 30,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        </View>

        {selectedPaymentMethod === "gcash" && (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 12,
              color: COLORS.gray,
            }}
          >
            You will be redirected to GCash after checkout. After you've
            performed the payment, you will be redirected back to HalalExpress.
          </Text>
        )}
      </TouchableOpacity>

      {paymentMethodError && (
        <Text
          style={[
            styles.label,
            {
              color: COLORS.red,
              textAlign: "left",
              fontFamily: "regular",
              marginTop: 10,
            },
          ]}
        >
          *Please select a payment method
        </Text>
      )}
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({});
