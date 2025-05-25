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
import { useNavigation } from "@react-navigation/native";

const CompletedOrders = ({ completedOrders }) => {
  const navigation = useNavigation();
  const animation = useRef(null);
  return (
    <>
      {completedOrders.length === 0 ? (
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
            data={completedOrders}
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
                onPress={() =>
                  navigation.navigate("pending-order-details-page", item)
                }
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
                            marginLeft: 5,
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
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </>
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({});
