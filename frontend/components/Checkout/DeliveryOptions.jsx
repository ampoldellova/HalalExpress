import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";

const DeliveryOptions = ({
  deliveryOptionsError,
  setDeliveryFee,
  selectedDeliveryOption,
  setSelectedDeliveryOption,
  restaurant,
  totalTime,
  setDeliveryOptionsError,
}) => {
  return (
    <>
      {deliveryOptionsError && (
        <Text
          style={[
            styles.label,
            { color: COLORS.red, textAlign: "left", fontFamily: "regular" },
          ]}
        >
          *Please select a delivery option
        </Text>
      )}
      <View
        style={{
          borderColor: deliveryOptionsError ? COLORS.secondary : COLORS.gray2,
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
            source={require("../../assets/images/options.png")}
            style={{ width: 25, height: 25 }}
          />
          <Text style={{ fontFamily: "bold", fontSize: 18, marginLeft: 5 }}>
            Delivery Options
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (restaurant?.delivery) {
              setDeliveryFee(distanceTime.finalPrice);
              selectedDeliveryOption === "standard"
                ? (setSelectedDeliveryOption(null), setDeliveryFee(0))
                : (setSelectedDeliveryOption("standard"),
                  setDeliveryFee(distanceTime.finalPrice));
              setDeliveryOptionsError(false);
            } else {
              setSelectedDeliveryOption(null);
              setDeliveryOptionsError(true);
            }
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor:
              selectedDeliveryOption === "standard"
                ? COLORS.primary
                : COLORS.gray2,
            opacity: restaurant?.delivery ? 1 : 0.5,
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
                  source={require("../../assets/images/delivery.png")}
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
                  Standard
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 12,
                  color: COLORS.gray,
                  marginLeft: 5,
                }}
              >
                ({totalTime.toFixed(0)} mins)
              </Text>
            </View>

            {restaurant?.delivery ? (
              <View
                style={{
                  backgroundColor: COLORS.secondary,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "bold",
                    fontSize: 12,
                    color: COLORS.white,
                  }}
                >
                  + ₱{distanceTime.finalPrice}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: 16,
                  color: COLORS.red,
                }}
              >
                Not Available
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setDeliveryFee(0);
            selectedDeliveryOption === null
              ? setDeliveryOptionsError(false)
              : setSelectedDeliveryOption("pickup");
            selectedDeliveryOption === "pickup"
              ? setSelectedDeliveryOption(null)
              : setSelectedDeliveryOption("pickup");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor:
              selectedDeliveryOption === "pickup"
                ? COLORS.primary
                : COLORS.gray2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/pickup.png")}
              style={{ width: 20, height: 20, marginLeft: 2.5 }}
            />
            <View style={{ flex: 1, height: 30, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "medium",
                  fontSize: 16,
                  marginLeft: 10,
                  color: COLORS.black,
                }}
              >
                Pickup
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "bold",
                fontSize: 16,
                color: COLORS.primary,
              }}
            >
              Free
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default DeliveryOptions;

const styles = StyleSheet.create({});
