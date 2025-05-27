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

const ActiveOrders = ({ pendingOrders, navigation }) => {
  return (
    <FlatList
      data={pendingOrders}
      scrollEnabled={false}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
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
          onPress={() =>
            navigation.navigate("order-details-page", {
              order: item,
            })
          }
        >
          <View style={{ flexDirection: "row", width: "55%" }}>
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
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "bold", fontSize: 16 }}>
                {item?.restaurant
                  ? item?.restaurant?.title
                  : item?.supplier?.title}{" "}
              </Text>

              {(item?.orderStatus === "Pending" ||
                item?.orderStatus === "Preparing" ||
                item?.orderStatus === "Ready for pickup" ||
                item?.orderStatus === "Out for delivery") && (
                <View>
                  <Text
                    style={{
                      color: COLORS.gray,
                      fontSize: 12,
                      fontFamily: "regular",
                    }}
                  >
                    Order Status:
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 99,
                        backgroundColor:
                          item?.orderStatus === "Pending"
                            ? COLORS.gray2
                            : item?.orderStatus === "Preparing"
                            ? COLORS.secondary
                            : item?.orderStatus === "Ready for pickup"
                            ? COLORS.tertiary
                            : COLORS.primary,
                        marginRight: 5,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "bold",
                        fontSize: 12,
                      }}
                    >
                      {item?.orderStatus}
                    </Text>
                  </View>
                </View>
              )}

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

export default ActiveOrders;

const styles = StyleSheet.create({});
