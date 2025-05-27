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
const OutForDeliveryOrders = ({ outForDeliveryOrders }) => {
  const animation = useRef(null);
  return (
    <>
      {outForDeliveryOrders.length === 0 ? (
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
            data={outForDeliveryOrders}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, marginBottom: SIZES.height / 12 }}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: COLORS.white,
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontFamily: "bold" }}>
                    Order #: {item?._id}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
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
                          Payment method:
                        </Text>

                        {item?.paymentMethod === "gcash" ? (
                          <Image
                            source={require("../../assets/images/gcash1.png")}
                            style={{
                              width: 60,
                              objectFit: "contain",
                              height: 15,
                              marginLeft: 5,
                              borderRadius: 5,
                            }}
                          />
                        ) : (
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: "regular",
                              color: COLORS.gray,
                            }}
                          >
                            Cash On Delivery
                          </Text>
                        )}
                      </View>

                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "regular",
                          color: COLORS.gray,
                        }}
                      >
                        Payment status:{" "}
                        {item?.paymentStatus === "Paid" ? "🟢" : "🟡"}{" "}
                        {item?.paymentStatus}
                      </Text>

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

                    <LottieView
                      autoPlay
                      ref={animation}
                      style={{ width: 100, height: 100 }}
                      source={require("../../assets/anime/delivery.json")}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </>
  );
};

export default OutForDeliveryOrders;

const styles = StyleSheet.create({});
