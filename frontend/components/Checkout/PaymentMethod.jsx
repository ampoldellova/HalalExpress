import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";

const PaymentMethod = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedDeliveryOption,
  setPaymentMethodError,
  paymentMethodError,
}) => {
  return (
    <>
      {paymentMethodError && (
        <Text
          style={[
            styles.label,
            { color: COLORS.red, textAlign: "left", fontFamily: "regular" },
          ]}
        >
          *Please select a payment method
        </Text>
      )}
      <View
        style={{
          borderColor: paymentMethodError ? COLORS.secondary : COLORS.gray2,
          height: "auto",
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Image
            source={require("../../assets/images/payment.png")}
            style={{ width: 25, height: 25 }}
          />
          <Text style={{ fontFamily: "bold", fontSize: 18, marginLeft: 5 }}>
            Payment Method
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            selectedPaymentMethod === null
              ? setPaymentMethodError(false)
              : setSelectedPaymentMethod(
                  selectedDeliveryOption === "pickup"
                    ? "Pay at the counter"
                    : "cod"
                );
            selectedPaymentMethod === "Pay at the counter" ||
            selectedPaymentMethod === "cod"
              ? setSelectedPaymentMethod(null)
              : setSelectedPaymentMethod(
                  selectedDeliveryOption === "pickup"
                    ? "Pay at the counter"
                    : "cod"
                );
          }}
          style={{
            marginTop: 10,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor:
              selectedPaymentMethod === "Pay at the counter" ||
              selectedPaymentMethod === "cod"
                ? COLORS.primary
                : COLORS.gray2,
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
                  {selectedDeliveryOption === "pickup"
                    ? "Pay at the counter"
                    : "Cash On Delivery"}
                </Text>
              </View>
            </View>
          </View>

          {selectedPaymentMethod === "Pay at the counter" ||
            (selectedPaymentMethod === "cod" && (
              <>
                {selectedDeliveryOption === "pickup" ? (
                  <Text
                    style={{
                      fontFamily: "regular",
                      fontSize: 12,
                      color: COLORS.gray,
                    }}
                  >
                    You can place your order online and make the payment when
                    you pick up your order at the restaurant. This allows you to
                    conveniently reserve your items and pay in person.
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "regular",
                      fontSize: 12,
                      color: COLORS.gray,
                    }}
                  >
                    Consider payment upon ordering for contactless delivery. You
                    can't pay by card to the rider upon delivery.
                  </Text>
                )}
              </>
            ))}
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
              performed the payment, you will be redirected back to
              HalalExpress.
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({});
