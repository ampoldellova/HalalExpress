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
        marginBottom: 20,
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
        <Text style={{ fontFamily: "bold", fontSize: 18 }}>Your order</Text>
      </View>

      <Divider />

      <FlatList
        style={{ marginTop: 10 }}
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
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
              <View style={{ flexDirection: "column", marginLeft: 10 }}>
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 16,
                    color: COLORS.black,
                  }}
                >
                  {item?.productId
                    ? item?.productId?.title
                    : item?.foodId?.title}
                </Text>

                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 16,
                    color: COLORS.black,
                  }}
                >
                  ₱ {item?.totalPrice.toFixed(2)}
                </Text>

                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  Quantity: {item?.quantity}
                </Text>

                {item?.foodId && (
                  <>
                    {item?.additives.length > 0 ? (
                      <FlatList
                        data={item?.additives}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                          <Text
                            style={{
                              fontFamily: "regular",
                              fontSize: 12,
                              color: COLORS.gray,
                            }}
                          >
                            {item?.title}
                            {index !== item?.additives?.length - 1 && " |"}{" "}
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
          </View>
        )}
      />
    </View>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({});
