import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";
import { RatingInput } from "react-native-stock-star-rating";

const PreviousOrders = ({ pastOrders, navigation }) => {
  return (
    <FlatList
      data={pastOrders}
      scrollEnabled={false}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("order-details-page", {
              order: item,
            })
          }
          style={{
            marginBottom: 10,
            borderRadius: 15,
            boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)",
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: COLORS.white,
            marginHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{
                uri: item?.restaurant
                  ? item?.restaurant?.logoUrl?.url
                  : item?.supplier?.logoUrl?.url,
              }}
              style={{
                height: 70,
                width: 70,
                borderRadius: 10,
              }}
            />
            <View
              style={{
                marginLeft: 10,
                flexDirection: "column",
              }}
            >
              <Text style={{ fontFamily: "bold", fontSize: 16 }}>
                {item?.restaurant
                  ? item?.restaurant?.title
                  : item?.supplier?.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.gray,
                    fontSize: 12,
                    fontFamily: "regular",
                  }}
                >
                  Rating:
                </Text>

                {item?.rating?.status === "pending" ? (
                  <View
                    style={{
                      marginLeft: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 99,
                        backgroundColor: COLORS.secondary,
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: 3,
                        fontFamily: "bold",
                        fontSize: 12,
                      }}
                    >
                      Pending
                    </Text>
                  </View>
                ) : (
                  <View
                    pointerEvents="none"
                    style={{ marginLeft: 5, marginTop: -5 }}
                  >
                    <RatingInput
                      rating={item?.rating?.stars}
                      color={COLORS.primary}
                      size={15}
                    />
                  </View>
                )}
              </View>

              <View>
                <Text
                  style={{
                    color: COLORS.gray,
                    fontSize: 12,
                    fontFamily: "regular",
                    marginTop: 5,
                  }}
                >
                  Ordered on:
                </Text>
                <Text
                  style={{
                    color: COLORS.gray,
                    fontSize: 12,
                    fontFamily: "regular",
                  }}
                >
                  {new Date(item?.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(item?.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </View>

              <FlatList
                data={item?.orderItems}
                style={{ marginTop: 5 }}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View>
                    <Text
                      style={{
                        color: COLORS.gray,
                        fontSize: 14,
                        fontFamily: "regular",
                      }}
                    >
                      x{item?.quantity}{" "}
                      {item?.foodId
                        ? item?.foodId?.title
                        : item?.productId?.title}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
          <Text style={{ fontFamily: "bold", fontSize: 16 }}>
            ₱{(item?.totalAmount).toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default PreviousOrders;

const styles = StyleSheet.create({});
