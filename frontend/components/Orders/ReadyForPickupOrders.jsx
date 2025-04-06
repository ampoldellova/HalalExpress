import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import { COLORS, SIZES } from "../../styles/theme";
import LottieView from "lottie-react-native";

const ReadyForPickupOrders = ({ readyForPickupOrders }) => {
  const animation = useRef(null);
  return (
    <>
      {readyForPickupOrders.length === 0 ? (
        <View
          style={{
            width: SIZES.width,
            height: SIZES.height / 1.5,
            justifyContent: "center",
            alignItems: "center",
            top: 0,
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "50%", height: "50%" }}
            source={require("../../assets/anime/emptyOrders.json")}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "regular",
              marginTop: -20,
              color: COLORS.gray,
            }}
          >
            No orders found.
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={readyForPickupOrders}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, marginBottom: SIZES.height / 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: COLORS.white,
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: item?.userId?.profile?.url }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <Text style={{ fontSize: 16, fontFamily: "bold" }}>
                      Order #:{" "}
                      {item?._id ? `${item._id.substring(0, 20)}...` : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "bold",
                        color: COLORS.gray,
                      }}
                    >
                      Customer: {item?.userId?.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "regular",
                        color: COLORS.gray,
                      }}
                    >
                      Delivery option:{" "}
                      {item?.deliveryOption === "standard"
                        ? "For delivery"
                        : "For pickup"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "regular",
                        color: COLORS.gray,
                      }}
                    >
                      Payment method: {item?.paymentMethod}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "regular",
                          color: COLORS.gray,
                        }}
                      >
                        Payment status:
                      </Text>

                      <View
                        style={{
                          borderRadius: 99,
                          backgroundColor:
                            item.paymentStatus === "Pending"
                              ? COLORS.secondary
                              : COLORS.primary,
                          width: 10,
                          height: 10,
                          marginLeft: 5,
                          marginBottom: 2,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "bold",
                          color: COLORS.gray,
                          marginLeft: 2,
                        }}
                      >
                        {item?.paymentStatus}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "regular",
                        color: COLORS.gray,
                      }}
                    >
                      Ordered on:{" "}
                      {new Date(item?.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(item?.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </>
  );
};

export default ReadyForPickupOrders;

const styles = StyleSheet.create({});
