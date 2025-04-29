import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";
import { Image } from "react-native";
import Divider from "../Divider";

const OrderSummary = ({
  cart,
  user,
  supplier,
  restaurant,
  selectedDeliveryOption,
  deliveryFee,
  distanceTime,
}) => {
  return (
    <View
      style={{
        borderColor: COLORS.gray2,
        height: "auto",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text style={{ fontFamily: "bold", fontSize: 18 }}>
          Your order from:
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Image
          source={{
            uri:
              user?.userType === "Vendor"
                ? supplier?.logoUrl?.url
                : restaurant?.logoUrl?.url,
          }}
          style={{ width: 20, height: 20, borderRadius: 5 }}
        />
        <Text style={{ fontFamily: "regular", fontSize: 14, marginLeft: 5 }}>
          {user?.userType === "Vendor" ? supplier?.title : restaurant?.title}
        </Text>
      </View>

      <FlatList
        style={{ marginBottom: 20 }}
        data={cart?.cartItems}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{
                  uri:
                    user?.userType === "Vendor"
                      ? item?.productId?.imageUrl?.url
                      : item?.foodId?.imageUrl?.url,
                }}
                style={{ width: 50, height: 50, borderRadius: 10 }}
              />
              <View style={{ flexDirection: "column", marginLeft: 10 }}>
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 14,
                    color: COLORS.gray,
                  }}
                >
                  {item?.quantity}x{" "}
                  {user?.userType === "Vendor"
                    ? item?.productId?.title
                    : item?.foodId?.title}
                </Text>

                {item?.productId ? (
                  <></>
                ) : (
                  <>
                    {item?.additives.length > 0 ? (
                      <FlatList
                        data={item?.additives}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                          <Text
                            style={{
                              fontFamily: "regular",
                              fontSize: 14,
                              color: COLORS.gray,
                              marginLeft: 10,
                            }}
                          >
                            + {item?.title}
                          </Text>
                        )}
                      />
                    ) : (
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 14,
                          color: COLORS.gray,
                          marginLeft: 10,
                        }}
                      >
                        - No additives
                      </Text>
                    )}
                  </>
                )}
              </View>
            </View>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              ₱ {item?.totalPrice.toFixed(2)}
            </Text>
          </View>
        )}
      />

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
          marginBottom: 20,
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
    </View>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({});
